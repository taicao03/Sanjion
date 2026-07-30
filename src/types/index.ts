export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
export type QuestionType = 'THEORY' | 'MULTIPLE_CHOICE' | 'CODING_PRACTICE';
export type ProgressStatus = 'UNATTEMPTED' | 'ATTEMPTED' | 'SOLVED';
export type UserRole = 'OWNER' | 'ADMIN' | 'USER';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  orderIndex: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface QuizOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface TestCase {
  input: string;
  expected: any;
}

export interface Question {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  difficulty: DifficultyLevel;
  type: QuestionType;
  content: string;
  explanation: string;
  options?: QuizOption[];
  starterCode?: string;
  testCases?: TestCase[];
  points: number;
  viewCount: number;
  createdAt: string;
  tags?: string[];
}

export interface UserProgress {
  questionId: string;
  status: ProgressStatus;
  userAnswer?: string;
  score: number;
  attemptsCount: number;
  solvedAt?: string;
  lastAttemptAt: string;
  aiResult?: any;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  streakCount: number;
  lastActiveDate: string;
  targetLevel: 'Junior' | 'Mid-level' | 'Senior';
  totalPoints: number;
  role: UserRole;
  status?: 'ACTIVE' | 'BLOCKED';
  email?: string;
  provider?: 'google' | 'github' | 'email' | string;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  count: number;
}
