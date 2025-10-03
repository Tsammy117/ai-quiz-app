import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="spinner"></div>
        <h2>Generating Your Quiz</h2>
        <p>AI is creating personalized questions for you...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;