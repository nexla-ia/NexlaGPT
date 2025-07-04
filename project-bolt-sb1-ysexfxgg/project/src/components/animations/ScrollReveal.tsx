import React, { forwardRef } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  threshold?: number;
  triggerOnce?: boolean;
  as?: keyof JSX.IntrinsicElements;
  [key: string]: any;
}

const ScrollReveal = forwardRef<HTMLElement, ScrollRevealProps>(({
  children,
  className = '',
  delay = 0,
  duration = 600,
  distance = 30,
  direction = 'up',
  threshold = 0.1,
  triggerOnce = true,
  as: Component = 'div',
  ...props
}, forwardedRef) => {
  const { ref, style } = useScrollReveal({
    delay,
    duration,
    distance,
    direction,
    threshold,
    triggerOnce
  });

  // Combine refs if forwardedRef is provided
  const combinedRef = (element: HTMLElement | null) => {
    if (element) {
      (ref as React.MutableRefObject<HTMLElement | null>).current = element;
      if (typeof forwardedRef === 'function') {
        forwardedRef(element);
      } else if (forwardedRef) {
        forwardedRef.current = element;
      }
    }
  };

  return (
    <Component
      ref={combinedRef}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
});

ScrollReveal.displayName = 'ScrollReveal';

export default ScrollReveal;