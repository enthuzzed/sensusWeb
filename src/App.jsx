import React, { useState } from 'react';
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import VideoRecorder from './components/VideoRecorder';
import UserDashboard from './components/UserDashboard';
import { useTheme } from './context/ThemeContext';
import logoLight from './assets/logo-light.png';
import logoDark from './assets/logo-dark.png';

function App() {
  const address = useAddress();
  const [activeTab, setActiveTab] = useState('record'); // 'record' or 'dashboard'
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 dark:from-indigo-900 dark:via-purple-900 dark:to-blue-900 transition-colors duration-200">
      {/* Dynamic vector background */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" className="text-gray-600 dark:text-white"/>
              <circle cx="18" cy="18" r="1" fill="currentColor" className="text-gray-600 dark:text-white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Main content with padding-bottom for footer */}
      <div className="relative z-10 pb-16">
        <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg transition-colors duration-200">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img 
                src={theme === 'dark' ? logoDark : logoLight} 
                alt="SensusAI Logo" 
                className="h-12 w-auto transition-opacity duration-200" 
              />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SensusAI</h1>
            </div>
            <ConnectWallet 
              theme={theme}
              modalTitle="Connect Your Wallet"
              modalTitleIconUrl="/vite.svg"
              auth={{
                loginOptional: false,
                onLogin: () => {},
                onLogout: () => {},
              }}
            />
          </div>
        </header>

        {address && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('record')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'record'
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Record
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Dashboard
              </button>
            </div>
            
            {activeTab === 'record' ? (
              <VideoRecorder />
            ) : (
              <UserDashboard />
            )}
          </div>
        )}

        {!address && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
              Please connect your wallet to start recording
            </h2>
          </div>
        )}

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              © 2025 SensusAI. All rights reserved.
            </p>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-mina hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
                  </svg>
                  <span className="text-sm">Light Mode</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                  </svg>
                  <span className="text-sm">Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;