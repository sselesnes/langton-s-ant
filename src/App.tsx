import { useRef, useState, useEffect } from "react";
import Copyright from "./Copyright";

const gridSize = [40, 60]; // rows [y], columns[x]

const antDir = [
  { dx: 0, dy: -1 }, // 0: up
  { dx: 1, dy: 0 }, // 1: right
  { dx: 0, dy: 1 }, // 2: down
  { dx: -1, dy: 0 }, // 3: left
];

export function Cell({
  cellValue,
  antIsHere,
  antDirection,
}: {
  cellValue: number;
  antIsHere: boolean;
  antDirection: number;
}) {
  const cellState = `w-[clamp(1px,8vw,1rem)] aspect-square relative ${
    cellValue === 1 ? "bg-blue-500" : "bg-gray-300"
  }`;

  return (
    <div className={cellState}>
      {antIsHere && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center"
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

export default function App() {
  const [ant, setAnt] = useState({
    x: Math.round(gridSize[1] / 2),
    y: Math.round(gridSize[0] / 2),
    dir: 0,
    count: 0,
    limit: 100,
    speed: 150,
    isMoving: false,
  });

  const [showCopyright, setShowCopyright] = useState(false);
  const intersectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 'entry.isIntersecting' is true if the element is in the viewport
        setShowCopyright(entry.isIntersecting);
      },
      { threshold: 0 } // The observer will fire as soon as the element crosses the viewport border
    );

    // If the ref exists, start observing the element
    if (intersectionRef.current) {
      observer.observe(intersectionRef.current);
    }

    // Clean up the observer when the component unmounts
    return () => {
      if (intersectionRef.current) {
        observer.unobserve(intersectionRef.current);
      }
    };
  }, []);

  const [gridData, setGridData] = useState(() =>
    // створюємо rows [y] та заповнюємо кожен з cells (columns) [x]
    Array.from({ length: gridSize[0] }, () => Array.from({ length: gridSize[1] }, () => 0))
  );
  // Додано стан для керування запуском/зупинкою симуляції
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Зупиняємо симуляцію, якщо isRunning false
    if (!isRunning) {
      return;
    }

    const step = () => {
      setAnt(antProps => {
        if (antProps.isMoving) {
          return antProps; // Якщо вже в русі, нічого не робимо
        }
        antProps.isMoving = true;
        const newAntProps = { ...antProps, isMoving: true };
        const { x, y, dir, count, limit } = newAntProps;

        const isOutOfGrid = y < 0 || y >= gridSize[0] || x < 0 || x >= gridSize[1];
        if (isOutOfGrid) {
          setIsRunning(false); // Зупиняємо симуляцію, якщо мураха вийшла за межі
          return antProps;
        }
        if (limit && count >= limit) {
          setIsRunning(false); // Зупиняємо, якщо досягнуто ліміту
          return antProps;
        }

        // копія (глибока) для стану (React immutability)
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
        antProps.isMoving = false;
        return {
          x: newX,
          y: newY,
          dir: newDir,
          count: newCount,
          limit: limit,
          speed: antProps.speed,
          isMoving: false,
        };
      });
    };

    const intervalId = setInterval(step, ant.speed);
    return () => clearInterval(intervalId);
  }, [isRunning, ant.speed, gridData, ant.limit, ant.count]);

  const handleStartStop = () => {
    if (!isRunning) {
      // Обмежуємо швидкість
      // if (ant.speed < 25) ant.speed = 25;
      // Очищаємо сітку, коли симуляція починається
      setGridData(
        Array.from({ length: gridSize[0] }, () => Array.from({ length: gridSize[1] }, () => 0))
      );
      // Скидаємо стан мурахи
      setAnt({
        x: Math.round(gridSize[1] / 2),
        y: Math.round(gridSize[0] / 2),
        dir: 0,
        count: 0,
        limit: ant.limit,
        speed: ant.speed,
        isMoving: false,
      });
    }
    setIsRunning(!isRunning);
  };

  return (
    <div className="flex flex-col  justify-center text-white font-inter ">
      <div className="flex flex-col justify-center gap-px mx-auto max-w-[95vw]">
        <div className="flex flex-col justify-around">
          <h1 className="text-3xl font-bold mb-6 text-center">Мураха Ленгтона</h1>
          <div className="flex flex-row justify-evenly bg-blue mb-2 md:h-8">
            <div className="flex gap-1 md:gap-4 items-center ">
              <label className=" text-sm self-center md:text-lg">Ліміт кроків:</label>
              <input
                type="number"
                className="w-16 border border-none bg-inherit rounded-sm text-left text-gray-300 disabled:opacity-50"
                value={ant.limit}
                onChange={e =>
                  setAnt(antProps => ({ ...antProps, limit: Number(e.target.value) }))
                }
                disabled={isRunning}
              />
            </div>
            <div className="flex gap-1 md:gap-4 items-center">
              <label className=" text-sm self-center md:text-lg">Затримка:</label>
              <input
                type="number"
                className="pl-2 w-16 border border-none bg-inherit rounded-sm text-left text-gray-300 disabled:opacity-50"
                value={ant.speed}
                onChange={e =>
                  setAnt(antProps => ({ ...antProps, speed: Number(e.target.value) }))
                }
                disabled={isRunning}
              />
            </div>
            <button
              onClick={handleStartStop}
              className="px-3 py-1 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isRunning ? "Стоп" : "Пуск"}
            </button>
          </div>
        </div>
        <div className="pt-2 pb-1 flex flex-col gap-px">
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

        <div className="flex justify-center w-full xs:gap-1 sm:gap-3 md:gap-8 mt-4 text-xs md:text-lg">
          <p>
            Сітка: {gridSize[1]} х {gridSize[0]}
          </p>
          <p>
            Позиція: {ant.x} x {ant.y}
          </p>
          <p>Напрямок: {ant.dir}</p>
          <p>Крок: {ant.count}</p>
        </div>
        <div ref={intersectionRef}>
          <Copyright isVisible={showCopyright} />
        </div>
      </div>
    </div>
  );
}
