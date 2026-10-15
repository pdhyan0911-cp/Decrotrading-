import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './src/server/db';
import { marketSimulator } from './src/server/marketSimulator';
import { askNovaAI } from './src/server/aiService';
import { COURSES_DATA } from './src/data/coursesData';
import { CHALLENGES } from './src/data/challengesData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Auth helper middleware
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required.' });
  }

  const user = db.getUserByToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Session expired or invalid.' });
  }

  (req as any).user = user;
  (req as any).token = token;
  next();
}

function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (token) {
    const user = db.getUserByToken(token);
    if (user) {
      (req as any).user = user;
      (req as any).token = token;
    }
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
  }
  next();
}

// ==================== AUTH ROUTES ====================
app.post('/api/auth/signup', (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }
    const result = db.createUser({ name, email, password });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Signup failed' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const stored = db.getUserByEmail(email);
    if (!stored) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (stored.isSuspended) {
      return res.status(403).json({ error: 'This account has been suspended by an administrator.' });
    }

    const isMatch = db.verifyPassword(stored, password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = db.createSession(stored.id);
    const { passwordHash, salt, ...user } = stored;
    res.json({ user, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  const token = (req as any).token;
  db.deleteSession(token);
  res.json({ success: true, message: 'Logged out successfully.' });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: (req as any).user });
});

