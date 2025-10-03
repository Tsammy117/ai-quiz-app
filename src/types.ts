     export interface Question {
       id: number;
       question: string;
       options: string[];
       correctAnswer: number;
     }

     export interface QuizData {
       topic: string;
       questions: Question[];
     }
     