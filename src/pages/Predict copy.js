import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
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
import ProjectCombobox from "../components/ProjectCombobox";
import ModelCombobox from "../components/ModelCombobox";

import { fetchProjectScreensGroupedBySection } from "../services/zeplin";
import {Predict} from "../components/Predict";



const useStyles = makeStyles((theme) => ({
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
    color: "white",
  },
}));



export default function Create() {
  const classes = useStyles();
  const history = useHistory();
  const [error, setError] = useState();
  const [selectedProject, setSelectedProject] = useState();
  const [selectedModel, setSelectedModel] = useState();
  const [creating, setCreating] = useState();
  const [imagePath, setImagePath] = useState();
  

  const onBack = (e) => {
    e.preventDefault();

    history.replace("/");
  };

  const onCreate = async () => {
    setCreating(true);

    const screens = await fetchProjectScreensGroupedBySection(
      selectedProject.id
    );

    screens.map((section, index) => {
      console.log(section.id);
      section.screens.map((screen, index) => {
        const img = screen.image.original_url;
        
        setImagePath(img);

      });
    });

    setCreating(false);
  };

  const isReady = !!selectedProject && !!selectedModel;

  return (
    <Main>
      <Box marginBottom={4}>
        <Paper variant="outlined">
          <Box padding={4}>
            <Box marginBottom={2}>
              <Typography component="h1" variant="h6">
                Extract screens from a Zeplin
              </Typography>
            </Box>
            <ProjectCombobox onProjectSelect={setSelectedProject} />
          </Box>
          <Box padding={4}>
            <Box marginBottom={2}>
              <Typography component="h1" variant="h6">
                Choose a ML model
              </Typography>
            </Box>
            <ModelCombobox onModelSelect={setSelectedModel} />
          </Box>

          <Box padding={4}>
            <Box marginTop={2}>
              <Button
                onClick={onCreate}
                size="large"
                variant="contained"
                color="primary"
                fullWidth
                disableElevation
                disabled={!isReady || creating}
                startIcon={
                  creating && <CircularProgress color="inherit" size={24} />
                }
              >
                Predict
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
      {!creating && imagePath && (
        <Paper variant="outlined">
          <Box padding={4}>
            <Predict model={selectedModel} img={imagePath}/>
          </Box>
        </Paper>
      )}

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
          Change accounts
        </Link>
      </Box>
    </Main>
  );
}
