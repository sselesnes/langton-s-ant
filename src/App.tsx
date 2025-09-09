// import { useState } from "react";

import "./App.css";

// array center coords
// direction clockwise 0 up, 1 right, 2 down, 3 left
const directions = [
  { dx: 0, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
];

interface AntProps {
  x: number;
  y: number;
  dir: number;
}

const gridSize = [10, 10]; //columns y, row x
const gridData = Array.from({ length: gridSize[0] }, () =>
  Array.from({ length: gridSize[1] }, () => 0)
);

const antProps = {
  x: Math.round(gridSize[0] / 2),
  y: Math.round(gridSize[1] / 2),
  dir: 0,
};

function ant({ x, y, dir }: AntProps) {
  // На білому квадраті — повернути на 90' праворуч, змінити колір квадрата на чорний, зробити крок уперед наступну клітину.
  // На чорному квадраті - повернути на 90' ліворуч, змінити колір квадрата на білий, зробити крок уперед на наступну клітину.
  if (gridData[x][y] === 0) {
    console.log("0");
    gridData[x][y] = 1;
    dir = (dir + 1) % 4;
  } else if (gridData[x][y] === 1) {
    console.log("1");
    gridData[x][y] = 0;
    dir = (dir - 1 + 4) % 4;
  }
  console.log(x, y, dir);
}

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
ant(antProps);
