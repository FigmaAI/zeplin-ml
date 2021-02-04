import React, { useRef } from "react";
import { useObjects } from 'use-tensorflow';
import styled from "styled-components";

// See their implementations below
const Container = styled.div`
  position: relative;
`;

const BBox = styled.div`
  border: 2px solid ${({ color }) => color || "red"};
  position: absolute;
  border-radius: 4px;
  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  &::before,
  &::after {
    display: block;
    position: absolute;
    top: 0;
    color: white;
    background: ${({ color }) => color || "red"};
    padding: 3px 6px;
    font-size: 12px;
    font-family: monospace;
  }
  &::before {
    content: "${({ label }) => label}";
    left: 0;
    border-radius: 0 0 4px;
  }
  &::after {
    content: "${({ score }) => Math.round(score * 100)}%";
    right: 0;
    border-radius: 0 0 0 4px;
  }
`;

const asdf = () => {
  // 텐서플로 돌리고 
  // 제플린 API 쏘고 [comment, setComment ] = useState 
  // 이미지 지우고
  // 이미지 다시넣고 

}

export default function PredictCard(props) {
  const ref = useRef(null);
  const objects = useObjects(ref, { modelUrl: "/models/"+ props.model + "/model.json"});
  console.log(objects);
  return (
    <Container>
    <img ref={ref} onLoad={asdf} src="/image2.jpg" />
    {objects && objects.map(({ left, top, width, height, label, score }) => (
      <BBox
        left={left}
        top={top}
        width={width}
        height={height}
        label={label}
        color={score > 0.6 ? "blue" : "red"}
        score={score}
      />
    ))}
  </Container>

  );
}

