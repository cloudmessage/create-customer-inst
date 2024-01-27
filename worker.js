#!/usr/bin/env node

import * as amqplib from 'amqplib';
import axios from 'axios';
import dotenv from 'dotenv';
import randomstring from 'randomstring';
import knexEnvOptions from './knexoptions.js';
import Knex from 'knex';

dotenv.config();

const CUSTOMER_CLUSTER_URL = process.env.CUSTOMER_CLUSTER_URL;

const knexOptions = knexEnvOptions[process.env.NODE_ENV];
const knex = Knex(knexOptions);

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
channel.consume(queue, async (msg) => {
  var instanceId = msg.content.toString();

  console.log(" [x] Received %s", instanceId);

  const randomString = getRandomUsernameAndVhost()
  const password = generatePassword()

  console.log("Creating vhost and user")

  const managementCredentials = `${process.env.MANAGEMENT_USERNAME}:${process.env.MANAGEMENT_PASSWORD}`;
  const base64ManagementCredentials = Buffer.from(managementCredentials).toString("base64")
  const config = {
    headers: {
      "content-type": "application/json",
      "Authorization": "Basic " + base64ManagementCredentials
    }
  }

  // creating vhost
  try {
    await axios.put(
      `${CUSTOMER_CLUSTER_URL}:15672/api/vhosts/` + randomString,
      null,
      config
    )
    console.log(`host ${randomString} created`)
  } catch(err) {
    console.log("host create error: ", err.message)
    throw err
  }

  // creating user
  try {
    await axios.put(
      `${CUSTOMER_CLUSTER_URL}:15672/api/users/` + randomString,
      {"password": password, "tags": "customer"},
      config
    )
    console.log(`user ${randomString} created`)
  } catch(err) {
    console.log("user create error: ", err.message)
    throw err
  }

  // grant permissions to user for vhost
  try {
    await axios.put(
      `${CUSTOMER_CLUSTER_URL}:15672/api/permissions/${randomString}/${randomString}`,
      {"configure": ".*", "write": ".*", "read": ".*"},
      config
    )
    console.log(`permissions granted to user ${randomString} on vhost ${randomString}`)
  } catch(err) {
    console.log("permissions grant error: ", err.message)
    throw err
  }

  const url = new URL(CUSTOMER_CLUSTER_URL);
  const hostname = url.hostname;

  // update database with instance information
  knex('instances')
    .where('id', instanceId)
    .update({
      user: randomString,
      virtual_host: randomString,
      password,
      hostname
    })
    .catch((err) => { console.log(err); throw err })

  channel.ack(msg);
},
{
  noAck: false
});
