import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  easing?: string;
}

interface ScrollRevealState {
  isVisible: boolean;
  hasTriggered: boolean;
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0,
    duration = 600,
    distance = 30,
    direction = 'up',
    easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<ScrollRevealState>({
    isVisible: false,
    hasTriggered: false
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setState({ isVisible: true, hasTriggered: true });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setState(prev => ({
              isVisible: true,
              hasTriggered: true
            }));
            
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setState(prev => ({
              isVisible: false,
              hasTriggered: prev.hasTriggered
            }));
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  // Generate transform values based on direction
  const getTransform = (isVisible: boolean) => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`;
      default:
        return `translate3d(0, ${distance}px, 0)`;
    }
  };

  const animationStyle = {
    opacity: state.isVisible ? 1 : 0,
    transform: getTransform(state.isVisible),
    transition: `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`,
    willChange: 'opacity, transform'
  };

  return {
    ref: elementRef,
    style: animationStyle,
    isVisible: state.isVisible,
    hasTriggered: state.hasTriggered
  };
}

// Hook for staggered animations
export function useStaggeredScrollReveal(
  itemCount: number,
  options: UseScrollRevealOptions & { staggerDelay?: number } = {}
) {
  const { staggerDelay = 100, ...baseOptions } = options;
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(container);
          }
        });
      },
      {
        threshold: baseOptions.threshold || 0.1,
        rootMargin: baseOptions.rootMargin || '0px 0px -50px 0px'
      }
    );

    observer.observe(container);

    return () => {
      observer.unobserve(container);
    };
  }, [baseOptions.threshold, baseOptions.rootMargin]);

  const getItemStyle = (index: number) => {
    const delay = (baseOptions.delay || 0) + (index * staggerDelay);
    const duration = baseOptions.duration || 600;
    const distance = baseOptions.distance || 30;
    const direction = baseOptions.direction || 'up';
    const easing = baseOptions.easing || 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    const getTransform = () => {
      if (isVisible) return 'translate3d(0, 0, 0)';
      
      switch (direction) {
        case 'up':
          return `translate3d(0, ${distance}px, 0)`;
        case 'down':
          return `translate3d(0, -${distance}px, 0)`;
        case 'left':
          return `translate3d(${distance}px, 0, 0)`;
        case 'right':
          return `translate3d(-${distance}px, 0, 0)`;
        default:
          return `translate3d(0, ${distance}px, 0)`;
      }
    };

    return {
      opacity: isVisible ? 1 : 0,
      transform: getTransform(),
      transition: `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`,
      willChange: 'opacity, transform'
    };
  };

  return {
    containerRef,
    isVisible,
    getItemStyle
  };
}