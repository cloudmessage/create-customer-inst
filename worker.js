#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

function getRandomString() {
  const randomstring = require('randomstring')

  const generatedString = randomstring.generate({
    length: 8,
    charset: 'alphabetic',
    capitalization: 'lowercase'
  })

  return generatedString
}

function generatePassword() {
  const { v4: uuidv4 } = require('uuid')

  return uuidv4()
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

      const randomString = getRandomString()
      const password = generatePassword()
      console.log("random-string=", randomString, "password=", password)
      // create container
      console.log("Creating container")
      channel.ack(msg);
    }, {
      // manual acknowledgment mode,
      // see ../confirms.html for details
      noAck: false
    });
  });
});
