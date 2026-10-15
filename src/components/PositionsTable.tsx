import React, { useState, useEffect } from 'react';
import { Position, ClosedTrade } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  TrendingDown,
  XCircle,
  RotateCcw,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  History,
  Layers
} from 'lucide-react';

interface PositionsTableProps {
  onOpenJournalModal?: (trade: ClosedTrade) => void;
  refreshTrigger?: number;
}

export const PositionsTable: React.FC<PositionsTableProps> = ({ onOpenJournalModal, refreshTrigger }) => {
  const { token, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');
  const [positions, setPositions] = useState<Position[]>([]);
  const [closedTrades, setClosedTrades] = useState<ClosedTrade[]>([]);
  const [summary, setSummary] = useState<{
    virtualBalance: number;
    totalInvested: number;
    totalUnrealizedPnl: number;
    totalRealizedPnl: number;
    totalEquity: number;
    winRate: number;
  }>({
    virtualBalance: 100000,
    totalInvested: 0,
    totalUnrealizedPnl: 0,
    totalRealizedPnl: 0,
    totalEquity: 100000,
    winRate: 0
  });
  const [isClosingId, setIsClosingId] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/simulator/portfolio', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPositions(data.positions || []);
        setClosedTrades(data.closedTrades || []);
        setSummary({
          virtualBalance: data.virtualBalance,
          totalInvested: data.totalInvested,
          totalUnrealizedPnl: data.totalUnrealizedPnl,
          totalRealizedPnl: data.totalRealizedPnl,
          totalEquity: data.totalEquity,
          winRate: data.winRate
        });
      }
    } catch (e) {
      console.error('Failed to load portfolio:', e);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 3000);
    return () => clearInterval(interval);
  }, [token, refreshTrigger]);

  const handleClosePosition = async (posId: string) => {
    if (!token) return;
    setIsClosingId(posId);
    try {
      const res = await fetch(`/api/simulator/positions/${posId}/close`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setFeedbackMsg('Position successfully closed at current market price.');
        await fetchPortfolio();
        await refreshUser();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsClosingId(null);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  const handleResetBalance = async () => {
    if (!token) return;
    if (!window.confirm('Reset virtual balance back to $100,000.00? (This does not erase your completed courses)')) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch('/api/simulator/reset', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setFeedbackMsg('Virtual balance successfully reset to $100,000.00!');
        await fetchPortfolio();
        await refreshUser();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4 text-slate-200 shadow-xl">
      {/* Portfolio Summary Bar */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4 border-b border-slate-800/80 pb-4">
        <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800">
          <span className="block text-[11px] text-slate-400">Virtual Equity</span>
          <span className="font-mono text-base font-bold text-white">
            ${summary.totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800">
          <span className="block text-[11px] text-slate-400">Unrealized P&L</span>
          <span className={`font-mono text-base font-bold ${summary.totalUnrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {summary.totalUnrealizedPnl >= 0 ? '+' : ''}${summary.totalUnrealizedPnl.toFixed(2)}
          </span>
        </div>
        <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800">
          <span className="block text-[11px] text-slate-400">Realized P&L</span>
          <span className={`font-mono text-base font-bold ${summary.totalRealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {summary.totalRealizedPnl >= 0 ? '+' : ''}${summary.totalRealizedPnl.toFixed(2)}
          </span>
        </div>
        <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="block text-[11px] text-slate-400">Win Rate (Simulated)</span>
            <span className="font-mono text-base font-bold text-violet-300">{summary.winRate}%</span>
          </div>
          <button
            onClick={handleResetBalance}
            disabled={isResetting}
            title="Reset virtual balance to $100,000"
            className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-emerald-950/60 p-2.5 text-xs text-emerald-300 border border-emerald-800/60">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('open')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'open'
                ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Open Positions ({positions.length})
          </button>
          <button
            onClick={() => setActiveTab('closed')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'closed'
                ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            Practice History ({closedTrades.length})
          </button>
        </div>
      </div>

      {/* Tab: Open Positions */}
      {activeTab === 'open' && (
        <div className="overflow-x-auto">
          {positions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No active virtual positions open. Use the order ticket above to practice an entry.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                  <th className="pb-2">Instrument</th>
                  <th className="pb-2">Side</th>
                  <th className="pb-2">Size</th>
                  <th className="pb-2">Entry</th>
                  <th className="pb-2">Current</th>
                  <th className="pb-2">Stop-Loss</th>
                  <th className="pb-2">Take-Profit</th>
                  <th className="pb-2">Unrealized P&L</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {positions.map((pos) => {
                  const isProfit = pos.unrealizedPnl >= 0;
                  return (
                    <tr key={pos.id} className="hover:bg-slate-900/40 transition">
                      <td className="py-2.5 font-bold text-white">{pos.symbol}</td>
                      <td className="py-2.5">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                            pos.side === 'long'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                              : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                          }`}
                        >
                          {pos.side}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-200">{pos.quantity}</td>
                      <td className="py-2.5 text-slate-300">${pos.entryPrice.toFixed(2)}</td>
                      <td className="py-2.5 text-white font-semibold">${pos.currentPrice.toFixed(2)}</td>
                      <td className="py-2.5 text-rose-400">{pos.stopLoss ? `$${pos.stopLoss.toFixed(2)}` : '—'}</td>
                      <td className="py-2.5 text-emerald-400">{pos.takeProfit ? `$${pos.takeProfit.toFixed(2)}` : '—'}</td>
                      <td className={`py-2.5 font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isProfit ? '+' : ''}${pos.unrealizedPnl.toFixed(2)} ({isProfit ? '+' : ''}{pos.unrealizedPnlPercent.toFixed(2)}%)
                      </td>
                      <td className="py-2.5 text-right font-sans">
                        <button
                          onClick={() => handleClosePosition(pos.id)}
                          disabled={isClosingId === pos.id}
                          className="rounded bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-rose-300 hover:bg-rose-950 hover:border-rose-700 border border-slate-700 transition"
                        >
                          {isClosingId === pos.id ? 'Closing...' : 'Close'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab: Closed History */}
      {activeTab === 'closed' && (
        <div className="overflow-x-auto">
          {closedTrades.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No closed practice trades recorded yet. Completed trades will appear here with P&L audits.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                  <th className="pb-2">Instrument</th>
                  <th className="pb-2">Side</th>
                  <th className="pb-2">Entry &bull; Exit</th>
                  <th className="pb-2">Exit Reason</th>
                  <th className="pb-2">Risk/Reward</th>
                  <th className="pb-2">Realized P&L</th>
                  <th className="pb-2 text-right">Journal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {closedTrades.map((t) => {
                  const isProfit = t.realizedPnl >= 0;
                  return (
                    <tr key={t.id} className="hover:bg-slate-900/40 transition">
                      <td className="py-2.5 font-bold text-white">{t.symbol}</td>
                      <td className="py-2.5">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                            t.side === 'long'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                              : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                          }`}
                        >
                          {t.side}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-300">
                        ${t.entryPrice.toFixed(2)} &rarr; ${t.exitPrice.toFixed(2)}
                      </td>
                      <td className="py-2.5 font-sans">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] capitalize ${
                            t.closeReason === 'take_profit'
                              ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/30'
                              : t.closeReason === 'stop_loss'
                              ? 'bg-rose-950/70 text-rose-300 border border-rose-800/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {t.closeReason.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-300">
                        {t.riskRewardRatio ? `1 : ${t.riskRewardRatio}` : '—'}
                      </td>
                      <td className={`py-2.5 font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isProfit ? '+' : ''}${t.realizedPnl.toFixed(2)} ({isProfit ? '+' : ''}{t.realizedPnlPercent.toFixed(2)}%)
                      </td>
                      <td className="py-2.5 text-right font-sans">
                        {onOpenJournalModal && (
                          <button
                            onClick={() => onOpenJournalModal(t)}
                            className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[11px] font-medium text-violet-300 hover:bg-violet-950 hover:border-violet-700 border border-slate-700 transition"
                          >
                            <BookOpen className="h-3 w-3" />
                            Log Note
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};
