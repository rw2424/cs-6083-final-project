import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export default function StepForm({
  stepDescriptions,
  setStepDescriptions,
}: {
  stepDescriptions: string[];
  setStepDescriptions: (stepDescriptions: string[]) => void;
}) {
  const [stepDescription, setStepDescription] = useState('');

  return (
    <>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Step
      </Typography>
      <List>
        {stepDescriptions.map((stepDescription, index) => (
          <ListItem>
            <ListItemText primary={index + ' ' + stepDescription} />
          </ListItem>
        ))}
      </List>
      <Box noValidate sx={{ mt: 3 }} component="form">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Step Description"
              fullWidth
              value={stepDescription}
              onChange={(e) => {
                setStepDescription(e.currentTarget.value);
              }}
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          color="info"
          onClick={() => {
            setStepDescriptions([...stepDescriptions, stepDescription]);
            setStepDescription('');
          }}
        >
          Add Step
        </Button>
      </Box>
    </>
  );
}
