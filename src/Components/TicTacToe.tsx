import { useRef, useState, type MouseEvent, useEffect } from "react";

// Get game configuration from environment variables
const GAME_CONFIG = {
  playerXName: import.meta.env.VITE_PLAYER_X_NAME || "Player X",
  playerOName: import.meta.env.VITE_PLAYER_O_NAME || "Player O",
  enableSounds: import.meta.env.VITE_ENABLE_SOUNDS === "true",
  enableAnimations: import.meta.env.VITE_ENABLE_ANIMATIONS === "true",
  maxMoves: parseInt(import.meta.env.VITE_MAX_MOVES || "9"),
  autoResetDelay: parseInt(import.meta.env.VITE_AUTO_RESET_DELAY || "3000"),
};

const TicTacToe = () => {
  const [board, setBoard] = useState<string[]>(["", "", "", "", "", "", "", "", ""]);
  const [count, setCount] = useState(0);
  const [lock, setLock] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [gameHistory, setGameHistory] = useState<string[][]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Initialize refs for each box
  const boxRefs = Array.from({ length: 9 }, () => useRef<HTMLDivElement>(null));

  // Sound effects (if enabled)
  const playSound = (soundType: "click" | "win" | "draw" | "reset") => {
    if (!GAME_CONFIG.enableSounds) return;

    // In a real app, you would load actual sound files
    console.log(`Playing sound: ${soundType}`);

    // Example: Use Web Audio API or HTML5 Audio
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      switch (soundType) {
        case "click":
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
          break;
        case "win":
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
          break;
        case "draw":
          oscillator.frequency.setValueAtTime(392.0, audioContext.currentTime); // G4
          break;
        case "reset":
          oscillator.frequency.setValueAtTime(293.66, audioContext.currentTime); // D4
          break;
      }

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log("Audio not supported or disabled");
    }
  };

  const toggle = (e: MouseEvent<HTMLDivElement>, num: number) => {
    if (lock || board[num] !== "") return;

    const target = e.currentTarget as HTMLDivElement;

    // Play click sound
    playSound("click");

    // Update board state
    const newBoard = [...board];
    newBoard[num] = currentPlayer;

    setBoard(newBoard);
    setCount(count + 1);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");

    // Save to history
    setGameHistory((prev) => [...prev, [...newBoard]]);

    // Update UI
    target.textContent = currentPlayer;
    target.classList.add(currentPlayer.toLowerCase());

    checkWin(newBoard);
  };

  const checkWin = (currentBoard: string[]) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        // Play win sound
        playSound("win");

        // Highlight winning boxes
        combination.forEach((index) => {
          boxRefs[index].current?.classList.add("winning-box");
        });

        won(currentBoard[a]);
        return;
      }
    }

    // Check for draw
    if (count === GAME_CONFIG.maxMoves - 1 && !lock) {
      playSound("draw");
      if (titleRef.current) {
        titleRef.current.innerHTML = "Game Draw! <span style='color: #ff6b6b'>🤝</span>";
      }
      setLock(true);

      // Auto-reset if configured
      if (GAME_CONFIG.autoResetDelay > 0) {
        setTimeout(() => {
          reset();
        }, GAME_CONFIG.autoResetDelay);
      }
    }
  };

  const won = (winner: string) => {
    setLock(true);
    if (titleRef.current) {
      const winnerName = winner === "X" ? GAME_CONFIG.playerXName : GAME_CONFIG.playerOName;
      titleRef.current.innerHTML = `🎉 ${winnerName} Wins! <span style="color: #26ffcb">(${winner})</span>`;
    }

    // Auto-reset if configured
    if (GAME_CONFIG.autoResetDelay > 0) {
      setTimeout(() => {
        reset();
      }, GAME_CONFIG.autoResetDelay);
    }
  };

  const reset = () => {
    playSound("reset");

    setLock(false);
    setCount(0);
    setBoard(["", "", "", "", "", "", "", "", ""]);
    setCurrentPlayer("X");

    if (titleRef.current) {
      titleRef.current.innerHTML =
        'Tic Tac Toe <span style="color: #26ffcb">(React + TypeScript)</span>';
    }

    boxRefs.forEach((ref, index) => {
      if (ref.current) {
        ref.current.textContent = "";
        ref.current.classList.remove("x", "o", "winning-box");
      }
    });
  };

  const undo = () => {
    if (gameHistory.length <= 1 || lock) return;

    const previousState = gameHistory[gameHistory.length - 2];
    setBoard(previousState);
    setGameHistory((prev) => prev.slice(0, -1));
    setCount(count - 1);
    setCurrentPlayer(count % 2 === 0 ? "X" : "O");
    setLock(false);

    // Update UI
    previousState.forEach((value, index) => {
      const box = boxRefs[index].current;
      if (box) {
        box.textContent = value;
        box.classList.remove("x", "o", "winning-box");
        if (value) {
          box.classList.add(value.toLowerCase());
        }
      }
    });

    // Reset title
    if (titleRef.current) {
      titleRef.current.innerHTML =
        'Tic Tac Toe <span style="color: #26ffcb">(React + TypeScript)</span>';
    }
  };

  // Initialize game
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.innerHTML = `Tic Tac Toe <span style="color: #26ffcb">(${GAME_CONFIG.playerXName} vs ${GAME_CONFIG.playerOName})</span>`;
    }
  }, []);

  // Render boxes dynamically
  const renderBoxes = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => {
      const index = start + i;
      return (
        <div
          key={index}
          className={`boxes ${board[index].toLowerCase()} ${GAME_CONFIG.enableAnimations ? "animated" : ""}`}
          onClick={(e) => toggle(e, index)}
          ref={boxRefs[index]}
          data-testid={`box-${index}`}
        />
      );
    });
  };

  return (
    <div className="container">
      <h1
        className="title"
        ref={titleRef}
        dangerouslySetInnerHTML={{
          __html: 'Tic Tac Toe <span style="color: #26ffcb">(React + TypeScript)</span>',
        }}
      />

      <div className="player-info">
        <div className={`player-x ${currentPlayer === "X" ? "active" : ""}`}>
          {GAME_CONFIG.playerXName} (X)
        </div>
        <div className="vs">VS</div>
        <div className={`player-o ${currentPlayer === "O" ? "active" : ""}`}>
          {GAME_CONFIG.playerOName} (O)
        </div>
      </div>

      <div className="game-stats">
        <div>Moves: {count}</div>
        <div>Turn: {currentPlayer}</div>
        <div>Games: {gameHistory.length > 0 ? Math.ceil(gameHistory.length / 2) : 0}</div>
      </div>

      <div className="board">
        <div className="row1">{renderBoxes(0, 2)}</div>
        <div className="row2">{renderBoxes(3, 5)}</div>
        <div className="row3">{renderBoxes(6, 8)}</div>
      </div>

      <div className="controls">
        <button className="btn reset" onClick={reset}>
          🔄 Reset Game
        </button>
        <button className="btn undo" onClick={undo} disabled={gameHistory.length <= 1 || lock}>
          ↩️ Undo Move
        </button>
        <button
          className="btn history"
          onClick={() => console.log("Game History:", gameHistory)}
          disabled={gameHistory.length === 0}
        >
          📜 View History ({gameHistory.length})
        </button>
      </div>

      <div className="config-info">
        {GAME_CONFIG.enableSounds && <span>🔊 Sounds ON</span>}
        {GAME_CONFIG.enableAnimations && <span>🎬 Animations ON</span>}
        {import.meta.env.DEV && <span>🛠️ Development Mode</span>}
      </div>
    </div>
  );
};

export default TicTacToe;
