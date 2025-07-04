import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, Activity, LogOut, ChevronDown, HelpCircle, CreditCard, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileMenuProps {
  className?: string;
}

export default function ProfileMenu({ className = '' }: ProfileMenuProps) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  const handleItemClick = (action: string) => {
    setIsOpen(false);
    
    switch (action) {
      case 'chat':
        window.dispatchEvent(new CustomEvent('navigate-to-activity'));
        break;
      case 'billing':
        window.dispatchEvent(new CustomEvent('navigate-to-billing'));
        break;
      case 'profile':
        window.dispatchEvent(new CustomEvent('navigate-to-profile'));
        break;
      case 'settings':
        window.dispatchEvent(new CustomEvent('navigate-to-settings'));
        break;
      case 'activity':
        window.dispatchEvent(new CustomEvent('navigate-to-activity'));
        break;
      case 'help':
        window.dispatchEvent(new CustomEvent('navigate-to-help'));
        break;
      case 'logout':
        logout();
        break;
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!user) return null;

  const menuItems = [
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageSquare,
    },
    {
      id: 'billing',
      label: 'Cobrança',
      icon: CreditCard,
    },
    {
      type: 'separator'
    },
    {
      id: 'profile',
      label: 'Perfil do usuário',
      icon: User,
    },
    {
      id: 'settings',
      label: 'Configurações da conta',
      icon: Settings,
    },
    {
      id: 'activity',
      label: 'Histórico de atividades',
      icon: Activity,
    },
    {
      id: 'help',
      label: 'Central de ajuda',
      icon: HelpCircle,
    }
  ];

  return (
    <div 
      className={`relative ${className}`}
      ref={menuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Profile Trigger Button */}
      <button
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-800/60 ${
          isOpen ? 'bg-gray-800/60' : ''
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user.name?.charAt(0).toUpperCase()}
        </div>

        {/* User Name (hidden on mobile) */}
        <span className="hidden md:block text-sm font-medium text-white truncate max-w-24">
          {user.name}
        </span>

        {/* Chevron */}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full right-0 mt-1 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden transition-all duration-200 z-50 ${
          isOpen 
            ? 'opacity-100 visible transform translate-y-0' 
            : 'opacity-0 invisible transform -translate-y-1'
        }`}
      >
        {/* User Info Header */}
        <div className="px-4 py-3 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          {menuItems.map((item, index) => {
            if (item.type === 'separator') {
              return <div key={index} className="border-t border-gray-700 my-1"></div>;
            }

            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-150"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <div className="border-t border-gray-700"></div>

        {/* Logout */}
        <div className="py-1">
          <button
            onClick={() => handleItemClick('logout')}
            className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-150"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}