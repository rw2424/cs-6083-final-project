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
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Header from '../components/Header';

export default function BrowserHistory() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const browserHistory = JSON.parse(
      localStorage.getItem('browserHistory') || '[]'
    );

    axios
      .post('/api/recipe/mu', {
        ids: browserHistory,
      })
      .then((res) => {
        setRecipes(res.data);
      });
  }, []);

  const router = useRouter();

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
              Browser History
            </Typography>
          </Container>
        </Box>
        <Container maxWidth="md">
          <Grid container spacing={4}>
            {recipes.map((recipe) => (
              <Grid item key={recipe.recipeId} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={recipe.pictureUrl}
                    height="200px"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {recipe.title}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" href={`/recipe/${recipe.recipeId}`}>
                      View Again
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
