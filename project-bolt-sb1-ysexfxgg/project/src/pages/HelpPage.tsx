import React, { useState } from 'react';
import { HelpCircle, Search, Book, MessageCircle, Mail, Phone, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Como funciona o sistema de tokens?',
      answer: 'Os tokens são unidades de medida para o uso da IA. Cada mensagem consome tokens baseado no tamanho do texto. Você pode monitorar seu uso em tempo real no dashboard.'
    },
    {
      question: 'Posso fazer upgrade do meu plano a qualquer momento?',
      answer: 'Sim! Você pode fazer upgrade imediatamente. O valor será calculado proporcionalmente e você terá acesso instantâneo aos novos limites.'
    },
    {
      question: 'O que acontece se eu atingir o limite de tokens?',
      answer: 'Você receberá alertas antes de atingir o limite. Com o upgrade automático ativado, seu plano será atualizado automaticamente para evitar interrupções.'
    },
    {
      question: 'Como ativar o upgrade automático?',
      answer: 'Vá para Cobrança > Configurações e ative o "Upgrade Automático". Isso garantirá que você nunca fique sem tokens.'
    },
    {
      question: 'Posso cancelar minha assinatura?',
      answer: 'Sim, você pode cancelar a qualquer momento. Você continuará tendo acesso até o final do período pago.'
    }
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Chat ao Vivo',
      description: 'Suporte instantâneo via chat',
      action: 'Iniciar Chat',
      available: true
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Resposta em até 24 horas',
      action: 'Enviar Email',
      available: true
    },
    {
      icon: Phone,
      title: 'Telefone',
      description: 'Suporte por telefone',
      action: 'Ligar Agora',
      available: false
    }
  ];

  const resources = [
    {
      title: 'Guia de Início Rápido',
      description: 'Aprenda o básico em 5 minutos',
      link: '#'
    },
    {
      title: 'Documentação da API',
      description: 'Integre NexlaGPT em seus projetos',
      link: '#'
    },
    {
      title: 'Melhores Práticas',
      description: 'Otimize seu uso de tokens',
      link: '#'
    },
    {
      title: 'Vídeo Tutoriais',
      description: 'Aprenda visualmente',
      link: '#'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Central de Ajuda</h1>
        <p className="text-sm sm:text-base text-gray-400">Encontre respostas e obtenha suporte</p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar na central de ajuda..."
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Perguntas Frequentes</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-700/50 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700/30 transition-colors"
                  >
                    <span className="text-white font-medium text-sm sm:text-base">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedFaq === index && (
                    <div className="px-4 pb-4 text-gray-300 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="space-y-6">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Contato</h2>
            
            <div className="space-y-4">
              {contactOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <div key={index} className={`p-4 rounded-lg border ${
                    option.available 
                      ? 'border-gray-700/50 hover:border-cyan-500/50 cursor-pointer' 
                      : 'border-gray-700/30 opacity-50'
                  } transition-colors`}>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`w-5 h-5 ${option.available ? 'text-cyan-400' : 'text-gray-500'}`} />
                      <h3 className="font-medium text-white text-sm sm:text-base">{option.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{option.description}</p>
                    <button 
                      disabled={!option.available}
                      className={`text-sm font-medium ${
                        option.available 
                          ? 'text-cyan-400 hover:text-cyan-300' 
                          : 'text-gray-500 cursor-not-allowed'
                      } transition-colors`}
                    >
                      {option.action}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Recursos</h2>
            
            <div className="space-y-3">
              {resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.link}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/30 transition-colors group"
                >
                  <div>
                    <h3 className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-xs text-gray-400">{resource.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <h2 className="text-lg font-semibold text-white">Status do Sistema</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-green-400 font-semibold">API</div>
            <div className="text-sm text-gray-300">Operacional</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-semibold">IA Engine</div>
            <div className="text-sm text-gray-300">Operacional</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-semibold">Dashboard</div>
            <div className="text-sm text-gray-300">Operacional</div>
          </div>
        </div>
      </div>
    </div>
  );
}