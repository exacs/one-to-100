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

function Game() {
  const [latest, setLatest] = React.useState(0);
  const [numbers] = React.useState(generateNumbers());

  function handleClick(n: number) {
    if (n === latest + 1) {
      // Correct
      setLatest(n);
    } else {
      // No correct
      setLatest(100);
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
  const [numbers, setNumbers] = React.useState(generateNumbers());

  return (
    <>
      <aside>Timer: 4:00</aside>
      <main>
        {!started && (
          <button onClick={() => setStarted(true)}>Start game</button>
        )}
        {started && <Game />}
      </main>
    </>
  );
}
