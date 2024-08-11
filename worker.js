#!/usr/bin/env node

import * as amqplib from 'amqplib';
import axios from 'axios';
import randomstring from 'randomstring';
import dotenv from 'dotenv';
import { getKnexEnvOptions } from './knexoptions.js';
import Knex from 'knex';
import Data from './Data.js';
import CustomerClusterApi from './CustomerClusterApi.js';
import Utils from './Utils.js';
import { createCustomerFunction } from './createCustomerFunction.js';
import createCustomer from './createCustomer.js';

dotenv.config();

const knexOptions = getKnexEnvOptions(process.env.NODE_ENV, process.env.DB_URL);
const knex = Knex(knexOptions);

const data = new Data(knex);
const api = new CustomerClusterApi(
  axios,
  process.env.MANAGEMENT_USERNAME,
  process.env.MANAGEMENT_PASSWORD,
  process.env.CUSTOMER_CLUSTER_URL
  );

const utils = new Utils(randomstring);
const queue = 'create_inst_queue';
const conn = await amqplib.connect(process.env.INSTANCE_MQ_URL);
const channel = await conn.createChannel();
await channel.assertQueue(queue, { durable: true });
channel.prefetch(1);
console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
channel.consume(
  queue,
  (msg) => {
    createCustomer.createCustomerVhostAndUser(
      createCustomerFunction,
      data,
      api,
      utils,
      process.env.CUSTOMER_CLUSTER_URL,
      channel,
      msg);
  },
  {
    noAck: false
  }
);
