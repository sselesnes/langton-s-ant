// import { useState } from "react";
import "./App.css";

const gridData = [
  [1, 0, 0, 1, 0],
  [0, 1, 1, 0, 1],
  [1, 0, 1, 0, 1],
  [0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1],
];

interface CellProps {
  value: number;
}

function Cell({ value }: CellProps) {
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
