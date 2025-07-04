import React from 'react';
import ScrollReveal from './ScrollReveal';

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  splitWords?: boolean;
  splitLines?: boolean;
}

export default function AnimatedText({
  children,
  className = '',
  delay = 0,
  as = 'div',
  splitWords = false,
  splitLines = false
}: AnimatedTextProps) {
  // Simple implementation - for more complex text splitting, you'd need additional logic
  if (splitWords || splitLines) {
    const text = typeof children === 'string' ? children : '';
    const parts = splitWords ? text.split(' ') : splitLines ? text.split('\n') : [text];
    
    return (
      <ScrollReveal
        as={as}
        className={className}
        delay={delay}
        direction="up"
        distance={20}
        duration={800}
      >
        {parts.map((part, index) => (
          <span
            key={index}
            style={{
              display: 'inline-block',
              opacity: 0,
              transform: 'translateY(20px)',
              animation: `fadeInUp 0.6s ease-out ${delay + index * 50}ms forwards`
            }}
          >
            {part}
            {splitWords && index < parts.length - 1 && ' '}
            {splitLines && index < parts.length - 1 && <br />}
          </span>
        ))}
      </ScrollReveal>
    );
  }

  return (
    <ScrollReveal
      as={as}
      className={className}
      delay={delay}
      direction="up"
      distance={20}
      duration={800}
    >
      {children}
    </ScrollReveal>
  );
}