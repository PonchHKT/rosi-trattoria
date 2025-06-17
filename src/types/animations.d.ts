// types/animations.d.ts ou dans un fichier global types.d.ts
export interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  animateOnce?: boolean;
  delay?: number;
}

export type AnimationType = 
  | 'scroll-animate'
  | 'fade-in-left'
  | 'fade-in-right'
  | 'fade-in-scale'
  | 'fade-in-rotate'
  | 'title-animate'
  | 'card-animate'
  | 'typewriter-animate';

export interface AnimatedSectionProps {
  children: React.ReactNode;
  animationType?: AnimationType;
  delay?: number;
  threshold?: number;
  className?: string;
  staggerDelay?: number;
  rootMargin?: string;
}

// Si vous avez des modules sans types
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}