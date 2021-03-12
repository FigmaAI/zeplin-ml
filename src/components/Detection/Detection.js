import React, { Fragment } from "react";
import { CreateNote } from "../../services/zeplin";

const Detection = ({ model, data, options }) => {
  const run = async () => {
    console.log(data);
    const preview = document.getElementById("preview");

    // canvas 그리기
    const c = document.getElementById("canvas");
    c.width = data.imgWidth;
    c.height = data.imgHeight;
    const context = c.getContext("2d");
    context.drawImage(preview, 0, 0);
    context.font = "16px Arial";

    if (options !== null) {
      const predictions = await model.detect(preview, options);
      console.log(predictions);
      console.log("number of detections: ", predictions.length);
      const context = c.getContext("2d");

      if (predictions.length !== null) {
        for (let i = 0; i < predictions.length; i++) {
          const { box, label, score } = predictions[i];
          const { left, top, width, height } = box;
          const bbox = [left, top, width, height];

          const percent = score * 100;
          const content = label + " ( " + percent.toFixed(2) + "% )";
          context.beginPath();
          context.rect(...bbox);
          context.lineWidth = 6;
          context.strokeStyle = "white";
          context.fillStyle = "white";
          context.stroke();
          context.fillText(content, left, top > 10 ? top - 5 : 10);

          const params = {
            content: content,
            position: {
              x: left / c.width,
              y: top / c.height,
            },
            color: "peach",
          };

          const note = await CreateNote(data.pid, data.screenId, params);
          console.log(note);
        }
      }
    } else {
      const predictions = await model.detect(preview);
      console.log(predictions);
      console.log("number of detections: ", predictions.length);

      for (let i = 0; i < predictions.length; i++) {
        const percent = predictions[i].score * 100;
        const content =
          predictions[i].class + " ( " + percent.toFixed(2) + "% )";

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
            x: predictions[i].bbox[0] / c.width,
            y: predictions[i].bbox[1] / c.height,
          },
          color: "deep_purple",
        };

        const note = await CreateNote(data.pid, data.screenId, params);
        console.log(note);
      }
    }
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
