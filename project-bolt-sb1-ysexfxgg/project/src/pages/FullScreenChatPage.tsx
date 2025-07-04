import React, { useState, useCallback } from 'react';
import FullScreenChatLayout from '../components/layout/FullScreenChatLayout';
import ChatInterface from '../components/ChatInterface';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function FullScreenChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string>('current-chat');

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: generateMessageId(),
      content,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    try {
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      const responses = [
        "Entendo sua pergunta! Vou ajudá-lo com isso. Baseado no que você mencionou, posso sugerir algumas abordagens diferentes para resolver esse problema de forma eficiente.",
        "Essa é uma excelente questão! Deixe-me explicar de forma detalhada como você pode abordar isso da melhor maneira possível, considerando as melhores práticas.",
        "Perfeito! Vou te dar uma resposta completa sobre isso. Há várias considerações importantes que devemos levar em conta para garantir o melhor resultado.",
        "Ótima pergunta! Posso te ajudar com isso de várias formas. Vamos começar com o básico e depois aprofundar nos detalhes mais técnicos.",
        "Interessante! Essa é uma área que tem muitas nuances. Vou explicar passo a passo para que você tenha uma compreensão clara e possa implementar com confiança."
      ];

      const assistantMessage: Message = {
        id: generateMessageId(),
        content: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(`chat-${Date.now()}`);
  };

  const handleChatSelect = (chatId: string) => {
    // In a real app, this would load the selected chat's messages
    console.log('Loading chat:', chatId);
    setCurrentChatId(chatId);
    
    // Simulate loading different chat content
    const mockMessages: Message[] = [
      {
        id: 'mock-1',
        content: 'Esta é uma conversa anterior que foi carregada.',
        isUser: true,
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: 'mock-2',
        content: 'Sim, posso ver o histórico da nossa conversa anterior. Como posso ajudá-lo hoje?',
        isUser: false,
        timestamp: new Date(Date.now() - 3500000)
      }
    ];
    
    setMessages(mockMessages);
  };

  return (
    <FullScreenChatLayout 
      onNewChat={handleNewChat}
      onChatSelect={handleChatSelect}
      currentChatId={currentChatId}
    >
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </FullScreenChatLayout>
  );
}