import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';

import { Ingredient } from '../../services/recipe-service';

export default function IngredientForm({
  ingredients,
  setIngredients,
}: {
  ingredients: Ingredient[];
  setIngredients: (ingredients: Ingredient[]) => void;
}) {
  const formik = useFormik({
    initialValues: {
      iName: '',
      unitName: '',
      amount: 0,
    },
    onSubmit: () => {},
  });

  const [ingNames, setIngNames] = useState<string[]>([]);
  const [units, setUnits] = useState<string[]>([]);

  useEffect(() => {
    axios.get('/api/ingredient').then((res) => {
      const ingNames = res.data.ingredients.map(
        (ingredient) => ingredient.iName
      );
      setIngNames(ingNames);
    });
    axios.get('/api/unit').then((res) => {
      const units = res.data.units.map((unit) => unit.unitName);
      setUnits(units);
    });
  }, []);

  return (
    <>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Ingredient
      </Typography>
      <List>
        {ingredients.map((ingredient) => (
          <ListItem>
            <ListItemText primary={ingredient.iName} />
          </ListItem>
        ))}
      </List>
      <Box
        component="form"
        noValidate
        onSubmit={formik.handleSubmit}
        sx={{ mt: 3 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Ingredient Name</InputLabel>
              <Select
                label="Ingredient Name"
                name="iName"
                value={formik.values.iName}
                onChange={formik.handleChange}
              >
                {ingNames.map((ingName) => (
                  <MenuItem value={ingName}>{ingName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Unit Name</InputLabel>
              <Select
                label="Unit Name"
                name="unitName"
                value={formik.values.unitName}
                onChange={formik.handleChange}
              >
                {units.map((unit) => (
                  <MenuItem value={unit}>{unit}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Amount"
              name="amount"
              fullWidth
              value={formik.values.amount}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          color="info"
          onClick={() => {
            setIngredients([
              ...ingredients,
              {
                iName: formik.values.iName,
                unitName: formik.values.unitName,
                amount: formik.values.amount,
              },
            ]);
            formik.resetForm();
          }}
        >
          Add Ingredient
        </Button>
      </Box>
    </>
  );
}
