import { useState } from "react";

function Square({ value, onSquareClick, className }) {
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  let status;
  const calculatedWinner = calculateWinner(squares);
  const winner = calculatedWinner[1];
  const winner_array = calculatedWinner[0];
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "0");
  }
  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "0";
    }
    onPlay(nextSquares);
  }
  const rows = [];

  for (let i = 0; i < 3; i++) {
    let sect = [];
    for (let j = 0; j < 3; j++) {
      let k = "sq" + (3 * i + j + 1);
      let cs = "square";
      if (winner && winner_array.includes(3 * i + j)) {
        cs = "winner-square";
      }
      sect.push(
        <Square
          key={k}
          className={cs}
          value={squares[3 * i + j]}
          onSquareClick={() => handleClick(3 * i + j)}
        />
      );
    }
    rows.push(
      <div key={i} className="board-row">
        {sect}
      </div>
    );
  }
  return (
    <>
      <div className="winner">{status}</div>
      {rows}
    </>
  );
}
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const [isAsc, setIsAsc] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  function toggleOrder() {
    setIsAsc(!isAsc);
  }
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return move !== currentMove ? (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    ) : (
      <li key={move}>
        <p className="code">{description}</p>
      </li>
    );
  });
  const sorted_moves = isAsc ? moves : moves.reverse();
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <input
          type="checkbox"
          value={isAsc}
          onClick={() => {
            toggleOrder();
          }}
        />
        <ul>{sorted_moves}</ul>
      </div>
    </div>
  );
}
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [1, 4, 7],
    [0, 3, 6],
    [2, 5, 8]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      console.log(lines[i]);
      return [lines[i], squares[a]];
    }
  }
  return [null, null];
}
