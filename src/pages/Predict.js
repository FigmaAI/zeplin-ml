import React, { useState, useEffect } from "react";
import "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

import { useHistory } from "react-router-dom";

import queryString from "query-string";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { Box, Link } from "@material-ui/core";

import Main from "../layouts/Main";

import { fetchProjectScreensGroupedBySection } from "../services/zeplin";
import Loader from "../components/Loader";
import Detection from "../components/Detection";

export default function Predict(props) {
  const [model, setModel] = useState(null);
  // const [imageUrl, setImageUrl] = useState(null);
  // const [imgWidth, setImgWidth] = useState(null);
  // const [imgHeight, setImgHeight] = useState(null);

  // 일단 임시로 이것을 사용
  const imageUrl = "./image2.jpg";
  const imgWidth = "600";
  const imgHeight = "399";

  const history = useHistory();
  const query = queryString.parse(history.location.search);
  const onBack = (e) => {
    e.preventDefault();
    history.replace("/create");
  };
  const onFetch = async () => {
    const screens = await fetchProjectScreensGroupedBySection(query.pid);

    screens.map((section, index) => {
      console.log(section.id);
      section.screens.map((screen, index) => {
        // setImageUrl(screen.image.original_url);
        // setImgWidth(screen.image.width);
        // setImgHeight(screen.image.height);
        console.log(screen);
      });
    });
  };

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await cocoSsd.load({ base: query.model });
      // const loadedModel = await tf.loadGraphModel(
      //   "/models/" + query.model + "/model.json"
      // );
      setModel(loadedModel);
    };
    loadModel();
    onFetch();
  }, []);

  console.log(model);

  return (
    <Main>
      {model === null && <Loader text="Loading the model" />}
      {model !== null &&
        imageUrl !== null &&
        imgWidth !== null &&
        imgHeight !== null && (
          <Detection
            model={model}
            imageUrl={imageUrl}
            width={imgWidth}
            height={imgHeight}
          />
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
