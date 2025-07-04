import React from 'react';
import StaggeredReveal from './StaggeredReveal';

interface AnimatedGridProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  cols?: number;
}

export default function AnimatedGrid({
  children,
  className = '',
  itemClassName = '',
  staggerDelay = 100,
  direction = 'up',
  cols = 3
}: AnimatedGridProps) {
  const gridClass = `grid grid-cols-1 md:grid-cols-${Math.min(cols, 3)} lg:grid-cols-${cols} gap-6`;
  
  return (
    <StaggeredReveal
      className={`${gridClass} ${className}`}
      itemClassName={itemClassName}
      staggerDelay={staggerDelay}
      direction={direction}
      duration={600}
      distance={30}
    >
      {children}
    </StaggeredReveal>
  );
}