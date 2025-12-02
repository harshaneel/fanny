import React, { useState } from 'react';
import { Chat } from './components/Chat';
import { Settings } from './components/Settings';

type Tab = 'chat' | 'settings';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Fanny – Local Finance Copilot</h1>
        <nav className="tabs">
          <button
            className={activeTab === 'chat' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          <button
            className={activeTab === 'settings' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
      </header>
      <main className="app-main">
        {activeTab === 'chat' ? <Chat /> : <Settings />}
      </main>
    </div>
  );
};


