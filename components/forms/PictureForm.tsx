import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export default function PictureForm({
  pictureUrls,
  setPictureUrls,
}: {
  pictureUrls: string[];
  setPictureUrls: (pictures: string[]) => void;
}) {
  const [pictureUrl, setPictureUrl] = useState('');

  return (
    <>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Picture
      </Typography>
      <List>
        {pictureUrls.map((pictureUrl) => (
          <ListItem>
            <img src={pictureUrl} height="200px" />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Picture URL"
              fullWidth
              value={pictureUrl}
              onChange={(e) => {
                setPictureUrl(e.currentTarget.value);
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
            setPictureUrls([...pictureUrls, pictureUrl]);
            setPictureUrl('');
          }}
        >
          Add Picture
        </Button>
      </Box>
    </>
  );
}
