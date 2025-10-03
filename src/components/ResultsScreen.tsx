import React from 'react';
import { QuizData } from '../types';

interface ResultsScreenProps {
  quizData: QuizData;
  userAnswers: number[];
  feedback: string;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  quizData,
  userAnswers,
  feedback,
  onRestart
}) => {
  const score = userAnswers.filter((answer, index) => 
    answer === quizData.questions[index].correctAnswer
  ).length;

  const totalQuestions = quizData.questions.length;
  const percentage = (score / totalQuestions) * 100;

  return (
    <div className="results-screen">
      <div className="results-header">
        <h1>Quiz Results</h1>
        <p>Your performance on the {quizData.topic} quiz</p>
      </div>

      <div className="score-display">
        <div className="score-circle">
          <span className="score-text">{score}/{totalQuestions}</span>
          <span className="score-percentage">{Math.round(percentage)}%</span>
        </div>
      </div>

      <div className="feedback-section">
        <h2>AI Feedback</h2>
        <div className="feedback-text">
          {feedback}
        </div>
      </div>

      <div className="results-actions">
        <button onClick={onRestart} className="btn-primary">
          Take Another Quiz
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;