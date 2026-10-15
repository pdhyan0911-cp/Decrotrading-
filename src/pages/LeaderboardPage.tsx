import React, { useState, useEffect } from 'react';
import { CHALLENGES } from '../data/challengesData';
import { Trophy, Medal, Award, Clock, Target, User } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const url = selectedChallengeId ? `/api/leaderboard?challengeId=${selectedChallengeId}` : '/api/leaderboard';
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setLeaderboard(data || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [selectedChallengeId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            DecroTrade Global Leaderboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified academic scores and speed completions recorded across all trading challenges.
          </p>
        </div>

        {/* Filter */}
        <select
          value={selectedChallengeId}
          onChange={(e) => setSelectedChallengeId(e.target.value)}
          className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-violet-500 focus:outline-none"
        >
          <option value="">All Challenges Combined</option>
          {CHALLENGES.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.title}
            </option>
          ))}
        </select>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-5 shadow">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading rankings...</div>
        ) : leaderboard.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No challenge records logged yet. Play a challenge to claim the top spot!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                  <th className="pb-3 w-16">Rank</th>
                  <th className="pb-3">Trader</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Accuracy</th>
                  <th className="pb-3">Time Spent</th>
                  <th className="pb-3 text-right">Recorded Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {leaderboard.map((entry, idx) => {
                  const isTop3 = idx < 3;
                  return (
                    <tr key={idx} className="hover:bg-slate-900/40 transition">
                      <td className="py-3">
                        {idx === 0 ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-black font-bold text-xs">
                            1
                          </span>
                        ) : idx === 1 ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-black font-bold text-xs">
                            2
                          </span>
                        ) : idx === 2 ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-700 text-white font-bold text-xs">
                            3
                          </span>
                        ) : (
                          <span className="text-slate-500 pl-2">#{idx + 1}</span>
                        )}
                      </td>
                      <td className="py-3 font-sans font-semibold text-white flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-950 text-violet-300 text-[10px] border border-violet-800/50">
                          {entry.userName ? entry.userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span>{entry.userName}</span>
                      </td>
                      <td className="py-3 text-violet-300 font-bold">
                        {entry.score} / {entry.total}
                      </td>
                      <td className="py-3 text-emerald-400 font-semibold">{entry.accuracyPercent}%</td>
                      <td className="py-3 text-slate-400">{entry.timeSpentSeconds}s</td>
                      <td className="py-3 text-right text-slate-500 font-sans text-[11px]">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
