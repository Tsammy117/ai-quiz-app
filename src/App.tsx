import React, { useState } from 'react';
import TopicSelection from './components/TopicSelection';
import LoadingScreen from './components/LoadingScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import { generateQuizQuestions, generateFeedback } from './services/aiService';
import { Question, QuizData } from './types';  
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'topic' | 'loading' | 'quiz' | 'results'>('topic');
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  const handleTopicSelect = async (topic: string) => {
    setLoading(true);
    setError(null);
    setCurrentScreen('loading');
    
    try {
      const questions = await generateQuizQuestions(topic);
      setQuizData({ topic, questions });
      setUserAnswers(new Array(questions.length).fill(-1));
      setCurrentScreen('quiz');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz questions');
      setCurrentScreen('topic');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = async (answers: number[]) => {
    setLoading(true);
    setCurrentScreen('loading');
    
    try {
      const score = answers.filter((answer, index) => 
        answer === quizData?.questions[index]?.correctAnswer
      ).length;
      
      const feedbackMessage = await generateFeedback(
        quizData?.topic || '', 
        score, 
        quizData?.questions.length || 5
      );
      
      setFeedback(feedbackMessage);
      setCurrentScreen('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate feedback');
      setCurrentScreen('topic');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setQuizData(null);
    setUserAnswers([]);
    setFeedback('');
    setError(null);
    setCurrentScreen('topic');
  };

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={handleRestart} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {currentScreen === 'topic' && (
        <TopicSelection onTopicSelect={handleTopicSelect} />
      )}
      {currentScreen === 'loading' && (
          <LoadingScreen />
      )}
      {currentScreen === 'quiz' && quizData && (
        <QuizScreen
          quizData={quizData}
          userAnswers={userAnswers}
          onAnswerUpdate={setUserAnswers}
          onComplete={handleQuizComplete}
        />
      )}
      {currentScreen === 'results' && quizData && (
        <ResultsScreen
          quizData={quizData}
          userAnswers={userAnswers}
          feedback={feedback}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
