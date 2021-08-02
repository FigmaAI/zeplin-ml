import React, { Fragment } from "react";
import * as tf from "@tensorflow/tfjs";
import {
  CreateNote,
  fetchLayersFromScreenVersions,
  ExtractComponents,
} from "../../services/zeplin";
import { Button, Box, Paper, Typography } from "@material-ui/core";
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

const renderComponents = async (data) => {
  console.log("Getting components from Zeplin");

  // Get raw JSON and extract Component_name
  const raw = await fetchLayersFromScreenVersions(data.pid, data.screenId);
  const layers = ExtractComponents(raw);
  console.log("Zeplin Components: ", layers);

  const image = document.getElementById("preview");

  // Draw canvas
  const c = document.getElementById("components");
  c.width = data.imgWidth;
  c.height = data.imgHeight;
  const context = c.getContext("2d");
  context.drawImage(image, 0, 0, c.width, c.height);

  // Font options.
  const font = "12px sans-serif";
  context.font = font;
  context.textBaseline = "top";

  layers.forEach((layer) => {
    const x = layer.RECT.absolute.x;
    const y = layer.RECT.absolute.y;
    const width = layer.RECT.width;
    const height = layer.RECT.height;
    const label = layer.COMPONENT_NAME;

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
};

const renderPredictions = (
  predictions,
  width,
  height,
  classesDir,
  savedModelShow
) => {
  console.log("Highlighting results...");

  //Getting predictions
  const boxes = predictions[savedModelShow.boxes].arraySync();
  const scores = predictions[savedModelShow.scores].arraySync();
  const classes = predictions[savedModelShow.classes].dataSync();
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

const Detection = ({ model, data, classesDir, savedModelShow }) => {
  const run = async () => {
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
        savedModelShow
      );

      console.log("detected: ", detections);

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

        // const zeplinX = x / data.imgWidth;
        // const zeplinY = y / data.imgHeight;
        // const params = {
        //   content: content,
        //   position: { x: zeplinX, y: zeplinY },
        //   color: "peach",
        // };

        // const note = await CreateNote(data.pid, data.screenId, params);
        // console.log(note);
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const classes = useStyles();
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
                  onLoad={() => {
                    run();
                  }}
                  alt=""
                  id="preview"
                  crossOrigin="anonymous"
                  border="1px"
                />
              </Box>
            </Paper>
          </Box>
          <Box marginTop={4}>
            <Paper className={classes.paper} variant="outlined">
              <Box padding={4}>
                <Typography component="h1" variant="h6">
                  TensorFlow Detections
                </Typography>
                <canvas id="predictions" border="1px" />
              </Box>
            </Paper>
          </Box>

          <Box marginTop={4}>
            <Paper className={classes.paper} variant="outlined">
              <Box padding={4}>
                <Typography component="h1" variant="h6">
                  Design System usage
                </Typography>
                <canvas id="components" border="1px" />
                <Box padding={4}>
                  <Button
                    onClick={() => renderComponents(data)}
                    size="large"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disableElevation
                  >
                    Compare to...
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Fragment>
      )}
    </>
  );
};

export default Detection;
