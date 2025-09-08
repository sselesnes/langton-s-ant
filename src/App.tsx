// import { useState } from "react";
// import { Children } from "react";
import "./App.css";

interface AntProps {
  x: number;
  y: number;
}

const gridSize = [40, 30]; //columns y, row x
const gridData = Array.from({ length: gridSize[0] }, () =>
  Array.from({ length: gridSize[1] }, () => 0)
);

// array center coords
const antProps = {
  x: Math.round(gridSize[0] / 2),
  y: Math.round(gridSize[1] / 2),
};

function ant(props: AntProps) {
  // На білому квадраті — повернути на 90° праворуч, змінити колір квадрата на чорний, зробити крок уперед наступну клітину.
  if (gridData[props.x][props.y] === 0) {
    console.log("0");
  }

  // На чорному квадраті - повернути на 90 ° вліво, змінити колір квадрата на білий, зробити крок уперед на наступну клітину.
  if (gridData[props.x][props.y] === 1) {
    console.log("1");
  }
}
// direction 0 up, 1 right, 2 down, 3 left

function Cell({ value }: { value: number }) {
  const cellState = value ? "cell color-set" : "cell color-unset";
  return <div className={cellState}> </div>;
}

export default function App() {
  return (
    <div className="grid-container">
      {gridData.map((rowArray, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {rowArray.map((cellValue, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} value={cellValue} />
          ))}
        </div>
      ))}
    </div>
  );
}

ant(antProps);
