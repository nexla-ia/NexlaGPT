import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'dark';
  language: string;
  setTheme: (theme: 'dark') => void;
  setLanguage: (language: string) => void;
  translations: Record<string, string>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

// Translations object
const translations: Record<string, Record<string, string>> = {
  'pt-BR': {
    'welcome': 'Bem-vindo',
    'settings': 'Configurações',
    'profile': 'Perfil',
    'billing': 'Cobrança',
    'help': 'Ajuda',
    'logout': 'Sair',
    'save': 'Salvar',
    'cancel': 'Cancelar',
    'edit': 'Editar',
    'language': 'Idioma',
    'notifications': 'Notificações'
  },
  'en-US': {
    'welcome': 'Welcome',
    'settings': 'Settings',
    'profile': 'Profile',
    'billing': 'Billing',
    'help': 'Help',
    'logout': 'Logout',
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'language': 'Language',
    'notifications': 'Notifications'
  },
  'es-ES': {
    'welcome': 'Bienvenido',
    'settings': 'Configuración',
    'profile': 'Perfil',
    'billing': 'Facturación',
    'help': 'Ayuda',
    'logout': 'Cerrar sesión',
    'save': 'Guardar',
    'cancel': 'Cancelar',
    'edit': 'Editar',
    'language': 'Idioma',
    'notifications': 'Notificaciones'
  },
  'fr-FR': {
    'welcome': 'Bienvenue',
    'settings': 'Paramètres',
    'profile': 'Profil',
    'billing': 'Facturation',
    'help': 'Aide',
    'logout': 'Déconnexion',
    'save': 'Enregistrer',
    'cancel': 'Annuler',
    'edit': 'Modifier',
    'language': 'Langue',
    'notifications': 'Notifications'
  },
  'de-DE': {
    'welcome': 'Willkommen',
    'settings': 'Einstellungen',
    'profile': 'Profil',
    'billing': 'Abrechnung',
    'help': 'Hilfe',
    'logout': 'Abmelden',
    'save': 'Speichern',
    'cancel': 'Abbrechen',
    'edit': 'Bearbeiten',
    'language': 'Sprache',
    'notifications': 'Benachrichtigungen'
  },
  'it-IT': {
    'welcome': 'Benvenuto',
    'settings': 'Impostazioni',
    'profile': 'Profilo',
    'billing': 'Fatturazione',
    'help': 'Aiuto',
    'logout': 'Disconnetti',
    'save': 'Salva',
    'cancel': 'Annulla',
    'edit': 'Modifica',
    'language': 'Lingua',
    'notifications': 'Notifiche'
  },
  'ja-JP': {
    'welcome': 'ようこそ',
    'settings': '設定',
    'profile': 'プロフィール',
    'billing': '請求',
    'help': 'ヘルプ',
    'logout': 'ログアウト',
    'save': '保存',
    'cancel': 'キャンセル',
    'edit': '編集',
    'language': '言語',
    'notifications': '通知'
  },
  'ko-KR': {
    'welcome': '환영합니다',
    'settings': '설정',
    'profile': '프로필',
    'billing': '결제',
    'help': '도움말',
    'logout': '로그아웃',
    'save': '저장',
    'cancel': '취소',
    'edit': '편집',
    'language': '언어',
    'notifications': '알림'
  },
  'zh-CN': {
    'welcome': '欢迎',
    'settings': '设置',
    'profile': '个人资料',
    'billing': '账单',
    'help': '帮助',
    'logout': '登出',
    'save': '保存',
    'cancel': '取消',
    'edit': '编辑',
    'language': '语言',
    'notifications': '通知'
  },
  'ru-RU': {
    'welcome': 'Добро пожаловать',
    'settings': 'Настройки',
    'profile': 'Профиль',
    'billing': 'Оплата',
    'help': 'Помощь',
    'logout': 'Выйти',
    'save': 'Сохранить',
    'cancel': 'Отмена',
    'edit': 'Редактировать',
    'language': 'Язык',
    'notifications': 'Уведомления'
  }
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme] = useState<'dark'>('dark'); // Always dark theme - no option to change
  const [language, setLanguageState] = useState('pt-BR');

  // Load saved language on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('nexla-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.interface?.language) {
          setLanguageState(settings.interface.language);
        }
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    }
  }, []);

  // Force dark theme on DOM - no light mode option
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
    
    // Force dark background
    document.body.style.backgroundColor = '#111827';
    document.body.style.color = '#ffffff';
  }, []);

  const setTheme = () => {
    // Theme is always dark, so this function does nothing
    console.log('Theme is fixed to dark mode');
  };

  const setLanguage = (newLanguage: string) => {
    setLanguageState(newLanguage);
    
    // Save to localStorage
    const savedSettings = localStorage.getItem('nexla-settings');
    let settings = {};
    
    if (savedSettings) {
      try {
        settings = JSON.parse(savedSettings);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
    
    const updatedSettings = {
      ...settings,
      interface: {
        ...(settings as any)?.interface,
        language: newLanguage
      }
    };
    
    localStorage.setItem('nexla-settings', JSON.stringify(updatedSettings));
  };

  const currentTranslations = translations[language] || translations['pt-BR'];

  const value: ThemeContextType = {
    theme,
    language,
    setTheme,
    setLanguage,
    translations: currentTranslations
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}