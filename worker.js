#!/usr/bin/env node

import * as amqplib from 'amqplib';
import dotenv from 'dotenv';
import createCustomer from './createCustomer.js';
import { getKnexEnvOptions } from './knexoptions.js';
import Knex from 'knex';
import Data from './Data.js';

dotenv.config();

const knexOptions = getKnexEnvOptions(process.env.NODE_ENV, process.env.FILENAME_OR_DB_URL);
const knex = Knex(knexOptions);

const data = new Data(knex);
const queue = 'create_inst_queue';
const conn = await amqplib.connect(process.env.INSTANCE_MQ_URL);
const channel = await conn.createChannel();
await channel.assertQueue(queue, { durable: true });
channel.prefetch(1);
console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
channel.consume(
  queue,
  (msg) => {
    createCustomer.createCustomerVhostAndUser(data, channel, msg);
  },
  {
    noAck: false
  }
);
