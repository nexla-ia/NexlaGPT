import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          toggleVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Use passive listeners for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    // Use smooth scroll behavior
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation ${
        isVisible 
          ? 'opacity-100 visible transform translate-y-0' 
          : 'opacity-0 invisible transform translate-y-4'
      }`}
      style={{
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        minHeight: '48px',
        minWidth: '48px'
      }}
      aria-label="Voltar ao topo"
    >
      <div className="flex items-center justify-center w-full h-full">
        <ChevronUp className="w-6 h-6" />
      </div>
    </button>
  );
}