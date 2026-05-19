
export enum SectionType {
  INTRODUCTION = 'introduction',
  PRACTICE_SELECTION = 'practice_selection',
  SENTENCE_BUILDING = 'sentence_building',
  RESULTS = 'results'
}

export interface SentenceQuestion {
  id: number;
  context: string;
  scrambledWords: string[];
  correctAnswer: string;
  prefix?: string;
  suffix?: string;
  fixedWords?: Record<number, string>;
  explanation?: string;
  correctSegmentCount?: number;
}

export interface Feedback {
  score: number;
  levelDescription: string;
  strengths: string[];
  weaknesses: string[];
  corrections: string[];
  overallComments: string;
}
