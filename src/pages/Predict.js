import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as automl from "@tensorflow/tfjs-automl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

import queryString from "query-string";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { Box, Link, Button } from "@material-ui/core";

import Main from "../layouts/Main";

import { fetchProjectScreensGroupedBySection } from "../services/zeplin";
import Loader from "../components/Loader";
import Detection from "../components/Detection";

tf.setBackend("cpu");

export default function Predict(props) {
  const [model, setModel] = useState(null);
  const [imgData, setImgData] = useState([]);
  const [round, setRound] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [totalLength, setTotalLength] = useState(null);
  const [options, setOptions] = useState(null);

  const history = useHistory();
  const query = queryString.parse(history.location.search);

  const onBack = (e) => {
    e.preventDefault();
    history.replace("/create");
  };
  const loadModel = async () => {
    if (query.model === "mobilenet_v1" || query.model === "mobilenet_v2") {
      const loadedModel = await cocoSsd.load({ base: query.model });
      setModel(loadedModel);
    } else {
      const loadedModel = await tf.loadGraphModel(
        "/models/" + query.model + "/model.json"
      );

      const options = {
        1: "Buttons",
        2: "Checkboxes",
        3: "FAB -Floating Action Button-",
        4: "Page Controls",
        5: "Pickers",
        6: "Progress indicators",
        7: "Radio buttons",
        8: "Rating",
        9: "Sliders",
        10: "Steppers",
        11: "Switches",
        12: "Text Fields",
      };

      // // AutoML의 경우 이것을 사용한다.
      // const options = { score: 0.5, iou: 0.5, topk: 20 };
      // const loadedModel = await automl.loadObjectDetection(
      // "/models/" + query.model + "/model.json"
      // "https://storage.googleapis.com/tfjs-testing/tfjs-automl/object_detection/model.json"
      // );
      setOptions(options); // SSD와 구분하는 용도로 사용
      setModel(loadedModel);
    }
  };

  const onFetch = async () => {
    const sections = await fetchProjectScreensGroupedBySection(query.pid);
    let data = [];
    sections.map((section, index) => {
      section.screens.map((screen, index) => {
        const origin_img = screen.image.original_url;
        const imgProxy = origin_img.replace(
          "https://public-cdn.zeplin.dev/",
          "/"
        );

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
      {model === null && <Loader text="Loading the model" />}
      {model !== null && selectedData !== null && (
        <>
          <Box marginBottom={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={onIncrease}
              fullWidth
            >
              {round + 1} / {totalLength + 1}
            </Button>
          </Box>
          <Detection data={selectedData} model={model} options={options} />
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
