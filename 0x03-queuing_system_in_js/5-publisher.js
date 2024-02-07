import { createClient } from 'redis';

const client = createClient();

// On connect, log the message
client.on('connect', () => {
  console.log("Redis client connected to the server");
  // Call the publishMessage function with specific messages and times
  publishMessage("Holberton Student #1 starts course", 100);
  publishMessage("Holberton Student #2 starts course", 200);
  publishMessage("KILL_SERVER", 300);
  publishMessage("Holberton Student #3 starts course", 400);
});

// On error, log the error message
client.on('error', (err) => console.log(`Redis client not connected to the server: ${err.message}`));

// Function to publish a message to the channel after a specified time
function publishMessage(message, time) {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    client.publish('holberton school channel', message);
  }, time);
}
