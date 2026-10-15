import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BADGES_DATA } from '../data/coursesData';
import { Certificate } from '../types';
import {
  Award,
  Lock,
  CheckCircle2,
  Printer,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  FileCheck
} from 'lucide-react';

const LEVEL_ROADMAP = [
  { level: 1, title: 'Novice Student', xp: 0, perk: 'Unlocked Market Fundamentals & Simulator access' },
  { level: 2, title: 'Chart Apprentice', xp: 600, perk: 'Unlocked Candlestick Pattern recognizer' },
  { level: 3, title: 'Price Action Practitioner', xp: 1350, perk: 'Unlocked Multi-timeframe trend tools' },
  { level: 4, title: 'Risk Strategist', xp: 2400, perk: 'Unlocked Advanced 1% Position Sizing calculator' },
  { level: 5, title: 'Market Technician', xp: 3750, perk: 'Unlocked Divergence and Momentum scanner' },
  { level: 6, title: 'Discipline Master', xp: 5400, perk: 'Unlocked Nova AI Journal Review audit' },
  { level: 7, title: 'Liquidity Hunter', xp: 7350, perk: 'Unlocked Smart Money Concepts & FVG course' },
  { level: 8, title: 'Senior Analyst', xp: 9600, perk: 'Community mentor badge & verified certificate status' },
  { level: 9, title: 'Lead Strategist', xp: 12150, perk: 'Featured on the global hall of fame' },
  { level: 10, title: 'Decro Market Master', xp: 15000, perk: 'Curriculum Master certification' }
];

export const RewardsPage: React.FC = () => {
  const { user, token } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [activeCertModal, setActiveCertModal] = useState<Certificate | null>(null);

  useEffect(() => {
    if (token) {
      fetch('/api/certificates', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((r) => r.json())
        .then((data) => setCertificates(data || []))
        .catch(console.error);
    }
  }, [token]);

  const earnedBadgeIds = user?.earnedBadges || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-400" />
          Achievements, Badges & Certificates
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Celebrate genuine academic milestones and verified course completions.
        </p>
      </div>

      {/* Verified Certificates Section */}
      <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-5 shadow space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-emerald-400" />
              Verified Course Certificates ({certificates.length})
            </h3>
            <span className="text-xs text-slate-400">Official completion credentials with unique verification hash.</span>
          </div>
        </div>

        {certificates.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No certificates earned yet. Complete all lessons and quizzes in a course to earn your verified credential!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-[#0C1220] to-[#12192B] p-5 shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="rounded bg-amber-950 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-800/40">
                      100% Score Verified
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">{cert.issueDate}</span>
                  </div>

                  <h4 className="font-bold text-white text-base">{cert.courseTitle}</h4>
                  <p className="text-xs text-slate-400 mt-1">Conferred upon: <strong className="text-slate-200">{cert.userName}</strong></p>

                  <div className="mt-3 font-mono text-[11px] text-amber-400/90">
                    ID: {cert.verificationCode}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 mt-4 flex justify-end">
                  <button
                    onClick={() => setActiveCertModal(cert)}
                    className="flex items-center gap-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>View & Print</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievement Badges Showcase */}
      <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-5 shadow space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            Milestone Achievement Badges ({earnedBadgeIds.length} / {BADGES_DATA.length} Unlocked)
          </h3>
          <span className="text-xs text-slate-400">Earn badges through disciplined study, quizzes, and trade journaling.</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {BADGES_DATA.map((badge) => {
            const isUnlocked = earnedBadgeIds.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-xl border p-4 text-center transition ${
                  isUnlocked
                    ? 'border-amber-500/40 bg-amber-950/20 text-slate-200'
                    : 'border-slate-800/80 bg-slate-900/30 text-slate-500 opacity-60'
                }`}
              >
                <div
                  className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
                    isUnlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {isUnlocked ? <Award className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                </div>

                <div className={`text-xs font-bold ${isUnlocked ? 'text-amber-300' : 'text-slate-400'}`}>
                  {badge.name}
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
                <span className="inline-block mt-2 font-mono text-[10px] text-amber-400 font-semibold">
                  +{badge.xpReward} XP
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Progression Roadmap */}
      <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-5 shadow space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            Scholar Level Progression Roadmap
          </h3>
          <span className="text-xs text-slate-400">Advance through 10 mastery ranks based on total earned XP.</span>
        </div>

        <div className="divide-y divide-slate-800/60 font-mono text-xs">
          {LEVEL_ROADMAP.map((item) => {
            const isCurrent = (user?.level || 1) === item.level;
            const isPassed = (user?.level || 1) > item.level;

            return (
              <div
                key={item.level}
                className={`py-3 flex flex-wrap items-center justify-between gap-3 ${
                  isCurrent ? 'bg-violet-950/30 px-3 rounded-lg border border-violet-800/40' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      isPassed
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {item.level}
                  </span>
                  <div>
                    <span className="font-bold text-white font-sans block">{item.title}</span>
                    <span className="text-[11px] text-slate-400 font-sans">{item.perk}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">{item.xp} XP Requirement</span>
                  {isCurrent && (
                    <span className="rounded bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      Current Rank
                    </span>
                  )}
                  {isPassed && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Print Certificate Modal */}
      {activeCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-amber-500/60 bg-[#0B0E17] p-8 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
              <Award className="h-10 w-10" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Certificate of Completion
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">{activeCertModal.courseTitle}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Conferred to <strong className="text-white">{activeCertModal.userName}</strong> on {activeCertModal.issueDate}
              </p>
            </div>

            <div className="rounded-lg bg-slate-900/90 p-4 border border-slate-800 text-xs font-mono text-slate-300">
              Verification Code: <strong className="text-amber-300">{activeCertModal.verificationCode}</strong>
              <div className="text-[11px] text-slate-500 mt-1">
                DecroTrade Academic Standards &bull; 100% Score Verified
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
              >
                <Printer className="h-4 w-4" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setActiveCertModal(null)}
                className="rounded-lg bg-violet-600 px-5 py-2 text-xs font-bold text-white hover:bg-violet-500 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
