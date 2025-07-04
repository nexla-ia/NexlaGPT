import React from 'react';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Dark Multi-layer Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900">
        {/* Primary dark gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 via-transparent to-gray-800/30"></div>
        {/* Secondary dark gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-bl from-gray-800/20 via-transparent to-slate-900/25"></div>
      </div>
      
      {/* Animated Floating Particles System */}
      <div className="absolute inset-0">
        {/* Large Animated Orbs */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`large-orb-${i}`}
            className={`absolute rounded-full ${
              i % 2 === 0 ? 'w-32 h-32 bg-gradient-to-br from-slate-700/8 to-gray-600/6' :
              'w-40 h-40 bg-gradient-to-br from-gray-700/6 to-slate-800/8'
            } backdrop-blur-3xl animate-float`}
            style={{
              left: `${15 + (i * 20)}%`,
              top: `${20 + (i * 15)}%`,
              filter: 'blur(3px)',
              animationDelay: `${i * 2}s`,
              animationDuration: `${8 + i * 2}s`
            }}
          />
        ))}

        {/* Medium Animated Elements */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`medium-element-${i}`}
            className={`absolute rounded-full ${
              i % 3 === 0 ? 'w-16 h-16 bg-gradient-to-br from-slate-600/10 to-gray-700/8' :
              i % 3 === 1 ? 'w-20 h-20 bg-gradient-to-br from-gray-600/8 to-slate-700/10' :
              'w-12 h-12 bg-gradient-to-br from-slate-800/8 to-gray-800/6'
            } backdrop-blur-sm animate-float-delayed`}
            style={{
              left: `${10 + (i * 15)}%`,
              top: `${30 + (i * 12)}%`,
              filter: 'blur(2px)',
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${10 + i * 1.5}s`
            }}
          />
        ))}

        {/* Small Animated Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`small-particle-${i}`}
            className={`absolute rounded-full ${
              i % 4 === 0 ? 'w-6 h-6 bg-gradient-to-br from-slate-500/12 to-gray-600/10' :
              i % 4 === 1 ? 'w-4 h-4 bg-gradient-to-br from-gray-500/10 to-slate-600/12' :
              i % 4 === 2 ? 'w-8 h-8 bg-gradient-to-br from-slate-700/8 to-gray-700/10' :
              'w-3 h-3 bg-gradient-to-br from-gray-600/10 to-slate-700/8'
            } animate-pulse-soft`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.5}s`
            }}
          />
        ))}

        {/* Micro Animated Sparkles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`micro-sparkle-${i}`}
            className={`absolute rounded-full ${
              i % 3 === 0 ? 'w-2 h-2 bg-slate-400/15' :
              i % 3 === 1 ? 'w-1 h-1 bg-gray-400/12' :
              'w-3 h-3 bg-slate-500/10'
            } animate-pulse-soft`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + i * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Large Animated Glowing Orbs */}
      <div className="absolute top-1/4 left-1/6 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-slate-600/4 to-gray-700/3 rounded-full blur-3xl animate-float" style={{ animationDuration: '12s' }}></div>
      <div className="absolute bottom-1/4 right-1/6 w-72 h-72 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] bg-gradient-to-br from-gray-600/3 to-slate-700/4 rounded-full blur-3xl animate-float-delayed" style={{ animationDuration: '15s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-[24rem] md:h-[24rem] lg:w-[32rem] lg:h-[32rem] bg-gradient-to-br from-slate-700/2 to-gray-600/3 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '18s' }}></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.015] animate-pulse-soft" style={{ animationDuration: '8s' }}>
        <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none">
          <defs>
            <pattern id="animatedGrid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 0h100v100H0z" stroke="currentColor" strokeWidth="0.3" fill="none"/>
              <circle cx="50" cy="50" r="1" fill="currentColor" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#animatedGrid)" className="text-slate-500"/>
        </svg>
      </div>

      {/* Animated Energy Cores */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-gradient-to-br from-slate-500/15 to-gray-600/12 rounded-full shadow-lg shadow-slate-500/5 animate-pulse-soft" style={{ animationDuration: '3s' }}></div>
      <div className="absolute bottom-32 left-32 w-3 h-3 bg-gradient-to-br from-gray-500/12 to-slate-600/15 rounded-full shadow-lg shadow-gray-500/5 animate-pulse-soft" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-gradient-to-br from-slate-600/18 to-gray-500/15 rounded-full shadow-lg shadow-slate-600/8 animate-pulse-soft" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
      
      {/* Additional atmospheric elements with animation */}
      <div className="absolute top-10 left-10 w-1 h-1 bg-slate-500/25 rounded-full animate-pulse-soft" style={{ animationDuration: '2s' }}></div>
      <div className="absolute bottom-20 right-40 w-0.5 h-0.5 bg-gray-500/30 rounded-full animate-pulse-soft" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
      <div className="absolute top-1/3 left-3/4 w-1.5 h-1.5 bg-slate-600/20 rounded-full animate-pulse-soft" style={{ animationDuration: '4s', animationDelay: '1.5s' }}></div>
    </div>
  );
}