import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  User,
  Position,
  ClosedTrade,
  TradeJournalEntry,
  CommunityPost,
  NotificationItem,
  Certificate
} from '../types';
import { BADGES_DATA } from '../data/coursesData';

interface StoredUser extends User {
  passwordHash: string;
  salt: string;
}

interface DatabaseSchema {
  users: StoredUser[];
  sessions: { token: string; userId: string; expiresAt: number }[];
  positions: Position[];
  closedTrades: ClosedTrade[];
  journalEntries: TradeJournalEntry[];
  communityPosts: CommunityPost[];
  notifications: NotificationItem[];
  certificates: Certificate[];
  challengeLeaderboards: {
    challengeId: string;
    userId: string;
    userName: string;
    score: number;
    total: number;
    accuracyPercent: number;
    timeSpentSeconds: number;
    timestamp: string;
  }[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function initDefaultDatabase(): DatabaseSchema {
  const adminSalt = generateSalt();
  const traderSalt = generateSalt();

  const adminUser: StoredUser = {
    id: 'user-admin',
    name: 'DecroTrade Chief Admin',
    email: 'admin@decrotrade.com',
    passwordHash: hashPassword('DecroAdmin2026!', adminSalt),
    salt: adminSalt,
    role: 'admin',
    createdAt: '2026-01-10T10:00:00.000Z',
    tradingStyle: 'Position Trader',
    bio: 'Lead market structure researcher and educational curriculum director at DecroTrade.',
    virtualBalance: 100000,
    xp: 7500,
    level: 8,
    streakDays: 14,
    lastActiveDate: new Date().toISOString(),
    completedLessons: ['les-1-1-1', 'les-1-1-2', 'les-2-1-1', 'les-2-1-2', 'les-7-1-1'],
    completedCourses: ['course-1', 'course-2'],
    quizAttempts: [
      { quizId: 'q-1-1-1', score: 2, total: 2, timestamp: '2026-10-12T14:20:00.000Z' },
      { quizId: 'q-2-1-1', score: 2, total: 2, timestamp: '2026-10-13T09:15:00.000Z' }
    ],
    earnedBadges: ['badge-first-step', 'badge-quiz-ace', 'badge-risk-architect', 'badge-course-grad'],
    dailyGoalXP: 100,
    todayXP: 75
  };

  const demoTrader: StoredUser = {
    id: 'user-trader',
    name: 'Alex Vance',
    email: 'trader@decrotrade.com',
    passwordHash: hashPassword('TraderPass123!', traderSalt),
    salt: traderSalt,
    role: 'user',
    createdAt: '2026-02-01T12:00:00.000Z',
    tradingStyle: 'Swing Trader',
    bio: 'Disciplined student focusing on multi-timeframe price action and strict 1% account risk.',
    virtualBalance: 102450.50,
    xp: 1850,
    level: 3,
    streakDays: 4,
    lastActiveDate: new Date().toISOString(),
    completedLessons: ['les-1-1-1', 'les-1-1-2', 'les-2-1-1'],
    completedCourses: ['course-1'],
    quizAttempts: [
      { quizId: 'q-1-1-1', score: 2, total: 2, timestamp: '2026-10-13T10:00:00.000Z' }
    ],
    earnedBadges: ['badge-first-step', 'badge-paper-pioneer'],
    dailyGoalXP: 100,
    todayXP: 50
  };

  const samplePositions: Position[] = [
    {
      id: 'pos-1',
      userId: 'user-trader',
      symbol: 'AAPL',
      side: 'long',
      quantity: 50,
      entryPrice: 224.50,
      currentPrice: 228.45,
      stopLoss: 221.00,
      takeProfit: 235.00,
      unrealizedPnl: 197.50,
      unrealizedPnlPercent: 1.76,
      openTimestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      leverage: 1,
      investedAmount: 11225.00
    }
  ];

  const sampleClosedTrades: ClosedTrade[] = [
    {
      id: 'trade-closed-1',
      userId: 'user-trader',
      symbol: 'NVDA',
      side: 'long',
      quantity: 100,
      entryPrice: 120.50,
      exitPrice: 125.00,
      stopLoss: 118.00,
      takeProfit: 125.00,
      realizedPnl: 450.00,
      realizedPnlPercent: 3.73,
      openTimestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
      closeTimestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
      closeReason: 'take_profit',
      riskRewardRatio: 1.8
    },
    {
      id: 'trade-closed-2',
      userId: 'user-trader',
      symbol: 'BTC/USD',
      side: 'long',
      quantity: 0.25,
      entryPrice: 63500.00,
      exitPrice: 62800.00,
      stopLoss: 62800.00,
      takeProfit: 66000.00,
      realizedPnl: -175.00,
      realizedPnlPercent: -1.10,
      openTimestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
      closeTimestamp: new Date(Date.now() - 3600000 * 50).toISOString(),
      closeReason: 'stop_loss',
      riskRewardRatio: 0
    }
  ];

  const sampleJournal: TradeJournalEntry[] = [
    {
      id: 'jour-1',
      userId: 'user-trader',
      tradeId: 'trade-closed-1',
      symbol: 'NVDA',
      side: 'long',
      entryDate: new Date(Date.now() - 3600000 * 48).toISOString(),
      pnl: 450.00,
      strategyUsed: 'Breakout Retest on 1H Chart',
      emotionalState: 'Disciplined',
      followedPlan: true,
      mistakeTags: [],
      notes: 'Waited for hourly close above $120.00 resistance with volume confirmation. Placed technical stop below recent swing low ($118.00). Target hit cleanly as buyers stepped in.',
      createdAt: new Date(Date.now() - 3600000 * 19).toISOString()
    },
    {
      id: 'jour-2',
      userId: 'user-trader',
      tradeId: 'trade-closed-2',
      symbol: 'BTC/USD',
      side: 'long',
      entryDate: new Date(Date.now() - 3600000 * 72).toISOString(),
      pnl: -175.00,
      strategyUsed: 'Support Bounce',
      emotionalState: 'Hesitant / Anxious',
      followedPlan: true,
      mistakeTags: ['Minor early entry before confirmation'],
      notes: 'Setup failed when higher-timeframe selling expanded. Happy I respected my stop loss and exited at $62,800 without hesitation. Kept loss capped at 0.17% of total capital.',
      createdAt: new Date(Date.now() - 3600000 * 49).toISOString()
    }
  ];

  const sampleCommunity: CommunityPost[] = [
    {
      id: 'post-1',
      userId: 'user-admin',
      authorName: 'DecroTrade Chief Admin',
      authorRole: 'admin',
      title: 'The Golden Rule of Position Sizing: Why 1% Risk Saves Accounts',
      content: 'Many beginner traders wonder why they blow up their demo accounts in a single bad afternoon. The reason is almost always oversized risk. If you risk 10% per trade, five consecutive losses cuts your capital by over 40%. When you limit risk to 1%, a 5-loss streak is a mere 4.9% dent, leaving your psychology intact. Calculate your stop-loss distance FIRST, then determine share size!',
      category: 'Risk Management',
      symbolTag: 'AAPL',
      likes: 18,
      likedBy: ['user-trader'],
      commentCount: 2,
      comments: [
        {
          id: 'comm-1',
          userId: 'user-trader',
          userName: 'Alex Vance',
          content: 'This formula changed everything for me. Calculating shares based on the stop distance took away 90% of my trading anxiety.',
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 'post-2',
      userId: 'user-trader',
      authorName: 'Alex Vance',
      authorRole: 'user',
      title: 'Spotting Bearish Divergence on the 4H Timeframe',
      content: 'Spent the weekend studying Course 6 (Indicators and Trend Analysis). Notice how when price makes a higher high, but the 14 RSI makes a lower high, it acts like an early warning radar that buyers are losing steam. Tested this on paper trades and it prevented me from buying at tops!',
      category: 'Strategy Analysis',
      symbolTag: 'BTC/USD',
      likes: 9,
      likedBy: [],
      commentCount: 0,
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    }
  ];

  const sampleCertificates: Certificate[] = [
    {
      id: 'cert-1',
      userId: 'user-trader',
      userName: 'Alex Vance',
      courseId: 'course-1',
      courseTitle: 'Market Fundamentals',
      issueDate: '2026-10-13',
      verificationCode: 'DT-MF-84920',
      scorePercent: 100
    }
  ];

  const sampleLeaderboards = [
    {
      challengeId: 'ch-1',
      userId: 'user-admin',
      userName: 'DecroTrade Chief Admin',
      score: 5,
      total: 5,
      accuracyPercent: 100,
      timeSpentSeconds: 42,
      timestamp: new Date(Date.now() - 3600000 * 8).toISOString()
    },
    {
      challengeId: 'ch-1',
      userId: 'user-trader',
      userName: 'Alex Vance',
      score: 4,
      total: 5,
      accuracyPercent: 80,
      timeSpentSeconds: 58,
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      challengeId: 'ch-4',
      userId: 'user-trader',
      userName: 'Alex Vance',
      score: 5,
      total: 5,
      accuracyPercent: 100,
      timeSpentSeconds: 74,
      timestamp: new Date(Date.now() - 3600000 * 6).toISOString()
    }
  ];

  return {
    users: [adminUser, demoTrader],
    sessions: [],
    positions: samplePositions,
    closedTrades: sampleClosedTrades,
    journalEntries: sampleJournal,
    communityPosts: sampleCommunity,
    notifications: [
      {
        id: 'notif-1',
        userId: 'user-trader',
        title: 'Welcome to DecroTrade',
        message: 'Your virtual account has been credited with $100,000 virtual funds for educational practice.',
        type: 'system',
        isRead: false,
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: 'notif-2',
        userId: 'user-trader',
        title: 'Certificate Issued!',
        message: 'Congratulations on completing Course 1: Market Fundamentals!',
        type: 'course',
        isRead: true,
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString()
      }
    ],
    certificates: sampleCertificates,
    challengeLeaderboards: sampleLeaderboards
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error loading database, initializing default:', e);
    }
    const def = initDefaultDatabase();
    this.saveData(def);
    return def;
  }

  private saveData(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing database to disk:', e);
    }
  }

  // --- Auth & Users ---
  getUserByEmail(email: string): StoredUser | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): User | undefined {
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return undefined;
    const { passwordHash, salt, ...sanitized } = user;
    return sanitized;
  }

  createUser(params: { name: string; email: string; password: string }): { user: User; token: string } {
    const existing = this.getUserByEmail(params.email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }
    const salt = generateSalt();
    const passwordHash = hashPassword(params.password, salt);
    const id = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newUser: StoredUser = {
      id,
      name: params.name.trim(),
      email: params.email.toLowerCase().trim(),
      passwordHash,
      salt,
      role: 'user',
      createdAt: new Date().toISOString(),
      tradingStyle: 'Beginner Learner',
      virtualBalance: 100000,
      xp: 100,
      level: 1,
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      completedLessons: [],
      completedCourses: [],
      quizAttempts: [],
      earnedBadges: ['badge-first-step'],
      dailyGoalXP: 100,
      todayXP: 100
    };

    this.data.users.push(newUser);
    const token = this.createSession(id);
    this.saveData(this.data);

    const { passwordHash: _, salt: __, ...userPublic } = newUser;
    return { user: userPublic, token };
  }

  verifyPassword(user: StoredUser, attempt: string): boolean {
    const hash = hashPassword(attempt, user.salt);
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(user.passwordHash));
  }

