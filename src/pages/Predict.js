import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import queryString from "query-string";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { Box, Link, Button } from "@material-ui/core";

import Main from "../layouts/Main";
import { fetchProjectScreensGroupedBySection } from "../services/zeplin";
import Loader from "../components/Loader";
import Detection from "../components/Detection";
import * as tf from "@tensorflow/tfjs";
tf.setBackend("webgl");

export default function Predict(props) {
  const [model, setModel] = useState(null);
  const [imgData, setImgData] = useState([]);
  const [round, setRound] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [totalLength, setTotalLength] = useState(null);
  const [classesDir, setClassesDir] = useState(null);

  const history = useHistory();
  const query = queryString.parse(history.location.search);

  const onBack = (e) => {
    e.preventDefault();
    history.replace("/create");
  };

  const loadModel = async () => {
    const loadedModel = await tf.loadGraphModel(
      "/models/" + query.model + "/model.json"
    );

    let classesDir = {
      1: {
        name: "Text",
        id: 1,
      },
      2: {
        name: "Image",
        id: 2,
      },
      3: {
        name: "Icon",
        id: 3,
      },
      4: {
        name: "List Item",
        id: 4,
      },
      5: {
        name: "Text Button",
        id: 5,
      },
      6: {
        name: "Toolbar",
        id: 6,
      },
      7: {
        name: "Web View",
        id: 7,
      },
      8: {
        name: "Input",
        id: 8,
      },
      9: {
        name: "Card",
        id: 9,
      },
      10: {
        name: "Advertisement",
        id: 10,
      },
      11: {
        name: "Background Image",
        id: 11,
      },
      12: {
        name: "Drawer",
        id: 12,
      },
      13: {
        name: "Radio Button",
        id: 13,
      },
      14: {
        name: "Checkbox",
        id: 14,
      },
      15: {
        name: "Multi-Tab",
        id: 15,
      },
      16: {
        name: "Pager Indicator",
        id: 16,
      },
      17: {
        name: "Modal",
        id: 17,
      },
      18: {
        name: "On/Off Switch",
        id: 18,
      },
      19: {
        name: "Slider",
        id: 19,
      },
      20: {
        name: "Map View",
        id: 20,
      },
      21: {
        name: "Button Bar",
        id: 21,
      },
      22: {
        name: "Video",
        id: 22,
      },
      23: {
        name: "Bottom Navigation",
        id: 23,
      },
      24: {
        name: "Number Stepper",
        id: 24,
      },
      25: {
        name: "Date Picker",
        id: 25,
      },
    };

    setClassesDir(classesDir);
    setModel(loadedModel);
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
          <Detection
            data={selectedData}
            model={model}
            classesDir={classesDir}
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
