const amqplib = require("amqplib");

const { MQ_URL } = require("./server-config");

const queue = "email.notification";

let connection, channel;

async function connectToRabbitMQ() {
  try {
    connection = await amqplib.connect(MQ_URL);

    channel = await connection.createChannel();

    channel.assertQueue(queue);
  } catch (error) {
    console.log(`Error connecting to RabbitMQ:`, error);
  }
}

async function sendEmailNotification(data) {
  if (data) {
    try {
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
    } catch (error) {
      console.log(`Error sending message to ${queue}:`, error);
    }
  }
}

module.exports = {
  connectToRabbitMQ,
  sendEmailNotification,
};
