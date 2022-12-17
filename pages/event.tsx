import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  typographyClasses,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import toast, { Toaster } from 'react-hot-toast';

import Header from '../components/Header';

export default function Event() {
  const router = useRouter();
  const { gName, gCreator } = router.query;

  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (router.isReady) {
      axios
        .get(`/api/event?gName=${gName}&gCreator=${gCreator}`)
        .then((res) => {
          setEvents(res.data);
        });
    }
  }, [router.isReady]);

  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [user, setUser] = useState(null);
  const [isInGroup, setIsInGroup] = useState(false);

  useEffect(() => {
    setUser(cookies.user);
  }, [cookies]);

  useEffect(() => {
    if (router.isReady) {
      axios
        .get(
          `/api/group/in?userName=${cookies.user.userName}&gName=${gName}&gCreator=${gCreator}`
        )
        .then((res) => {
          console.log(res);
          setIsInGroup(res.data.isIn);
        });
    }
  }, [router.isReady, cookies]);

  console.log(isInGroup);

  return (
    <>
      <Header />
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h4"
              align="center"
              color="text.primary"
              gutterBottom
            >
              {`Events of Group ${gName} created by ${gCreator}`}
            </Typography>
          </Container>
        </Box>
        <Container maxWidth="md">
          {isInGroup ? (
            <Button
              variant="contained"
              sx={{ mb: 3 }}
              onClick={() => {
                router.push(`/post-event?gName=${gName}&gCreator=${gCreator}`);
              }}
            >
              Post Event
            </Button>
          ) : (
            <></>
          )}
          <Grid container spacing={4}>
            {events.map((event) => (
              <EventCard
                event={event}
                userName={user.userName}
                gName={gName}
                gCreator={gCreator}
              />
            ))}
          </Grid>
        </Container>
        <Toaster />
      </main>
    </>
  );
}

function EventCard({ event, userName, gName, gCreator }) {
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/rsvp/in?userName=${userName}&eID=${event.eID}`)
      .then((res) => {
        setIsIn(res.data.isIn);
      });
  }, []);

  return (
    <Grid item key={event.eID} xs={12} sm={6} md={4}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardMedia component="img" image={event.picture[0]} height="200px" />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="h2">
            {event.eName}
          </Typography>
          <Typography>
            <strong>Description: </strong>
            {event.eDesc}
          </Typography>
          <Typography>
            <strong>Date: </strong>
            {event.eDate.slice(0, -5)}
          </Typography>
        </CardContent>
        <CardActions>
          {isIn ? (
            <Button
              size="small"
              onClick={() => {
                axios
                  .post('/api/rsvp/cancel', {
                    userName: userName,
                    eID: event.eID,
                  })
                  .then((res) => {
                    // toast.success('RSVP successfully!');
                    setIsIn(false);
                  })
                  .catch((err) => {
                    toast.error('Failed to RSVP');
                  });
              }}
            >
              Cancel RSVP
            </Button>
          ) : (
            <Button
              size="small"
              onClick={() => {
                axios
                  .post('/api/rsvp/add', {
                    userName: userName,
                    eID: event.eID,
                    response: 'Y',
                    gName: gName,
                    gCreator: gCreator,
                  })
                  .then((res) => {
                    console.log(res);
                    if (res.data.error) {
                      toast.error('Please join the group first');
                    } else {
                      setIsIn(true);
                      toast.success('RSVP successfully!');
                    }
                  })
                  .catch((err) => {
                    toast.error('Failed to RSVP');
                  });
              }}
            >
              RSVP
            </Button>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
}
