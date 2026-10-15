import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Shield,
  Award,
  BookOpen,
  TrendingUp,
  Clock,
  Edit2,
  CheckCircle2,
  Save
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, isGuest, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [tradingStyle, setTradingStyle] = useState<any>(user?.tradingStyle || 'Beginner Learner');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      bio,
      tradingStyle
    });
    setIsEditing(false);
    setFeedback('Profile successfully updated!');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="h-5 w-5 text-violet-400" />
            Student Profile & Trading Identity
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your personal bio, learning persona, and trading philosophy.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-950/60 p-3 text-xs text-emerald-300 border border-emerald-800/60">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-6 shadow space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-800 text-2xl font-bold text-white shadow-xl shadow-violet-900/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-white">{user?.name || 'Decro Learner'}</h2>
              <span className="rounded bg-violet-950 px-2 py-0.5 text-[10px] font-bold text-violet-300 border border-violet-800/40 capitalize">
                {user?.role || 'user'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
            <p className="text-xs text-violet-300 font-semibold">{user?.tradingStyle}</p>
            <p className="text-xs text-slate-300 mt-2 max-w-xl">
              {user?.bio || 'Dedicated to learning price action dynamics, market microstructure, and strict risk control.'}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="pt-4 border-t border-slate-800 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded bg-slate-900 border border-slate-800 p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Trading Style Archetype</label>
                <select
                  value={tradingStyle}
                  onChange={(e) => setTradingStyle(e.target.value)}
                  className="w-full rounded bg-slate-900 border border-slate-800 p-2 text-white"
                >
                  <option value="Beginner Learner">Beginner Learner</option>
                  <option value="Swing Trader">Swing Trader</option>
                  <option value="Day Trader">Day Trader</option>
                  <option value="Scalper">Scalper</option>
                  <option value="Position Trader">Position Trader</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Personal Bio & Trading Philosophy</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded bg-slate-900 border border-slate-800 p-2 text-white"
                placeholder="Describe your current trading goals and market focus..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded bg-violet-600 px-4 py-2 font-bold text-white hover:bg-violet-500"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block">Level</span>
            <span className="font-mono text-base font-bold text-amber-400">Level {user?.level || 1}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Experience</span>
            <span className="font-mono text-base font-bold text-white">{user?.xp || 0} XP</span>
          </div>
          <div>
            <span className="text-slate-500 block">Lessons Completed</span>
            <span className="font-mono text-base font-bold text-violet-300">
              {user?.completedLessons?.length || 0}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Member Since</span>
            <span className="font-mono text-xs text-slate-300">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
