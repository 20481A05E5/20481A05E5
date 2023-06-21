const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = 8000;

// CORS middleware to allow cross-origin requests (if needed)
app.use((req, res, next) => {
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
     next();
});

// Train schedules route
app.get('/api/trains', async (req, res) => {
     try {
          const currentTime = new Date();
          const next12Hours = new Date(currentTime.getTime() + 12 * 60 * 60 * 1000);

          // Call John Doe Railways API to retrieve train schedules for the next 12 hours
          const schedules = await fetchTrainSchedules(currentTime, next12Hours);

          // Filter out trains departing in the next 30 minutes
          const filteredSchedules = schedules.filter((schedule) => {
               const departureTime = new Date(schedule.departureTime);
               return departureTime > currentTime && departureTime < next30Minutes;
          });

          // Sort the schedules based on the provided criteria
          filteredSchedules.sort((a, b) => {
               // Sort by ascending price
               if (a.pricing.price < b.pricing.price) return -1;
               if (a.pricing.price > b.pricing.price) return 1;

               // Sort by descending available tickets
               if (a.availability.tickets > b.availability.tickets) return -1;
               if (a.availability.tickets < b.availability.tickets) return 1;

               // Sort by descending departure time (including delays)
               const aDepartureTime = new Date(a.departureTime);
               const bDepartureTime = new Date(b.departureTime);
               return bDepartureTime - aDepartureTime;
          });

          res.json(filteredSchedules);
     } catch (error) {
          console.error('Failed to fetch train schedules:', error);
          res.status(500).json({ error: 'Failed to fetch train schedules' });
     }
});

// Fetch train schedules function
async function fetchTrainSchedules(startTime, endTime) {
     try {
          // Call John Doe Railways API to fetch train schedules based on the provided time range
          const response = await fetch('<JohnDoeRailwaysAPIURL>/schedules', {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'dWGzNM', // Replace with your authentication token
               },
               body: JSON.stringify({
                    startTime,
                    endTime,
               }),
          });

          const data = await response.json();
          return data.schedules;
     } catch (error) {
          throw new Error('Failed to fetch train schedules');
     }
}

app.listen(port, () => {
     console.log(`Server is running on port ${port}`);
});
