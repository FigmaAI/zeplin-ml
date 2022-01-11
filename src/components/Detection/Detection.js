import React, { Fragment, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import {
  CreateNote,
  fetchLayersFromScreenVersions,
  ExtractComponents,
  matchBoxes,
} from "../../services/zeplin";
import { Button, Box, Paper, Typography, ButtonGroup } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  color: theme.palette.text.secondary,
}));

const loadImage = (frame) => {
  console.log("Pre-processing image...");
  const tfimg = tf.browser.fromPixels(frame).toInt();
  const expandedimg = tfimg.expandDims();
  return expandedimg;
};

const predictUI = async (inputs, model) => {
  console.log("Running predictions...");
  const predictions = await model.executeAsync(inputs);
  return predictions;
};

const getLabelByID = (classes, i) => {
  let label = classes.filter((x) => x.id === i);
  return label[0].name;
};

const compareTo = (pid, screenId, imgWidth, imgHeight, boxes1, boxes2) => {
  console.log("Comparing designs and predictions...");

  try {
    // Matched designs and predictions
    const matched = matchBoxes(boxes1, boxes2);
    console.log("matched: ", matched);

    const image = document.getElementById("preview");
    // Draw canvas
    const c = document.getElementById("predictions");
    c.width = imgWidth;
    c.height = imgHeight;
    const context = c.getContext("2d");
    context.drawImage(image, 0, 0, c.width, c.height);
    // Font options.
    const font = "12px sans-serif";
    context.font = font;
    context.textBaseline = "top";

    matched.forEach((match) => {
      const iou = match.iou;
      const x = match.bbox[0];
      const y = match.bbox[1];
      const width = match.bbox[2];
      const height = match.bbox[3];
      const label = match.label;
      const labelSimilarity = match.labelSimilarity;

      // if IoU < 0.5, draw Red box, other would be drawn skyblue

      if (iou !== null && labelSimilarity > 0.5) {
        context.strokeStyle = "#00FFFF";
        context.lineWidth = 1;
        context.strokeRect(x, y, width, height);

        // Draw the label background.
        const content = "Similarity: " + (100 * iou).toFixed(2) + "%";
        context.fillStyle = "#00FFFF";
        const textWidth = context.measureText(content).width;
        const textHeight = parseInt(font, 10); // base 10
        context.fillRect(x, y, textWidth + 4, textHeight + 4);

        // Draw the text last to ensure it's on top.
        context.fillStyle = "#000000";
        context.fillText(content, x, y);
      } else {
        context.strokeStyle = "#FF0000";
        context.lineWidth = 4;
        context.strokeRect(x, y, width, height);

        // Draw the label background.
        context.fillStyle = "#FF0000";
        const textWidth = context.measureText(label).width;
        const textHeight = parseInt(font, 10); // base 10
        context.fillRect(x, y, textWidth + 4, textHeight + 4);

        // Draw the text last to ensure it's on top.
        context.fillStyle = "#FFFFFF";
        context.fillText(label, x, y);
        const zeplinX = x / imgWidth;
        const zeplinY = y / imgHeight;

        const params = {
          content: label,
          position: { x: zeplinX, y: zeplinY },
          color: "peach",
        };

        const note = CreateNote(pid, screenId, params);
        console.log(note);
      }
    });
  } catch (e) {
    console.log(e.message);
  }
};

const renderComponents = async (data, setLayer) => {
  console.log("Getting components from Zeplin");
  try {
    // Get raw JSON and extract Component_name
    const raw = await fetchLayersFromScreenVersions(data.pid, data.screenId);
    const layers = ExtractComponents(raw);
    console.log("Zeplin Components: ", layers);
    setLayer(layers);

    const image = document.getElementById("preview");

    // Draw canvas
    const c = document.getElementById("predictions");
    c.width = data.imgWidth;
    c.height = data.imgHeight;
    const context = c.getContext("2d");
    context.drawImage(image, 0, 0, c.width, c.height);

    // Font options.
    const font = "12px sans-serif";
    context.font = font;
    context.textBaseline = "top";

    layers.forEach((layer) => {
      const x = layer["bbox"][0];
      const y = layer["bbox"][1];
      const width = layer["bbox"][2];
      const height = layer["bbox"][3];
      const label = layer.label;

      // Draw the bounding box.
      context.strokeStyle = "#FFA500";
      context.lineWidth = 4;
      context.strokeRect(x, y, width, height);

      // Draw the label background.
      context.fillStyle = "#FFA500";
      const textWidth = context.measureText(label).width;
      const textHeight = parseInt(font, 10); // base 10
      context.fillRect(x, y, textWidth + 4, textHeight + 4);

      // Draw the text last to ensure it's on top.
      context.fillStyle = "#000000";
      context.fillText(label, x, y);
    });
  } catch (e) {
    console.log(e.message);
  }
};

