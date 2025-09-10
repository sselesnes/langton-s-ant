import { useState, useEffect } from "react";

const gridSize = [40, 40]; // rows [y], columns[x]

const antDir = [
  { dx: 0, dy: -1 }, // 0: up
  { dx: 1, dy: 0 }, // 1: right
  { dx: 0, dy: 1 }, // 2: down
  { dx: -1, dy: 0 }, // 3: left
];

export default function App() {
  const [ant, setAnt] = useState({
    x: Math.round(gridSize[1] / 2),
    y: Math.round(gridSize[0] / 2),
    dir: 0,
    count: 0,
  });

  const [gridData, setGridData] = useState(() =>
    // створюємо rows [y] та заповнюємо кожен з cells [x]
    Array.from({ length: gridSize[0] }, () => Array.from({ length: gridSize[1] }, () => 0))
  );

  useEffect(() => {
    const step = () => {
      setAnt(prevAnt => {
        const { x, y, dir, count } = prevAnt;

        const isOutOfGrid = y < 0 || y >= gridSize[0] || x < 0 || x >= gridSize[1];
        if (isOutOfGrid) {
          return prevAnt;
        }

        // глибока копія для стану (React immutability)
        const newGridData = gridData.map(row => [...row]);

        let newDir;

        // білий -> 90' за годинниковою стрілкою
        if (newGridData[y][x] === 0) {
          newDir = (dir + 1) % 4;
          newGridData[y][x] = 1;
        } else {
          // чорний -> 90' проти годинникової стрілки
          newDir = (dir - 1 + 4) % 4;
          newGridData[y][x] = 0;
        }
        // змінюємо координати
        // беремо з antDir по модулю 4
        const { dx, dy } = antDir[newDir];
        const newX = x + dx;
        const newY = y + dy;
        // оновлюємо стан
        const newCount = count + 1;
        setGridData(newGridData);
        return { x: newX, y: newY, dir: newDir, count: newCount };
      });
    };

    const intervalId = setInterval(step, 150);

    return () => clearInterval(intervalId);
  }, [gridData, ant]);

  return (
    <>
      <div className="flex flex-col justify-center gap-px max-w-[95vw] mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Мураха Ленгтона</h1>
        {gridData.map((rowArray, rowIndex) => (
          <div key={rowIndex} className="flex gap-px">
            {rowArray.map((cellValue, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                cellValue={cellValue}
                antIsHere={ant.x === colIndex && ant.y === rowIndex}
                antDirection={ant.dir}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-center w-full gap-2 mt-6 text-sm">
        <p>
          Позиція: ({ant.x}, {ant.y})
        </p>
        <p>Напрямок: {ant.dir}</p>
        <p>Крок: {ant.count}</p>
      </div>
    </>
  );
}

function Cell({
  cellValue,
  antIsHere,
  antDirection,
}: {
  cellValue: number;
  antIsHere: boolean;
  antDirection: number;
}) {
  const cellState = `w-[clamp(1px,8vw,1rem)] aspect-square transition-colors duration-100 ease-in-out relative overflow-hidden ${
    cellValue === 1 ? "bg-blue-500" : "bg-gray-300"
  }`;

  return (
    <div className={cellState}>
      {antIsHere && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center z-10 transition-transform duration-100 ease-in-out"
          style={{ transform: `rotate(${antDirection * 90}deg)` }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L2 22H22L12 2Z" fill="#FFFFFF" />
          </svg>
        </div>
      )}
    </div>
  );
}
