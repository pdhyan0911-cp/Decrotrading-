export type UserRole = 'user' | 'admin' | 'moderator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  avatarUrl?: string;
  bio?: string;
  tradingStyle: 'Day Trader' | 'Swing Trader' | 'Scalper' | 'Position Trader' | 'Beginner Learner';
  isSuspended?: boolean;
  virtualBalance: number; // Starting $100,000
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessons: string[]; // lesson IDs
  completedCourses: string[]; // course IDs
  quizAttempts: {
    quizId: string;
    score: number;
    total: number;
    timestamp: string;
  }[];
  earnedBadges: string[]; // badge IDs
  dailyGoalXP: number;
  todayXP: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'practice' | 'streak' | 'challenge';
  xpReward: number;
  unlockedAt?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  readTimeMinutes: number;
  summary: string;
  content: string; // Markdown or rich HTML-like formatted text
  keyTakeaways: string[];
  visualDiagramType?: 'candlestick' | 'support_resistance' | 'risk_reward' | 'indicators' | 'order_book';
  quiz?: QuizQuestion[];
  order: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  description: string;
  learningObjectives: string[];
  estimatedHours: number;
  icon: string;
  modules: {
    id: string;
    title: string;
    lessons: Lesson[];
  }[];
  finalAssessment?: QuizQuestion[];
  prerequisiteCourseIds?: string[];
}

export interface Candle {
  time: number; // timestamp in seconds or ms
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketInstrument {
  symbol: string;
  name: string;
  assetClass: 'Equities' | 'Crypto' | 'Forex' | 'Commodities';
  currentPrice: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  baseCurrency: string;
  quoteCurrency: string;
  pipSize: number;
  description: string;
}

export type OrderType = 'market' | 'limit';
export type PositionSide = 'long' | 'short';
export type PositionStatus = 'open' | 'closed';

export interface Position {
  id: string;
  userId: string;
  symbol: string;
  side: PositionSide;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  openTimestamp: string;
  leverage: number; // usually 1x in virtual safe education, or up to 5x
  investedAmount: number;
}

export interface ClosedTrade {
  id: string;
  userId: string;
  symbol: string;
  side: PositionSide;
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  realizedPnl: number;
  realizedPnlPercent: number;
  openTimestamp: string;
  closeTimestamp: string;
  closeReason: 'manual' | 'take_profit' | 'stop_loss';
  riskRewardRatio?: number;
}

export interface TradeJournalEntry {
  id: string;
  userId: string;
  tradeId?: string;
  symbol: string;
  side: PositionSide;
  entryDate: string;
  pnl?: number;
  strategyUsed: string;
  emotionalState: 'Calm & Objective' | 'Disciplined' | 'Hesitant / Anxious' | 'FOMO / Impatient' | 'Overconfident';
  followedPlan: boolean;
  mistakeTags: string[];
  notes: string;
  aiFeedback?: string;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'candlestick' | 'chart_pattern' | 'bull_bear' | 'risk_management' | 'terminology' | 'daily' | 'strategy_reasoning';
  xpReward: number;
  timeLimitSeconds?: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface CommunityPost {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: UserRole;
  title: string;
  content: string;
  category: 'Strategy Analysis' | 'Learning Notes' | 'Risk Management' | 'Market Discussion' | 'Question';
  symbolTag?: string;
  likes: number;
  likedBy: string[]; // user IDs
  commentCount: number;
  comments: {
    id: string;
    userId: string;
    userName: string;
    content: string;
    timestamp: string;
  }[];
  isReported?: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'achievement' | 'practice' | 'course' | 'system';
  isRead: boolean;
  timestamp: string;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  verificationCode: string;
  scorePercent: number;
}
