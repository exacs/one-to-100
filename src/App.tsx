import React from "react";

const GOAL = 100;
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
      <div className="time">{formatTime(time)}</div>
      <div className="next">Next: {score + 1}</div>
      <ul className="grid">
        {numbers.map((n) => (
          <li>
            <button
              className="content"
              onClick={() => handleClick(n)}
              disabled={n <= score}
            >
              {n}
            </button>
            {n === score + 1 && (
              <button
                className="next-button"
                onClick={() => handleClick(score + 1)}
              ></button>
            )}
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
      {started === "idle" && (
        <>
          <h1>1 to 100</h1>
          <main className="instructions">
            <p>
              Click the numbers from 1 to 100 in ascending order. You have 4
              minutes.
            </p>
            <p>If you click a wrong number, game is over</p>
            <button className="start" onClick={() => setStarted("playing")}>
              Start game
            </button>
          </main>
        </>
      )}
      {started === "playing" && (
        <Game
          onFinish={(outcome) => {
            setStarted("finished");
            setOutcome(outcome);
          }}
        />
      )}
      {started === "finished" && outcome && (
        <main className="results">
          {outcome.win && <h1>You win</h1>}
          {!outcome.win && (
            <>
              <h1>You lose</h1>
              <p>
                {outcome.time > 0
                  ? "You clicked the wrong number"
                  : "Time is up"}
              </p>
            </>
          )}

          <section className="scores">
            <div className="score">
              <h2>Score</h2>
              <div>{outcome.score}</div>
            </div>
            <div className="score">
              <h2>Time</h2>
              <div>{formatTime(outcome.time)}</div>
            </div>
          </section>
          <button className="start" onClick={() => setStarted("idle")}>
            Retry
          </button>
        </main>
      )}
    </>
  );
}
