import React, { useState, useEffect } from 'react';
import { TradeJournalEntry, ClosedTrade } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Smile,
  Frown,
  Brain,
  Shield,
  Calendar
} from 'lucide-react';

interface TradeJournalPageProps {
  initialTradeForModal?: ClosedTrade | null;
  onClearInitialTrade?: () => void;
  navigate: (route: string) => void;
}

export const TradeJournalPage: React.FC<TradeJournalPageProps> = ({
  initialTradeForModal,
  onClearInitialTrade,
  navigate
}) => {
  const { token, refreshUser } = useAuth();
  const [entries, setEntries] = useState<TradeJournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(!!initialTradeForModal);

  // Form State
  const [symbol, setSymbol] = useState(initialTradeForModal?.symbol || 'AAPL');
  const [side, setSide] = useState<'long' | 'short'>(initialTradeForModal?.side || 'long');
  const [pnl, setPnl] = useState<string>(initialTradeForModal ? String(initialTradeForModal.realizedPnl) : '');
  const [strategyUsed, setStrategyUsed] = useState('Breakout Retest on 1H Chart');
  const [emotionalState, setEmotionalState] = useState<
    'Calm & Objective' | 'Disciplined' | 'Hesitant / Anxious' | 'FOMO / Impatient' | 'Overconfident'
  >('Disciplined');
  const [followedPlan, setFollowedPlan] = useState<boolean>(true);
  const [mistakeTagInput, setMistakeTagInput] = useState<string>('');
  const [mistakeTags, setMistakeTags] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [isAuditingAI, setIsAuditingAI] = useState<boolean>(false);
  const [activeAiReview, setActiveAiReview] = useState<{ id: string; feedback: string } | null>(null);

  const fetchEntries = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/journal', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [token]);

  const handleAddMistakeTag = () => {
    if (mistakeTagInput.trim() && !mistakeTags.includes(mistakeTagInput.trim())) {
      setMistakeTags([...mistakeTags, mistakeTagInput.trim()]);
      setMistakeTagInput('');
    }
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          symbol: symbol.toUpperCase(),
          side,
          pnl: pnl ? parseFloat(pnl) : undefined,
          strategyUsed,
          emotionalState,
          followedPlan,
          mistakeTags,
          notes,
          entryDate: new Date().toISOString()
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        setNotes('');
        setMistakeTags([]);
        if (onClearInitialTrade) onClearInitialTrade();
        await fetchEntries();
        await refreshUser();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`/api/journal/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestAiAudit = async (entry: TradeJournalEntry) => {
    setIsAuditingAI(true);
    try {
      const res = await fetch('/api/nova-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: `Analyze my trade journal entry for ${entry.symbol}. I executed a ${entry.side.toUpperCase()} trade using "${entry.strategyUsed}". Emotional state was "${entry.emotionalState}". Plan adherence: ${entry.followedPlan ? 'Yes' : 'No'}. Mistakes noted: ${entry.mistakeTags.join(', ') || 'None'}. Notes: "${entry.notes}". Please evaluate my discipline, risk management, and psychology.`,
          contextType: 'journal_review',
          journalContext: entry
        })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveAiReview({ id: entry.id, feedback: data.reply });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-violet-400" />
            Trade Journal & Psychological Audit
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Record each practice execution, tag emotional state, and audit execution discipline with Nova AI.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-violet-500 transition"
        >
          <Plus className="h-4 w-4" />
          <span>New Journal Entry</span>
        </button>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-12 text-center text-xs text-slate-500">
            <BookOpen className="mx-auto h-8 w-8 text-slate-600 mb-2" />
            <span className="block font-semibold text-slate-400">No journal reflections recorded yet.</span>
            <span>Record your setups, emotional observations, and lessons learned to build institutional discipline.</span>
          </div>
        ) : (
          entries.map((entry) => {
            const isProfit = (entry.pnl || 0) >= 0;
            return (
              <div
                key={entry.id}
                className="rounded-xl border border-slate-800 bg-[#0B0F19] p-5 shadow space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-white">{entry.symbol}</span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        entry.side === 'long'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                          : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                      }`}
                    >
                      {entry.side}
                    </span>
                    {entry.pnl !== undefined && (
                      <span className={`font-mono text-xs font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isProfit ? '+' : ''}${entry.pnl.toFixed(2)}
                      </span>
                    )}
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                      {entry.strategyUsed}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-mono">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Delete journal entry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Emotional State & Plan Adherence Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 rounded bg-slate-900 px-2 py-1 border border-slate-800 text-slate-300 text-[11px]">
                    <Brain className="h-3.5 w-3.5 text-purple-400" />
                    <span>Mindset: <strong>{entry.emotionalState}</strong></span>
                  </div>

                  <div
                    className={`flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium border ${
                      entry.followedPlan
                        ? 'border-emerald-800/40 bg-emerald-950/40 text-emerald-300'
                        : 'border-amber-800/40 bg-amber-950/40 text-amber-300'
                    }`}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    <span>{entry.followedPlan ? 'Plan Adherence: Maintained' : 'Plan Adherence: Deviated'}</span>
                  </div>

                  {entry.mistakeTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-rose-950/40 border border-rose-900/40 px-2 py-0.5 text-[10px] text-rose-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Notes Body */}
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/40 p-3 rounded-lg border border-slate-900">
                  {entry.notes}
                </p>

                {/* Nova AI Audit Feedback */}
                {activeAiReview?.id === entry.id ? (
                  <div className="rounded-lg border border-purple-900/50 bg-purple-950/20 p-4 text-xs text-slate-200 space-y-2">
                    <div className="flex items-center justify-between border-b border-purple-900/40 pb-2">
                      <span className="font-bold text-purple-300 flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4" /> Nova AI Pedagogical Review
                      </span>
                      <button
                        onClick={() => setActiveAiReview(null)}
                        className="text-purple-400 hover:text-white text-[11px]"
                      >
                        Close Review
                      </button>
                    </div>
                    <div className="prose prose-invert max-w-none text-xs leading-relaxed whitespace-pre-line text-slate-300">
                      {activeAiReview.feedback}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRequestAiAudit(entry)}
                    disabled={isAuditingAI}
                    className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isAuditingAI ? 'Analyzing with Nova AI...' : 'Request Nova AI Feedback on this Trade &rarr;'}</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: New Journal Entry */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Record Trade Journal Entry</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Symbol</label>
                  <input
                    type="text"
                    required
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-slate-800 p-2 font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Side</label>
                  <select
                    value={side}
                    onChange={(e) => setSide(e.target.value as any)}
                    className="w-full rounded bg-slate-900 border border-slate-800 p-2 text-white"
                  >
                    <option value="long">Long (Buy)</option>
                    <option value="short">Short (Sell)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Realized P&L ($)</label>
                  <input
                    type="number"
                    step="any"
                    value={pnl}
                    onChange={(e) => setPnl(e.target.value)}
                    placeholder="e.g. +350"
                    className="w-full rounded bg-slate-900 border border-slate-800 p-2 font-mono text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Strategy Used</label>
                <select
                  value={strategyUsed}
                  onChange={(e) => setStrategyUsed(e.target.value)}
                  className="w-full rounded bg-slate-900 border border-slate-800 p-2 text-white"
                >
                  <option value="Breakout Retest on 1H Chart">Breakout Retest on 1H Chart</option>
                  <option value="Support & Demand Zone Bounce">Support & Demand Zone Bounce</option>
                  <option value="Fair Value Gap (FVG) Retracement">Fair Value Gap (FVG) Retracement</option>
                  <option value="Bearish RSI Divergence at Resistance">Bearish RSI Divergence at Resistance</option>
                  <option value="Moving Average Confluence Pullback">Moving Average Confluence Pullback</option>
                  <option value="Liquidity Sweep Reversal">Liquidity Sweep Reversal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Emotional State</label>
                  <select
                    value={emotionalState}
                    onChange={(e) => setEmotionalState(e.target.value as any)}
                    className="w-full rounded bg-slate-900 border border-slate-800 p-2 text-white"
                  >
                    <option value="Disciplined">Disciplined</option>
                    <option value="Calm & Objective">Calm & Objective</option>
                    <option value="Hesitant / Anxious">Hesitant / Anxious</option>
                    <option value="FOMO / Impatient">FOMO / Impatient</option>
                    <option value="Overconfident">Overconfident</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Did you follow your plan?</label>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setFollowedPlan(true)}
                      className={`flex-1 rounded p-1.5 font-bold ${
                        followedPlan ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      Yes (Disciplined)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFollowedPlan(false)}
                      className={`flex-1 rounded p-1.5 font-bold ${
                        !followedPlan ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      No (Deviated)
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Mistake Tags (Optional)</label>
                <div className="flex gap-2 mb-1.5">
                  <input
                    type="text"
                    value={mistakeTagInput}
                    onChange={(e) => setMistakeTagInput(e.target.value)}
                    placeholder="e.g. Moved stop loss, Chased candle"
                    className="flex-1 rounded bg-slate-900 border border-slate-800 p-2 text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddMistakeTag}
                    className="rounded bg-slate-800 px-3 py-2 text-slate-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {mistakeTags.map((tag, i) => (
                    <span key={i} className="rounded bg-rose-950 border border-rose-800 px-2 py-0.5 text-[10px] text-rose-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Trade Notes & Reflections</label>
                <textarea
                  required
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What was your setup thesis? Where was your invalidation stop? Did you execute cleanly?"
                  className="w-full rounded bg-slate-900 border border-slate-800 p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-violet-600 px-5 py-2 font-bold text-white hover:bg-violet-500"
                >
                  Save Entry (+200 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
