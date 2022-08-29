import { useEffect, useRef } from "react";

export const useDebounce = (callback: any, delay: number) => {
  // todo proper typing
  const latestCallback = useRef<any>(null);
  const latestTimeout = useRef<any>(null);

  useEffect(() => {
    latestCallback.current = callback;
  }, [callback]);

  // todo proper typing
  return (args: any): any => {
    if (latestTimeout.current) {
      clearTimeout(latestTimeout.current);
    }

    latestTimeout.current = setTimeout(() => {
      latestCallback.current(args);
    }, delay);
  };
};
