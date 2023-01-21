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
  const [latest, setLatest] = React.useState(0);
  const [numbers] = React.useState(generateNumbers());

  function handleClick(n: number) {
    if (n === latest + 1) {
      setLatest(n);

      if (n === 100) {
        onFinish({ win: true, score: 100, time: 0 });
      }
    } else {
      onFinish({ win: false, time: 0, score: latest });
    }
  }

  return (
    <ul className="grid">
      {numbers.map((n) => (
        <li>
          <button onClick={() => handleClick(n)} disabled={n <= latest}>
            {n}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function App() {
  const [started, setStarted] = React.useState(false);

  return (
    <>
      <aside>Timer: 4:00</aside>
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
