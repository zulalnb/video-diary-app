import { useRef } from 'react';

function useThrottle<T extends (...args: any[]) => void>(fn: T, delay: number) {
  const lastCall = useRef(0);

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      fn(...args);
    }
  };
}

export default useThrottle;
