import React from 'react';
import ScrollReveal from './ScrollReveal';

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
}

export default function FadeInSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 30,
  duration = 600
}: FadeInSectionProps) {
  return (
    <ScrollReveal
      className={className}
      delay={delay}
      direction={direction}
      distance={distance}
      duration={duration}
      threshold={0.1}
      triggerOnce={true}
    >
      {children}
    </ScrollReveal>
  );
}