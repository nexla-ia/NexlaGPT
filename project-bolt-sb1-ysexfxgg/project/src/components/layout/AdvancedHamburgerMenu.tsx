import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  MessageSquare, 
  Clock, 
  Search, 
  Plus,
  Trash2,
  Archive,
  Bookmark,
  BookmarkCheck,
  MoreVertical,
  ArrowLeft,
  Filter,
  Calendar,
  Star
} from 'lucide-react';

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  isBookmarked: boolean;
  isArchived: boolean;
  category: 'today' | 'yesterday' | 'week' | 'month' | 'older';
}

interface AdvancedHamburgerMenuProps {
  className?: string;
  onNewChat?: () => void;
  onChatSelect?: (chatId: string) => void;
  currentChatId?: string;
}

export default function AdvancedHamburgerMenu({ 
  className = '', 
  onNewChat, 
  onChatSelect,
  currentChatId 
}: AdvancedHamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  const [showActions, setShowActions] = useState(false);
  const [filterBy, setFilterBy] = useState<'all' | 'bookmarked' | 'archived'>('all');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load chat history with categories
  useEffect(() => {
    const loadChatHistory = async () => {
      setIsLoadingHistory(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const now = new Date();
        const mockHistory: ChatHistory[] = [
          {
            id: '1',
            title: 'Como integrar N8N com APIs',
            lastMessage: 'Obrigado pela explicação detalhada sobre webhooks!',
            timestamp: new Date(now.getTime() - 1800000), // 30 min ago
            messageCount: 12,
            isBookmarked: true,
            isArchived: false,
            category: 'today'
          },
          {
            id: '2',
            title: 'Automatização de workflows complexos',
            lastMessage: 'Perfeito, vou implementar essa solução de automação.',
            timestamp: new Date(now.getTime() - 7200000), // 2 hours ago
            messageCount: 8,
            isBookmarked: false,
            isArchived: false,
            category: 'today'
          },
          {
            id: '3',
            title: 'Análise de dados em tempo real',
            lastMessage: 'Como posso otimizar a performance dos dashboards?',
            timestamp: new Date(now.getTime() - 86400000), // Yesterday
            messageCount: 15,
            isBookmarked: true,
            isArchived: false,
            category: 'yesterday'
          },
          {
            id: '4',
            title: 'Configuração de webhooks avançados',
            lastMessage: 'Funcionou perfeitamente, obrigado pela ajuda!',
            timestamp: new Date(now.getTime() - 172800000), // 2 days ago
            messageCount: 6,
            isBookmarked: false,
            isArchived: false,
            category: 'week'
          },
          {
            id: '5',
            title: 'Integração com banco de dados PostgreSQL',
            lastMessage: 'Vou testar essa abordagem com conexões pool.',
            timestamp: new Date(now.getTime() - 432000000), // 5 days ago
            messageCount: 10,
            isBookmarked: false,
            isArchived: true,
            category: 'week'
          },
          {
            id: '6',
            title: 'Deploy automatizado com Docker',
            lastMessage: 'Sistema de CI/CD configurado com sucesso.',
            timestamp: new Date(now.getTime() - 1209600000), // 2 weeks ago
            messageCount: 18,
            isBookmarked: true,
            isArchived: false,
            category: 'month'
          },
          {
            id: '7',
            title: 'Otimização de performance React',
            lastMessage: 'Aplicação 40% mais rápida após as otimizações.',
            timestamp: new Date(now.getTime() - 2592000000), // 1 month ago
            messageCount: 22,
            isBookmarked: false,
            isArchived: true,
            category: 'older'
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

  // Handle ESC key and outside clicks
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeSidebar();
      }
    };

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
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => {
    setIsOpen(false);
    setShowActions(false);
    setSelectedChats(new Set());
    setActiveDropdown(null);
  };

  const handleNewChat = () => {
    onNewChat?.();
    closeSidebar();
  };

  const handleChatSelect = (chatId: string) => {
    if (selectedChats.size > 0) {
      toggleChatSelection(chatId);
    } else {
      onChatSelect?.(chatId);
      closeSidebar();
    }
  };

  const toggleChatSelection = (chatId: string) => {
    const newSelected = new Set(selectedChats);
    if (newSelected.has(chatId)) {
      newSelected.delete(chatId);
    } else {
      newSelected.add(chatId);
    }
    setSelectedChats(newSelected);
    setShowActions(newSelected.size > 0);
  };

  const handleBookmark = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatHistory(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, isBookmarked: !chat.isBookmarked } : chat
    ));
    setActiveDropdown(null);
  };

  const handleArchive = (chatIds: string[]) => {
    setChatHistory(prev => prev.map(chat => 
      chatIds.includes(chat.id) ? { ...chat, isArchived: !chat.isArchived } : chat
    ));
    setSelectedChats(new Set());
    setShowActions(false);
  };

  const handleDelete = (chatIds: string[]) => {
    if (confirm(`Tem certeza que deseja excluir ${chatIds.length} conversa(s)?`)) {
      setChatHistory(prev => prev.filter(chat => !chatIds.includes(chat.id)));
      setSelectedChats(new Set());
      setShowActions(false);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora';
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `${diffInDays}d`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}sem`;
    
    return timestamp.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      today: 'Hoje',
      yesterday: 'Ontem',
      week: 'Esta semana',
      month: 'Este mês',
      older: 'Mais antigo'
    };
    return labels[category as keyof typeof labels] || category;
  };

  // Filter and group conversations
  const filteredHistory = chatHistory.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'bookmarked' && chat.isBookmarked) ||
                         (filterBy === 'archived' && chat.isArchived);
    
    return matchesSearch && matchesFilter;
  });

  const groupedHistory = filteredHistory.reduce((groups, chat) => {
    const category = chat.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push(chat);
    return groups;
  }, {} as Record<string, ChatHistory[]>);

  const categoryOrder = ['today', 'yesterday', 'week', 'month', 'older'];

  return (
    <>
      {/* Hamburger Button */}
      <button
        ref={buttonRef}
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-[300] w-12 h-12 bg-gray-800/90 hover:bg-gray-700 border border-gray-600 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 backdrop-blur-sm shadow-lg ${className}`}
        aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isOpen}
        style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
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
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-0 z-[200] h-full w-80 max-w-[85vw] bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 shadow-2xl transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gray-900/95 backdrop-blur-xl flex-shrink-0">
          {showActions ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedChats(new Set());
                  setShowActions(false);
                }}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <span className="text-sm text-gray-300">
                {selectedChats.size} selecionada(s)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <img 
                  src="/icon_trimmed_transparent_customcolor (1).png" 
                  alt="NexlaGPT" 
                  className="w-4 h-4 object-contain"
                />
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Conversas
              </h2>
            </div>
          )}

          {showActions && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleArchive(Array.from(selectedChats))}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Arquivar"
              >
                <Archive className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => handleDelete(Array.from(selectedChats))}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          )}
        </div>

        {!showActions && (
          <>
            {/* New Chat Button */}
            <div className="p-4 border-b border-gray-700/50 bg-gray-900/95 backdrop-blur-xl flex-shrink-0">
              <button
                onClick={handleNewChat}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl text-white transition-all duration-200 group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                <span className="font-medium">Nova Conversa</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="p-4 border-b border-gray-700/50 bg-gray-900/95 backdrop-blur-xl flex-shrink-0 space-y-3">
              {/* Search Bar */}
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
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterBy('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    filterBy === 'all' 
                      ? 'bg-cyan-500 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFilterBy('bookmarked')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
                    filterBy === 'bookmarked' 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <Star className="w-3 h-3" />
                  Favoritas
                </button>
                <button
                  onClick={() => setFilterBy('archived')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
                    filterBy === 'archived' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <Archive className="w-3 h-3" />
                  Arquivadas
                </button>
              </div>
            </div>
          </>
        )}

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="px-4 pb-4">
              {Object.keys(groupedHistory).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
                  </p>
                  {!searchQuery && (
                    <p className="text-xs mt-1">Inicie uma nova conversa</p>
                  )}
                </div>
              ) : (
                categoryOrder.map(category => {
                  const chats = groupedHistory[category];
                  if (!chats || chats.length === 0) return null;

                  return (
                    <div key={category} className="mb-6">
                      <div className="flex items-center gap-2 px-2 py-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {getCategoryLabel(category)}
                        </h3>
                        <div className="flex-1 h-px bg-gray-700"></div>
                      </div>

                      <div className="space-y-1">
                        {chats.map((chat) => (
                          <div
                            key={chat.id}
                            className={`relative group rounded-xl transition-all duration-200 ${
                              currentChatId === chat.id 
                                ? 'bg-cyan-500/10 border border-cyan-500/30' 
                                : 'hover:bg-gray-800/50'
                            } ${
                              selectedChats.has(chat.id) ? 'bg-blue-500/10 border border-blue-500/30' : ''
                            }`}
                          >
                            <button
                              onClick={() => handleChatSelect(chat.id)}
                              className="w-full flex flex-col gap-2 px-3 py-3 text-left transition-all duration-200"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <MessageSquare className={`w-4 h-4 flex-shrink-0 transition-colors ${
                                    currentChatId === chat.id ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-400'
                                  }`} />
                                  <div className="min-w-0 flex-1">
                                    <div className={`text-sm font-medium truncate ${
                                      currentChatId === chat.id ? 'text-cyan-300' : 'text-gray-300'
                                    }`}>
                                      {chat.title}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {chat.isBookmarked && (
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  )}
                                  {chat.isArchived && (
                                    <Archive className="w-3 h-3 text-purple-400" />
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {formatTimestamp(chat.timestamp)}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="ml-6 text-xs text-gray-500 truncate">
                                {chat.lastMessage}
                              </div>
                              
                              <div className="ml-6 flex items-center justify-between">
                                <span className="text-xs text-gray-600">
                                  {chat.messageCount} mensagens
                                </span>
                              </div>
                            </button>

                            {/* Action Menu */}
                            {!showActions && (
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="relative">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveDropdown(activeDropdown === chat.id ? null : chat.id);
                                    }}
                                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                                  >
                                    <MoreVertical className="w-4 h-4 text-gray-400" />
                                  </button>

                                  {activeDropdown === chat.id && (
                                    <div className="absolute right-0 top-full mt-1 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                                      <button
                                        onClick={(e) => handleBookmark(chat.id, e)}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                                      >
                                        {chat.isBookmarked ? (
                                          <BookmarkCheck className="w-4 h-4 text-yellow-400" />
                                        ) : (
                                          <Bookmark className="w-4 h-4" />
                                        )}
                                        {chat.isBookmarked ? 'Remover favorito' : 'Favoritar'}
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleArchive([chat.id]);
                                          setActiveDropdown(null);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                                      >
                                        <Archive className="w-4 h-4" />
                                        {chat.isArchived ? 'Desarquivar' : 'Arquivar'}
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete([chat.id]);
                                          setActiveDropdown(null);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700 transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        Excluir
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Return to Current Chat */}
        {currentChatId && !showActions && (
          <div className="p-4 border-t border-gray-700/50 bg-gray-900/95 backdrop-blur-xl flex-shrink-0">
            <button
              onClick={closeSidebar}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-500/20 hover:border-green-500/40 rounded-xl text-white transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Voltar ao Chat Atual</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}