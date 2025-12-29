import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { SnakeGame } from './components/SnakeGame';
import { Ranking } from './components/Ranking';
import { UserProfile } from './types';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<'LOGIN' | 'GAME' | 'RANKING'>('LOGIN');
  // Default to dark mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    setView('GAME');
  };

  const handleLogout = () => {
    setUser(null);
    setView('LOGIN');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen transition-colors duration-300 bg-gray-100 text-gray-900 dark:bg-[#0a0a0f] dark:text-gray-100 font-sans">
        {view === 'LOGIN' && (
          <LoginForm 
            onLogin={handleLogin} 
            onShowRanking={() => setView('RANKING')}
            isDarkMode={isDarkMode} 
            toggleTheme={toggleTheme} 
          />
        )}
        
        {view === 'GAME' && user && (
          <SnakeGame 
            user={user} 
            onLogout={handleLogout} 
            isDarkMode={isDarkMode} 
            toggleTheme={toggleTheme} 
          />
        )}

        {view === 'RANKING' && (
          <Ranking 
            onBack={() => setView('LOGIN')} 
          />
        )}
      </div>
    </div>
  );
}