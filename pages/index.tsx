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

export default function Index() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios.get('/api/recipe').then((res) => {
      setRecipes(res.data);
    });
  }, []);

  const router = useRouter();
  const { q } = router.query;

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
              Recipes
            </Typography>
          </Container>
        </Box>
        <Container maxWidth="md">
          <Grid container spacing={4}>
            {recipes
              .filter((recipe) => !q || recipe.title.includes(q))
              .map((recipe) => (
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
                        View
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
