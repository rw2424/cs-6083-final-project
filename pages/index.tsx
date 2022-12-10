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

import Header from '../components/Header';

const recipes = [
  {
    imageUrl:
      'https://theclevermeal.com/wp-content/uploads/2021/09/italian-pasta-recipes_12.jpg',
    title: 'Pasta Napoletana',
  },
  {
    imageUrl:
      'https://whereismyspoon.co/wp-content/uploads/2019/12/tiramisu-torte-18.jpg',
    title: 'Tiramisu Torte',
  },
  {
    imageUrl:
      'https://i2.wp.com/wonkywonderful.com/wp-content/uploads/2017/09/italian-pasta-salad-recipe-1.jpg?resize=720%2C720&ssl=1',
    title: 'Spinach Tortellini',
  },
];

export default function Index() {
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
            {recipes.map((recipe) => (
              <Grid item key={recipe.title} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={recipe.imageUrl}
                    height="200px"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {recipe.title}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
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
