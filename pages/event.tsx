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

  useEffect(() => {
    setUser(cookies.user);
  }, [cookies]);

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
          <Grid container spacing={4}>
            {events.map((event) => (
              <Grid item key={event.eID} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={event.picture[0]}
                    height="200px"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {event.eName}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => {
                        axios
                          .post('/api/rsvp', {
                            userName: user.userName,
                            eID: event.eID,
                            response: 'Y',
                          })
                          .then((res) => {
                            toast.success('RSVP successfully!');
                          })
                          .catch((err) => {
                            toast.error('Failed to RSVP');
                          });
                      }}
                    >
                      RSVP
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Toaster />
      </main>
    </>
  );
}