app.put('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const updated = db.updateUserProfile(user.id, req.body);
    res.json({ user: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==================== COURSES & LEARNING ====================
app.get('/api/courses', optionalAuth, (req, res) => {
  const user = (req as any).user;
  const userCompletedLessons = user?.completedLessons || [];
  const userCompletedCourses = user?.completedCourses || [];

  const sanitizedCourses = COURSES_DATA.map((course) => {
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const completedCount = course.modules.reduce((sum, m) => {
      return sum + m.lessons.filter((l) => userCompletedLessons.includes(l.id)).length;
    }, 0);
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    const isCompleted = userCompletedCourses.includes(course.id) || progressPercent === 100;

    return {
      ...course,
      totalLessons,
      completedLessonsCount: completedCount,
      progressPercent,
      isCompleted
    };
  });

  res.json(sanitizedCourses);
});

app.get('/api/courses/:id', optionalAuth, (req, res) => {
  const course = COURSES_DATA.find((c) => c.id === req.params.id || c.slug === req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found.' });
  res.json(course);
});

app.post('/api/lessons/:id/complete', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const { courseId } = req.body;
    const result = db.recordLessonComplete(user.id, req.params.id, courseId);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/quizzes/:id/submit', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const { score, total } = req.body;
    if (score === undefined || total === undefined) {
      return res.status(400).json({ error: 'Score and total are required.' });
    }
    const result = db.recordQuizAttempt(user.id, req.params.id, score, total);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/certificates', authenticateToken, (req, res) => {
  const user = (req as any).user;
  const certs = db.getCertificates(user.id);
  res.json(certs);
});

app.post('/api/certificates/issue', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const { courseId, courseTitle, scorePercent } = req.body;
    const cert = db.issueCertificate(user.id, courseId, courseTitle, scorePercent);
    res.json(cert);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==================== MARKET DATA ====================
app.get('/api/market/instruments', (_req, res) => {
  const instruments = marketSimulator.getInstruments();
  res.json(instruments);
});

app.get('/api/market/instruments/:symbol', (req, res) => {
  const symbol = decodeURIComponent(req.params.symbol);
  const inst = marketSimulator.getInstrument(symbol);
  if (!inst) return res.status(404).json({ error: 'Instrument not found.' });
  res.json(inst);
});

app.get('/api/market/candles/:symbol', (req, res) => {
  const symbol = decodeURIComponent(req.params.symbol);
  const timeframe = (req.query.timeframe as any) || '15m';
  const candles = marketSimulator.getCandles(symbol, timeframe);
  res.json(candles);
});

app.get('/api/market/orderbook/:symbol', (req, res) => {
  const symbol = decodeURIComponent(req.params.symbol);
  const book = marketSimulator.getOrderBook(symbol);
  res.json(book);
});

// ==================== VIRTUAL PRACTICE SIMULATOR ====================
app.get('/api/simulator/portfolio', authenticateToken, (req, res) => {
  const user = (req as any).user;
  const positions = db.getUserPositions(user.id);
  const closedTrades = db.getUserClosedTrades(user.id);

  // Calculate live portfolio summary
  const totalInvested = positions.reduce((acc, p) => acc + p.investedAmount, 0);
  const totalUnrealizedPnl = positions.reduce((acc, p) => acc + p.unrealizedPnl, 0);
  const totalRealizedPnl = closedTrades.reduce((acc, t) => acc + t.realizedPnl, 0);
  const totalEquity = Number((user.virtualBalance + totalInvested + totalUnrealizedPnl).toFixed(2));

  const winningTrades = closedTrades.filter((t) => t.realizedPnl > 0).length;
  const winRate = closedTrades.length > 0 ? Number(((winningTrades / closedTrades.length) * 100).toFixed(1)) : 0;

  res.json({
    virtualBalance: user.virtualBalance,
    totalInvested,
    totalUnrealizedPnl,
    totalRealizedPnl,
    totalEquity,
    winRate,
    openPositionsCount: positions.length,
    closedTradesCount: closedTrades.length,
    positions,
    closedTrades
  });
});

app.post('/api/simulator/order', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const { symbol, side, quantity, stopLoss, takeProfit, leverage } = req.body;

    if (!symbol || !side || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Valid symbol, side, and quantity are required.' });
    }

    const inst = marketSimulator.getInstrument(symbol);
    if (!inst) {
      return res.status(404).json({ error: 'Instrument not found.' });
    }

    const position = db.openPosition(user.id, {
      symbol,
      side,
      quantity,
      currentPrice: inst.currentPrice,
      stopLoss,
      takeProfit,
      leverage
    });

    res.json(position);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/simulator/positions/:id/close', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const positions = db.getUserPositions(user.id);
    const pos = positions.find((p) => p.id === req.params.id);
    if (!pos) return res.status(404).json({ error: 'Position not found.' });

    const inst = marketSimulator.getInstrument(pos.symbol);
    const exitPrice = inst ? inst.currentPrice : pos.currentPrice;

    const closed = db.closePosition(user.id, pos.id, exitPrice, 'manual');
    res.json(closed);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/simulator/reset', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const newBalance = db.resetVirtualBalance(user.id);
    res.json({ success: true, virtualBalance: newBalance, message: 'Virtual practice balance reset to $100,000.00' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==================== TRADE JOURNAL ====================
app.get('/api/journal', authenticateToken, (req, res) => {
  const user = (req as any).user;
  const entries = db.getJournalEntries(user.id);
  res.json(entries);
});

app.post('/api/journal', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const newEntry = db.createJournalEntry(user.id, req.body);
    res.json(newEntry);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/journal/:id', authenticateToken, (req, res) => {
  const user = (req as any).user;
  db.deleteJournalEntry(user.id, req.params.id);
  res.json({ success: true });
});

// ==================== CHALLENGES & LEADERBOARDS ====================
app.get('/api/challenges', (_req, res) => {
  res.json(CHALLENGES);
});

app.get('/api/challenges/:id', (req, res) => {
  const challenge = CHALLENGES.find((c) => c.id === req.params.id || c.slug === req.params.id);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found.' });
  res.json(challenge);
});

app.post('/api/challenges/:id/submit', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const { score, total, timeSpentSeconds } = req.body;
    const result = db.recordChallengeScore(user.id, req.params.id, score, total, timeSpentSeconds);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/leaderboard', (req, res) => {
  const challengeId = req.query.challengeId as string;
  const leaderboard = db.getLeaderboard(challengeId);
  res.json(leaderboard);
});

// ==================== NOVA AI LEARNING ASSISTANT ====================
app.post('/api/nova-ai', optionalAuth, async (req, res) => {
  try {
    const { prompt, contextType, journalContext } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'A prompt is required for Nova AI.' });
    }

    const user = (req as any).user;
    const userContext = user ? { name: user.name, level: user.level, xp: user.xp } : undefined;

    const result = await askNovaAI({
      prompt,
      contextType,
      journalContext,
      userContext
    });

    res.json(result);
  } catch (err: any) {
    console.error('Nova AI endpoint error:', err);
    res.status(500).json({ error: 'Nova AI encountered a processing issue. Please try again.' });
  }
});

// ==================== COMMUNITY ====================
app.get('/api/community/posts', (_req, res) => {
  const posts = db.getCommunityPosts();
  res.json(posts);
});

app.post('/api/community/posts', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const post = db.createCommunityPost(user.id, req.body);
    res.json(post);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/community/posts/:id/like', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const result = db.toggleLikePost(user.id, req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/community/posts/:id/comment', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Comment content is required.' });
    const comment = db.addCommentToPost(user.id, req.params.id, content);
    res.json(comment);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/community/posts/:id/report', (_req, res) => {
  db.reportPost(_req.params.id);
  res.json({ success: true, message: 'Post reported for moderator review.' });
});

// ==================== NOTIFICATIONS ====================
app.get('/api/notifications', authenticateToken, (req, res) => {
  const user = (req as any).user;
  const notifs = db.getNotifications(user.id);
  res.json(notifs);
});

app.post('/api/notifications/:id/read', authenticateToken, (req, res) => {
  const user = (req as any).user;
  db.markNotificationRead(user.id, req.params.id);
  res.json({ success: true });
});

// ==================== ADMIN CONTROL CENTER ====================
app.get('/api/admin/users', authenticateToken, requireAdmin, (_req, res) => {
  const users = db.getAllUsers();
  res.json(users);
});

app.patch('/api/admin/users/:id/status', authenticateToken, requireAdmin, (req, res) => {
  try {
    const admin = (req as any).user;
    const updated = db.updateUserStatus(admin.id, req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/stats', authenticateToken, requireAdmin, (_req, res) => {
  const stats = db.getAdminStats();
  res.json(stats);
});

// ==================== DEV & PROD SERVERS ====================
async function startServer() {
  const port = Number(process.env.PORT) || 3000;

  if (!isProduction) {
    // Mount Vite dev middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Serve production static assets
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`DecroTrade server running at http://0.0.0.0:${port}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