const renderPredictions = (
  predictions,
  width,
  height,
  classesDir,
  cli
) => {
  console.log("Highlighting results...");

  //Getting predictions
  const boxes = predictions[cli.boxes].arraySync();
  const scores = predictions[cli.scores].arraySync();
  const classes = predictions[cli.classes].dataSync();
  const detectionObjects = [];

  scores[0].forEach((score, i) => {
    if (score > 0.3) {
      const bbox = [];
      const minY = boxes[0][i][0] * height;
      const minX = boxes[0][i][1] * width;
      const maxY = boxes[0][i][2] * height;
      const maxX = boxes[0][i][3] * width;
      bbox[0] = minX;
      bbox[1] = minY;
      bbox[2] = maxX - minX;
      bbox[3] = maxY - minY;

      detectionObjects.push({
        class: classes[i],
        label: getLabelByID(classesDir, classes[i]),
        score: score.toFixed(4),
        bbox: bbox,
      });
    }
  });

  return detectionObjects;
};

const runPrediction = async (
  data,
  model,
  classesDir,
  cli,
  setLoading,
  setPrediction
) => {
  setLoading(true);
  try {
    const image = document.getElementById("preview");

    // Draw canvas
    const c = document.getElementById("predictions");
    c.width = data.imgWidth;
    c.height = data.imgHeight;
    const context = c.getContext("2d");
    context.drawImage(image, 0, 0, c.width, c.height);

    // Font options.
    const font = "16px sans-serif";
    context.font = font;
    context.textBaseline = "top";

    const expandedimg = loadImage(image);
    const predictions = await predictUI(expandedimg, model);
    const detections = renderPredictions(
      predictions,
      data.imgWidth,
      data.imgHeight,
      classesDir,
      cli
    );

    console.log("detected: ", detections);
    setPrediction(detections);
    setLoading(false);

    detections.forEach((item) => {
      const x = item["bbox"][0];
      const y = item["bbox"][1];
      const width = item["bbox"][2];
      const height = item["bbox"][3];

      // Draw the bounding box.
      context.strokeStyle = "#00FFFF";
      context.lineWidth = 4;
      context.strokeRect(x, y, width, height);

      // Draw the label background.
      context.fillStyle = "#00FFFF";
      const textWidth = context.measureText(
        item["label"] + " " + (100 * item["score"]).toFixed(2) + "%"
      ).width;
      const textHeight = parseInt(font, 10); // base 10
      context.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    for (let i = 0; i < detections.length; i++) {
      const item = detections[i];
      const x = item["bbox"][0];
      const y = item["bbox"][1];
      const content =
        item["label"] + " " + (100 * item["score"]).toFixed(2) + "%";

      // Draw the text last to ensure it's on top.
      context.fillStyle = "#000000";
      context.fillText(content, x, y);
      console.log("detected: ", item);
    }
  } catch (e) {
    console.log(e.message);
  }
};

const Detection = ({ model, data, classesDir, cli }) => {
  const [loading, setLoading] = useState();
  const [layer, setLayer] = useState();
  const [prediction, setPrediction] = useState();
  const classes = useStyles();

  const isReady = !!layer && !!prediction;

  return (
    <>
      {data === undefined && (
        <Box marginTop={4}>
          <Paper className={classes.paper} variant="outlined">
            <Box padding={4}>
              <img src="http://via.placeholder.com/360x640" alt="" />
            </Box>
          </Paper>
        </Box>
      )}
      {data !== undefined && (
        <Fragment>
          <Box marginTop={4}>
            <Paper className={classes.paper} variant="outlined">
              <Box padding={4}>
                <Typography component="h1" variant="h6">
                  Original Screen
                </Typography>
                <img
                  src={data.imageUrl}
                  width={data.imgWidth}
                  height={data.imgHeight}
                  alt=""
                  id="preview"
                  crossOrigin="anonymous"
                />
              </Box>
            </Paper>
          </Box>
          <Box marginTop={4}>
            <Paper className={classes.paper} variant="outlined">
              <Box padding={4}>
                <Box padding={4}>
                  <ButtonGroup
                    color="primary"
                    aria-label="outlined primary button group"
                  >
                    <Button
                      onClick={() => {
                        runPrediction(
                          data,
                          model,
                          classesDir,
                          cli,
                          setLoading,
                          setPrediction
                        );
                      }}
                      disabled={loading}
                    >
                      ❶ Get TFJS
                    </Button>
                    <Button onClick={() => renderComponents(data, setLayer)}>
                      ❷ Get Zeplin
                    </Button>
                    <Button
                      onClick={() =>
                        compareTo(
                          data.pid,
                          data.screenId,
                          data.imgWidth,
                          data.imgHeight,
                          layer,
                          prediction
                        )
                      }
                      disabled={!isReady}
                    >
                      ❸ Compare
                    </Button>
                  </ButtonGroup>
                </Box>
                <canvas id="predictions" />
              </Box>
            </Paper>
          </Box>
        </Fragment>
      )}
    </>
  );
};

export default Detection;
