import React, { useState } from 'react';
import { User, Mail, Calendar, Shield, Edit3, Save, X, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      updateUser({
        name: formData.name,
        email: formData.email
      });
    }
    
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  if (!user) return null;

  const tokenPercentage = (user.tokensUsed / user.tokensLimit) * 100;
  const messagePercentage = (user.messagesUsed / user.messagesLimit) * 100;
  const daysRemaining = Math.ceil((user.subscriptionEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const StatBar = ({ 
    label, 
    value, 
    total, 
    percentage, 
    color, 
    unit = '' 
  }: { 
    label: string; 
    value: number; 
    total: number; 
    percentage: number; 
    color: string; 
    unit?: string; 
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs sm:text-sm font-medium text-gray-400">{label}</span>
        <span className="text-xs sm:text-sm font-bold text-white">
          {value.toLocaleString()}{unit} / {total.toLocaleString()}{unit}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2 sm:h-2.5">
        <div 
          className={`h-2 sm:h-2.5 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {percentage.toFixed(1)}% usado
        </span>
        <span className="text-xs text-gray-500">
          {(total - value).toLocaleString()}{unit} restantes
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Perfil</h1>
        <p className="text-sm sm:text-base text-gray-400">Gerencie suas informações pessoais</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white hover:bg-cyan-600 transition-colors">
                <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
            
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-sm sm:text-base text-gray-400 mb-4 break-all">{user.email}</p>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400 capitalize">
                Plano {user.plan}
              </span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Membro desde:</span>
                <span className="text-white">
                  {user.createdAt.toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Último acesso:</span>
                <span className="text-white">
                  {user.lastLogin.toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
              <h3 className="text-base sm:text-lg font-semibold text-white">Informações Pessoais</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors text-sm"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome Completo
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-white text-sm">{user.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-white text-sm break-all">{user.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Data de Criação
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-white text-sm">
                      {user.createdAt.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Plano Atual
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span className="text-white text-sm capitalize">{user.plan}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Estatísticas de Uso</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Tokens Usage */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-300">Uso de Tokens</h4>
            <StatBar
              label="Tokens Utilizados"
              value={user.tokensUsed}
              total={user.tokensLimit}
              percentage={tokenPercentage}
              color={tokenPercentage >= 90 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                     tokenPercentage >= 75 ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 
                     'bg-gradient-to-r from-cyan-500 to-blue-500'}
            />
          </div>

          {/* Messages Usage */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-300">Mensagens</h4>
            <StatBar
              label="Mensagens Enviadas"
              value={user.messagesUsed}
              total={user.messagesLimit}
              percentage={messagePercentage}
              color={messagePercentage >= 90 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                     messagePercentage >= 75 ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 
                     'bg-gradient-to-r from-blue-500 to-purple-500'}
            />
          </div>

          {/* Efficiency */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-300">Eficiência</h4>
            <StatBar
              label="Otimização de Uso"
              value={92}
              total={100}
              percentage={92}
              color="bg-gradient-to-r from-green-500 to-emerald-500"
              unit="%"
            />
          </div>

          {/* Subscription Days */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-300">Assinatura</h4>
            <StatBar
              label="Dias Restantes"
              value={daysRemaining}
              total={30}
              percentage={(daysRemaining / 30) * 100}
              color={daysRemaining <= 7 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                     daysRemaining <= 14 ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 
                     'bg-gradient-to-r from-purple-500 to-pink-500'}
              unit=" dias"
            />
          </div>
        </div>
      </div>
    </div>
  );
}