import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  User as UserIcon,
  LogOut,
  Shield,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Layers,
  Award,
  BookOpen
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  currentRoute,
  navigate
}) => {
  const { user, isGuest, logout, notifications, markNotificationRead } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Level progress percentage
  const currentXP = user?.xp || 0;
  const level = user?.level || 1;
  const xpForNextLevel = Math.pow(level, 2) * 150;
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 150;
  const levelProgress = Math.min(
    100,
    Math.max(0, Math.round(((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel || 1)) * 100))
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070A11]/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Toggle navigation"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div
            onClick={() => navigate('dashboard')}
            className="flex cursor-pointer items-center gap-2.5 transition opacity-95 hover:opacity-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 via-indigo-700 to-purple-800 shadow-lg shadow-violet-900/30">
              <span className="font-mono text-base font-black text-white tracking-tighter">D</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white">DecroTrade</span>
                <span className="rounded bg-violet-950/80 px-1.5 py-0.2 text-[10px] font-bold text-violet-300 border border-violet-800/40">
                  EDU
                </span>
              </div>
              <span className="hidden text-[10px] font-medium text-slate-400 sm:inline-block">
                Learn the Market. Master the Strategy.
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Learning Level & Virtual Balance */}
        <div className="hidden md:flex items-center gap-4">
          {/* XP & Level Pill */}
          <div
            onClick={() => navigate('rewards')}
            className="flex cursor-pointer items-center gap-2.5 rounded-full bg-slate-900/90 py-1.5 px-3.5 border border-slate-800 hover:border-violet-500/50 transition"
          >
            <div className="flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-bold text-amber-400">LVL {level}</span>
            </div>
            <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              ></div>
            </div>
            <span className="font-mono text-[11px] text-slate-400">{currentXP} XP</span>
          </div>

          {/* Virtual Capital Pill */}
          <div
            onClick={() => navigate('practice')}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-slate-900/90 py-1.5 px-3.5 border border-slate-800 hover:border-emerald-500/50 transition"
            title="Virtual funds for educational practice only"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-slate-400">Virtual Portfolio:</span>
            <span className="font-mono text-xs font-bold text-emerald-400">
              ${(user?.virtualBalance || 100000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Right: Guest Warning, Notifications, User Menu */}
        <div className="flex items-center gap-2.5">
          {isGuest && (
            <div className="hidden sm:flex items-center gap-1 rounded bg-amber-950/60 px-2.5 py-1 text-xs text-amber-300 border border-amber-800/40">
              <span>Guest Mode</span>
              <button
                onClick={() => navigate('login')}
                className="underline ml-1 hover:text-white font-medium"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-[#0B0F19] p-3 shadow-2xl z-50">
                <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white">Notifications</span>
                  <span className="text-[10px] text-slate-400">{unreadCount} unread</span>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <div className="py-4 text-center text-xs text-slate-500">No notifications yet.</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`cursor-pointer rounded-lg p-2 text-xs transition ${
                          n.isRead ? 'bg-slate-900/40 text-slate-400' : 'bg-slate-800/80 text-slate-200 border-l-2 border-violet-500'
                        }`}
                      >
                        <div className="font-semibold text-white">{n.title}</div>
                        <div className="text-[11px] text-slate-400">{n.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-800/70 transition"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-900/60 border border-violet-700/50 text-xs font-bold text-violet-200">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-[#0B0F19] p-2 shadow-2xl z-50 text-xs text-slate-300 divide-y divide-slate-800">
                <div className="px-3 py-2">
                  <div className="font-semibold text-white truncate">{user?.name || 'Decro Learner'}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-violet-400">
                    <span className="capitalize">{user?.role}</span> &bull; {user?.tradingStyle}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate('profile');
                      setShowUserMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-slate-800 hover:text-white"
                  >
                    <UserIcon className="h-3.5 w-3.5" /> Profile & Stats
                  </button>
                  <button
                    onClick={() => {
                      navigate('rewards');
                      setShowUserMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-slate-800 hover:text-white"
                  >
                    <Award className="h-3.5 w-3.5" /> Certificates & Badges
                  </button>
                  <button
                    onClick={() => {
                      navigate('settings');
                      setShowUserMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-slate-800 hover:text-white"
                  >
                    Settings
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => {
                        navigate('admin');
                        setShowUserMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left text-violet-300 font-semibold hover:bg-violet-950/60"
                    >
                      <Shield className="h-3.5 w-3.5" /> Admin Control
                    </button>
                  )}
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                      navigate('landing');
                    }}
                    className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left text-rose-400 hover:bg-rose-950/40"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
