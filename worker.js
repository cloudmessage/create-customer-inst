#!/usr/bin/env node

import * as amqplib from 'amqplib';
import dotenv from 'dotenv';
import randomstring from 'randomstring';
import createCustomer from './createCustomer.js';

dotenv.config();

function getRandomUsernameAndVhost() {
  const generatedString = randomstring.generate({
    length: 8,
    charset: 'alphabetic',
    capitalization: 'lowercase'
  })

  return generatedString
}

function generatePassword() {
  const generatedString = randomstring.generate({
    length: 32,
    charset: 'alphanumeric'
  })

  return generatedString
}

const queue = 'create_inst_queue';
const conn = await amqplib.connect(process.env.INSTANCE_MQ_URL);
const channel = await conn.createChannel();
await channel.assertQueue(queue, { durable: true });
channel.prefetch(1);
console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
channel.consume(
  queue,
  (msg) => {
    createCustomer.createCustomerVhostAndUser(channel, msg);
  },
  {
    noAck: false
  }
);
