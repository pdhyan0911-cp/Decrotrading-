import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { COURSES_DATA } from '../data/coursesData';
import {
  BarChart3,
  TrendingUp,
  Target,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PieChart
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { user, token } = useAuth();
  const [portfolioData, setPortfolioData] = useState<any>({
    virtualBalance: user?.virtualBalance || 100000,
    totalEquity: user?.virtualBalance || 100000,
    totalRealizedPnl: 0,
    winRate: 0,
    closedTrades: []
  });

  useEffect(() => {
    if (token) {
      fetch('/api/simulator/portfolio', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((r) => r.json())
        .then((data) => {
          if (data && !data.error) setPortfolioData(data);
        })
        .catch(console.error);
    }
  }, [token]);

  const closedTrades = portfolioData.closedTrades || [];
  const winningTrades = closedTrades.filter((t: any) => t.realizedPnl > 0);
  const losingTrades = closedTrades.filter((t: any) => t.realizedPnl < 0);

  const totalWinDollar = winningTrades.reduce((acc: number, t: any) => acc + t.realizedPnl, 0);
  const totalLossDollar = Math.abs(losingTrades.reduce((acc: number, t: any) => acc + t.realizedPnl, 0));
  const profitFactor = totalLossDollar > 0 ? (totalWinDollar / totalLossDollar).toFixed(2) : 'N/A';
  const avgWin = winningTrades.length > 0 ? (totalWinDollar / winningTrades.length).toFixed(2) : '0.00';
  const avgLoss = losingTrades.length > 0 ? (totalLossDollar / losingTrades.length).toFixed(2) : '0.00';

  // Quiz Accuracy
  const quizAttempts = user?.quizAttempts || [];
  const totalQuizQuestions = quizAttempts.reduce((acc, q) => acc + q.total, 0);
  const totalQuizCorrect = quizAttempts.reduce((acc, q) => acc + q.score, 0);
  const quizAccuracy = totalQuizQuestions > 0 ? Math.round((totalQuizCorrect / totalQuizQuestions) * 100) : 0;

  // Curriculum stats
  const completedLessons = user?.completedLessons?.length || 0;
  const totalLessons = COURSES_DATA.reduce(
    (acc, c) => acc + c.modules.reduce((mAcc, m) => mAcc + m.lessons.length, 0),
    0
  );
  const curriculumPercent = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-violet-400" />
          Performance & Learning Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Objective evaluation of your educational comprehension, quiz accuracy, and simulated trading discipline.
        </p>
      </div>

      {/* Section 1: Educational Progress Metrics */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-3">
          1. Educational Competency Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4">
            <span className="text-xs text-slate-400 block mb-1">Curriculum Completion</span>
            <span className="font-mono text-2xl font-bold text-white">{curriculumPercent}%</span>
            <div className="mt-2 text-[11px] text-slate-400">
              {completedLessons} of {totalLessons} lessons finished
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-violet-500"
                style={{ width: `${curriculumPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4">
            <span className="text-xs text-slate-400 block mb-1">Overall Quiz Accuracy</span>
            <span className="font-mono text-2xl font-bold text-cyan-400">
              {totalQuizQuestions > 0 ? `${quizAccuracy}%` : 'No Data'}
            </span>
            <div className="mt-2 text-[11px] text-slate-400">
              {totalQuizCorrect} / {totalQuizQuestions} questions answered correctly
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4">
            <span className="text-xs text-slate-400 block mb-1">Active Learning Streak</span>
            <span className="font-mono text-2xl font-bold text-amber-400">
              {user?.streakDays || 1} Days
            </span>
            <div className="mt-2 text-[11px] text-slate-400">
              {user?.todayXP || 0} XP accumulated today
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Virtual Trading Execution Metrics */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
          2. Virtual Practice Performance (Simulated)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4">
            <span className="text-xs text-slate-400 block mb-1">Win Rate</span>
            <span className="font-mono text-xl font-bold text-white">{portfolioData.winRate}%</span>
            <span className="text-[10px] text-slate-500 block mt-1">
              {winningTrades.length} Wins / {losingTrades.length} Losses
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4">
            <span className="text-xs text-slate-400 block mb-1">Profit Factor</span>
            <span className="font-mono text-xl font-bold text-violet-300">{profitFactor}</span>
            <span className="text-[10px] text-slate-500 block mt-1">Gross Win / Gross Loss</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4">
            <span className="text-xs text-slate-400 block mb-1">Avg Win ($)</span>
            <span className="font-mono text-xl font-bold text-emerald-400">+${avgWin}</span>
            <span className="text-[10px] text-slate-500 block mt-1">Per winning trade</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4">
            <span className="text-xs text-slate-400 block mb-1">Avg Loss ($)</span>
            <span className="font-mono text-xl font-bold text-rose-400">-${avgLoss}</span>
            <span className="text-[10px] text-slate-500 block mt-1">Per losing trade</span>
          </div>
        </div>
      </div>

      {/* Equity & Risk-Reward Breakdown */}
      <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-5 shadow space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="font-bold text-white text-xs">Simulated Equity Curve Overview</span>
          <span className="font-mono text-xs text-emerald-400 font-bold">
            ${portfolioData.totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {closedTrades.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No simulated practice trades closed yet. Execute virtual positions in the simulator to generate your equity curve.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-slate-400">
              Completed Trades Chronology:
            </div>
            <div className="space-y-2">
              {closedTrades.slice(0, 5).map((t: any, i: number) => {
                const isWin = t.realizedPnl >= 0;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-slate-900/60 p-3 border border-slate-800 text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">{t.symbol}</span>
                      <span className="text-[10px] uppercase text-slate-400 font-sans">{t.side}</span>
                      <span className="text-slate-500 text-[10px]">
                        {new Date(t.closeTimestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 text-[11px]">
                        R:R {t.riskRewardRatio ? `1:${t.riskRewardRatio}` : '—'}
                      </span>
                      <span className={`font-bold ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isWin ? '+' : ''}${t.realizedPnl.toFixed(2)} ({isWin ? '+' : ''}{t.realizedPnlPercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
