import React from 'react';
import ScrollReveal from '../animations/ScrollReveal';
import StaggeredReveal from '../animations/StaggeredReveal';
import FadeInSection from '../animations/FadeInSection';
import AnimatedGrid from '../animations/AnimatedGrid';
import AnimatedText from '../animations/AnimatedText';
import { Star, Zap, Shield, Target } from 'lucide-react';

export default function AnimationExamples() {
  const features = [
    { icon: Zap, title: 'Fast Performance', description: 'Lightning-fast responses' },
    { icon: Shield, title: 'Secure', description: 'Enterprise-grade security' },
    { icon: Target, title: 'Accurate', description: 'Precise AI responses' },
    { icon: Star, title: 'Reliable', description: '99.9% uptime guarantee' }
  ];

  const testimonials = [
    { name: 'John Doe', text: 'Amazing service!' },
    { name: 'Jane Smith', text: 'Highly recommended!' },
    { name: 'Bob Johnson', text: 'Excellent quality!' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 space-y-20">
      {/* Hero Section with Animated Text */}
      <section className="text-center py-20">
        <AnimatedText as="h1" className="text-5xl font-bold mb-6" delay={0}>
          Welcome to Our Platform
        </AnimatedText>
        <AnimatedText as="p" className="text-xl text-gray-300 max-w-2xl mx-auto" delay={200}>
          Experience the power of smooth animations that enhance user engagement
          and create delightful interactions.
        </AnimatedText>
      </section>

      {/* Features Grid with Staggered Animation */}
      <section className="py-20">
        <FadeInSection>
          <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
        </FadeInSection>
        
        <AnimatedGrid cols={4} staggerDelay={150}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-gray-800 p-6 rounded-xl text-center hover:bg-gray-700 transition-colors">
                <Icon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </AnimatedGrid>
      </section>

      {/* Individual Scroll Reveals with Different Directions */}
      <section className="py-20 space-y-12">
        <ScrollReveal direction="left" delay={0}>
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-8 rounded-xl border border-cyan-500/30">
            <h3 className="text-2xl font-bold mb-4">Slide from Left</h3>
            <p className="text-gray-300">This content slides in from the left when it enters the viewport.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={100}>
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-8 rounded-xl border border-purple-500/30">
            <h3 className="text-2xl font-bold mb-4">Slide from Right</h3>
            <p className="text-gray-300">This content slides in from the right with a slight delay.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200} distance={50}>
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-8 rounded-xl border border-green-500/30">
            <h3 className="text-2xl font-bold mb-4">Slide from Bottom</h3>
            <p className="text-gray-300">This content slides up from the bottom with increased distance.</p>
          </div>
        </ScrollReveal>
      </section>

      {/* Testimonials with Staggered Reveal */}
      <section className="py-20">
        <FadeInSection>
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        </FadeInSection>

        <StaggeredReveal
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          staggerDelay={200}
          direction="up"
          duration={800}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
              <p className="font-semibold">{testimonial.name}</p>
            </div>
          ))}
        </StaggeredReveal>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center">
        <ScrollReveal direction="up" delay={0} duration={800}>
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-12">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already experienced the power of our platform.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
              Get Started Now
            </button>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}