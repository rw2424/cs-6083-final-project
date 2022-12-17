import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  ImageList,
  ImageListItem,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Card,
  CardContent,
} from '@mui/material';
import { useFormik } from 'formik';
import { useCookies } from 'react-cookie';
import toast, { Toaster } from 'react-hot-toast';
import Router from 'next/router';

import { Ingredient } from '../../services/recipe-service';
import Header from '../../components/Header';
import PictureForm from '../../components/forms/PictureForm';

type RecipeInfo = {
  title: string;
  numServings: number;
  postedBy: string;
  ingredients: Ingredient[];
  pictureUrls: string[];
  stepDescriptions: string[];
  tags: string[];
};

type ReviewInfo = {
  title: string;
  description: string;
  star: number;
  pictureUrls: string[];
};

export default function Recipe() {
  const router = useRouter();
  const { id } = router.query;

  const [recipeInfo, setRecipeInfo] = useState<RecipeInfo>();
  const [reviewInfo, setReviewInfo] = useState<ReviewInfo[]>();
  const [units, setUnits] = useState<string[]>([]);
  const [iniUnits, setIniUnits] = useState<string[]>();
  const [iniAmounts, setIniAmounts] = useState<number[]>();
  const [curUnits, setCurUnits] = useState<string[]>();
  const [curAmounts, setCurAmounts] = useState<number[]>();

  useEffect(() => {
    if (router.isReady) {
      axios.get(`/api/recipe/${id}`).then((res) => {
        let { recipe, ingredients, pictureUrls, steps, tags } = res.data;
        let pictures = pictureUrls;
        steps = steps.map((step) => step.sDesc);
        setRecipeInfo({
          title: recipe[0].title,
          numServings: recipe[0].numServings,
          postedBy: recipe[0].postedBy,
          ingredients: ingredients,
          pictureUrls: pictures,
          stepDescriptions: steps,
          tags: tags.map((tag) => tag.tagText),
        });
        setIniUnits(ingredients.map((ingredient) => ingredient.unitName));
        setIniAmounts(ingredients.map((ingredient) => ingredient.amount));
        const preferredUnit = localStorage.getItem('preferredUnit') || '';
        if (preferredUnit.length > 0) {
          setCurUnits(ingredients.map(() => preferredUnit));
          axios
            .post(
              '/api/unit/batch',
              ingredients.map((ingredient) => {
                return {
                  srcUnit: ingredient.unitName,
                  dstUnit: preferredUnit,
                  srcAmount: ingredient.amount,
                };
              })
            )
            .then((res) => {
              setCurAmounts(res.data);
            });
          setCurAmounts(ingredients.map(() => ''));
        } else {
          setCurUnits(ingredients.map((ingredient) => ingredient.unitName));
          setCurAmounts(ingredients.map((ingredient) => ingredient.amount));
        }
      });
      axios.get(`/api/review/${id}`).then((res) => {
        let data = res.data;
        setReviewInfo(
          data.map((rev) => {
            return {
              title: rev.revTitle,
              userName: rev.userName,
              description: rev.revDesc,
              stars: rev.stars,
              pictureUrls: rev.pictureUrls,
            };
          })
        );
      });
      let browserHistory = JSON.parse(
        localStorage.getItem('browserHistory') || '[]'
      );
      const index = browserHistory.indexOf(id);
      if (index > -1) {
        browserHistory.splice(index, 1);
      }
      browserHistory = [id].concat(browserHistory);
      localStorage.setItem('browserHistory', JSON.stringify(browserHistory));
      axios.get('/api/unit').then((res) => {
        const units = res.data.units.map((unit) => unit.unitName);
        setUnits(units);
      });
    }
  }, [router.isReady]);

  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(cookies.user);
  }, [cookies]);

  const [pictureUrls, setPictureUrls] = useState<string[]>([]);
  const formik = useFormik({
    initialValues: {
      reviewTitle: '',
      reviewDescription: '',
      reviewStars: 0,
    },
    onSubmit: () => {
      if (
        formik.values.reviewTitle == '' ||
        formik.values.reviewDescription == '' ||
        pictureUrls == []
      ) {
        toast.error(
          'All review information must be filled in, please re-enter!'
        );
        return;
      }
      axios
        .post('/api/review', {
          userName: user?.userName,
          recipeID: id,
          revTitle: formik.values.reviewTitle,
          revDesc: formik.values.reviewDescription,
          stars: formik.values.reviewStars,
          pictureUrls: pictureUrls,
        })
        .then((res) => {
          Router.reload();
        })
        .catch((error) => {
          console.log(error);
          toast.error(
            'Failed to post the review, you may have already posted it!'
          );
        });
    },
  });

  return recipeInfo && curUnits && curAmounts ? (
    <>
      <Header />
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h3">{recipeInfo.title}</Typography>
          <Typography variant="subtitle1">
            Posted By: {recipeInfo.postedBy}
          </Typography>
          <Typography variant="subtitle1">
            Number of servings: {recipeInfo.numServings}
          </Typography>
          <Typography variant="subtitle1">
            Tags: {recipeInfo.tags.join(' ')}
          </Typography>
          <Card sx={{ minWidth: 400 }} variant="outlined">
            <CardContent>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                Images
              </Typography>
              {recipeInfo.pictureUrls.map((pictureUrl) => (
                <img src={`${pictureUrl}`} loading="lazy" width="400px" />
              ))}
            </CardContent>
          </Card>
          <br />
          <Card sx={{ minWidth: 600 }} variant="outlined">
            <CardContent>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                Ingredients
              </Typography>
              {recipeInfo.ingredients.map((ingredient, index) => (
                <Card sx={{ minWidth: 300, mb: 1 }} variant="outlined">
                  <Typography>{`Ingredient ${index + 1}`}</Typography>
                  <Typography>{`Name: ${ingredient.iName}`}</Typography>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Unit
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        value={curUnits[index]}
                        onChange={(e) => {
                          e.target.value;
                          setCurUnits(
                            curUnits.map((curUnit, idx) =>
                              index == idx ? e.target.value : curUnit
                            )
                          );
                          axios
                            .post('/api/unit', {
                              srcUnit: iniUnits[index],
                              dstUnit: e.target.value,
                              srcAmount: iniAmounts[index],
                            })
                            .then((res) => {
                              setCurAmounts(
                                curAmounts.map((curAmount, idx) =>
                                  index == idx ? res.data.dstAmount : curAmount
                                )
                              );
                            });
                        }}
                      >
                        {units.map((unit) => (
                          <MenuItem value={unit}>{unit}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Typography>{`Amount: ${curAmounts[index]}`}</Typography>
                </Card>
              ))}
            </CardContent>
          </Card>
          <br />
          <Card sx={{ minWidth: 600 }} variant="outlined">
            <CardContent>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                Steps
              </Typography>
              {recipeInfo.stepDescriptions.map((stepDescription, index) => (
                <>
                  <Typography>{`Step ${
                    index + 1
                  }: ${stepDescription}`}</Typography>
                </>
              ))}
            </CardContent>
          </Card>
          <br />
          <Card sx={{ minWidth: 400 }} variant="outlined">
            <CardContent>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                Reviews
              </Typography>
              {reviewInfo?.map((rev, index) => (
                <Card sx={{ minWidth: 400 }} variant="outlined">
                  <Typography>{`Review ${index + 1}`}</Typography>
                  <Typography>{`Title: ${rev.title}`}</Typography>
                  <Typography>{`User Name: ${rev.userName}`}</Typography>
                  <Typography>{`Description: ${rev.description}`}</Typography>
                  <Typography>{`Stars: ${rev.stars}`}</Typography>
                  {rev.pictureUrls.map((pictureUrl) => (
                    <ImageListItem key={pictureUrl}>
                      <img src={`${pictureUrl}`} width="200px" />
                    </ImageListItem>
                  ))}
                </Card>
              ))}
            </CardContent>
          </Card>
          <br />
          <Typography component="h1" variant="h5">
            Post a Review
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
                  name="reviewTitle"
                  fullWidth
                  value={formik.values.reviewTitle}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="reviewDescription"
                  fullWidth
                  multiline
                  rows={4}
                  value={formik.values.reviewDescription}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Stars</InputLabel>
                  <Select
                    label="Stars"
                    name="reviewStars"
                    value={formik.values.reviewStars}
                    onChange={formik.handleChange}
                  >
                    {[0, 1, 2, 3, 4, 5].map((star) => (
                      <MenuItem value={star}>{star}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
  ) : (
    <></>
  );
}
