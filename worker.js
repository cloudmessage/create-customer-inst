#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const axios = require('axios');
require('dotenv').config();
const randomstring = require('randomstring');
const knexOptionsFile = require('./knexoptions');

const CUSTOMER_CLUSTER_URL = process.env.CUSTOMER_CLUSTER_URL;

const knexOptions = knexOptionsFile[process.env.NODE_ENV];

const knex = require('knex')(knexOptions)

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

amqp.connect(process.env.INSTANCE_MQ_URL, function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'create_inst_queue';

    channel.assertQueue(queue, {
      durable: true
    });
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(queue, async function(msg) {
      var instanceId = msg.content.toString();

      console.log(" [x] Received %s", instanceId);

      const randomString = getRandomUsernameAndVhost()
      const password = generatePassword()

      console.log("Creating vhost and user")

      const managementCredentials = "guest:guest"
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
          `${CUSTOMER_CLUSTER_URL}/api/vhosts/` + randomString,
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
          `${CUSTOMER_CLUSTER_URL}/api/users/` + randomString,
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
          `${CUSTOMER_CLUSTER_URL}/api/permissions/${randomString}/${randomString}`,
          {"configure": ".*", "write": ".*", "read": ".*"},
          config
        )
        console.log(`permissions granted to user ${randomString} on vhost ${randomString}`)
      } catch(err) {
        console.log("permissions grant error: ", err.message)
        throw err
      }

      // update database with instance information
      knex('instances')
        .where('id', instanceId)
        .update({
          user: randomString,
          virtual_host: randomString,
          password,
          hostname: 'localhost'
        })
        .catch((err) => { console.log(err); throw err })

      channel.ack(msg);
    }, {
      // manual acknowledgment mode,
      // see ../confirms.html for details
      noAck: false
    });
  });
});
