// hooks/useScrollAnimation.ts
import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  animateOnce?: boolean;
  delay?: number;
}

type UseScrollAnimationReturn = [
  React.RefObject<HTMLDivElement | null>,
  boolean
];

const useScrollAnimation = (
  options: UseScrollAnimationOptions = {}
): UseScrollAnimationReturn => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const {
    threshold = 0.1,
    rootMargin = "0px 0px -30px 0px",
    animateOnce = true,
    delay = 0,
  } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
            if (animateOnce) {
              setHasAnimated(true);
            }
          }, delay);
        } else if (!animateOnce && !hasAnimated) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin, animateOnce, delay, hasAnimated]);

  return [elementRef, isVisible];
};

export default useScrollAnimation;
