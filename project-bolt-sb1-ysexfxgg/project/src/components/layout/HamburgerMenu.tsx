import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, MessageSquare, Clock, Search } from 'lucide-react';

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface HamburgerMenuProps {
  className?: string;
  onNewChat?: () => void;
}

export default function HamburgerMenu({ className = '', onNewChat }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const firstFocusableRef = useRef<HTMLElement>(null);
  const lastFocusableRef = useRef<HTMLElement>(null);

  // Load chat history
  useEffect(() => {
    const loadChatHistory = async () => {
      setIsLoadingHistory(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockHistory: ChatHistory[] = [
          {
            id: '1',
            title: 'Como integrar N8N com APIs',
            lastMessage: 'Obrigado pela explicação detalhada!',
            timestamp: new Date(Date.now() - 3600000),
            messageCount: 12
          },
          {
            id: '2',
            title: 'Automatização de workflows',
            lastMessage: 'Perfeito, vou implementar essa solução.',
            timestamp: new Date(Date.now() - 86400000),
            messageCount: 8
          },
          {
            id: '3',
            title: 'Análise de dados em tempo real',
            lastMessage: 'Como posso otimizar a performance?',
            timestamp: new Date(Date.now() - 172800000),
            messageCount: 15
          },
          {
            id: '4',
            title: 'Configuração de webhooks',
            lastMessage: 'Funcionou perfeitamente, obrigado!',
            timestamp: new Date(Date.now() - 259200000),
            messageCount: 6
          },
          {
            id: '5',
            title: 'Integração com banco de dados',
            lastMessage: 'Vou testar essa abordagem.',
            timestamp: new Date(Date.now() - 432000000),
            messageCount: 10
          }
        ];
        
        setChatHistory(mockHistory);
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, []);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        closeSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Focus search input when sidebar opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else if (!isOpen && buttonRef.current) {
      // Return focus to button when sidebar closes
      buttonRef.current.focus();
    }
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    const handleTabKey = (event: KeyboardEvent) => {
      if (!isOpen || event.key !== 'Tab') return;

      const focusableElements = sidebarRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleTabKey);
    }

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleNewChat = () => {
    onNewChat?.();
    closeSidebar();
  };

  const handleChatSelect = (chatId: string) => {
    console.log('Selected chat:', chatId);
    closeSidebar();
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora';
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return timestamp.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  // Filter conversations based on search
  const filteredHistory = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Hamburger Button */}
      <button
        ref={buttonRef}
        onClick={toggleSidebar}
        className={`hamburger-menu-button fixed top-4 left-4 z-[300] w-12 h-12 bg-gray-800/90 hover:bg-gray-700 border border-gray-600 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 backdrop-blur-sm shadow-lg ${className}`}
        aria-label={isOpen ? 'Fechar histórico de chat' : 'Abrir histórico de chat'}
        aria-expanded={isOpen}
        aria-controls="chat-history-sidebar"
        style={{
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation'
        }}
      >
        <div className="relative w-6 h-6">
          <Menu 
            className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
              isOpen ? 'opacity-0 rotate-180 scale-75' : 'opacity-100 rotate-0 scale-100'
            }`}
          />
          <X 
            className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
              isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-75'
            }`}
          />
        </div>
      </button>

      {/* Overlay */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        id="chat-history-sidebar"
        role="navigation"
        aria-label="Histórico de conversas"
        className={`fixed left-0 top-0 z-[200] h-full w-80 max-w-[80vw] bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 shadow-2xl transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col overflow-hidden`}
        style={{
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gray-900/95 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <img 
                src="/icon_trimmed_transparent_customcolor (1).png" 
                alt="NexlaGPT" 
                className="w-4 h-4 object-contain"
              />
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              NexlaGPT
            </h2>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-gray-700/50 bg-gray-900/95 backdrop-blur-xl flex-shrink-0">
          <button
            ref={firstFocusableRef}
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl text-white transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Iniciar nova conversa"
          >
            <MessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
            <span className="font-medium">Nova Conversa</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-700/50 bg-gray-900/95 backdrop-blur-xl flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar conversas..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              style={{ fontSize: '16px' }}
              aria-label="Buscar no histórico de conversas"
            />
          </div>
        </div>

        {/* Chat History Header */}
        <div className="px-4 py-3 border-b border-gray-700/50 bg-gray-900/95 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Conversas Recentes
            </h3>
            {searchQuery && (
              <span className="text-xs text-gray-400">
                {filteredHistory.length} resultado(s)
              </span>
            )}
          </div>
        </div>

        {/* Chat History List */}
        <div 
          className="flex-1 px-4 pb-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 scroll-smooth"
          style={{
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-2 pt-4">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
                  </p>
                  {!searchQuery && (
                    <p className="text-xs mt-1">Inicie uma nova conversa acima</p>
                  )}
                </div>
              ) : (
                filteredHistory.map((chat, index) => (
                  <button
                    key={chat.id}
                    ref={index === filteredHistory.length - 1 ? lastFocusableRef : undefined}
                    onClick={() => handleChatSelect(chat.id)}
                    className="w-full flex flex-col gap-2 px-3 py-3 text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    aria-label={`Abrir conversa: ${chat.title}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MessageSquare className="w-4 h-4 flex-shrink-0 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate">{chat.title}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 flex-shrink-0">
                        {formatTimestamp(chat.timestamp)}
                      </div>
                    </div>
                    
                    <div className="ml-6 text-xs text-gray-500 truncate">
                      {chat.lastMessage}
                    </div>
                    
                    <div className="ml-6 text-xs text-gray-600">
                      {chat.messageCount} mensagens
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}