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
  const [detected, setDetected] = useState(null);
  const [imgData, setImgData] = useState([]);
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

  const loadModel = async () => {
    const loadedModel = await cocoSsd.load({ base: query.model });
    // const loadedModel = await tf.loadGraphModel(
    //   "/models/" + query.model + "/model.json"
    // );
    setModel(loadedModel);
  };

  const onFetch = async () => {
    const sections = await fetchProjectScreensGroupedBySection(query.pid);
    console.log(sections);

    // 첫번째 배열은 비어있으므로 두번째 배열부터 반복
    for (var i = 1; i < sections.length; i++) {
      sections[i].screens.map((screen, index) => {
        let img = {
          id: screen.id,
          image: screen.image,
        };
        setImgData([...imgData, img]);
      });
    }
  };
  console.log(imgData)

  useEffect(() => {
    loadModel();
    onFetch();
  }, []);

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
            setDetected={setDetected}
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
