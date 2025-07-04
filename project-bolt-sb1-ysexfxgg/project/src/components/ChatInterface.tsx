import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, User, Plus, LogOut, Settings, CreditCard, HelpCircle, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AdvancedHamburgerMenu from './layout/AdvancedHamburgerMenu';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: Message[];
  isLoading: boolean;
}

export default function ChatInterface({ onSendMessage, messages, isLoading }: ChatInterfaceProps) {
  const { user, logout } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleNewChat = () => {
    window.location.reload(); // Simple way to start new chat
  };

  const handleChatSelect = (chatId: string) => {
    console.log('Selected chat:', chatId);
    // Implement chat loading logic here
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuItemClick = (action: string) => {
    setIsDropdownOpen(false);
    
    switch (action) {
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

  // Quick action suggestions
  const quickActions = [
    { icon: '📝', text: 'Resumir', action: 'Pode resumir este texto para mim?' },
    { icon: '💡', text: 'Ideias', action: 'Preciso de ideias criativas para' },
    { icon: '🔍', text: 'Explicar', action: 'Pode explicar o conceito de' },
    { icon: '🎯', text: 'Resolver', action: 'Preciso resolver este problema:' },
    { icon: '⚡', text: 'Otimizar', action: 'Como posso otimizar' },
    { icon: '🚀', text: 'Implementar', action: 'Como implementar' }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white w-full relative">
      {/* Advanced Hamburger Menu */}
      <AdvancedHamburgerMenu 
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
        currentChatId="current-chat"
      />

      {/* Header - Centralized Layout with Symmetric Distribution */}
      <div className="flex items-center justify-center p-4 border-b border-gray-800 bg-gray-900 flex-shrink-0 relative z-10">
        {/* Container with symmetric layout */}
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Left Side - Spacer to balance the profile menu */}
          <div className="w-8 h-8"></div>
          
          {/* Center - Logo and Title */}
          <div className="flex items-center gap-3 tablet:gap-4 lg:gap-4">
            <div className="w-8 h-8 tablet:w-10 tablet:h-10 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105 flex-shrink-0">
              <img 
                src="/icon_trimmed_transparent_customcolor (1).png" 
                alt="NexlaGPT" 
                className="w-4 h-4 tablet:w-6 tablet:h-6 lg:w-6 lg:h-6 object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg tablet:text-xl lg:text-xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 bg-clip-text text-transparent truncate">
                NexlaGPT
              </h1>
            </div>
          </div>

          {/* Right Side - Profile Menu */}
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button 
              onClick={handleProfileClick}
              className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium hover:scale-105 transition-transform"
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{user?.name || 'Usuário'}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email || 'email@exemplo.com'}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={() => handleMenuItemClick('billing')}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    Cobrança
                  </button>
                  
                  <button
                    onClick={() => handleMenuItemClick('profile')}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Perfil do usuário
                  </button>
                  
                  <button
                    onClick={() => handleMenuItemClick('settings')}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Configurações da conta
                  </button>
                  
                  <button
                    onClick={() => handleMenuItemClick('activity')}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <Activity className="w-4 h-4" />
                    Histórico de atividades
                  </button>
                  
                  <button
                    onClick={() => handleMenuItemClick('help')}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Central de ajuda
                  </button>
                </div>

                {/* Separator */}
                <div className="border-t border-gray-700"></div>

                {/* Logout */}
                <div className="py-1">
                  <button
                    onClick={() => handleMenuItemClick('logout')}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area - Dynamic Height with Full Width */}
      <div className="flex-1 overflow-y-auto w-full min-h-0 relative">
        {messages.length === 0 ? (
          /* Empty State - Full Width with Proper Padding */
          <div className="flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-8 w-full max-w-7xl mx-auto">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                  <img 
                    src="/icon_trimmed_transparent_customcolor (1).png" 
                    alt="NexlaGPT" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                Como posso ajudar você hoje?
              </h2>
              <p className="text-gray-400 mb-8 text-base sm:text-lg max-w-3xl mx-auto">
                Faça uma pergunta, peça ajuda com um projeto ou simplesmente converse comigo.
              </p>
              
              {/* Quick Actions Grid - Responsive Full Width */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 w-full">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="group p-3 sm:p-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 text-center backdrop-blur-sm"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    <div className="text-lg sm:text-xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {action.icon}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-gray-300 group-hover:text-cyan-400 transition-colors">
                      {action.text}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Messages - Full Width with Responsive Padding */
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <div className="max-w-7xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fadeIn mb-6`}
                >
                  <div className={`flex max-w-[90%] sm:max-w-[85%] lg:max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                      message.isUser 
                        ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600' 
                        : 'bg-gradient-to-br from-slate-700 to-slate-600'
                    }`}>
                      {message.isUser ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <img 
                          src="/icon_trimmed_transparent_customcolor (1).png" 
                          alt="NexlaGPT" 
                          className="w-5 h-5 object-contain"
                        />
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`px-4 py-3 rounded-2xl shadow-lg ${
                      message.isUser
                        ? 'bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 text-white'
                        : 'bg-slate-800/80 text-gray-100 border border-slate-700/50 backdrop-blur-sm'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{message.content}</p>
                      <div className={`text-xs mt-2 ${
                        message.isUser ? 'text-cyan-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start animate-fadeIn mb-6">
                  <div className="flex gap-3 max-w-[90%] sm:max-w-[85%] lg:max-w-[80%]">
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center shadow-lg">
                      <img 
                        src="/icon_trimmed_transparent_customcolor (1).png" 
                        alt="NexlaGPT" 
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm shadow-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Fixed Bottom with Centered Layout */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-gray-900/95 backdrop-blur-xl p-4 pb-6 sm:pb-8 z-20">
        <div className="w-full max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end gap-3 bg-gray-800 rounded-2xl border border-gray-700 p-3 focus-within:border-gray-600 transition-colors shadow-lg">
              {/* Attachment Button */}
              <button
                type="button"
                className="flex-shrink-0 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Anexar arquivo"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Text Input */}
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Pergunte alguma coisa"
                  className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none min-h-[24px] max-h-[120px] py-1 text-sm sm:text-base"
                  style={{ fontSize: '16px' }}
                  rows={1}
                  disabled={isLoading}
                />
              </div>

              {/* Voice/Send Button */}
              {inputValue.trim() ? (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-shrink-0 p-2 bg-white text-black rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Enviar mensagem"
                >
                  <Send className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                    isRecording 
                      ? 'text-red-500 bg-red-100/10' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                  aria-label={isRecording ? 'Parar gravação' : 'Iniciar gravação'}
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
          
          <div className="text-center mt-2">
            <p className="text-xs text-gray-500">
              O NexlaGPT pode cometer erros. Considere verificar informações importantes.
            </p>
          </div>
        </div>
      </div>

      {/* Spacer for Fixed Input */}
      <div className="h-24 sm:h-28 flex-shrink-0"></div>
    </div>
  );
}