  createSession(userId: string): string {
    const token = generateToken();
    const expiresAt = Date.now() + 7 * 24 * 3600 * 1000; // 7 days
    this.data.sessions.push({ token, userId, expiresAt });
    this.saveData(this.data);
    return token;
  }

  getUserByToken(token: string): User | undefined {
    const session = this.data.sessions.find((s) => s.token === token && s.expiresAt > Date.now());
    if (!session) return undefined;
    return this.getUserById(session.userId);
  }

  deleteSession(token: string) {
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.saveData(this.data);
  }

  updateUserProfile(userId: string, updates: Partial<User>): User {
    const userIndex = this.data.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');

    const currentUser = this.data.users[userIndex];
    // prevent changing sensitive fields directly
    const allowedUpdates = {
      name: updates.name ?? currentUser.name,
      bio: updates.bio ?? currentUser.bio,
      tradingStyle: updates.tradingStyle ?? currentUser.tradingStyle,
      avatarUrl: updates.avatarUrl ?? currentUser.avatarUrl,
      dailyGoalXP: updates.dailyGoalXP ?? currentUser.dailyGoalXP
    };

    this.data.users[userIndex] = { ...currentUser, ...allowedUpdates };
    this.saveData(this.data);

    const { passwordHash, salt, ...sanitized } = this.data.users[userIndex];
    return sanitized;
  }

