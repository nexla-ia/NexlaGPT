import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, ChevronRight, Plus, Search } from 'lucide-react';

interface NavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

export default function Navigation({ isOpen, onToggle, activeTab, onTabChange }: NavigationProps) {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
          },
          {
            id: '6',
            title: 'Otimização de performance',
            lastMessage: 'Excelente resultado!',
            timestamp: new Date(Date.now() - 518400000),
            messageCount: 7
          },
          {
            id: '7',
            title: 'Deploy em produção',
            lastMessage: 'Tudo funcionando perfeitamente.',
            timestamp: new Date(Date.now() - 604800000),
            messageCount: 9
          },
          {
            id: '8',
            title: 'Monitoramento de logs',
            lastMessage: 'Sistema implementado com sucesso.',
            timestamp: new Date(Date.now() - 691200000),
            messageCount: 11
          },
          {
            id: '9',
            title: 'Configuração de SSL',
            lastMessage: 'Certificado instalado com sucesso.',
            timestamp: new Date(Date.now() - 777600000),
            messageCount: 5
          },
          {
            id: '10',
            title: 'Backup automático',
            lastMessage: 'Rotina de backup configurada.',
            timestamp: new Date(Date.now() - 864000000),
            messageCount: 8
          },
          {
            id: '11',
            title: 'Integração com Slack',
            lastMessage: 'Notificações funcionando.',
            timestamp: new Date(Date.now() - 950400000),
            messageCount: 6
          },
          {
            id: '12',
            title: 'Dashboard personalizado',
            lastMessage: 'Métricas implementadas.',
            timestamp: new Date(Date.now() - 1036800000),
            messageCount: 14
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

  const handleNewChat = () => {
    window.dispatchEvent(new CustomEvent('new-chat'));
    onTabChange('chat');
  };

  const handleChatSelect = (chatId: string) => {
    window.dispatchEvent(new CustomEvent('select-chat', { detail: { chatId } }));
    onTabChange('chat');
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
      {/* Mobile/Tablet Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[50] 
                    block lg:hidden 
                    transition-all duration-300 ease-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onToggle}
      />

      {/* Sidebar */}
      <div className={`navigation-sidebar fixed left-0 top-0 h-full 
                       w-80 tablet:w-84 lg:w-80 xl:w-96 
                       bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 
                       z-[55] transition-all duration-300 ease-out will-change-transform ${
        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      } 
      lg:relative lg:translate-x-0 lg:shadow-none lg:z-auto 
      flex flex-col overflow-hidden`}>
        
        {/* Header - MANTIDO */}
        <div className="navigation-header flex items-center justify-between 
                        p-4 tablet:p-5 lg:p-5 
                        border-b border-gray-200 dark:border-gray-700 
                        bg-white dark:bg-gray-900 flex-shrink-0 
                        h-[68px] tablet:h-[76px] lg:h-[76px]">
          <div className="flex items-center gap-3 tablet:gap-4 lg:gap-4 min-w-0 flex-1">
            <div className="w-8 h-8 tablet:w-10 tablet:h-10 lg:w-10 lg:h-10 
                            bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 
                            rounded-xl flex items-center justify-center shadow-lg 
                            transition-transform duration-200 hover:scale-105 flex-shrink-0">
              <img 
                src="/icon_trimmed_transparent_customcolor (1).png" 
                alt="NexlaGPT" 
                className="w-4 h-4 tablet:w-5 tablet:h-5 lg:w-5 lg:h-5 object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg tablet:text-xl lg:text-xl font-bold 
                             bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 
                             bg-clip-text text-transparent truncate">NexlaGPT</h1>
            </div>
          </div>
        </div>

        {/* Content Area - REMOVIDOS os elementos solicitados */}
        <div className="navigation-content flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* REMOVIDO: New Chat Button */}
          {/* REMOVIDO: Search Bar */}
          {/* REMOVIDO: Chat History Header */}
          {/* REMOVIDO: Chat History List */}
        </div>
      </div>
    </>
  );
}