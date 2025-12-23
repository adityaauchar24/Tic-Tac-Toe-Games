import React, { useRef, useState, type MouseEvent, CSSProperties, useEffect } from "react";

type Player = "x" | "o" | "";
type GameBoard = Player[];

const TicTacToe = () => {
  // Core Game State
  const [board, setBoard] = useState<GameBoard>(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState<"x" | "o">("x");
  const [gameStatus, setGameStatus] = useState<"playing" | "x-wins" | "o-wins" | "draw">("playing");
  const [moveCount, setMoveCount] = useState<number>(0);
  const [gameHistory, setGameHistory] = useState<GameBoard[]>([]);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  
  // Game Features
  const [theme, setTheme] = useState<"dark" | "light" | "neon">("neon");
  
  // Time tracking
  const [gameStartTime] = useState<number>(Date.now());
  const [gameDuration, setGameDuration] = useState<number>(0);
  
  // Refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);
  const box3Ref = useRef<HTMLDivElement>(null);
  const box4Ref = useRef<HTMLDivElement>(null);
  const box5Ref = useRef<HTMLDivElement>(null);
  const box6Ref = useRef<HTMLDivElement>(null);
  const box7Ref = useRef<HTMLDivElement>(null);
  const box8Ref = useRef<HTMLDivElement>(null);
  const box9Ref = useRef<HTMLDivElement>(null);
  
  // Array of refs for easier access
  const boxesRefs = [box1Ref, box2Ref, box3Ref, box4Ref, box5Ref, box6Ref, box7Ref, box8Ref, box9Ref];
  
  // Themes with proper CSS values
  const themes = {
    dark: {
      bgPrimary: "#0f172a",
      bgSecondary: "#1e293b",
      textPrimary: "#f8fafc",
      textSecondary: "#cbd5e1",
      accentX: "#3b82f6", // Blue
      accentO: "#ef4444", // Red
      accentWin: "#10b981", // Green
      accentHover: "#475569",
      shadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
      gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      cellBg: "rgba(255, 255, 255, 0.05)",
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    light: {
      bgPrimary: "#ffffff",
      bgSecondary: "#f8fafc",
      textPrimary: "#0f172a",
      textSecondary: "#475569",
      accentX: "#2563eb", // Blue
      accentO: "#dc2626", // Red
      accentWin: "#059669", // Green
      accentHover: "#e2e8f0",
      shadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      gradient: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      cellBg: "rgba(0, 0, 0, 0.03)",
      borderColor: "rgba(0, 0, 0, 0.1)",
    },
    neon: {
      bgPrimary: "#0a0a0a",
      bgSecondary: "#1a1a2e",
      textPrimary: "#ffffff",
      textSecondary: "#b0b0ff",
      accentX: "#00f7ff", // Cyan
      accentO: "#ff00ff", // Magenta
      accentWin: "#00ff9d", // Green
      accentHover: "#2a2a4a",
      shadow: "0 20px 40px rgba(0, 247, 255, 0.3), 0 0 60px rgba(255, 0, 255, 0.2)",
      gradient: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
      cellBg: "rgba(255, 255, 255, 0.03)",
      borderColor: "rgba(255, 255, 255, 0.15)",
    }
  };
  
  const currentTheme = themes[theme];

  // Check winner - FIXED LOGIC
  const checkWinner = (boardState: GameBoard): Player => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const [a, b, c] of winningCombinations) {
      if (boardState[a] !== "" && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return boardState[a];
      }
    }
    return "";
  };

  // Make a move - FIXED LOGIC
  const makeMove = (index: number): void => {
    if (gameStatus !== "playing" || board[index] !== "") return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    
    // Add to history for undo
    setGameHistory(prev => [...prev, [...board]]);
    
    setBoard(newBoard);
    setMoveCount(prev => prev + 1);

    const winner = checkWinner(newBoard);
    if (winner) {
      handleWin(winner, newBoard);
      return; // Stop here if someone won
    }
    
    // Check for draw - FIXED: Only check if board is full AND no winner
    if (newBoard.every(cell => cell !== "")) {
      handleDraw();
    } else {
      setCurrentPlayer(currentPlayer === "x" ? "o" : "x");
    }
  };

  // Handle win - FIXED LOGIC
  const handleWin = (winner: Player, boardState: GameBoard) => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    let winLine: number[] = [];
    for (const [a, b, c] of winningCombinations) {
      if (boardState[a] !== "" && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        winLine = [a, b, c];
        break;
      }
    }

    setWinningLine(winLine);
    setGameStatus(winner === "x" ? "x-wins" : "o-wins");
    
    // Add confetti effect on win
    if (theme === 'neon') {
      setTimeout(() => createConfetti(), 300);
    }
  };

  // Handle draw
  const handleDraw = () => {
    setGameStatus("draw");
  };

  // Reset game
  const resetGame = () => {
    setGameStatus("playing");
    setBoard(Array(9).fill(""));
    setCurrentPlayer("x");
    setMoveCount(0);
    setWinningLine([]);
    setGameHistory([]);
    setHoveredCell(null);
  };

  // Undo last move
  const undoMove = () => {
    if (gameHistory.length === 0 || gameStatus !== "playing") return;
    
    const lastBoard = gameHistory[gameHistory.length - 1];
    setBoard(lastBoard);
    setGameHistory(prev => prev.slice(0, -1));
    setMoveCount(prev => prev - 1);
    setCurrentPlayer(prev => prev === "x" ? "o" : "x");
    setWinningLine([]);
  };

  // Change theme
  const changeTheme = (newTheme: "dark" | "light" | "neon") => {
    setTheme(newTheme);
  };

  // Create confetti effect
  const createConfetti = () => {
    if (typeof window === 'undefined') return;
    
    const confettiCount = 50;
    const colors = [currentTheme.accentX, currentTheme.accentO, currentTheme.accentWin];
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = '50%';
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.top = '-20px';
      confetti.style.zIndex = '9999';
      confetti.style.boxShadow = `0 0 20px ${currentTheme.accentWin}`;
      document.body.appendChild(confetti);
      
      // Animation
      confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: 2000 + Math.random() * 3000,
        easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
      }).onfinish = () => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      };
    }
  };

  // Update game duration
  useEffect(() => {
    if (gameStatus === "playing") {
      const interval = setInterval(() => {
        setGameDuration(Date.now() - gameStartTime);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStatus, gameStartTime]);

  // Format time
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get dynamic cell style
  const getCellStyle = (index: number): CSSProperties => {
    const isWinning = winningLine.includes(index);
    const isEmpty = board[index] === "";
    const isHovered = hoveredCell === index && isEmpty && gameStatus === "playing";
    const playerColor = board[index] === "x" ? currentTheme.accentX : currentTheme.accentO;
    
    // Responsive cell size
    const isMobile = window.innerWidth < 768;
    const isSmallMobile = window.innerWidth < 480;
    
    const cellSize = isSmallMobile ? "70px" : isMobile ? "90px" : "120px";
    const fontSize = isSmallMobile ? "2.5rem" : isMobile ? "3.5rem" : "4.5rem";
    const borderSize = isWinning ? "4px" : board[index] ? "3px" : "2px";
    
    return {
      width: cellSize,
      height: cellSize,
      background: isWinning ? 
        `linear-gradient(135deg, ${currentTheme.accentWin}20, ${currentTheme.accentWin}40)` : 
        isHovered ? `${currentTheme.accentHover}30` : 
        currentTheme.cellBg,
      border: isWinning ? 
        `${borderSize} solid ${currentTheme.accentWin}` : 
        board[index] ? `${borderSize} solid ${playerColor}` : 
        `${borderSize} solid ${currentTheme.accentHover}`,
      borderRadius: "16px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: fontSize,
      fontWeight: "900",
      cursor: gameStatus !== "playing" || !isEmpty ? "default" : "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      overflow: "hidden",
      color: playerColor,
      textShadow: board[index] ? `0 0 20px ${playerColor}` : "none",
      transform: isHovered ? "scale(1.05) translateY(-2px)" : 
                 board[index] ? "scale(1.02)" : "scale(1)",
      boxShadow: isWinning ? 
        `0 0 30px ${currentTheme.accentWin}, inset 0 0 20px ${currentTheme.accentWin}30` : 
        board[index] ? `0 8px 25px ${playerColor}30, inset 0 0 15px ${playerColor}20` : 
        isHovered ? `0 10px 30px ${currentTheme.accentHover}40` : 
        "0 4px 15px rgba(0, 0, 0, 0.2)",
    };
  };

  // Render cells
  const renderCell = (index: number) => {
    const ref = boxesRefs[index];
    
    return (
      <div
        key={index}
        style={getCellStyle(index)}
        onClick={() => makeMove(index)}
        onMouseEnter={() => setHoveredCell(index)}
        onMouseLeave={() => setHoveredCell(null)}
        ref={ref}
      >
        {board[index]?.toUpperCase()}
        {board[index] && (
          <div style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            fontSize: window.innerWidth < 480 ? "0.8rem" : "1rem",
            opacity: 0.7,
            color: board[index] === "x" ? currentTheme.accentX : currentTheme.accentO,
          }}>
            {board[index] === "x" ? "❌" : "⭕"}
          </div>
        )}
      </div>
    );
  };

  // Render winning line
  const renderWinningLine = () => {
    if (winningLine.length !== 3) return null;
    
    const [a, b, c] = winningLine;
    const isRow = [0, 3, 6].includes(a);
    const isCol = [0, 1, 2].includes(a);
    const isDiagonal = a === 0 && c === 8;
    const isAntiDiagonal = a === 2 && c === 6;
    
    // Responsive sizing
    const isMobile = window.innerWidth < 768;
    const isSmallMobile = window.innerWidth < 480;
    
    const cellSize = isSmallMobile ? 70 : isMobile ? 90 : 120;
    const gap = isSmallMobile ? 8 : isMobile ? 12 : 16;
    const padding = isSmallMobile ? 15 : isMobile ? 20 : 25;
    
    const totalWidth = (cellSize * 3) + (gap * 2) + (padding * 2);
    const lineThickness = isSmallMobile ? "6px" : "8px";
    
    let lineStyle: CSSProperties = {
      position: "absolute",
      background: currentTheme.accentWin,
      borderRadius: "4px",
      zIndex: 1,
      boxShadow: `0 0 30px ${currentTheme.accentWin}`,
      transition: "all 0.5s ease",
    };
    
    if (isRow) {
      const topPosition = padding + (Math.floor(a / 3) * (cellSize + gap)) + (cellSize / 2);
      lineStyle = {
        ...lineStyle,
        width: `${totalWidth - (padding * 2)}px`,
        height: lineThickness,
        top: `${topPosition}px`,
        left: `${padding}px`,
      };
    } else if (isCol) {
      const leftPosition = padding + ((a % 3) * (cellSize + gap)) + (cellSize / 2);
      lineStyle = {
        ...lineStyle,
        width: lineThickness,
        height: `${totalWidth - (padding * 2)}px`,
        left: `${leftPosition}px`,
        top: `${padding}px`,
      };
    } else if (isDiagonal) {
      const diagonalWidth = Math.sqrt(2) * (totalWidth - (padding * 2));
      lineStyle = {
        ...lineStyle,
        width: `${diagonalWidth}px`,
        height: lineThickness,
        top: `${totalWidth / 2}px`,
        left: `${padding}px`,
        transform: "rotate(45deg)",
        transformOrigin: "0 0",
      };
    } else if (isAntiDiagonal) {
      const diagonalWidth = Math.sqrt(2) * (totalWidth - (padding * 2));
      lineStyle = {
        ...lineStyle,
        width: `${diagonalWidth}px`,
        height: lineThickness,
        top: `${totalWidth / 2}px`,
        left: `${totalWidth - padding}px`,
        transform: "rotate(-45deg)",
        transformOrigin: "100% 0",
      };
    }
    
    return <div style={lineStyle} />;
  };

  

  // Get current player display
  const getCurrentPlayerDisplay = () => {
    if (gameStatus !== "playing") {
      return gameStatus === "draw" 
        ? "Game ended in a draw!" 
        : `${gameStatus === 'x-wins' ? 'X' : 'O'} Wins the Game!`;
    }
    return `Current Player: ${currentPlayer.toUpperCase()}`;
  };

  // Get responsive font size
  const getResponsiveFontSize = (baseSize: number): string => {
    if (window.innerWidth < 480) return `${baseSize * 0.7}rem`;
    if (window.innerWidth < 768) return `${baseSize * 0.85}rem`;
    return `${baseSize}rem`;
  };

  // Get responsive padding
  const getResponsivePadding = (): string => {
    if (window.innerWidth < 480) return "15px";
    if (window.innerWidth < 768) return "25px";
    return "35px";
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: currentTheme.gradient,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: window.innerWidth < 480 ? "10px" : "20px",
      margin: "0",
      transition: "all 0.5s ease",
    }}>
      <div style={{
        background: currentTheme.bgSecondary,
        borderRadius: window.innerWidth < 480 ? "20px" : window.innerWidth < 768 ? "24px" : "28px",
        padding: getResponsivePadding(),
        boxShadow: currentTheme.shadow,
        border: `2px solid ${currentTheme.borderColor}`,
        maxWidth: "800px",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}>
        
        {/* Header */}
        <div style={{
          display: "flex",
          flexDirection: window.innerWidth < 768 ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: window.innerWidth < 480 ? "20px" : "30px",
          gap: window.innerWidth < 480 ? "15px" : "20px",
        }}>
         
          
          {/* Theme Controls */}
          <div style={{
            display: "flex",
            gap: window.innerWidth < 480 ? "8px" : "12px",
            alignItems: "center",
          }}>
            <button
              style={{
                background: theme === "dark" ? currentTheme.accentX : currentTheme.accentHover,
                color: theme === "dark" ? "white" : currentTheme.textPrimary,
                border: "none",
                padding: window.innerWidth < 480 ? "8px 12px" : "10px 16px",
                borderRadius: "10px",
                fontSize: window.innerWidth < 480 ? "0.9rem" : "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1)`,
              }}
              onClick={() => changeTheme("dark")}
              title="Dark Theme"
            >
              🌙 Dark
            </button>
            <button
              style={{
                background: theme === "light" ? currentTheme.accentO : currentTheme.accentHover,
                color: theme === "light" ? "white" : currentTheme.textPrimary,
                border: "none",
                padding: window.innerWidth < 480 ? "8px 12px" : "10px 16px",
                borderRadius: "10px",
                fontSize: window.innerWidth < 480 ? "0.9rem" : "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1)`,
              }}
              onClick={() => changeTheme("light")}
              title="Light Theme"
            >
              ☀️ Light
            </button>
            <button
              style={{
                background: theme === "neon" ? currentTheme.accentWin : currentTheme.accentHover,
                color: theme === "neon" ? "white" : currentTheme.textPrimary,
                border: "none",
                padding: window.innerWidth < 480 ? "8px 12px" : "10px 16px",
                borderRadius: "10px",
                fontSize: window.innerWidth < 480 ? "0.9rem" : "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1)`,
              }}
              onClick={() => changeTheme("neon")}
              title="Neon Theme"
            >
              💫 Neon
            </button>
          </div>
        </div>

        {/* Game Status */}
        <div style={{
          background: currentTheme.bgPrimary,
          padding: window.innerWidth < 480 ? "15px" : "20px",
          borderRadius: "16px",
          marginBottom: window.innerWidth < 480 ? "20px" : "25px",
          border: `3px solid ${gameStatus === 'x-wins' ? currentTheme.accentX : 
                             gameStatus === 'o-wins' ? currentTheme.accentO : 
                             gameStatus === 'draw' ? currentTheme.accentWin : 
                             currentTheme.accentHover}`,
          textAlign: "center",
          boxShadow: gameStatus === 'x-wins' ? `0 0 30px ${currentTheme.accentX}40` : 
                     gameStatus === 'o-wins' ? `0 0 30px ${currentTheme.accentO}40` : 
                     gameStatus === 'draw' ? `0 0 30px ${currentTheme.accentWin}40` : 
                     "0 4px 20px rgba(0, 0, 0, 0.1)",
          transition: "all 0.4s ease",
        }}>
          <div style={{ 
            fontSize: getResponsiveFontSize(1.3), 
            marginBottom: "10px", 
            fontWeight: "700",
            color: gameStatus === "x-wins" ? currentTheme.accentX : 
                   gameStatus === "o-wins" ? currentTheme.accentO : 
                   gameStatus === "draw" ? currentTheme.accentWin : 
                   currentTheme.textPrimary
          }}>
            {getCurrentPlayerDisplay()}
          </div>
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: window.innerWidth < 480 ? "15px" : "20px", 
            fontSize: getResponsiveFontSize(0.9),
            marginTop: "10px",
            color: currentTheme.textSecondary,
            fontWeight: "500",
            flexWrap: "wrap",
          }}>
            <span>⏱️ {formatTime(gameDuration)}</span>
            <span>📊 Moves: {moveCount}</span>
          </div>
        </div>

        {/* Game Board */}
        <div style={{
          position: "relative",
          margin: "0 auto",
          width: "fit-content",
        }}>
          {renderWinningLine()}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: window.innerWidth < 480 ? "8px" : window.innerWidth < 768 ? "12px" : "16px",
            background: currentTheme.bgPrimary,
            padding: window.innerWidth < 480 ? "15px" : window.innerWidth < 768 ? "20px" : "25px",
            borderRadius: "20px",
            border: `2px solid ${currentTheme.accentHover}`,
            boxShadow: "inset 0 4px 20px rgba(0, 0, 0, 0.2)",
          }}>
            {Array.from({ length: 9 }).map((_, index) => renderCell(index))}
          </div>
        </div>

        {/* Game Controls */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: window.innerWidth < 480 ? "12px" : "20px",
          marginTop: window.innerWidth < 480 ? "25px" : "30px",
          flexWrap: "wrap",
        }}>
          <button 
            style={{
              background: `linear-gradient(135deg, ${currentTheme.accentX}, ${currentTheme.accentO})`,
              color: "white",
              border: "none",
              padding: window.innerWidth < 480 ? "12px 24px" : "14px 28px",
              borderRadius: "12px",
              fontSize: getResponsiveFontSize(1),
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              boxShadow: `0 6px 20px ${theme === 'neon' ? 'rgba(0, 247, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'}`,
              width: window.innerWidth < 480 ? "100%" : "auto",
              maxWidth: "200px",
            }}
            onClick={resetGame}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = `0 10px 25px ${theme === 'neon' ? 'rgba(0, 247, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 6px 20px ${theme === 'neon' ? 'rgba(0, 247, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'}`;
            }}
          >
            <span style={{ fontSize: getResponsiveFontSize(1.2) }}>🔄</span>
            <span>New Game</span>
          </button>
          
          <button 
            style={{
              background: currentTheme.accentHover,
              color: currentTheme.textPrimary,
              border: "none",
              padding: window.innerWidth < 480 ? "12px 24px" : "14px 28px",
              borderRadius: "12px",
              fontSize: getResponsiveFontSize(1),
              fontWeight: "600",
              cursor: gameHistory.length === 0 ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              boxShadow: `0 6px 20px rgba(0, 0, 0, 0.1)`,
              opacity: gameHistory.length === 0 ? 0.5 : 1,
              width: window.innerWidth < 480 ? "100%" : "auto",
              maxWidth: "200px",
            }}
            onClick={undoMove}
            disabled={gameHistory.length === 0}
            onMouseEnter={(e) => {
              if (gameHistory.length > 0) {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.1)";
            }}
          >
            <span style={{ fontSize: getResponsiveFontSize(1.2) }}>↩️</span>
            <span>Undo Move</span>
          </button>
        </div>

        {/* Instructions */}
        <div style={{
          textAlign: "center",
          marginTop: window.innerWidth < 480 ? "20px" : "25px",
          color: currentTheme.textSecondary,
          fontSize: getResponsiveFontSize(0.85),
          opacity: 0.8,
          lineHeight: "1.5",
          padding: window.innerWidth < 480 ? "0 10px" : "0",
        }}>
          <p><strong>How to Play:</strong> Click on an empty cell to place your mark. Get 3 in a row to win!</p>
        </div>
      </div>

      {/* Global Styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          
          * {
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
          }
          
          body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
          
          button {
            outline: none;
            user-select: none;
            touch-action: manipulation;
          }
          
          button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
          }
          
          button:hover:not(:disabled) {
            transform: translateY(-2px);
          }
          
          button:active:not(:disabled) {
            transform: translateY(-1px);
          }
          
          /* Custom Scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: ${currentTheme.bgPrimary};
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${currentTheme.accentHover};
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${currentTheme.accentX};
          }
          
          /* Selection Color */
          ::selection {
            background: ${currentTheme.accentWin}40;
            color: ${currentTheme.textPrimary};
          }
          
          /* Remove blue highlight on mobile */
          * {
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          }
        `}
      </style>
    </div>
  );
};

export default TicTacToe;