// Animation utility functions and constants

export const ANIMATION_DURATIONS = {
  fast: 300,
  normal: 600,
  slow: 900,
  slower: 1200
} as const;

export const ANIMATION_EASINGS = {
  easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
} as const;

export const STAGGER_DELAYS = {
  fast: 50,
  normal: 100,
  slow: 150,
  slower: 200
} as const;

// Utility function to create custom animation styles
export function createAnimationStyle(
  isVisible: boolean,
  options: {
    duration?: number;
    delay?: number;
    easing?: string;
    distance?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    scale?: number;
    rotation?: number;
  } = {}
) {
  const {
    duration = ANIMATION_DURATIONS.normal,
    delay = 0,
    easing = ANIMATION_EASINGS.easeOut,
    distance = 30,
    direction = 'up',
    scale = 1,
    rotation = 0
  } = options;

  const getTransform = () => {
    if (isVisible) {
      return `translate3d(0, 0, 0) scale(${scale}) rotate(${rotation}deg)`;
    }
    
    let translateValue = '';
    switch (direction) {
      case 'up':
        translateValue = `0, ${distance}px, 0`;
        break;
      case 'down':
        translateValue = `0, -${distance}px, 0`;
        break;
      case 'left':
        translateValue = `${distance}px, 0, 0`;
        break;
      case 'right':
        translateValue = `-${distance}px, 0, 0`;
        break;
    }
    
    return `translate3d(${translateValue}) scale(${scale * 0.95}) rotate(${rotation}deg)`;
  };

  return {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`,
    willChange: 'opacity, transform'
  };
}

// Utility to check if animations should be disabled
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Utility to create intersection observer with common defaults
export function createScrollObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
}

// Performance optimization: Debounce scroll events
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Utility for creating sequential animations
export function createSequentialAnimation(
  elements: HTMLElement[],
  animationClass: string,
  delay: number = 100
): void {
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add(animationClass);
    }, index * delay);
  });
}