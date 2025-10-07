import { useState, useCallback, RefObject } from 'react';

interface UseTouchSwipeProps {
  scrollRef: RefObject<HTMLDivElement>;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export function useTouchSwipe({
  scrollRef,
  onSwipeLeft,
  onSwipeRight,
  threshold = 75
}: UseTouchSwipeProps) {
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;

    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    const diffX = Math.abs(touchStartX - touchCurrentX);
    const diffY = Math.abs(touchStartY - touchCurrentY);

    if (diffX > diffY && diffX > 10) {
      e.preventDefault();
    }
  }, [isDragging, scrollRef, touchStartX, touchStartY]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;

    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchStartX - touchEndX;

    if (Math.abs(swipeDistance) > threshold) {
      if (swipeDistance > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (swipeDistance < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    setIsDragging(false);
    setTouchStartX(0);
    setTouchStartY(0);
  }, [isDragging, touchStartX, threshold, onSwipeLeft, onSwipeRight]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isDragging
  };
}
