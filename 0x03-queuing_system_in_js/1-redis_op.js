import { createClient } from 'redis';

const client = createClient();

// Function to set a new school in Redis
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, redisPrintCallback);
}

// Function to display the value for a given school key
function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, value) => {
    if (err) {
      console.error(`Error getting value for ${schoolName}: ${err.message}`);
    } else {
      console.log(`Value for ${schoolName}: ${value}`);
    }
  });
}

// Callback function for Redis operations
function redisPrintCallback(err, reply) {
  if (err) {
    console.error(`Redis operation failed: ${err.message}`);
  } else {
    console.log(`Redis operation successful: ${reply}`);
  }
}

// Call the functions
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
