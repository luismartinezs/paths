import React from 'react';
import { ActionCanvas } from './components/ActionCanvas';

interface AppProps {
  dbReady: boolean;
}

export const App: React.FC<AppProps> = ({ dbReady }) => {
  if (!dbReady) {
    return <div>Initializing database...</div>;
  }

  return (
    <div className="app">
      <h1>Action Network</h1>
      <ActionCanvas />
    </div>
  );
};
