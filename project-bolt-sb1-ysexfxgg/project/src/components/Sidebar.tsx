import React, { useState } from 'react';
import { MessageSquare, Plus, Settings, User, LogOut, Menu, X, Zap, Database } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
}

export default function Sidebar({ isOpen, onToggle, onNewChat }: SidebarProps) {
  const [chatHistory] = useState<ChatHistory[]>([
    { id: '1', title: 'Como integrar N8N com APIs', timestamp: new Date(Date.now() - 86400000) },
    { id: '2', title: 'Automatização de workflows', timestamp: new Date(Date.now() - 172800000) },
    { id: '3', title: 'Análise de dados em tempo real', timestamp: new Date(Date.now() - 259200000) },
  ]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <img 
                src="/icon_trimmed_transparent_customcolor (1).png" 
                alt="Nexla GPT" 
                className="w-5 h-5 object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-white">Nexla GPT</h1>
          </div>
          <button
            onClick={onToggle}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl text-white transition-all duration-200 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            <span className="font-medium">Nova Conversa</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Conversas Recentes</h3>
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0 text-gray-500 group-hover:text-cyan-400" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{chat.title}</div>
                    <div className="text-xs text-gray-500">
                      {chat.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* N8N Integration Section */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Integrações</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 group">
                <Zap className="w-4 h-4 flex-shrink-0 text-orange-400" />
                <div className="flex-1">
                  <div className="text-sm font-medium">N8N Workflows</div>
                  <div className="text-xs text-gray-500">Configurar automações</div>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 group">
                <Database className="w-4 h-4 flex-shrink-0 text-green-400" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Conectores</div>
                  <div className="text-xs text-gray-500">APIs e serviços</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700/50 p-4">
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Configurações</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200">
              <User className="w-4 h-4" />
              <span className="text-sm">Perfil</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200">
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}