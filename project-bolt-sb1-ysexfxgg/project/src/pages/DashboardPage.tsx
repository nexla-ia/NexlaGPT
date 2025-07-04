import React, { useState, useCallback } from 'react';
import ChatInterface from '../components/ChatInterface';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateMessageId = () => msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)};

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
        "Entendo sua pergunta! Vou ajudá-lo com isso. Baseado no que você mencionou, posso sugerir algumas abordagens diferentes para resolver esse problema.",
        "Essa é uma excelente questão! Deixe-me explicar de forma detalhada como você pode abordar isso da melhor maneira possível.",
        "Perfeito! Vou te dar uma resposta completa sobre isso. Há várias considerações importantes que devemos levar em conta.",
        "Ótima pergunta! Posso te ajudar com isso de várias formas. Vamos começar com o básico e depois aprofundar nos detalhes.",
        "Interessante! Essa é uma área que tem muitas nuances. Vou explicar passo a passo para que você tenha uma compreensão clara."
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

  return (
    <div className="h-screen">
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}