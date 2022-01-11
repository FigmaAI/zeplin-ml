import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import queryString from "query-string";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { Box, Link, Button, Paper, Typography } from "@material-ui/core";

import Main from "../layouts/Main";
import { fetchProjectScreensGroupedBySection } from "../services/zeplin";
import Loader from "../components/Loader";
import Detection from "../components/Detection";
import modelList from "../components/ModelCombobox/models.json";
import * as tf from "@tensorflow/tfjs";

tf.setBackend("webgl");

export default function Predict(props) {
  const [model, setModel] = useState(null);
  const [imgData, setImgData] = useState([]);
  const [round, setRound] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [totalLength, setTotalLength] = useState(null);
  const [classesDir, setClassesDir] = useState(null);
  const [cli, setCli] = useState(null);

  const history = useHistory();
  const query = queryString.parse(history.location.search);

  const onBack = (e) => {
    e.preventDefault();
    history.replace("/create");
  };

  const getModelByID = (models, i) => {
    let model = models.filter((x) => x.id === i);
    return model[0];
  };

  const imageReplacer = (screen) => {
    const image =
      process.env.NODE_ENV === "development"
        ? screen.replace("https://public-cdn.zeplin.dev/", "/")
        : screen;

    return image;
  };
  const loadModel = async () => {
    const model = getModelByID(modelList, query.model_id);

    const loadedModel = await tf.loadGraphModel(
      "/models/" + model.value[1] + "/" + model.value[2] + "/model.json"
    );
    const classesDir = require("../../public/models/" +
      model.value[1] +
      "/" +
      model.value[2] +
      "/label_map.json");

    setClassesDir(classesDir);
    setCli(model.cli);
    setModel(loadedModel);
  };

  const onFetch = async () => {
    const sections = await fetchProjectScreensGroupedBySection(query.pid);
    let data = [];
    sections.map((section, index) => {
      section.screens.map((screen, index) => {
        const imgProxy = imageReplacer(screen.image.original_url);
        const img = {
          pid: query.pid,
          screenId: screen.id,
          imageUrl: imgProxy,
          imgWidth: screen.image.width,
          imgHeight: screen.image.height,
        };
        data.push(img);
      });
    });

    console.log(data);
    setImgData(data);
    setRound(0);
    setTotalLength(data.length);
    setSelectedData(imgData[0]);
  };

  const onIncrease = () => {
    setRound(round + 1);
    setSelectedData(imgData[round]);
  };

  useEffect(() => {
    loadModel();
    onFetch();
  }, []);

  return (
    <Main>
      {model === null && (
        <Box marginBottom={4}>
          <Paper variant="outlined">
            <Loader text="Loading the model" />
          </Paper>
        </Box>
      )}
      {model !== null && selectedData !== null && (
        <>
          <Box marginBottom={4}>
            <Paper variant="outlined">
              <Box padding={4}>
                <Box marginBottom={2}>
                  <Typography component="h1" variant="h6">
                    Let's predict screens
                  </Typography>

                  <Box marginTop={2}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={onIncrease}
                      fullWidth
                    >
                      {round} / {totalLength}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>

          <Detection
            data={selectedData}
            model={model}
            classesDir={classesDir}
            cli={cli}
          />
        </>
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
