import "./App.css";
import TicTacToe from "./Components/TicTacToe";

// Access environment variables
const gameTitle = import.meta.env.VITE_GAME_TITLE || "Tic Tac Toe";
const appVersion = import.meta.env.VITE_APP_VERSION || "1.0.0";
const isDebugMode = import.meta.env.VITE_DEBUG_MODE === "true";
const enableSounds = import.meta.env.VITE_ENABLE_SOUNDS === "true";
const enableAnimations = import.meta.env.VITE_ENABLE_ANIMATIONS === "true";

function App() {
  return (
    <div className="app-container">
      {/* Debug information */}
      {isDebugMode && (
        <div className="debug-info">
          <div>Debug Mode Active</div>
          <div>Version: {appVersion}</div>
          <div>Sounds: {enableSounds ? "ON" : "OFF"}</div>
          <div>Animations: {enableAnimations ? "ON" : "OFF"}</div>
        </div>
      )}

      {/* Optional: Show game title from env if you want */}
      {/* <h1 className="app-title">{gameTitle} v{appVersion}</h1> */}

      <TicTacToe />

      {/* Footer with environment info */}
      <footer className="app-footer">
        <div>
          {gameTitle} v{appVersion}
        </div>
        <div>Built with React + TypeScript + Vite</div>
        {isDebugMode && (
          <div className="env-info">
            Environment: {import.meta.env.MODE} | API: {import.meta.env.VITE_API_URL || "Not set"}
          </div>
        )}
      </footer>
    </div>
  );
}

export default App;
