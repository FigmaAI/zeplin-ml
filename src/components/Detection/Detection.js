import React, { Fragment, useCallback } from "react";

const Detection = ({ model, data }) => {
  console.log(data);
  const imgRef = React.useRef();

  async function run(props) {
    const img = document.getElementById("preview");

    // Classify the image
    if (img != null) {
      const predictions = await model.detect(img);
      console.log(predictions);

      const c = document.getElementById("canvas");
      c.width = img.width;
      c.height = img.height;
      const context = c.getContext("2d");
      context.drawImage(img, 0, 0);
      context.font = "16px Arial";

      console.log("number of detections: ", predictions.length);
      for (let i = 0; i < predictions.length; i++) {
        context.beginPath();
        context.rect(...predictions[i].bbox);
        context.lineWidth = 6;
        context.strokeStyle = "white";
        context.fillStyle = "white";
        context.stroke();
        context.fillText(
          predictions[i].score.toFixed(3) + " " + predictions[i].class,
          predictions[i].bbox[0],
          predictions[i].bbox[1] > 10 ? predictions[i].bbox[1] - 5 : 10
        );
      }
    }
  }

  const onLoad = useCallback(() => {
    console.log("loaded");
    run();
  }, []);

  return (
    <>
      {data === undefined && (
        <img src="http://placehold.it/500x400" alt width="500" height="400" />
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