  addXP(userId: string, xpGained: number, reason: string): { newXP: number; newLevel: number; leveledUp: boolean } {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');

    const oldLevel = user.level;
    user.xp += xpGained;
    user.todayXP = (user.todayXP || 0) + xpGained;

    // Level progression formula: Level = Math.floor(Math.sqrt(xp / 100)) + 1
    const newLevel = Math.max(1, Math.min(20, Math.floor(Math.sqrt(user.xp / 150)) + 1));
    const leveledUp = newLevel > oldLevel;
    user.level = newLevel;

    // Check badges
    if (user.xp >= 1000 && !user.earnedBadges.includes('badge-streak-3')) {
      user.earnedBadges.push('badge-streak-3');
    }

    this.saveData(this.data);
    return { newXP: user.xp, newLevel: user.level, leveledUp };
  }

  recordLessonComplete(userId: string, lessonId: string, courseId: string): { user: User; xpGained: number } {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');

    let xpGained = 0;
    if (!user.completedLessons.includes(lessonId)) {
      user.completedLessons.push(lessonId);
      xpGained = 50;
      user.xp += xpGained;
      user.todayXP = (user.todayXP || 0) + xpGained;
      if (!user.earnedBadges.includes('badge-first-step')) {
        user.earnedBadges.push('badge-first-step');
      }
    }

    user.level = Math.max(1, Math.min(20, Math.floor(Math.sqrt(user.xp / 150)) + 1));
    this.saveData(this.data);
    const { passwordHash, salt, ...sanitized } = user;
    return { user: sanitized, xpGained };
  }

