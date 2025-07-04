import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import FullScreenChatPage from './pages/FullScreenChatPage';
import BillingPage from './pages/BillingPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import HelpPage from './pages/HelpPage';
import Header from './components/layout/Header';
import AnimatedBackground from './components/AnimatedBackground';
import BackToTopButton from './components/BackToTopButton';

function AppContent() {
  const { user, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');
  const [showAuth, setShowAuth] = useState(false);

  // Listen for navigation events from header and profile menu
  useEffect(() => {
    const handleNavigateToSettings = () => setActiveTab('settings');
    const handleNavigateToProfile = () => setActiveTab('profile');
    const handleNavigateToBilling = () => setActiveTab('billing');
    const handleNavigateToHelp = () => setActiveTab('help');
    const handleNavigateToActivity = () => {
      setActiveTab('chat');
    };
    const handleLogout = () => logout();

    window.addEventListener('navigate-to-settings', handleNavigateToSettings);
    window.addEventListener('navigate-to-profile', handleNavigateToProfile);
    window.addEventListener('navigate-to-billing', handleNavigateToBilling);
    window.addEventListener('navigate-to-help', handleNavigateToHelp);
    window.addEventListener('navigate-to-activity', handleNavigateToActivity);
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('navigate-to-settings', handleNavigateToSettings);
      window.removeEventListener('navigate-to-profile', handleNavigateToProfile);
      window.removeEventListener('navigate-to-billing', handleNavigateToBilling);
      window.removeEventListener('navigate-to-help', handleNavigateToHelp);
      window.removeEventListener('navigate-to-activity', handleNavigateToActivity);
      window.removeEventListener('logout', handleLogout);
    };
  }, [logout]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
            <img 
              src="/icon_trimmed_transparent_customcolor (1).png" 
              alt="NexlaGPT" 
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
          </div>
          <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">NexlaGPT</h2>
          <p className="text-sm text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show landing page if user is not authenticated and hasn't clicked to show auth
  if (!user && !showAuth) {
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  // Show auth page if user is not authenticated but has clicked to get started
  if (!user && showAuth) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'billing':
        return <BillingPage />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'help':
        return <HelpPage />;
      case 'chat':
      default:
        return <FullScreenChatPage />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'billing':
        return 'Cobrança';
      case 'settings':
        return 'Configurações';
      case 'profile':
        return 'Perfil';
      case 'help':
        return 'Ajuda';
      case 'chat':
      default:
        return 'NexlaGPT';
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <AnimatedBackground />
      
      {/* Layout Container - Full Width */}
      <div className="flex w-full min-h-screen relative">
        {/* Main Content Area - Full Width */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {activeTab === 'chat' ? (
            // Full-screen chat interface
            <div className="w-full h-screen">
              {renderContent()}
            </div>
          ) : (
            // Other pages with header and scrollable content
            <>
              <Header 
                onToggleSidebar={() => {}} // Empty function since no sidebar
                title={getPageTitle()}
              />
              <main className="flex-1 relative pt-[68px] tablet:pt-[76px] lg:pt-[76px] overflow-y-auto">
                <div className="p-4 sm:p-6 pb-safe lg:pb-32">
                  {renderContent()}
                </div>
              </main>
            </>
          )}
        </div>
      </div>

      {/* Back to Top Button - Only for non-chat pages */}
      {activeTab !== 'chat' && <BackToTopButton />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;