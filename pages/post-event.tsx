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

export default function PostEvent() {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [user, setUser] = useState(null);

  const { gName, gCreator } = router.query;

  useEffect(() => {
    setUser(cookies.user);
  }, [cookies]);

  const [pictureUrls, setPictureUrls] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      date: '2022-12-16T10:10',
    },
    onSubmit: () => {
      console.log(
        formik.values.name,
        formik.values.description,
        formik.values.date
      );
      axios
        .post('/api/event', {
          eName: formik.values.name,
          eDesc: formik.values.description,
          eDate: formik.values.date,
          gName: gName,
          gCreator: gCreator,
          pictureUrls: pictureUrls,
        })
        .then((res) => {
          router.push(`/event?gName=${gName}&gCreator=${gCreator}`);
        })
        .catch((error) => {
          toast.error('Failed to post a event');
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
            Post a Event
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
                  label="Name"
                  name="name"
                  fullWidth
                  value={formik.values.title}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  value={formik.values.numServings}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Date"
                  type="datetime-local"
                  name="date"
                  value={formik.values.date}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <PictureForm
                  pictureUrls={pictureUrls}
                  setPictureUrls={setPictureUrls}
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
