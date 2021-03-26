import React, { Fragment } from "react";
import * as tf from "@tensorflow/tfjs";
import { CreateNote } from "../../services/zeplin";

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

const renderPredictions = (predictions, width, height, classesDir) => {
  console.log("Highlighting results...");

  //Getting predictions
  const boxes = predictions[0].arraySync();
  const scores = predictions[4].arraySync();
  const classes = predictions[2].dataSync();
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
        label: classesDir[classes[i]].name,
        score: score.toFixed(4),
        bbox: bbox
      });
    }
  });

  return detectionObjects;
};

const Detection = ({ model, data, classesDir }) => {
  const run = async () => {
    try {
      const image = document.getElementById("preview");

      // Draw canvas
      const c = document.getElementById("canvas");
      c.width = data.imgWidth;
      c.height = data.imgHeight;
      const context = c.getContext("2d");
      context.drawImage(image, 0, 0);

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
        classesDir
      );

      console.log(detections);

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

        const zeplinX = x / data.imgWidth;
        const zeplinY = y / data.imgHeight;
        const params = {
          content: content,
          position: { x: zeplinX, y: zeplinY },
          color: "peach",
        };

        const note = await CreateNote(data.pid, data.screenId, params);
        console.log(note);
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <>
      {data === undefined && (
        <img
          src="http://placehold.it/640x640"
          alt=""
          width="640"
          height="640"
        />
      )}
      {data !== undefined && (
        <Fragment>
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
          <canvas id="canvas" />
        </Fragment>
      )}
    </>
  );
};

export default Detection;
