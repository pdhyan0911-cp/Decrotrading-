import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  GraduationCap,
  LineChart,
  PlayCircle,
  BookOpen,
  Sparkles,
  Gamepad2,
  BarChart3,
  Trophy,
  Award,
  Users,
  ShieldAlert,
  Settings,
  HelpCircle,
  FileText,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  navigate,
  isOpen,
  onClose
}) => {
  const { user } = useAuth();

  const handleNav = (route: string) => {
    navigate(route);
    onClose();
  };

  const navItem = (route: string, label: string, icon: React.ReactNode, badge?: string, isHighlight?: boolean) => {
    const isActive = currentRoute === route;
    return (
      <button
        key={route}
        onClick={() => handleNav(route)}
        className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition ${
          isActive
            ? 'bg-violet-600/15 text-violet-300 font-semibold border-l-2 border-violet-500 shadow-sm'
            : isHighlight
            ? 'text-purple-300 hover:bg-purple-950/40 hover:text-white'
            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className={`${isActive ? 'text-violet-400' : isHighlight ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
            {icon}
          </span>
          <span>{label}</span>
        </div>
        {badge && (
          <span className="rounded bg-violet-950 px-1.5 py-0.5 text-[10px] font-bold text-violet-300 border border-violet-800/40">
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800/80 bg-[#070A11] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Daily Goal Streak Mini-Banner */}
          {user && (
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-amber-500" /> {user.streakDays}-Day Learning Streak
                </span>
                <span className="font-mono text-[10px] text-amber-400 font-bold">{user.todayXP}/{user.dailyGoalXP} XP</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                  style={{ width: `${Math.min(100, Math.round((user.todayXP / (user.dailyGoalXP || 100)) * 100))}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Section: Core Workspaces */}
          <div>
            <div className="mb-2 px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Core Platform
            </div>
            <div className="space-y-0.5">
              {navItem('dashboard', 'Dashboard', <LayoutDashboard className="h-4 w-4" />)}
              {navItem('learning', 'Learning Center', <GraduationCap className="h-4 w-4" />, '10 Courses')}
              {navItem('market', 'Market Analysis', <LineChart className="h-4 w-4" />)}
              {navItem('practice', 'Practice Simulator', <PlayCircle className="h-4 w-4" />, 'Virtual')}
              {navItem('journal', 'Trade Journal', <BookOpen className="h-4 w-4" />)}
              {navItem('nova-ai', 'Nova AI Assistant', <Sparkles className="h-4 w-4" />, 'Gemini', true)}
              {navItem('challenges', 'Challenges & Games', <Gamepad2 className="h-4 w-4" />, '7 Games')}
            </div>
          </div>

          {/* Section: Mastery & Community */}
          <div>
            <div className="mb-2 px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Community & Analytics
            </div>
            <div className="space-y-0.5">
              {navItem('analytics', 'Performance Analytics', <BarChart3 className="h-4 w-4" />)}
              {navItem('leaderboard', 'Leaderboard', <Trophy className="h-4 w-4" />)}
              {navItem('rewards', 'Certificates & Badges', <Award className="h-4 w-4" />)}
              {navItem('community', 'Community Feed', <Users className="h-4 w-4" />)}
            </div>
          </div>

          {/* Section: Administration & System */}
          <div>
            <div className="mb-2 px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              System & Safety
            </div>
            <div className="space-y-0.5">
              {user?.role === 'admin' &&
                navItem('admin', 'Admin Control Center', <ShieldAlert className="h-4 w-4" />, 'Admin')}
              {navItem('settings', 'Settings & Display', <Settings className="h-4 w-4" />)}
              {navItem('faq', 'Help & FAQ', <HelpCircle className="h-4 w-4" />)}
              {navItem('disclaimer', 'Safety Disclaimer', <FileText className="h-4 w-4" />)}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-800/80 p-3 text-center">
          <p className="text-[10px] text-slate-500 leading-tight">
            DecroTrade &bull; Simulated Educational Environment.
            <br />
            No Real-Money Trading or Deposits.
          </p>
        </div>
      </aside>
    </>
  );
};
