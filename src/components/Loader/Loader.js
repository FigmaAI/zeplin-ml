import React, { Fragment } from "react";
import { Grid, Box, Typography, CircularProgress } from "@material-ui/core";

const Loader = ({ text }) => (
  <Fragment>
    <Grid container justify="center" alignItems="center">
      <CircularProgress />
      <Box padding={4}>
        <Typography component="h1" variant="h6">
          {text}
        </Typography>
      </Box>
    </Grid>
  </Fragment>
);

export default Loader;
