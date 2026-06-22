import { useRef } from "react";

export function useSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  threshold = 50
) {
  const touchStartX = useRef<number | null>(null);

  const onTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
  };

  const onTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) return;

    const diff = touchStartX.current - clientX;
    touchStartX.current = null;

    if (Math.abs(diff) < threshold) return;

    if (diff > 0) {
      onSwipeLeft();
    } else {
      onSwipeRight();
    }
  };

  return {
    onTouchStart,
    onTouchEnd,
  };
}