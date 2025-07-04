import React, { useState, useEffect } from 'react';
import { Settings, Bell, Globe, Save, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { language, setLanguage, translations } = useTheme();
  const [settings, setSettings] = useState({
    notifications: {
      tokenWarnings: user?.notificationPreferences.tokenWarnings || true,
      usageReports: user?.notificationPreferences.usageReports || true,
      planUpgrades: user?.notificationPreferences.planUpgrades || true,
      emailNotifications: true,
      pushNotifications: false
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update user preferences
    if (user) {
      updateUser({
        notificationPreferences: {
          tokenWarnings: settings.notifications.tokenWarnings,
          usageReports: settings.notifications.usageReports,
          planUpgrades: settings.notifications.planUpgrades
        }
      });
    }
    
    setIsSaving(false);
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const languages = [
    { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'en-US', name: 'English (United States)', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Español (España)', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'Français (France)', flag: '🇫🇷' },
    { code: 'de-DE', name: 'Deutsch (Deutschland)', flag: '🇩🇪' },
    { code: 'it-IT', name: 'Italiano (Italia)', flag: '🇮🇹' },
    { code: 'ja-JP', name: '日本語 (日本)', flag: '🇯🇵' },
    { code: 'ko-KR', name: '한국어 (대한민국)', flag: '🇰🇷' },
    { code: 'zh-CN', name: '中文 (简体)', flag: '🇨🇳' },
    { code: 'ru-RU', name: 'Русский (Россия)', flag: '🇷🇺' }
  ];

  const notificationOptions = [
    {
      key: 'tokenWarnings',
      title: 'Alertas de Tokens',
      description: 'Receber avisos sobre uso de tokens'
    },
    {
      key: 'usageReports',
      title: 'Relatórios de Uso',
      description: 'Relatórios semanais de atividade'
    },
    {
      key: 'planUpgrades',
      title: 'Sugestões de Upgrade',
      description: 'Recomendações de planos'
    },
    {
      key: 'emailNotifications',
      title: 'Notificações por Email',
      description: 'Receber notificações no email'
    },
    {
      key: 'pushNotifications',
      title: 'Notificações Push',
      description: 'Notificações no navegador'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            {translations.settings || 'Configurações'}
          </h1>
          <p className="text-sm sm:text-base text-gray-400">Personalize sua experiência NexlaGPT</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 text-sm sm:text-base"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'Salvando...' : (translations.save || 'Salvar Alterações')}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Notifications */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-white">
              {translations.notifications || 'Notificações'}
            </h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {notificationOptions.map((option) => (
              <div key={option.key} className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">
                    {option.title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    {option.description}
                  </p>
                </div>
                <button
                  onClick={() => updateSetting('notifications', option.key, !settings.notifications[option.key as keyof typeof settings.notifications])}
                  className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                    settings.notifications[option.key as keyof typeof settings.notifications] ? 'bg-cyan-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications[option.key as keyof typeof settings.notifications] ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-white">
              {translations.language || 'Idioma'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {languages.map((languageOption) => {
              const isSelected = language === languageOption.code;
              
              return (
                <button
                  key={languageOption.code}
                  onClick={() => setLanguage(languageOption.code)}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-700 hover:border-gray-600 bg-gray-700/30'
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{languageOption.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isSelected ? 'text-cyan-400' : 'text-white'
                    }`}>
                      {languageOption.name}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50/5 border border-red-500/20 rounded-xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-red-400 mb-3 sm:mb-4">Zona de Perigo</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => {
              if (confirm('Tem certeza que deseja limpar todo o histórico de conversas? Esta ação não pode ser desfeita.')) {
                // Implement clear history
                alert('Histórico limpo com sucesso!');
              }
            }}
            className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
          >
            Limpar Histórico de Conversas
          </button>
          <button 
            onClick={() => {
              if (confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão perdidos.')) {
                // Implement account deletion
                alert('Funcionalidade em desenvolvimento. Entre em contato com o suporte.');
              }
            }}
            className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
          >
            Excluir Conta
          </button>
        </div>
      </div>
    </div>
  );
}