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

import Header from '../components/Header';

export default function Group() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios.get('/api/group').then((res) => {
      setGroups(res.data);
    });
  }, []);

  const router = useRouter();

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
              variant="h3"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Groups
            </Typography>
          </Container>
        </Box>
        <Container maxWidth="md">
          <Grid container spacing={4}>
            {groups.map((group, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {group.gName}
                    </Typography>
                    <Typography>{`Creator: ${group.gCreator}`}</Typography>
                    <Typography>{`Description: ${group.gDesc}`}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      href={`/event?gName=${group.gName}&gCreator=${group.gCreator}`}
                    >
                      See Events
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        axios.get(
                          `/api/group/join?userName=${user.userName}&gName=${group.gName}&gCreator=${group.gCreator}`
                        );
                      }}
                    >
                      Join Group
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </>
  );
}
