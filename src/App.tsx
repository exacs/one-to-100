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

// Outcome of the game:
// Win(remaining_time)
// Lose(score, time)
function Game({ onFinish }: GameParams) {
  const [score, setScore] = React.useState(0);
  const [numbers] = React.useState(generateNumbers());

  function handleClick(n: number) {
    if (n === score + 1) {
      setScore(n);

      if (n === 100) {
        onFinish({ win: true, score: 100, time: 0 });
      }
    } else {
      onFinish({ win: false, time: 0, score });
    }
  }

  return (
    <div className="game">
      <div className="game-score">
        <div className="score">Score: {score}</div>
        <div className="time">4:00</div>
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
            }}
          />
        )}
      </main>
    </>
  );
}
