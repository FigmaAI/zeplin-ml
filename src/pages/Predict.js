import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import queryString from "query-string";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { green } from "@material-ui/core/colors";
import { Alert, AlertTitle } from "@material-ui/lab";
import {
  Paper,
  Box,
  Link,
  Typography,
  Button,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";

import Main from "../layouts/Main";
import PredictCard from "../components/PredictCard";

const useStyles = makeStyles((theme) => ({
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
    color: "white",
  },
}));

export default function Predict() {
  const classes = useStyles();
  const history = useHistory();
  const query = queryString.parse(history.location.search);
  const [error, setError] = useState();

  const onBack = (e) => {
    e.preventDefault();

    history.replace("/create");
  };

  // const onLoad = async () => {
  //   setCreating(true);

  //   const screens = await fetchProjectScreensGroupedBySection(
  //     selectedProject.id
  //   );

  //   screens.map((section, index) => {
  //     console.log(section.id);
  //     section.screens.map((screen, index) => {
  //       const img = screen.image.original_url;

  //       setImagePath(img);

  //     });
  //   });

  //   setCreating(false);
  // };

  return (
    <Main>
      <PredictCard model={query.model} />

      {error && (
        <Alert severity="error">
          <AlertTitle>Error occurred!</AlertTitle>
          {error.message}
        </Alert>
      )}

      <Box position="absolute" left={16} top={16}>
        <Link
          style={{ fontSize: 16, display: "flex", alignItems: "center" }}
          component="button"
          onClick={onBack}
        >
          <ArrowBack color="primary" />
          Change a model and project
        </Link>
      </Box>
    </Main>
  );
}
