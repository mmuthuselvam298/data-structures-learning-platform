export type ViewMode = 
  | 'home'
  | 'learn'
  | 'lab'
  | 'practice'
  | 'quiz'
  | 'code'
  | 'progress'
  | 'resources'
  | 'glossary';

export type VisualizerId =
  | 'stack'
  | 'queue'
  | 'circular_queue'
  | 'array'
  | 'linked_list'
  | 'tree_bst'
  | 'tree_avl'
  | 'graph'
  | 'sorting'
  | 'searching'
  | 'hashing';

export interface ComplexityInfo {
  timeBest?: string;
  timeAverage?: string;
  timeWorst?: string;
  space?: string;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'predict_output' | 'complexity' | 'true_false';
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanationWhy: string;
  examSource?: string; // e.g., "SRM-AP Mid-Term 2025" or "SRM-AP End-Term 2025"
}

export interface Challenge {
  id: string;
  title: string;
  visualizerId: VisualizerId;
  description: string;
  taskGoal: string;
  instructions: string[];
  initialState?: any;
  validationCheck: (history: any[], currentState: any) => { success: boolean; feedback: string };
  hint: string;
  xpReward: number;
  examSource?: string;
}

export interface LessonContent {
  id: string;
  unitId: number;
  unitTitle: string;
  title: string;
  shortDescription: string;
  whatIsIt: string;
  whyDoWeNeedIt: string;
  realWorldAnalogy: {
    title: string;
    description: string;
    icon: string;
  };
  howDoesItWork: string[];
  visualizerId?: VisualizerId;
  operations: {
    name: string;
    description: string;
    timeComplexity: string;
    cCodeSnippet: string;
  }[];
  cImplementationFull: string;
  complexity: ComplexityInfo;
  commonMistakes: {
    mistake: string;
    whyItHappens: string;
    solution: string;
  }[];
  quizzes: QuizQuestion[];
  examQuestions: {
    year: string;
    marks: number;
    question: string;
    solutionOutline: string;
  }[];
}

export interface UnitInfo {
  id: number;
  title: string;
  badge: string;
  accentColor: string;
  description: string;
  lessons: LessonContent[];
  downloadFileName: string;
}

export interface UserProgress {
  completedLessons: string[];
  completedChallenges: string[];
  passedQuizzes: string[];
  xp: number;
  streakDays: number;
  unlockedBadges: string[];
}

export interface GlossaryTerm {
  term: string;
  unit: string;
  simpleDefinition: string;
  technicalDefinition: string;
  example: string;
  relatedTerms: string[];
}