  recordQuizAttempt(userId: string, quizId: string, score: number, total: number): { user: User; xpGained: number } {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');

    const percent = Math.round((score / total) * 100);
    const xpGained = Math.round(score * 25);
    user.xp += xpGained;
    user.todayXP = (user.todayXP || 0) + xpGained;
    user.quizAttempts.push({
      quizId,
      score,
      total,
      timestamp: new Date().toISOString()
    });

    if (percent === 100 && !user.earnedBadges.includes('badge-quiz-ace')) {
      user.earnedBadges.push('badge-quiz-ace');
    }

    user.level = Math.max(1, Math.min(20, Math.floor(Math.sqrt(user.xp / 150)) + 1));
    this.saveData(this.data);
    const { passwordHash, salt, ...sanitized } = user;
    return { user: sanitized, xpGained };
  }

  issueCertificate(userId: string, courseId: string, courseTitle: string, scorePercent: number): Certificate {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');

    if (!user.completedCourses.includes(courseId)) {
      user.completedCourses.push(courseId);
      user.xp += 300;
      if (!user.earnedBadges.includes('badge-course-grad')) {
        user.earnedBadges.push('badge-course-grad');
      }
    }

    const verificationCode = `DT-${courseId.toUpperCase().slice(-4)}-${Math.floor(10000 + Math.random() * 90000)}`;
    const cert: Certificate = {
      id: `cert-${Date.now()}`,
      userId,
      userName: user.name,
      courseId,
      courseTitle,
      issueDate: new Date().toISOString().split('T')[0],
      verificationCode,
      scorePercent
    };

    this.data.certificates.push(cert);
    this.saveData(this.data);
    return cert;
  }

  // --- Virtual Portfolio & Practice Simulator ---
  getUserPositions(userId: string): Position[] {
    return this.data.positions.filter((p) => p.userId === userId);
  }

  getUserClosedTrades(userId: string): ClosedTrade[] {
    return this.data.closedTrades.filter((t) => t.userId === userId).sort((a, b) => new Date(b.closeTimestamp).getTime() - new Date(a.closeTimestamp).getTime());
  }

