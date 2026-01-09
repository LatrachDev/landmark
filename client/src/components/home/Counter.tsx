"use client";

import { useEffect, useState, memo } from "react";

interface CounterProps {
  target: number;
  duration?: number;
}

const Counter: React.FC<CounterProps> = memo(({ target, duration = 800 }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * target);

      setCount(value);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [target, duration]);

  return <span aria-label={`${count}`}>{count}</span>;
});

Counter.displayName = "Counter";

export default Counter;