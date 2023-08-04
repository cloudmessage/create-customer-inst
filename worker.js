#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const axios = require('axios')
const randomstring = require('randomstring')

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

amqp.connect('amqp://localhost:10001', function(error0, connection) {
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
    channel.consume(queue, function(msg) {
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
      axios.put(
        'http://localhost:15672/api/vhosts/' + randomString,
        null,
        config
      )
      .then(() => {
        console.log(`host ${randomString} created`)
      })
      .catch((err) => {
        console.log("host create error: ", err)
        throw err
      })

      // creating user
      axios.put(
        'http://localhost:15672/api/users/' + randomString,
        {"password": password, "tags": "customer"},
        config
      )
      .then(() => {
        console.log(`user ${randomString} created`)
      })
      .catch((err) => {
        console.log("user create error: ", err)
        throw err
      })

      channel.ack(msg);
    }, {
      // manual acknowledgment mode,
      // see ../confirms.html for details
      noAck: false
    });
  });
});
