import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  RotateCcw,
  CheckCircle2,
  Shield,
  Bell,
  Eye,
  Sliders,
  AlertTriangle
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, token, refreshUser, updateProfile } = useAuth();
  const [dailyGoal, setDailyGoal] = useState<number>(user?.dailyGoalXP || 100);
  const [isResetting, setIsResetting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleUpdateGoal = async (goal: number) => {
    setDailyGoal(goal);
    await updateProfile({ dailyGoalXP: goal });
    setFeedback(`Daily learning goal updated to ${goal} XP!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleResetSimulator = async () => {
    if (!token) return;
    if (!window.confirm('Reset virtual simulator funds back to $100,000.00? (Your completed lessons and XP remain intact).')) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch('/api/simulator/reset', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setFeedback('Virtual paper portfolio reset to $100,000.00.');
        await refreshUser();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-violet-400" />
          Platform Settings & Virtual Controls
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure daily goals, simulator capital, and display preferences.
        </p>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-950/60 p-3 text-xs text-emerald-300 border border-emerald-800/60">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Daily Goal Configuration */}
      <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-5 shadow space-y-3">
        <div>
          <h3 className="font-bold text-white text-sm">Daily Learning XP Goal</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Set your target XP earned per day through lessons, challenges, and quizzes.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {[50, 100, 150, 200].map((goal) => (
            <button
              key={goal}
              onClick={() => handleUpdateGoal(goal)}
              className={`rounded-lg px-4 py-2 font-mono font-bold transition border ${
                dailyGoal === goal
                  ? 'bg-violet-600 text-white border-violet-500 shadow'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {goal} XP / Day
            </button>
          ))}
        </div>
      </div>

      {/* Virtual Simulator Capital Control */}
      <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-5 shadow space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">Virtual Balance Reset</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Reset your paper trading balance back to the starting $100,000.00 educational benchmark.
            </p>
          </div>
          <button
            onClick={handleResetSimulator}
            disabled={isResetting}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-950 hover:border-rose-700 border border-slate-700 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{isResetting ? 'Resetting...' : 'Reset to $100k'}</span>
          </button>
        </div>

        <div className="rounded-lg bg-slate-900/60 p-3 text-xs text-slate-400 border border-slate-800">
          Current Virtual Balance: <strong className="text-white font-mono">${(user?.virtualBalance || 100000).toLocaleString()}</strong>
        </div>
      </div>

      {/* Interface & Theme Info */}
      <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-5 shadow space-y-3">
        <div>
          <h3 className="font-bold text-white text-sm">Design & Accessibility System</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Engineered with DecroTrade Deep Navy (#080B11), restrained violet highlights, and WCAG AA contrast.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="rounded bg-[#080B11] border border-slate-800 p-2 text-center text-slate-400">
            <span className="block h-3 w-full rounded bg-[#080B11] border border-slate-700 mb-1"></span>
            Deep Navy
          </div>
          <div className="rounded bg-[#0A0E18] border border-slate-800 p-2 text-center text-slate-400">
            <span className="block h-3 w-full rounded bg-[#7C3AED] mb-1"></span>
            Violet Accent
          </div>
          <div className="rounded bg-[#0A0E18] border border-slate-800 p-2 text-center text-slate-400">
            <span className="block h-3 w-full rounded bg-[#10B981] mb-1"></span>
            Emerald P&L
          </div>
          <div className="rounded bg-[#0A0E18] border border-slate-800 p-2 text-center text-slate-400">
            <span className="block h-3 w-full rounded bg-[#F43F5E] mb-1"></span>
            Rose Risk
          </div>
        </div>
      </div>
    </div>
  );
};
