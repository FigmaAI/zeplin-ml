import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ArrowBack from "@material-ui/icons/ArrowBack";
import {
  Paper,
  Box,
  Link,
  Typography,
  Button,
} from "@material-ui/core";

import Main from "../layouts/Main";
import ProjectCombobox from "../components/ProjectCombobox";
import ModelCombobox from "../components/ModelCombobox";

export default function Create() {
  const history = useHistory();
  const [selectedProject, setSelectedProject] = useState();
  const [selectedModel, setSelectedModel] = useState();


  const onBack = (e) => {
    e.preventDefault();

    history.replace("/");
  };

  const onPredict = () => {
    history.push({
      pathname: "/predict",
      search: "?pid=" + selectedProject.id + "&model=" + selectedModel
    });
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
                onClick={onPredict}
                size="large"
                variant="contained"
                color="primary"
                fullWidth
                disableElevation
                disabled={!isReady}
              >
                Predict
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

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
