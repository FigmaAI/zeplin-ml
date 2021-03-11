import React, { Fragment } from "react";
import { CreateNote } from "../../services/zeplin";

const Detection = ({ model, data, options }) => {
  
  const run = async () => {
    
    console.log(data);
    const preview = document.getElementById("preview");
    const predictions = await model.detect(preview, options);

    // const predictions =
    //   options != null
    //     ? await model.detect(preview, options)
    //     : await model.detect(preview);
    console.log(predictions);

    const c = document.getElementById("canvas");
    c.width = data.imgWidth;
    c.height = data.imgHeight;
    const context = c.getContext("2d");
    context.drawImage(preview, 0, 0);
    context.font = "16px Arial";

    console.log("number of detections: ", predictions.length);

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
      context.fillText(
        content,
        left,
        top > 10 ? top - 5 : 10
      );

      const params = {
        content: content,
        position: {
          x: left / data.imgWidth,
          y: top / data.imgHeight,
        },
        color: "deep_purple",
      };

      // const note = await CreateNote(data.pid, data.screenId, params);
      // console.log(note);

    };
  }
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
            onLoad={()=>{run()}}
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
