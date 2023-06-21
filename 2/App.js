import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';

const TrainList = () => {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    // Fetch train schedules from the backend API
    fetch('/api/trains')
      .then((response) => response.json())
      .then((data) => setTrains(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <Container>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Train Schedules
      </Typography>
      <Grid container spacing={2}>
        {trains.map((train) => (
          <Grid item xs={12} sm={6} md={4} key={train.trainId}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  Train ID: {train.trainId}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Departure Time: {train.departureTime}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Seat Availability: {train.availability}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Price: {train.pricing}
                </Typography>
                <Link to={`/train/${train.trainId}`}>View Details</Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const TrainDetails = ({ match }) => {
  const [train, setTrain] = useState(null);

  useEffect(() => {
    // Fetch a single train schedule from the backend API
    fetch(`/api/train/${match.params.trainId}`)
      .then((response) => response.json())
      .then((data) => setTrain(data))
      .catch((error) => console.error(error));
  }, [match.params.trainId]);

  if (!train) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Train Details
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2">
            Train ID: {train.trainId}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Departure Time: {train.departureTime}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Seat Availability: {train.availability}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Price: {train.pricing}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={TrainList} />

      </Switch>
    </Router>

  );
}