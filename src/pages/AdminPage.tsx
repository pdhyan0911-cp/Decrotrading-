import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import {
  ShieldAlert,
  Users,
  Activity,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Server,
  Lock,
  Layers
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchData = async () => {
    if (!token) return;
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (usersRes.ok) {
        const u = await usersRes.json();
        setUsers(u || []);
      }
      if (statsRes.ok) {
        const s = await statsRes.json();
        setStats(s);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleToggleSuspension = async (targetUser: User) => {
    if (!token) return;
    const nextState = !targetUser.isSuspended;
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isSuspended: nextState })
      });
      if (res.ok) {
        setFeedback(`User ${targetUser.name} ${nextState ? 'suspended' : 'activated'}.`);
        await fetchData();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleRole = async (targetUser: User) => {
    if (!token) return;
    const nextRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: nextRole })
      });
      if (res.ok) {
        setFeedback(`User ${targetUser.name} role changed to ${nextRole}.`);
        await fetchData();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="rounded-xl border border-rose-900/60 bg-rose-950/20 p-8 text-center text-xs space-y-2">
        <Lock className="mx-auto h-8 w-8 text-rose-400" />
        <h3 className="text-base font-bold text-white">Restricted Administrator Area</h3>
        <p className="text-slate-400">Your account does not possess authorized administrator credentials.</p>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-violet-400" />
            Admin Control Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Internal telemetry, student account moderation, and persistent database management.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-mono">Server Status: Healthy</span>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-950/60 p-3 text-xs text-emerald-300 border border-emerald-800/60">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Platform Health & Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4">
            <span className="text-xs text-slate-400 block mb-1">Registered Accounts</span>
            <span className="font-mono text-2xl font-bold text-white">{stats.totalUsers}</span>
            <span className="text-[10px] text-slate-500 block mt-1">{stats.activeSessions} active sessions</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4">
            <span className="text-xs text-slate-400 block mb-1">Completed Lessons</span>
            <span className="font-mono text-2xl font-bold text-violet-300">{stats.totalCompletedLessons}</span>
            <span className="text-[10px] text-slate-500 block mt-1">Across all students</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4">
            <span className="text-xs text-slate-400 block mb-1">Simulated Practice Trades</span>
            <span className="font-mono text-2xl font-bold text-emerald-400">{stats.totalSimulatedTrades}</span>
            <span className="text-[10px] text-slate-500 block mt-1">Virtual executions recorded</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4">
            <span className="text-xs text-slate-400 block mb-1">Certificates Conferred</span>
            <span className="font-mono text-2xl font-bold text-amber-400">{stats.totalCertificates}</span>
            <span className="text-[10px] text-slate-500 block mt-1">100% verified credentials</span>
          </div>
        </div>
      )}

      {/* User Accounts Management Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-5 shadow space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-violet-400" />
            Registered Student Accounts ({users.length})
          </h3>

          <div className="relative">
            <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="rounded-lg bg-slate-900 border border-slate-800 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                <th className="pb-3">Trader Name</th>
                <th className="pb-3">Email Address</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Level / XP</th>
                <th className="pb-3">Virtual Equity</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 font-sans font-semibold text-white">{u.name}</td>
                  <td className="py-3 text-slate-400">{u.email}</td>
                  <td className="py-3 font-sans">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-amber-400">
                    Lvl {u.level} ({u.xp} XP)
                  </td>
                  <td className="py-3 text-emerald-400">
                    ${(u.virtualBalance || 100000).toLocaleString()}
                  </td>
                  <td className="py-3 font-sans">
                    {u.isSuspended ? (
                      <span className="rounded bg-rose-950 px-2 py-0.5 text-[10px] text-rose-300 border border-rose-800">
                        Suspended
                      </span>
                    ) : (
                      <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] text-emerald-300 border border-emerald-800">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right font-sans space-x-2">
                    <button
                      onClick={() => handleToggleRole(u)}
                      className="rounded bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-slate-700"
                    >
                      {u.role === 'admin' ? 'Demote to User' : 'Make Admin'}
                    </button>
                    <button
                      onClick={() => handleToggleSuspension(u)}
                      className={`rounded px-2.5 py-1 text-[11px] font-medium ${
                        u.isSuspended
                          ? 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
                          : 'bg-rose-950 text-rose-300 hover:bg-rose-900'
                      }`}
                    >
                      {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
