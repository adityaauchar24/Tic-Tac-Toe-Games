/// <reference types="vite/client" />
/// <reference types="@testing-library/jest-dom" />

// Environment Variables Type Definitions
interface ImportMetaEnv {
  // Application
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_URL: string;
  readonly VITE_DEBUG_MODE: string;
  
  // Game Configuration
  readonly VITE_GAME_TITLE: string;
  readonly VITE_MAX_PLAYERS: string;
  readonly VITE_BOARD_SIZE: string;
  readonly VITE_MAX_MOVES: string;
  
  // Features
  readonly VITE_ENABLE_SOUNDS: string;
  readonly VITE_ENABLE_ANIMATIONS: string;
  readonly VITE_AUTO_RESET_DELAY: string;
  
  // Players
  readonly VITE_PLAYER_X_NAME: string;
  readonly VITE_PLAYER_O_NAME: string;
  
  // Server
  readonly VITE_PORT: string;
  readonly VITE_PREVIEW_PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Vitest globals
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends TestingLibraryMatchers<T, void> {}
  }
  
  // For matchMedia mock
  interface Window {
    matchMedia: (query: string) => MediaQueryList;
  }
}