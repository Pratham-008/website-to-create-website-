import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import BuilderPage from './components/BuilderPage';
import { parseXml } from './steps';

export type AppState = 'landing' | 'builder';

function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('landing');
  const [prompt, setPrompt] = useState<string>('');

  const handlePromptSubmit = (userPrompt: string) => {
    setPrompt(userPrompt);
    setCurrentPage('builder');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
    setPrompt('');
  };

 

  return (
    <div className="min-h-screen bg-gray-900">
      {currentPage === 'landing' ? (
        <LandingPage onPromptSubmit={handlePromptSubmit} />
      ) : (
        <BuilderPage 
          prompt={prompt} 
          onBack={handleBackToLanding}
        />
      )}
    </div>
  );
}

export default App;