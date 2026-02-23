/// <reference types="styled-jsx" />

declare global {
  namespace React {
    interface StyleHTMLAttributes<T> {
      jsx?: boolean;
      global?: boolean;
    }
  }
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

export {};
