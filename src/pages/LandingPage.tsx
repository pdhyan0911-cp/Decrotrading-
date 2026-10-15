import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Gamepad2,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  LineChart,
  Award
} from 'lucide-react';

interface LandingPageProps {
  navigate: (route: string) => void;
  onExploreAsGuest: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate, onExploreAsGuest }) => {
  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-700/40 bg-violet-950/40 px-3.5 py-1 text-xs font-semibold text-violet-300 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span>Next-Generation Financial Education & Virtual Practice</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Learn the Market. <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Master the Strategy.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-400 mb-8 leading-relaxed">
            DecroTrade is an institutional-grade educational ecosystem. Master price action, technical analysis, and risk management with 10 structured courses, realistic virtual simulators, and our intelligent Nova AI tutor.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('signup')}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/30 hover:bg-violet-500 transition"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onExploreAsGuest}
              className="rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              Explore as Guest
            </button>
            <button
              onClick={() => navigate('login')}
              className="rounded-xl px-4 py-3.5 text-sm font-semibold text-violet-400 hover:text-violet-300 transition"
            >
              Sign In &rarr;
            </button>
          </div>

          {/* Trust points */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>100% Educational & Virtual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Zero Real Capital Required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Strict 1% Risk Management Standard</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Ecosystem Pillars */}
      <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Built for Traders Who Respect Mathematics & Discipline
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            No get-rich-quick gimmicks. No casino animations. DecroTrade teaches the actual mechanical auction principles that govern global financial markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-800 bg-[#0A0E18] p-6 hover:border-violet-700/50 transition">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-950 text-violet-400 border border-violet-800/40">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">10 Comprehensive Courses</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              From market microstructure and candlestick wicks to institutional Fair Value Gaps and mathematical expectancy. Includes interactive knowledge checks and official completion certificates.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-800 bg-[#0A0E18] p-6 hover:border-violet-700/50 transition">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/40">
              <LineChart className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Virtual Trading Simulator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Practice entries and exits with a $100,000 virtual balance. Test stop-loss placement, automatic take-profit targets, and examine your trade journal with psychology tracking.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-800 bg-[#0A0E18] p-6 hover:border-violet-700/50 transition">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-950 text-purple-400 border border-purple-800/40">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Nova AI Learning Assistant</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by advanced Gemini AI, Nova explains intricate price action patterns, audits your trade journal for emotional biases, and generates customized practice quizzes on command.
            </p>
          </div>
        </div>
      </section>

      {/* Gamification & Challenges Feature Section */}
      <section className="py-16 bg-[#080B12] border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-2 block">
                Educational Gamification
              </span>
              <h2 className="text-3xl font-bold text-white mb-4">
                Sharpen Pattern Recognition Under Time Pressure
              </h2>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Test your skills in 7 interactive challenges: Candlestick Recognition, Chart Pattern Mastery, Bull vs. Bear Duels, and Risk Management calculations. Earn XP, unlock badges, and compete on the global leaderboard.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="h-6 w-6 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">1</div>
                  <span>Realistic multi-choice scenarios with instant visual diagrams</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="h-6 w-6 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">2</div>
                  <span>Detailed educational rationale for every single correct and incorrect answer</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="h-6 w-6 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">3</div>
                  <span>XP and badges have zero monetary value &bull; 100% focused on skill development</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0B0F1A] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4 text-violet-400" /> Challenge Spotlight
                </span>
                <span className="text-[11px] font-mono text-emerald-400">+50 XP Per Correct Answer</span>
              </div>
              <div className="rounded-xl bg-slate-900/90 p-4 border border-slate-800 text-xs space-y-3">
                <div className="text-slate-400 text-[11px]">Question 3 of 5 &bull; 15s Timer</div>
                <div className="font-semibold text-white">
                  "At key horizontal support, a candle forms with a tiny real body at the high and a lower wick 3x its body length. What is this high-probability reversal signal?"
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="rounded border border-slate-700 bg-slate-800 p-2 text-slate-300 text-[11px]">
                    A. Shooting Star
                  </div>
                  <div className="rounded border border-emerald-500/50 bg-emerald-950/40 p-2 text-emerald-300 text-[11px] font-bold">
                    B. Hammer (Correct)
                  </div>
                  <div className="rounded border border-slate-700 bg-slate-800 p-2 text-slate-300 text-[11px]">
                    C. Gravestone Doji
                  </div>
                  <div className="rounded border border-slate-700 bg-slate-800 p-2 text-slate-300 text-[11px]">
                    D. Marubozu
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Educational Disclaimer Banner */}
      <section className="py-12 max-w-4xl mx-auto px-4 text-center">
        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-6 text-xs text-amber-200/90">
          <div className="flex items-center justify-center gap-2 font-bold mb-2 text-amber-400">
            <ShieldCheck className="h-4 w-4" />
            <span>DecroTrade Safety & Educational Commitment</span>
          </div>
          <p className="leading-relaxed text-[11px] text-amber-300/80">
            DecroTrade is an educational and simulated platform only. We do NOT accept cash deposits, process real-money payments, execute live brokerage transactions, or provide investment advice. All balances, achievements, and statistics represent virtual educational progress.
          </p>
        </div>
      </section>
    </div>
  );
};
