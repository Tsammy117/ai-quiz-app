import axios from 'axios';
import { Question } from '../types'; 

interface AIQuestion {
  id: number,
  question: string;
  options: string[];
  correctAnswer: number;
}

export const generateQuizQuestions = async (topic: string): Promise<AIQuestion[]> => {
  const systemPrompt = `You are a quiz question generator. Generate exactly 5 multiple choice questions about "${topic}". 
  Return ONLY a valid JSON array (no other text) where each object has: 
  - question: string (the question text)
  - options: array of exactly 4 strings (A, B, C, D options)
  - correctAnswer: number (0-3 index of the correct option)
  
  Make questions engaging, educational, and suitable for general knowledge. Ensure the JSON is parseable and correctAnswer is always 0, 1, 2, or 3.`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Generate 5 MCQs about ${topic}`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': 'Bearer ',
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'AI Quiz App' 
        }
      }
    );

    const content = response.data.choices[0].message.content.trim();
    let jsonString = content;
    if (content.startsWith('```json')) {
      jsonString = content.replace(/```json\n?|\n?```/g, '').trim();
    } else if (content.startsWith('[')) {
    } else {
      throw new Error('AI response is not in expected JSON format');
    }

    const questions: AIQuestion[] = JSON.parse(jsonString);

    if (!Array.isArray(questions) || questions.length !== 5) {
      throw new Error('AI did not generate exactly 5 questions');
    }

    questions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
          typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
        throw new Error(`Invalid question format at index ${index}`);
      }
    });

    return questions.map((q, idx) => ({ ...q, id: idx + 1 }));
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    if (error instanceof Error && error.message.includes('Invalid response format')) {
      throw new Error('AI response was malformed. Please try a different topic.');
    }
    throw new Error('Failed to generate quiz questions. Check your API key and try again.');
  }
};

export const generateFeedback = async (
  topic: string, 
  score: number, 
  totalQuestions: number
): Promise<string> => {
  const prompt = `Generate encouraging, personalized feedback for a user who scored ${score} out of ${totalQuestions} on a ${topic} quiz.
  Be positive and constructive. If the score is low (<60%), offer encouragement and tips. If high (>=80%), praise and suggest advanced topics.
  Keep it to 2-3 sentences. Make it engaging and motivational.`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.8
      },
      {
        headers: {
          'Authorization': 'Bearer ',
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'AI Quiz App'
        }
      }
    ); 

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating feedback:', error);
    return `Great job completing the ${topic} quiz! You scored ${score}/${totalQuestions}. Keep learning and you'll improve even more.`;
  }
};
