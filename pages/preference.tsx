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
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Header from '../components/Header';

export default function Preference() {
  const [preferredUnit, setPreferredUnit] = useState('');
  const [units, setUnits] = useState([]);

  useEffect(() => {
    setPreferredUnit(localStorage.getItem('preferredUnit') || '');
    axios.get('/api/unit').then((res) => {
      const units = res.data.units.map((unit) => unit.unitName);
      setUnits(units);
    });
  }, []);

  useEffect(() => {
    if (preferredUnit.length > 0) {
      localStorage.setItem('preferredUnit', preferredUnit);
    }
  }, [preferredUnit]);

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
              Preference
            </Typography>
          </Container>
        </Box>
        <Container maxWidth="md">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Preferred Unit
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={preferredUnit}
              onChange={(e) => {
                setPreferredUnit(e.target.value);
              }}
            >
              {units.map((unit) => (
                <MenuItem value={unit}>{unit}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Container>
      </main>
    </>
  );
}
