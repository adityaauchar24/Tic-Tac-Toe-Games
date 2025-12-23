import { useRef, useState, type MouseEvent } from "react";

let data = ["", "", "", "", "", "", "", "", ""];

const TicTacToe = () => {
  const [count, setCount] = useState(0);
  const [lock, setLock] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const box1 = useRef<HTMLDivElement>(null);
  const box2 = useRef<HTMLDivElement>(null);
  const box3 = useRef<HTMLDivElement>(null);
  const box4 = useRef<HTMLDivElement>(null);
  const box5 = useRef<HTMLDivElement>(null);
  const box6 = useRef<HTMLDivElement>(null);
  const box7 = useRef<HTMLDivElement>(null);
  const box8 = useRef<HTMLDivElement>(null);
  const box9 = useRef<HTMLDivElement>(null);

  const boxArray = [box1, box2, box3, box4, box5, box6, box7, box8, box9];

  const toggle = (e: MouseEvent<HTMLDivElement>, num: number) => {
    if (lock || data[num] !== "") return;
    
    const target = e.currentTarget as HTMLDivElement;
    
    if (count % 2 === 0) {
      target.textContent = "X";
      data[num] = "x";
      setCount(count + 1);
    } else {
      target.textContent = "O";
      data[num] = "o";
      setCount(count + 1);
    }
    checkWin();
  };

  const checkWin = () => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (data[a] && data[a] === data[b] && data[a] === data[c]) {
        won(data[a]);
        return;
      }
    }

    // Check for draw
    if (count === 8 && !lock) {
      if (titleRef.current) {
        titleRef.current.innerHTML = "Game Draw!";
      }
      setLock(true);
    }
  };

  const won = (winner: string) => {
    setLock(true);
    if (titleRef.current) {
      titleRef.current.innerHTML = `Congratulations: <span style="color: #26ffcb">${winner.toUpperCase()}</span> Wins!`;
    }
  };

  const reset = () => {
    setLock(false);
    setCount(0);
    data = ["", "", "", "", "", "", "", "", ""];
    
    if (titleRef.current) {
      titleRef.current.innerHTML = 'Tic Tac Toe Game <span style="color: #26ffcb">Using React js</span>';
    }
    
    boxArray.forEach((elem) => {
      if (elem.current) {
        elem.current.textContent = "";
      }
    });
  };

  return (
    <div className="container">
      <h1 
        className="title" 
        ref={titleRef}
        dangerouslySetInnerHTML={{
          __html: 'Tic Tac Toe Game <span style="color: #26ffcb">Using React js</span>'
        }}
      />
      <div className="board">
        <div className="row1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="boxes"
              onClick={(e) => toggle(e, index)}
              ref={boxArray[index]}
            />
          ))}
        </div>
        <div className="row2">
          {[3, 4, 5].map((index) => (
            <div
              key={index}
              className="boxes"
              onClick={(e) => toggle(e, index)}
              ref={boxArray[index]}
            />
          ))}
        </div>
        <div className="row3">
          {[6, 7, 8].map((index) => (
            <div
              key={index}
              className="boxes"
              onClick={(e) => toggle(e, index)}
              ref={boxArray[index]}
            />
          ))}
        </div>
      </div>
      <button className="reset" onClick={reset}>
        Reset
      </button>
    </div>
  );
};

export default TicTacToe;