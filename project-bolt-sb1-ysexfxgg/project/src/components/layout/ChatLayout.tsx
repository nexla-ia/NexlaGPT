import React from 'react';
import HamburgerMenu from './HamburgerMenu';

interface ChatLayoutProps {
  children: React.ReactNode;
  onNewChat?: () => void;
}

export default function ChatLayout({ children, onNewChat }: ChatLayoutProps) {
  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      {/* Hamburger Menu */}
      <HamburgerMenu onNewChat={onNewChat} />
      
      {/* Main Chat Content */}
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
}