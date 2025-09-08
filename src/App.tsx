// import { useState } from "react";
import "./App.css";

const gridSize = [40, 30]; //columns y, row x
const gridData = Array.from({ length: gridSize[0] }, () =>
  Array.from({ length: gridSize[1] }, () => 0)
);

gridData[1][2] = 1; //x,y

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
