import React from "react";

function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((value) => ({
      value,
      order: Math.random(),
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ value }) => value);
}

function generateNumbers() {
  return shuffle(Array.from({ length: 100 }).map((_, i) => i + 1));
}

function formatTime(seconds: number) {
  const s = (seconds % 60).toString(10).padStart(2, "0");
  const m = Math.floor(seconds / 60);

  return `${m}:${s}`;
}

interface GameOutcome {
  /** True if won */
  win: boolean;

  /**
   * Number of remaining seconds
   * - If win===false, is the time when wrong number has clicked
   * - If win===true, is when clicked the last number
   */
  time: number;

  /** Final score */
  score: number;
}

interface GameParams {
  onFinish(GameOutcome);
}

function useTime(initialTime: number) {
  const [time, setTime] = React.useState(initialTime);

  React.useEffect(() => {
    const t = setInterval(() => {
      setTime((time) => time - 1);
    }, 1000);

    return () => {
      clearInterval(t);
    };
  }, []);

  return time;
}

function Game({ onFinish }: GameParams) {
  const [score, setScore] = React.useState(0);
  const [numbers] = React.useState(generateNumbers());
  const time = useTime(240);

  React.useEffect(() => {
    if (time <= 0) {
      onFinish({ win: false, score, time: 0 });
    }
  }, [time]);

  function handleClick(n: number) {
    if (n === score + 1) {
      setScore(n);

      if (n === 100) {
        onFinish({ win: true, score: 100, time });
      }
    } else {
      onFinish({ win: false, time, score });
    }
  }

  return (
    <div className="game">
      <div className="game-score">
        <div className="score">Score: {score}</div>
        <div className="time">{formatTime(time)}</div>
      </div>
      <ul className="grid">
        {numbers.map((n) => (
          <li>
            <button onClick={() => handleClick(n)} disabled={n <= score}>
              {n}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function App() {
  const [started, setStarted] = React.useState(true);

  return (
    <>
      <main>
        {!started && (
          <button onClick={() => setStarted(true)}>Start game</button>
        )}
        {started && (
          <Game
            onFinish={(outcome) => {
              console.log(outcome);
              setStarted(false);
            }}
          />
        )}
      </main>
    </>
  );
}
