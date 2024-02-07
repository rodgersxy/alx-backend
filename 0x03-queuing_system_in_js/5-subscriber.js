import { createClient } from 'redis';

const client = createClient();

// On connect, log the message
client.on('connect', () => {
  console.log("Redis client connected to the server");
  // Subscribe to the holberton school channel
  client.subscribe('holberton school channel');
});

// On error, log the error message
client.on('error', (err) => console.log(`Redis client not connected to the server: ${err.message}`));

// On message received
client.on('message', (channel, message) => {
  console.log(message);
  // If the message is KILL_SERVER, unsubscribe and quit
  if (message === 'KILL_SERVER') {
    client.unsubscribe('holberton school channel');
    client.quit();
  }
});
