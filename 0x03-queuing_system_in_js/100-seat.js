import express from 'express';
import redis from 'redis';
import { promisify } from 'util';
import kue from 'kue';

const app = express();
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const queue = kue.createQueue();

// Initialize the number of available seats and reservation status
let numberOfAvailableSeats = 50;
let reservationEnabled = true;

// Function to reserve seats
const reserveSeat = async (number) => {
  await client.set('available_seats', number);
};

// Function to get the current number of available seats
const getCurrentAvailableSeats = async () => {
  const seats = await getAsync('available_seats');
  return parseInt(seats, 10);
};

// Express route to get the number of available seats
app.get('/available_seats', async (req, res) => {
  const seats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: seats });
});

// Express route to reserve a seat
app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    res.json({ status: "Reservation are blocked" });
    return;
  }

  const job = queue.create('reserve_seat').save((err) => {
    if (err) {
      console.error(`Error creating reservation job: ${err}`);
      res.json({ status: "Reservation failed" });
    } else {
      console.log(`Seat reservation job ${job.id} created`);
      res.json({ status: "Reservation in process" });
    }
  });
});

// Express route to process the reservation queue
app.get('/process', async (req, res) => {
  res.json({ status: "Queue processing" });

  queue.process('reserve_seat', async (job, done) => {
    const availableSeats = await getCurrentAvailableSeats();
    if (availableSeats > 0) {
      // Decrease the number of available seats
      await reserveSeat(availableSeats - 1);

      // If no seats are available, block reservations
      if (availableSeats === 1) {
        reservationEnabled = false;
      }

      // Successful job completion
      console.log(`Seat reservation job ${job.id} completed`);
      done();
    } else {
      // Fail the job with an error
      const errorMessage = "Not enough seats available";
      console.error(`Seat reservation job ${job.id} failed: ${errorMessage}`);
      done(new Error(errorMessage));
    }
  });
});

// Start the server
const port = 1245;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  // Set the initial number of available seats
  reserveSeat(numberOfAvailableSeats);
});
