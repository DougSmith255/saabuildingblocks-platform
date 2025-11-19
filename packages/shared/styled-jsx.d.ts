/// <reference types="styled-jsx" />

declare global {
  namespace React {
    interface StyleHTMLAttributes<T> {
      jsx?: boolean;
      global?: boolean;
    }
  }
}

export {};
