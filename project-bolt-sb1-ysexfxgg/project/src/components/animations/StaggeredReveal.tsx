import React, { forwardRef } from 'react';
import { useStaggeredScrollReveal } from '../../hooks/useScrollReveal';

interface StaggeredRevealProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  staggerDelay?: number;
  threshold?: number;
  as?: keyof JSX.IntrinsicElements;
  itemAs?: keyof JSX.IntrinsicElements;
  [key: string]: any;
}

const StaggeredReveal = forwardRef<HTMLElement, StaggeredRevealProps>(({
  children,
  className = '',
  itemClassName = '',
  delay = 0,
  duration = 600,
  distance = 30,
  direction = 'up',
  staggerDelay = 100,
  threshold = 0.1,
  as: Component = 'div',
  itemAs: ItemComponent = 'div',
  ...props
}, forwardedRef) => {
  const childrenArray = React.Children.toArray(children);
  const { containerRef, getItemStyle } = useStaggeredScrollReveal(childrenArray.length, {
    delay,
    duration,
    distance,
    direction,
    staggerDelay,
    threshold
  });

  // Combine refs if forwardedRef is provided
  const combinedRef = (element: HTMLElement | null) => {
    if (element) {
      (containerRef as React.MutableRefObject<HTMLElement | null>).current = element;
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
      {...props}
    >
      {childrenArray.map((child, index) => (
        <ItemComponent
          key={index}
          className={itemClassName}
          style={getItemStyle(index)}
        >
          {child}
        </ItemComponent>
      ))}
    </Component>
  );
});

StaggeredReveal.displayName = 'StaggeredReveal';

export default StaggeredReveal;