  openPosition(userId: string, order: {
    symbol: string;
    side: 'long' | 'short';
    quantity: number;
    currentPrice: number;
    stopLoss?: number;
    takeProfit?: number;
    leverage?: number;
  }): Position {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');

    const totalCost = order.quantity * order.currentPrice;
    if (user.virtualBalance < totalCost) {
      throw new Error(`Insufficient virtual balance. Required: $${totalCost.toFixed(2)}, Available: $${user.virtualBalance.toFixed(2)}`);
    }

    // Deduct virtual capital
    user.virtualBalance -= totalCost;

    const newPosition: Position = {
      id: `pos-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      symbol: order.symbol,
      side: order.side,
      quantity: order.quantity,
      entryPrice: order.currentPrice,
      currentPrice: order.currentPrice,
      stopLoss: order.stopLoss,
      takeProfit: order.takeProfit,
      unrealizedPnl: 0,
      unrealizedPnlPercent: 0,
      openTimestamp: new Date().toISOString(),
      leverage: order.leverage || 1,
      investedAmount: totalCost
    };

    this.data.positions.push(newPosition);

    if (!user.earnedBadges.includes('badge-paper-pioneer')) {
      user.earnedBadges.push('badge-paper-pioneer');
      user.xp += 150;
    }

    if (order.stopLoss && order.takeProfit && !user.earnedBadges.includes('badge-risk-architect')) {
      user.earnedBadges.push('badge-risk-architect');
      user.xp += 250;
    }

    this.saveData(this.data);
    return newPosition;
  }

  closePosition(userId: string, positionId: string, currentMarketPrice: number, reason: 'manual' | 'take_profit' | 'stop_loss' = 'manual'): ClosedTrade {
    const posIndex = this.data.positions.findIndex((p) => p.id === positionId && p.userId === userId);
    if (posIndex === -1) throw new Error('Position not found');

    const pos = this.data.positions[posIndex];
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');

    const priceDiff = pos.side === 'long'
      ? currentMarketPrice - pos.entryPrice
      : pos.entryPrice - currentMarketPrice;

    const realizedPnl = Number((priceDiff * pos.quantity).toFixed(2));
    const realizedPnlPercent = Number(((priceDiff / pos.entryPrice) * 100).toFixed(2));
    const returnedCapital = pos.investedAmount + realizedPnl;

    // Refund capital + PnL
    user.virtualBalance = Math.max(0, user.virtualBalance + returnedCapital);

    // Calculate risk reward ratio if SL/TP were specified
    let riskRewardRatio: number | undefined;
    if (pos.stopLoss && pos.takeProfit) {
      const risk = Math.abs(pos.entryPrice - pos.stopLoss);
      const reward = Math.abs(pos.takeProfit - pos.entryPrice);
      if (risk > 0) riskRewardRatio = Number((reward / risk).toFixed(2));
    }

    const closedTrade: ClosedTrade = {
      id: `trade-${Date.now()}`,
      userId,
      symbol: pos.symbol,
      side: pos.side,
      quantity: pos.quantity,
      entryPrice: pos.entryPrice,
      exitPrice: currentMarketPrice,
      stopLoss: pos.stopLoss,
      takeProfit: pos.takeProfit,
      realizedPnl,
      realizedPnlPercent,
      openTimestamp: pos.openTimestamp,
      closeTimestamp: new Date().toISOString(),
      closeReason: reason,
      riskRewardRatio
    };

    this.data.positions.splice(posIndex, 1);
    this.data.closedTrades.push(closedTrade);

    // XP for completing a disciplined trade
    user.xp += 25;

    this.saveData(this.data);
    return closedTrade;
  }

  resetVirtualBalance(userId: string): number {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    user.virtualBalance = 100000;
    this.saveData(this.data);
    return user.virtualBalance;
  }

  // --- Trade Journal ---
  getJournalEntries(userId: string): TradeJournalEntry[] {
    return this.data.journalEntries.filter((j) => j.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createJournalEntry(userId: string, entry: Omit<TradeJournalEntry, 'id' | 'userId' | 'createdAt'>): TradeJournalEntry {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');

    const newEntry: TradeJournalEntry = {
      id: `jour-${Date.now()}`,
      userId,
      ...entry,
      createdAt: new Date().toISOString()
    };

    this.data.journalEntries.push(newEntry);

    if (!user.earnedBadges.includes('badge-journal-keeper')) {
      user.earnedBadges.push('badge-journal-keeper');
      user.xp += 200;
    }

    this.saveData(this.data);
    return newEntry;
  }

  deleteJournalEntry(userId: string, entryId: string) {
    this.data.journalEntries = this.data.journalEntries.filter((j) => !(j.id === entryId && j.userId === userId));
    this.saveData(this.data);
  }

  // --- Challenges Leaderboard ---
  recordChallengeScore(userId: string, challengeId: string, score: number, total: number, timeSpentSeconds: number) {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');

    const accuracyPercent = Math.round((score / total) * 100);
    const xpReward = Math.round(score * 30 + (accuracyPercent === 100 ? 50 : 0));
    user.xp += xpReward;

    this.data.challengeLeaderboards.push({
      challengeId,
      userId,
      userName: user.name,
      score,
      total,
      accuracyPercent,
      timeSpentSeconds,
      timestamp: new Date().toISOString()
    });

    this.saveData(this.data);
    return { xpReward, accuracyPercent };
  }

  getLeaderboard(challengeId?: string) {
    let entries = this.data.challengeLeaderboards;
    if (challengeId) {
      entries = entries.filter((e) => e.challengeId === challengeId);
    }
    return entries.sort((a, b) => b.score - a.score || a.timeSpentSeconds - b.timeSpentSeconds).slice(0, 50);
  }

  // --- Community ---
  getCommunityPosts(): CommunityPost[] {
    return this.data.communityPosts.filter((p) => !p.isReported).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAllCommunityPostsAdmin(): CommunityPost[] {
    return this.data.communityPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createCommunityPost(userId: string, post: { title: string; content: string; category: any; symbolTag?: string }): CommunityPost {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      userId,
      authorName: user.name,
      authorRole: user.role,
      authorAvatar: user.avatarUrl,
      title: post.title.trim(),
      content: post.content.trim(),
      category: post.category,
      symbolTag: post.symbolTag?.toUpperCase(),
      likes: 0,
      likedBy: [],
      commentCount: 0,
      comments: [],
      createdAt: new Date().toISOString()
    };

    this.data.communityPosts.unshift(newPost);
    user.xp += 20;
    this.saveData(this.data);
    return newPost;
  }

  toggleLikePost(userId: string, postId: string): { likes: number; liked: boolean } {
    const post = this.data.communityPosts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    const index = post.likedBy.indexOf(userId);
    let liked = false;
    if (index === -1) {
      post.likedBy.push(userId);
      post.likes += 1;
      liked = true;
    } else {
      post.likedBy.splice(index, 1);
      post.likes = Math.max(0, post.likes - 1);
      liked = false;
    }

    this.saveData(this.data);
    return { likes: post.likes, liked };
  }

  addCommentToPost(userId: string, postId: string, content: string) {
    const post = this.data.communityPosts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');

    const comment = {
      id: `comm-${Date.now()}`,
      userId,
      userName: user.name,
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    post.comments.push(comment);
    post.commentCount = post.comments.length;
    this.saveData(this.data);
    return comment;
  }

  reportPost(postId: string) {
    const post = this.data.communityPosts.find((p) => p.id === postId);
    if (post) {
      post.isReported = true;
      this.saveData(this.data);
    }
  }

  // --- Admin Methods ---
  getAllUsers(): User[] {
    return this.data.users.map((u) => {
      const { passwordHash, salt, ...sanitized } = u;
      return sanitized;
    });
  }

  updateUserStatus(adminUserId: string, targetUserId: string, updates: { isSuspended?: boolean; role?: 'user' | 'admin' | 'moderator' }): User {
    const admin = this.data.users.find((u) => u.id === adminUserId);
    if (!admin || admin.role !== 'admin') throw new Error('Unauthorized. Admin privileges required.');

    const targetIndex = this.data.users.findIndex((u) => u.id === targetUserId);
    if (targetIndex === -1) throw new Error('User not found');

    if (updates.isSuspended !== undefined) {
      this.data.users[targetIndex].isSuspended = updates.isSuspended;
    }
    if (updates.role !== undefined) {
      this.data.users[targetIndex].role = updates.role;
    }

    this.saveData(this.data);
    const { passwordHash, salt, ...sanitized } = this.data.users[targetIndex];
    return sanitized;
  }

  getAdminStats() {
    const totalUsers = this.data.users.length;
    const totalSimulatedTrades = this.data.closedTrades.length + this.data.positions.length;
    const totalCompletedLessons = this.data.users.reduce((acc, u) => acc + u.completedLessons.length, 0);
    const totalCertificates = this.data.certificates.length;
    const totalJournalEntries = this.data.journalEntries.length;
    const totalCommunityPosts = this.data.communityPosts.length;

    return {
      totalUsers,
      totalSimulatedTrades,
      totalCompletedLessons,
      totalCertificates,
      totalJournalEntries,
      totalCommunityPosts,
      activeSessions: this.data.sessions.filter((s) => s.expiresAt > Date.now()).length,
      serverUptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    };
  }

  getCertificates(userId: string): Certificate[] {
    return this.data.certificates.filter((c) => c.userId === userId);
  }

  getNotifications(userId: string): NotificationItem[] {
    return this.data.notifications.filter((n) => n.userId === userId);
  }

  markNotificationRead(userId: string, notificationId: string) {
    const notif = this.data.notifications.find((n) => n.id === notificationId && n.userId === userId);
    if (notif) {
      notif.isRead = true;
      this.saveData(this.data);
    }
  }
}

export const db = new Database();
