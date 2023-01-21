import React from "react";

function Game() {
  const numbers = Array.from({ length: 100 }).map((_, i) => i + 1);
  const [latest, setLatest] = React.useState(0);

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
