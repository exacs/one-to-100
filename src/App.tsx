import React from "react";

const GOAL = 98;
const TIME = 240;

function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((value) => ({
      value,
      order: Math.random(),
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ value }) => value);
}

function generateNumbers(length: number) {
  return shuffle(Array.from({ length }).map((_, i) => i + 1));
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
  const [numbers] = React.useState(generateNumbers(GOAL));
  const time = useTime(TIME);

  React.useEffect(() => {
    if (time <= 0) {
      onFinish({ win: false, score, time: 0 });
    }
  }, [time]);

  function handleClick(n: number) {
    if (n === score + 1) {
      setScore(n);

      if (n === GOAL) {
        onFinish({ win: true, score: GOAL, time });
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

type GameState = "idle" | "playing" | "finished";
export function App() {
  const [started, setStarted] = React.useState<GameState>("idle");
  const [outcome, setOutcome] = React.useState<GameOutcome | null>(null);

  return (
    <>
      {started === "idle" && <div className="x">X</div>}
      {started === "playing" && (
        <Game
          onFinish={(outcome) => {
            setStarted("finished");
            setOutcome(outcome);
          }}
        />
      )}
      {started === "finished" && outcome && (
        <div>
          <div>{outcome.win ? "You won" : "You lose"}</div>
          <div>Time: {outcome.time}</div>
          <div>Score: {outcome.score}</div>
        </div>
      )}
    </>
  );
}
