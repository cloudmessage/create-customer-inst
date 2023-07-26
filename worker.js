#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const exec = require('child_process').exec;

amqp.connect('amqp://localhost', function(error0, connection) {
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
      // create container
      console.log("Creating container")
      exec("docker ps", function(err, stdout, stderr) {
        console.log(stdout);
      })
      channel.ack(msg);
    }, {
      // manual acknowledgment mode,
      // see ../confirms.html for details
      noAck: false
    });
  });
});
