import { useEffect } from "react";

export function useEnterClickListener(fn: () => void, deps: unknown[]) {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        fn();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [...deps]);
}
