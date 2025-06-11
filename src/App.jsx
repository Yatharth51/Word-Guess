import { useEffect, useState } from "react";
import "./App.css";
import LIST_WORDS from "./Words";

const GUESS_LEN = 5;

function Tile({ className = "", letter }) {
  letter = letter ? letter.toUpperCase() : "";
  return <span className={"tile " + className}>{letter}</span>;
}

function Word({ guess, isFinal, solution }) {
  const wordArray = [];
  for (let i = 0; i < GUESS_LEN; i++) {
    const char = guess?.[i];
    let className;
    if (isFinal && char) {
      if (char == solution[i]) {
        className = "correct";
      } else if (solution.includes(char)) {
        className = "close";
      } else {
        className = "wrong";
      }
    }
    wordArray.push(
      <Tile key={i} letter={guess?.[i] || ""} className={className}></Tile>
    );
  }
  return <div className="word">{wordArray}</div>;
}

function App() {
  const [guesses, setGuesses] = useState(Array(GUESS_LEN).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [solution, setSolution] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const allGuessesUsed = guesses.every((guess) => guess !== null);

  useEffect(() => {
    const sol = LIST_WORDS[Math.floor(Math.random() * LIST_WORDS.length)];
    console.log(sol);
    setSolution(sol);
  }, []);

  useEffect(() => {
    const handleType = (event) => {
      if (isGameOver) return;
      const key = event.key;
      const regex = /^[A-Za-z]+$/;
      if (key == "Enter") {
        if (currentGuess.length == GUESS_LEN) {
          const newGuesses = [...guesses];
          newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
          setGuesses(newGuesses);

          if (currentGuess == solution) {
            setIsGameOver(true);
            setCurrentGuess("");
            return;
          }
          setCurrentGuess("");
        }
      } else if (key == "Backspace") {
        if (currentGuess.length > 0) {
          setCurrentGuess((old) => old.slice(0, -1));
        }
        return;
      } else if (regex.test(key)) {
        if (currentGuess.length < 5) {
          setCurrentGuess((oldGuess) => oldGuess + key);
        }
        return;
      }
    };
    window.addEventListener("keydown", handleType);
    return () => window.removeEventListener("keydown", handleType);
  }, [guesses, currentGuess, solution, isGameOver]);

  function handleReset() {
    setGuesses(Array(GUESS_LEN).fill(null));
    setCurrentGuess("");
    setIsGameOver(false);
    setShowSolution(false);
    const newSolution =
      LIST_WORDS[Math.floor(Math.random() * LIST_WORDS.length)];
    setSolution(newSolution);
  }

  return (
    <div>
      {guesses.map((guess, index) => {
        const isCurrentGuess =
          index === guesses.findIndex((val) => val == null);
        return (
          <Word
            key={index}
            guess={isCurrentGuess ? currentGuess : guess}
            isFinal={!isCurrentGuess && guess != null}
            solution={solution}
          ></Word>
        );
      })}
      {(allGuessesUsed||isGameOver) && (
        <div className="solution-container">
          <div className="button-group">
            <button
              className="solution-button"
              onClick={() => setShowSolution(true)}
            >
              Show Solution
            </button>
            <button className="reset-button" onClick={handleReset}>
              Play Again
            </button>
          </div>
          {showSolution && !isGameOver && (
            <p className="solution-text">
              The word was: <strong>{solution?.toUpperCase()}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
