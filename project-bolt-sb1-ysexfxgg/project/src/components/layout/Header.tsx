import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationCenter from '../notifications/NotificationCenter';
import ProfileMenu from './ProfileMenu';

interface HeaderProps {
  onToggleSidebar: () => void;
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Header Principal - Fixed with smooth scroll optimization */}
      <header className={`fixed top-0 left-0 right-0 z-[60] flex-shrink-0 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 shadow-lg' 
          : 'bg-gray-900/80 backdrop-blur-md border-b border-gray-700/30'
      }`}>
        <div className="flex items-center justify-between p-3 tablet:p-4 lg:p-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Logo and Title */}
            <div className="w-8 h-8 tablet:w-10 tablet:h-10 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105 flex-shrink-0">
              <img 
                src="/icon_trimmed_transparent_customcolor (1).png" 
                alt="NexlaGPT" 
                className="w-4 h-4 tablet:w-6 tablet:h-6 lg:w-6 lg:h-6 object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg tablet:text-xl lg:text-xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 bg-clip-text text-transparent truncate">
                {title}
              </h1>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 tablet:gap-3 flex-shrink-0">
            {/* Token Usage Indicator - Tablet Optimized */}
            {user && (
              <div className="hidden sm:flex tablet:flex items-center gap-2 tablet:gap-3 px-3 tablet:px-4 py-2 tablet:py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-2 h-2 tablet:w-2.5 tablet:h-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                <span className="text-xs tablet:text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {((user.tokensUsed / user.tokensLimit) * 100).toFixed(0)}%
                </span>
                <div className="w-8 tablet:w-10 h-1 tablet:h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                    style={{ width: `${(user.tokensUsed / user.tokensLimit) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Notifications */}
            <NotificationCenter />

            {/* Profile Menu */}
            <ProfileMenu />
          </div>
        </div>
      </header>
    </>
  );
}