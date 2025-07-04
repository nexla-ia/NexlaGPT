import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Check, Star, Zap, Shield, Clock, Users, MessageSquare, BarChart3, Sparkles, ChevronDown, ChevronLeft, ChevronRight, User } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import ScrollReveal from '../components/animations/ScrollReveal';
import FadeInSection from '../components/animations/FadeInSection';
import AnimatedText from '../components/animations/AnimatedText';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [currentPlanIndex, setCurrentPlanIndex] = useState(1); // Start with Professional plan
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMoreTestimonials, setShowMoreTestimonials] = useState(false);
  const plansRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const planIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const testimonialIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Loading animation - 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const plans = [
    {
      id: 'inicial',
      name: 'Plano Inicial',
      price: 49,
      originalPrice: 89,
      discount: '45% OFF',
      description: 'Perfeito para começar',
      features: [
        'Tempo de resposta até 15s',
        'Suporte por email',
        'Histórico de conversas',
        'Dashboard básico'
      ],
      highlight: false,
      color: 'from-cyan-500 to-blue-500',
      locked: false // Plano inicial não bloqueado
    },
    {
      id: 'profissional',
      name: 'Plano Profissional',
      price: 149,
      originalPrice: 249,
      discount: '40% OFF',
      description: 'Mais popular para empresas',
      features: [
        'Tempo de resposta até 8s',
        'Suporte prioritário',
        'API de integração',
        'Relatórios avançados',
        'Backup automático',
        'Integração N8N premium'
      ],
      highlight: true,
      color: 'from-purple-500 to-pink-500',
      locked: true // Planos superiores bloqueados
    },
    {
      id: 'empresarial',
      name: 'Plano Empresarial',
      price: 399,
      originalPrice: 699,
      discount: '43% OFF',
      description: 'Para grandes volumes',
      features: [
        'Tempo de resposta até 3s',
        'Suporte 24/7',
        'API ilimitada',
        'Analytics avançados',
        'Múltiplos usuários',
        'SLA garantido',
        'Integração personalizada',
        'Gerente de conta dedicado'
      ],
      highlight: false,
      color: 'from-orange-500 to-red-500',
      locked: true // Planos superiores bloqueados
    }
  ];

  // Comentários atualizados - removendo empresa e economia
  const testimonials = [
    {
      name: 'Carlos Silva',
      role: 'CTO, TechStart',
      content: 'O NexlaGPT revolucionou nossa produtividade. A integração com N8N nos permitiu automatizar 80% dos nossos processos. Em apenas 3 meses, reduzimos o tempo de desenvolvimento em 60% e aumentamos a qualidade das entregas. A transparência nos custos é algo que nunca vimos antes no mercado.',
      rating: 5
    },
    {
      name: 'Ana Costa',
      role: 'Gerente de Produto, InnovaCorp',
      content: 'Transparência total nos custos e performance excepcional. O dashboard de monitoramento em tempo real nos permite otimizar o uso e prever custos futuros. Nossa equipe aumentou a produtividade em 45% desde a implementação.',
      rating: 4
    },
    {
      name: 'Roberto Lima',
      role: 'Fundador, StartupXYZ',
      content: 'A melhor relação custo-benefício do mercado. Suporte incrível e resultados que superam expectativas. Como startup, precisávamos de uma solução que crescesse conosco. O NexlaGPT oferece exatamente isso - escalabilidade sem surpresas financeiras.',
      rating: 3
    },
    {
      name: 'Marina Santos',
      role: 'Diretora de TI, MegaCorp',
      content: 'Implementamos o NexlaGPT em toda nossa operação e os resultados foram impressionantes. A redução de 70% no tempo de resposta ao cliente justificou o investimento em apenas 2 semanas.',
      rating: 5
    },
    {
      name: 'Pedro Oliveira',
      role: 'Head de Automação, AutoTech',
      content: 'A integração com N8N abriu possibilidades que nem imaginávamos. Automatizamos desde atendimento ao cliente até relatórios financeiros. O que antes levava dias, agora é feito em minutos.',
      rating: 4
    },
    {
      name: 'Julia Ferreira',
      role: 'CEO, DigitalFlow',
      content: 'Como CEO, preciso de soluções que entreguem resultados mensuráveis. O NexlaGPT não apenas entregou, como superou todas as expectativas. Nosso time de 50 pessoas agora produz como se fossem 80.',
      rating: 5
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'IA de Alto Desempenho',
      description: 'Modelo o4-mini otimizado para máxima eficiência e precisão em todas as respostas.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Transparência Total',
      description: 'Monitore cada token usado em tempo real. Sem surpresas, sem custos ocultos.',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Clock,
      title: 'Respostas Ultrarrápidas',
      description: 'Tempo de resposta médio de 3 segundos. Performance que acelera seu trabalho.',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics Avançados',
      description: 'Dashboard completo com insights de uso, eficiência e otimização de custos.',
      color: 'from-purple-400 to-pink-500'
    }
  ];

  const stats = [
    { number: '99.9%', label: 'Uptime Garantido', icon: Shield },
    { number: '3s', label: 'Tempo Médio de Resposta', icon: Clock },
    { number: '40%', label: 'Economia vs Concorrentes', icon: BarChart3 },
    { number: '24/7', label: 'Suporte Disponível', icon: Users }
  ];

  // Auto-scroll functionality for testimonials (desktop only) - 3 em 3
  useEffect(() => {
    if (window.innerWidth >= 1024) { // Desktop only
      testimonialIntervalRef.current = setInterval(() => {
        setCurrentTestimonialIndex(prev => {
          const nextIndex = prev + 3;
          return nextIndex >= testimonials.length ? 0 : nextIndex;
        });
      }, 4000); // 4 seconds

      return () => {
        if (testimonialIntervalRef.current) {
          clearInterval(testimonialIntervalRef.current);
        }
      };
    }
  }, [testimonials.length]);

  // Auto-scroll testimonials on desktop - 3 em 3
  useEffect(() => {
    if (window.innerWidth >= 1024 && testimonialsRef.current) {
      const container = testimonialsRef.current;
      const cardWidth = 384; // w-96 = 384px
      const gap = 24; // gap-6 = 24px
      const scrollLeft = currentTestimonialIndex * (cardWidth + gap);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [currentTestimonialIndex]);

  // Handle plan navigation for mobile
  const handlePlanScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (isScrolling) return;
    
    const container = event.currentTarget;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.offsetWidth;
    const newIndex = Math.round(scrollLeft / cardWidth);
    
    if (newIndex !== currentPlanIndex && newIndex >= 0 && newIndex < plans.length) {
      setCurrentPlanIndex(newIndex);
    }
  };

  const scrollToPlan = (index: number) => {
    if (!plansRef.current) return;
    
    setIsScrolling(true);
    const container = plansRef.current;
    const cardWidth = container.offsetWidth;
    
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
    
    setCurrentPlanIndex(index);
    
    setTimeout(() => setIsScrolling(false), 300);
  };

  // Desktop carousel navigation for testimonials - 3 em 3
  const nextTestimonial = () => {
    const nextIndex = currentTestimonialIndex + 3;
    const newIndex = nextIndex >= testimonials.length ? 0 : nextIndex;
    setCurrentTestimonialIndex(newIndex);
    
    // Reset auto-scroll timer
    if (testimonialIntervalRef.current) {
      clearInterval(testimonialIntervalRef.current);
      testimonialIntervalRef.current = setInterval(() => {
        setCurrentTestimonialIndex(prev => {
          const nextIdx = prev + 3;
          return nextIdx >= testimonials.length ? 0 : nextIdx;
        });
      }, 4000);
    }
  };

  const prevTestimonial = () => {
    const prevIndex = currentTestimonialIndex - 3;
    const newIndex = prevIndex < 0 ? Math.floor((testimonials.length - 1) / 3) * 3 : prevIndex;
    setCurrentTestimonialIndex(newIndex);
    
    // Reset auto-scroll timer
    if (testimonialIntervalRef.current) {
      clearInterval(testimonialIntervalRef.current);
      testimonialIntervalRef.current = setInterval(() => {
        setCurrentTestimonialIndex(prev => {
          const nextIdx = prev + 3;
          return nextIdx >= testimonials.length ? 0 : nextIdx;
        });
      }, 4000);
    }
  };

  // Auto-scroll to center plan on mount (mobile)
  useEffect(() => {
    if (isMobile && plansRef.current) {
      setTimeout(() => scrollToPlan(1), 100);
    }
  }, [isMobile]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (planIntervalRef.current) {
        clearInterval(planIntervalRef.current);
      }
      if (testimonialIntervalRef.current) {
        clearInterval(testimonialIntervalRef.current);
      }
    };
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl animate-pulse">
            <img 
              src="/icon_trimmed_transparent_customcolor (1).png" 
              alt="NexlaGPT" 
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
          </div>
          <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">NexlaGPT</h2>
          <p className="text-lg text-gray-400 animate-pulse">Carregando experiência premium...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      <AnimatedBackground />
      
      {/* Fixed Header - Mobile Optimized */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <img 
                  src="/icon_trimmed_transparent_customcolor (1).png" 
                  alt="NexlaGPT" 
                  className="w-4 h-4 lg:w-6 lg:h-6 object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  NexlaGPT
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">IA Premium com Transparência</p>
              </div>
            </div>
            
            <button
              onClick={onGetStarted}
              className="px-4 py-2 lg:px-6 lg:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 text-sm lg:text-base min-h-[44px] min-w-[44px] touch-manipulation"
            >
              Começar Agora
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Mobile First */}
      <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <AnimatedText 
              as="h1" 
              className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold mb-6 lg:mb-8 leading-tight"
              delay={0}
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                IA Premium
              </span>
              <br />
              <span className="text-white">
                com Transparência Total
              </span>
            </AnimatedText>
            
            <AnimatedText 
              as="p" 
              className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 lg:mb-12 max-w-4xl mx-auto leading-relaxed"
              delay={200}
            >
              Monitore cada token, otimize custos e acelere resultados com nossa IA de alto desempenho. 
              <span className="text-cyan-400 font-semibold"> 40% mais barato</span> que a concorrência.
            </AnimatedText>

            <ScrollReveal delay={400} direction="up">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 lg:mb-12">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25 text-lg min-h-[56px] touch-manipulation"
                >
                  <span className="flex items-center justify-center gap-2">
                    Começar Gratuitamente
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </button>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Sem cartão de crédito</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Stats Grid - Mobile Optimized */}
            <ScrollReveal delay={600}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-4xl mx-auto">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center p-4 lg:p-6 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                      <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-cyan-400 mx-auto mb-2 lg:mb-3" />
                      <div className="text-xl lg:text-3xl font-bold text-white mb-1">{stat.number}</div>
                      <div className="text-xs lg:text-sm text-gray-400">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Optimized */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
                Por que escolher o <span className="text-cyan-400">NexlaGPT</span>?
              </h2>
              <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
                Tecnologia de ponta com transparência que você nunca viu antes
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <ScrollReveal key={index} delay={index * 100} direction="up">
                  <div className="p-6 lg:p-8 bg-gray-800/50 rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
                    <div className={`w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 lg:mb-6 shadow-lg`}>
                      <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-white mb-3 lg:mb-4">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm lg:text-base">{feature.description}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section - Mobile Optimized with Navigation Buttons */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
                Planos que <span className="text-cyan-400">cabem no seu bolso</span>
              </h2>
              <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto mb-6">
                Transparência total, sem surpresas. Monitore cada centavo investido.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Promoção limitada - 40% OFF</span>
              </div>
            </div>
          </FadeInSection>

          {/* Desktop Grid - Static */}
          <div className="hidden md:block">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {plans.map((plan, index) => (
                <ScrollReveal key={plan.id} delay={index * 150} direction="up">
                  <div className={`relative p-6 lg:p-8 rounded-2xl border transition-all duration-300 hover:transform hover:scale-105 ${
                    plan.highlight 
                      ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 ring-2 ring-purple-500/20' 
                      : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50'
                  } backdrop-blur-sm ${plan.locked ? 'opacity-75' : ''}`}>
                    {plan.highlight && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                          Mais Popular
                        </div>
                      </div>
                    )}
                    
                    {plan.discount && (
                      <div className="absolute -top-2 -right-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          {plan.discount}
                        </div>
                      </div>
                    )}

                    {plan.locked && (
                      <div className="absolute inset-0 bg-gray-900/50 rounded-2xl flex items-center justify-center z-10">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-white font-semibold mb-2">Em Breve</p>
                          <p className="text-gray-400 text-sm">Disponível após cadastro</p>
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-6 lg:mb-8">
                      <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-gray-400 text-sm lg:text-base mb-4">{plan.description}</p>
                      
                      {!plan.locked && (
                        <div className="mb-4">
                          {plan.originalPrice && (
                            <div className="text-gray-500 line-through text-lg lg:text-xl mb-1">
                              R$ {plan.originalPrice}
                            </div>
                          )}
                          <div className="text-3xl lg:text-4xl font-bold text-white">
                            R$ {plan.price}
                            <span className="text-lg lg:text-xl text-gray-400 font-normal">/mês</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {!plan.locked && (
                      <>
                        <ul className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-3">
                              <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-300 text-sm lg:text-base">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={onGetStarted}
                          className={`w-full py-3 lg:py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm lg:text-base min-h-[48px] touch-manipulation ${
                            plan.highlight
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                              : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                          }`}
                        >
                          Começar Agora
                        </button>
                      </>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Mobile Carousel with Navigation Buttons - SEM INDICADORES */}
          <div className="md:hidden">
            <div className="relative">
              {/* Navigation Buttons - Subtle and Intuitive */}
              <button
                onClick={() => scrollToPlan(currentPlanIndex > 0 ? currentPlanIndex - 1 : plans.length - 1)}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-gray-800/80 hover:bg-gray-700 border border-gray-600/50 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 shadow-lg backdrop-blur-sm"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => scrollToPlan(currentPlanIndex < plans.length - 1 ? currentPlanIndex + 1 : 0)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-gray-800/80 hover:bg-gray-700 border border-gray-600/50 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 shadow-lg backdrop-blur-sm"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Carousel Container */}
              <div 
                ref={plansRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4 -mx-4 px-4"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
                onScroll={handlePlanScroll}
              >
                {plans.map((plan, index) => (
                  <div 
                    key={plan.id} 
                    className="flex-shrink-0 w-full snap-center"
                    style={{ width: 'calc(100vw - 2rem)' }}
                  >
                    <div className={`relative p-6 rounded-2xl border transition-all duration-300 h-full ${
                      plan.highlight 
                        ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 ring-2 ring-purple-500/20' 
                        : 'bg-gray-800/50 border-gray-700/50'
                    } backdrop-blur-sm ${plan.locked ? 'opacity-75' : ''}`}>
                      {plan.highlight && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                            Mais Popular
                          </div>
                        </div>
                      )}
                      
                      {plan.discount && (
                        <div className="absolute -top-2 -right-2">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            {plan.discount}
                          </div>
                        </div>
                      )}

                      {plan.locked && (
                        <div className="absolute inset-0 bg-gray-900/50 rounded-2xl flex items-center justify-center z-10">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Shield className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-white font-semibold mb-2">Em Breve</p>
                            <p className="text-gray-400 text-sm">Disponível após cadastro</p>
                          </div>
                        </div>
                      )}

                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                        
                        {!plan.locked && (
                          <div className="mb-4">
                            {plan.originalPrice && (
                              <div className="text-gray-500 line-through text-lg mb-1">
                                R$ {plan.originalPrice}
                              </div>
                            )}
                            <div className="text-3xl font-bold text-white">
                              R$ {plan.price}
                              <span className="text-lg text-gray-400 font-normal">/mês</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {!plan.locked && (
                        <>
                          <ul className="space-y-3 mb-6">
                            {plan.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start gap-3">
                                <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-300 text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          <button
                            onClick={onGetStarted}
                            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-sm min-h-[48px] touch-manipulation ${
                              plan.highlight
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                            }`}
                          >
                            Começar Agora
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* REMOVIDO: Discrete Indicators - não há mais indicadores */}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Desktop Carousel 3x3, Mobile Simple com botão "Saiba Mais" */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
                O que nossos <span className="text-cyan-400">clientes dizem</span>
              </h2>
              <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
                Resultados reais de empresas que confiam no NexlaGPT
              </p>
            </div>
          </FadeInSection>

          {/* Desktop Carousel with Navigation - 3 em 3 */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Navigation Buttons - Desktop Only */}
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-gray-800/80 hover:bg-gray-700 border border-gray-600 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-gray-800/80 hover:bg-gray-700 border border-gray-600 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Testimonials Carousel - 3 em 3 */}
              <div 
                ref={testimonialsRef}
                className="flex overflow-x-auto scrollbar-hide gap-6"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="flex-shrink-0 w-96">
                    <div className="p-6 lg:p-8 bg-gray-800/50 rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 backdrop-blur-sm h-full">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      
                      <p className="text-gray-300 mb-6 leading-relaxed text-sm lg:text-base">
                        "{testimonial.content}"
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 lg:w-6 lg:h-6 text-gray-300" />
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm lg:text-base">{testimonial.name}</div>
                          <div className="text-gray-400 text-xs lg:text-sm">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Indicators - Atualizado para 3 em 3 */}
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonialIndex(index * 3)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      Math.floor(currentTestimonialIndex / 3) === index
                        ? 'bg-cyan-400 scale-125' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet - Primeiros 2 comentários + botão "Saiba Mais" */}
          <div className="lg:hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.slice(0, showMoreTestimonials ? 6 : 2).map((testimonial, index) => (
                <ScrollReveal key={index} delay={index * 150} direction="up">
                  <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-gray-300 mb-6 leading-relaxed text-sm line-clamp-4">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-300" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                        <div className="text-gray-400 text-xs">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Botão "Saiba Mais" - aparece após os primeiros 2 comentários */}
            {!showMoreTestimonials && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowMoreTestimonials(true)}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 text-sm min-h-[48px] touch-manipulation"
                >
                  Saiba Mais
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center p-8 lg:p-12 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl border border-cyan-500/20 backdrop-blur-sm">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
                Pronto para <span className="text-cyan-400">revolucionar</span> sua produtividade?
              </h2>
              <p className="text-lg lg:text-xl text-gray-300 mb-8 lg:mb-10 max-w-2xl mx-auto">
                Junte-se a milhares de empresas que já economizam tempo e dinheiro com o NexlaGPT
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25 text-lg min-h-[56px] touch-manipulation"
                >
                  <span className="flex items-center justify-center gap-2">
                    Começar Gratuitamente
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </button>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Setup em 2 minutos</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer - CORRIGIDO COMPLETAMENTE */}
      <footer className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-800 bg-gray-900/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <img 
                  src="/icon_trimmed_transparent_customcolor (1).png" 
                  alt="NexlaGPT" 
                  className="w-5 h-5 lg:w-6 lg:h-6 object-contain"
                />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                NexlaGPT
              </h3>
            </div>
            
            <p className="text-gray-400 mb-8 text-sm lg:text-base max-w-2xl mx-auto">
              IA Premium com Transparência Total - Revolucionando a forma como você trabalha
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center text-sm text-gray-500 mb-8">
              <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
                <a href="#" className="hover:text-cyan-400 transition-colors">Privacidade</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">Termos</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">Suporte</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">Contato</a>
              </div>
            </div>
            
            {/* Copyright Section - TOTALMENTE CORRIGIDO */}
            <div className="border-t border-gray-800 pt-6">
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-center text-xs text-gray-600">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center text-center sm:text-left">
                  <span>© 2024 NexlaGPT. Todos os direitos reservados.</span>
                  <span className="hidden sm:inline text-gray-700">|</span>
                  <span>Desenvolvido com ❤️ no Brasil</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center text-center sm:text-right">
                  <span>CNPJ: 00.000.000/0001-00</span>
                  <span className="hidden sm:inline text-gray-700">|</span>
                  <span>v1.0.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}