import React, { Fragment } from "react";
import {CreateNote} from "../../services/zeplin";

const Detection = ({ model, data }) => {

  async function run() {
    console.log(data);
    const preview = document.getElementById("preview");

    // Classify the image
    if (preview != null) {
      const predictions = await model.detect(preview);
      console.log(predictions);

      const c = document.getElementById("canvas");
      c.width = preview.width;
      c.height = preview.height;
      const context = c.getContext("2d");
      context.drawImage(preview, 0, 0);
      context.font = "16px Arial";

      console.log("number of detections: ", predictions.length);
      for (let i = 0; i < predictions.length; i++) {
        const content = predictions[i].class + " ( " + predictions[i].score.toFixed(2)*100 + "% )";
        context.beginPath();
        context.rect(...predictions[i].bbox);
        context.lineWidth = 6;
        context.strokeStyle = "white";
        context.fillStyle = "white";
        context.stroke();
        context.fillText(
          content,
          predictions[i].bbox[0],
          predictions[i].bbox[1] > 10 ? predictions[i].bbox[1] - 5 : 10
        );
        
        const params = {
          content: content,
          position: {
            x: predictions[i].bbox[0]/data.imgWidth,
            y: predictions[i].bbox[1]/data.imgHeight,
          },
          color: "deep_purple",
        };

        const note = await CreateNote(data.pid, data.screenId, params);
        console.log(note);
      }
    }
  }

  const onLoad = () => {
    console.log("loaded");
    run();
  };

  return (
    <>
      {data === undefined && (
        <img
          src="http://placehold.it/500x400"
          alt=""
          width="500"
          height="400"
        />
      )}
      {data !== undefined && (
        <Fragment>
          <img
            src={data.imageUrl}
            width={data.imgWidth}
            height={data.imgHeight}
            onLoad={onLoad}
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
