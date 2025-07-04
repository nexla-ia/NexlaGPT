import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onToggleMode: () => void;
}

export default function LoginForm({ onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState('demo@nexla.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Credenciais inválidas. Tente: demo@nexla.com / demo123');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <img 
            src="/icon_trimmed_transparent_customcolor (1).png" 
            alt="NexlaGPT" 
            className="w-10 h-10 object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta</h1>
        <p className="text-gray-400">Entre na sua conta NexlaGPT</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Sua senha"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <LogIn className="w-5 h-5" />
          )}
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Não tem uma conta?{' '}
          <button
            onClick={onToggleMode}
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Criar conta
          </button>
        </p>
      </div>

      <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <h3 className="text-sm font-medium text-white mb-2">Conta Demo:</h3>
        <p className="text-xs text-gray-400 mb-1">Email: demo@nexla.com</p>
        <p className="text-xs text-gray-400">Senha: demo123</p>
      </div>
    </div>
  );
}