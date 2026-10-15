import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarket } from '../context/MarketContext';
import { COURSES_DATA, BADGES_DATA } from '../data/coursesData';
import {
  GraduationCap,
  PlayCircle,
  Award,
  Flame,
  ArrowRight,
  TrendingUp,
  Target,
  BookOpen,
  Sparkles,
  BarChart2,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DashboardPageProps {
  navigate: (route: string) => void;
  onSelectCourse: (courseId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ navigate, onSelectCourse }) => {
  const { user, isGuest } = useAuth();
  const { instruments, setSelectedSymbol } = useMarket();

  const [portfolioStats, setPortfolioStats] = useState<{
    openPositionsCount: number;
    closedTradesCount: number;
    totalEquity: number;
    totalRealizedPnl: number;
    winRate: number;
  }>({
    openPositionsCount: 0,
    closedTradesCount: 0,
    totalEquity: user?.virtualBalance || 100000,
    totalRealizedPnl: 0,
    winRate: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('decrotrade_token');
    if (token) {
      fetch('/api/simulator/portfolio', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((r) => r.json())
        .then((data) => {
          if (data && !data.error) {
            setPortfolioStats({
              openPositionsCount: data.openPositionsCount || 0,
              closedTradesCount: data.closedTradesCount || 0,
              totalEquity: data.totalEquity || 100000,
              totalRealizedPnl: data.totalRealizedPnl || 0,
              winRate: data.winRate || 0
            });
          }
        })
        .catch(console.error);
    }
  }, []);

  // Compute actual completed stats
  const completedLessonsCount = user?.completedLessons?.length || 0;
  const completedCoursesCount = user?.completedCourses?.length || 0;
  const totalAvailableLessons = COURSES_DATA.reduce(
    (sum, c) => sum + c.modules.reduce((mSum, m) => mSum + m.lessons.length, 0),
    0
  );
  const overallCurriculumProgress = Math.round((completedLessonsCount / totalAvailableLessons) * 100);

  // Calculate genuine Quiz Accuracy
  const quizAccuracy = (() => {
    if (!user?.quizAttempts || user.quizAttempts.length === 0) return 0;
    const totalQuestions = user.quizAttempts.reduce((acc, q) => acc + q.total, 0);
    const totalCorrect = user.quizAttempts.reduce((acc, q) => acc + q.score, 0);
    return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  })();

  // Find next unfinished lesson to recommend
  const nextLessonRecommendation = (() => {
    for (const course of COURSES_DATA) {
      for (const mod of course.modules) {
        for (const lesson of mod.lessons) {
          if (!user?.completedLessons?.includes(lesson.id)) {
            return { course, lesson };
          }
        }
      }
    }
    return null;
  })();

  // Badges earned
  const earnedBadgeObjects = BADGES_DATA.filter((b) => user?.earnedBadges?.includes(b.id));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0C101C] via-[#0E1527] to-[#121124] p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs text-violet-400 font-semibold tracking-wide uppercase">
              <span>Student Overview</span>
              <span>&bull;</span>
              <span>Level {user?.level || 1} Trader</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, {user?.name || 'Decro Learner'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Track your persistent educational milestones, paper portfolio statistics, and technical pattern mastery.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate('practice')}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-500 transition"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Launch Simulator</span>
            </button>
            <button
              onClick={() => navigate('learning')}
              className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-violet-900/30 hover:bg-violet-500 transition"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Explore Curriculum</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* XP & Level */}
        <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4 shadow">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Total Experience</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white">{user?.xp || 0} XP</div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Level {user?.level || 1} Scholar</span>
            <span className="text-amber-400 font-semibold">{user?.todayXP || 0} XP Today</span>
          </div>
        </div>

        {/* Curriculum Progress */}
        <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4 shadow">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Lessons Finished</span>
            <GraduationCap className="h-4 w-4 text-violet-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white">
            {completedLessonsCount} / {totalAvailableLessons}
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-violet-500 transition-all duration-500"
              style={{ width: `${overallCurriculumProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Quiz Accuracy */}
        <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4 shadow">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Quiz Accuracy</span>
            <Target className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white">
            {user?.quizAttempts && user.quizAttempts.length > 0 ? `${quizAccuracy}%` : 'No Quizzes Yet'}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {user?.quizAttempts?.length || 0} assessment sessions logged
          </div>
        </div>

        {/* Virtual Equity */}
        <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4 shadow">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Virtual Equity</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-400">
            ${portfolioStats.totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {portfolioStats.closedTradesCount} closed trades &bull; {portfolioStats.winRate}% win rate
          </div>
        </div>
      </div>

      {/* Middle Row: Resume Learning & Watchlist Quick Launch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resume Learning Action Card */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#0B0F19] p-5 shadow space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-violet-400" />
              <h3 className="font-bold text-white text-sm">Resume Learning & Recommended Next Step</h3>
            </div>
            <button
              onClick={() => navigate('learning')}
              className="text-xs text-violet-400 hover:text-violet-300 font-medium"
            >
              All 10 Courses &rarr;
            </button>
          </div>

          {nextLessonRecommendation ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="rounded bg-violet-950/80 px-2 py-0.5 text-[10px] font-bold text-violet-300 border border-violet-800/40">
                  {nextLessonRecommendation.course.title}
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  {nextLessonRecommendation.lesson.title}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                  {nextLessonRecommendation.lesson.summary}
                </p>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {nextLessonRecommendation.lesson.readTimeMinutes} min read
                  </span>
                  <span>+50 XP upon completion</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectCourse(nextLessonRecommendation.course.id);
                  navigate('learning');
                }}
                className="shrink-0 flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-violet-500 transition"
              >
                <span>Study Lesson</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400 mb-2" />
              <div className="font-bold text-white text-sm">Curriculum Mastered!</div>
              <p className="text-xs text-slate-400 mt-1">
                You have completed all available lessons. Test your speed in the Challenges section or practice on the live simulator.
              </p>
            </div>
          )}

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => navigate('nova-ai')}
              className="flex items-center gap-2.5 rounded-lg border border-purple-900/40 bg-purple-950/20 p-3 text-left hover:border-purple-600/60 transition group"
            >
              <Sparkles className="h-5 w-5 text-purple-400 group-hover:scale-110 transition" />
              <div>
                <span className="block text-xs font-bold text-purple-200">Ask Nova AI</span>
                <span className="text-[10px] text-slate-400">Concept Tutor</span>
              </div>
            </button>

            <button
              onClick={() => navigate('challenges')}
              className="flex items-center gap-2.5 rounded-lg border border-amber-900/40 bg-amber-950/20 p-3 text-left hover:border-amber-600/60 transition group"
            >
              <Award className="h-5 w-5 text-amber-400 group-hover:scale-110 transition" />
              <div>
                <span className="block text-xs font-bold text-amber-200">Daily Challenge</span>
                <span className="text-[10px] text-slate-400">Earn +50 XP</span>
              </div>
            </button>

            <button
              onClick={() => navigate('journal')}
              className="flex items-center gap-2.5 rounded-lg border border-indigo-900/40 bg-indigo-950/20 p-3 text-left hover:border-indigo-600/60 transition group col-span-2 sm:col-span-1"
            >
              <BookOpen className="h-5 w-5 text-indigo-400 group-hover:scale-110 transition" />
              <div>
                <span className="block text-xs font-bold text-indigo-200">Trade Journal</span>
                <span className="text-[10px] text-slate-400">Log Reflections</span>
              </div>
            </button>
          </div>
        </div>

        {/* Watchlist Shortcuts */}
        <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-5 shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
              <h3 className="font-bold text-white text-sm">Market Watchlist</h3>
              <button
                onClick={() => navigate('market')}
                className="text-xs text-violet-400 hover:text-violet-300"
              >
                Chart Desk &rarr;
              </button>
            </div>
            <div className="divide-y divide-slate-800/60">
              {instruments.slice(0, 5).map((inst) => (
                <div
                  key={inst.symbol}
                  onClick={() => {
                    setSelectedSymbol(inst.symbol);
                    navigate('market');
                  }}
                  className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/40 px-1 rounded transition"
                >
                  <div>
                    <span className="font-mono font-bold text-white text-xs">{inst.symbol}</span>
                    <span className="block text-[10px] text-slate-500">{inst.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold text-white">
                      ${inst.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </span>
                    <span
                      className={`block font-mono text-[10px] font-semibold ${
                        inst.changePercent24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {inst.changePercent24h >= 0 ? '+' : ''}
                      {inst.changePercent24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 text-center">
            Educational Real-Time Tick Engine &bull; Non-delayed Feed
          </div>
        </div>
      </div>

      {/* Recent Achievements Row */}
      <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-5 shadow">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" /> Earned Achievement Badges ({earnedBadgeObjects.length})
          </h3>
          <button
            onClick={() => navigate('rewards')}
            className="text-xs text-violet-400 hover:text-violet-300 font-medium"
          >
            View All Rewards & Certificates &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {earnedBadgeObjects.map((badge) => (
            <div
              key={badge.id}
              className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 text-center"
            >
              <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold">
                ★
              </div>
              <div className="text-xs font-bold text-amber-300 truncate">{badge.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{badge.description}</div>
            </div>
          ))}
          {earnedBadgeObjects.length === 0 && (
            <div className="col-span-4 py-4 text-center text-xs text-slate-500">
              No badges unlocked yet. Complete your first lesson or practice trade to earn badges!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
