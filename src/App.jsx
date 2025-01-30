import React, { useState } from 'react';
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import VideoRecorder from './components/VideoRecorder';
import UserDashboard from './components/UserDashboard';

function App() {
  const address = useAddress();
  const [activeTab, setActiveTab] = useState('record'); // 'record' or 'dashboard'

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">SensusAI</h1>
          <div className="flex items-center space-x-4">
            <ConnectWallet 
              theme="light"
              modalTitle="Connect Your Wallet"
              modalTitleIconUrl="/vite.svg"
              auth={{
                loginOptional: false,
                onLogin: () => {},
                onLogout: () => {},
              }}
            />
          </div>
        </div>
      </header>

      {address && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('record')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'record'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Record
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
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
          <h2 className="text-2xl font-semibold text-gray-700">
            Please connect your wallet to start recording
          </h2>
        </div>
      )}
    </div>
  );
}

export default App;