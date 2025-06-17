// components/Acceuil/AnimatedSection/AnimatedSection.tsx
import React from "react";
import type { ReactNode } from "react";
import useScrollAnimation from "../../../hooks/useScrollAnimation";

type AnimationType =
  | "scroll-animate"
  | "fade-in-left"
  | "fade-in-right"
  | "fade-in-scale"
  | "fade-in-rotate"
  | "title-animate"
  | "card-animate"
  | "typewriter-animate"
  | "bio-slide-left"
  | "bio-slide-right"
  | "bio-wave-left"
  | "bio-wave-right"
  | "bio-flip-left"
  | "bio-flip-right"
  | "bio-morph-left"
  | "bio-morph-right"
  | "bio-particle-left"
  | "bio-particle-right";

interface AnimatedSectionProps {
  children: ReactNode;
  animationType?: AnimationType;
  delay?: number;
  threshold?: number;
  className?: string;
  staggerDelay?: number;
  rootMargin?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animationType = "scroll-animate",
  delay = 0,
  threshold = 0.1,
  className = "",
  staggerDelay = 0,
  rootMargin = "0px 0px -50px 0px",
}) => {
  const [ref, isVisible] = useScrollAnimation({
    threshold,
    delay,
    rootMargin,
  });

  const staggerClass = staggerDelay > 0 ? `stagger-delay-${staggerDelay}` : "";
  const animationClass = `${animationType} ${staggerClass} ${
    isVisible ? "visible" : ""
  }`;

  return (
    <div ref={ref} className={`${animationClass} ${className}`.trim()}>
      {children}
    </div>
  );
};

export default AnimatedSection;
