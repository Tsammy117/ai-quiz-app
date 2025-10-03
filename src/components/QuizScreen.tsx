import React, { useState } from 'react';
import { QuizData, Question } from '../types';

interface QuizScreenProps {
  quizData: QuizData;
  userAnswers: number[];
  onAnswerUpdate: (answers: number[]) => void;
  onComplete: (answers: number[]) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({
  quizData,
  userAnswers,
  onAnswerUpdate,
  onComplete
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion: Question = quizData.questions[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    onAnswerUpdate(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(userAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

  return (
    <div className="quiz-screen">
      <div className="quiz-header">
        <h1>{quizData.topic} Quiz</h1>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p>Question {currentQuestionIndex + 1} of {quizData.questions.length}</p>
      </div>

      <div className="question-container">
        <h2 className="question-text">{currentQuestion.question}</h2>
        
        <div className="options-list">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`option ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(index)}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="btn-secondary"
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          className="btn-primary"
        >
          {currentQuestionIndex === quizData.questions.length - 1 ? 'Finish Quiz' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default QuizScreen;