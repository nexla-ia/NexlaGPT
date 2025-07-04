import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import AnimatedBackground from '../components/AnimatedBackground';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}