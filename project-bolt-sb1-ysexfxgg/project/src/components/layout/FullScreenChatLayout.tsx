import React from 'react';
import AdvancedHamburgerMenu from './AdvancedHamburgerMenu';

interface FullScreenChatLayoutProps {
  children: React.ReactNode;
  onNewChat?: () => void;
  onChatSelect?: (chatId: string) => void;
  currentChatId?: string;
}

export default function FullScreenChatLayout({ 
  children, 
  onNewChat, 
  onChatSelect,
  currentChatId 
}: FullScreenChatLayoutProps) {
  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      {/* Advanced Hamburger Menu */}
      <AdvancedHamburgerMenu 
        onNewChat={onNewChat}
        onChatSelect={onChatSelect}
        currentChatId={currentChatId}
      />
      
      {/* Full-Screen Chat Content */}
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
}