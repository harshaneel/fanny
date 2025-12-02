import React, { useEffect, useState } from 'react';

type Config = {
  documentsDir: string | null;
};

export const Settings: React.FC = () => {
  const [config, setConfig] = useState<Config | null>(null);
  const [inputDir, setInputDir] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (!res.ok) throw new Error('Failed to load config');
        const data: Config = await res.json();
        setConfig(data);
        setInputDir(data.documentsDir ?? '');
      } catch {
        setStatus('Could not load config from backend.');
      }
    };

    void loadConfig();
  }, []);

  const save = async () => {
    setStatus(null);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentsDir: inputDir }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error ?? 'Failed to save config');
        return;
      }
      setConfig(data);
      setStatus('Saved documents directory.');
    } catch {
      setStatus('Error saving config. Is backend running on port 3001?');
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <p>
        Choose the directory where your financial statements (PDF/CSV/etc.) will be stored. The app
        will treat files in that directory as “uploaded” documents and process them locally.
      </p>
      <label className="field">
        <span>Documents directory (absolute path)</span>
        <input
          type="text"
          value={inputDir}
          onChange={(e) => setInputDir(e.target.value)}
          placeholder="/Users/you/Documents/finance-statements"
        />
      </label>
      <button onClick={() => void save()}>Save</button>
      {config?.documentsDir && (
        <p className="current-dir">
          Current directory: <code>{config.documentsDir}</code>
        </p>
      )}
      {status && <p className="status">{status}</p>}
    </div>
  );
};


