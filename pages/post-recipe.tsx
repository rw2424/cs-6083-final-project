import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useFormik } from 'formik';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { Ingredient } from '../services/recipe-service';
import IngredientForm from '../components/forms/IngredientForm';
import PictureForm from '../components/forms/PictureForm';
import StepForm from '../components/forms/StepForm';

export default function PostRecipe() {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(cookies.user);
  }, [cookies]);

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [pictureUrls, setPictureUrls] = useState<string[]>([]);
  const [stepDescriptions, setStepDescriptions] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: {
      title: '',
      numServings: 0,
      tags: '',
    },
    onSubmit: () => {
      if (
        formik.values.title == '' ||
        formik.values.numServings == 0 ||
        formik.values.tags == '' ||
        ingredients == [] ||
        pictureUrls == [] ||
        stepDescriptions == []
      ) {
        toast.error(
          'At least one entry of each field must be filled in, please re-enter!'
        );
        return;
      }
      axios
        .post('/api/recipe', {
          title: formik.values.title,
          numServings: formik.values.numServings,
          postedBy: user?.userName,
          ingredients: ingredients,
          pictureUrls: pictureUrls,
          stepDescriptions: stepDescriptions,
          tags: formik.values.tags.split(','),
        })
        .then((res) => {
          router.push('/');
        })
        .catch((error) => {
          console.log(error);
          toast.error('Failed to post a recipe');
        });
    },
  });

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Post a Recipe
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  name="title"
                  fullWidth
                  value={formik.values.title}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Number of Servings"
                  name="numServings"
                  fullWidth
                  value={formik.values.numServings}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <IngredientForm
                  ingredients={ingredients}
                  setIngredients={setIngredients}
                />
              </Grid>
              <Grid item xs={12}>
                <PictureForm
                  pictureUrls={pictureUrls}
                  setPictureUrls={setPictureUrls}
                />
              </Grid>
              <Grid item xs={12}>
                <StepForm
                  stepDescriptions={stepDescriptions}
                  setStepDescriptions={setStepDescriptions}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Tags (seperated by ',')"
                  name="tags"
                  fullWidth
                  value={formik.values.tags}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="success"
            >
              Post
            </Button>
          </Box>
        </Box>
      </Container>
      <Toaster />
    </>
  );
}
