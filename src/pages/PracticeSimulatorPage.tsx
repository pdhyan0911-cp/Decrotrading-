import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { InteractiveChart } from '../components/InteractiveChart';
import { OrderTicket } from '../components/OrderTicket';
import { PositionsTable } from '../components/PositionsTable';
import { ClosedTrade } from '../types';
import { PlayCircle, ShieldCheck, BookOpen, AlertCircle, Sparkles } from 'lucide-react';

interface PracticeSimulatorPageProps {
  navigate: (route: string) => void;
  onOpenJournalWithTrade?: (trade: ClosedTrade) => void;
}

export const PracticeSimulatorPage: React.FC<PracticeSimulatorPageProps> = ({
  navigate,
  onOpenJournalWithTrade
}) => {
  const { selectedSymbol, selectedInstrument } = useMarket();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOrderPlaced = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="rounded-xl border border-violet-900/40 bg-gradient-to-r from-violet-950/30 via-slate-900/80 to-[#0A0D15] p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-900/50 text-violet-300 border border-violet-700/50">
            <PlayCircle className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-white block">DecroTrade Virtual Practice Environment</span>
            <span className="text-slate-400 text-[11px]">
              Execute real-time virtual Long and Short positions with automated Stop-Loss and Take-Profit risk parameters.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('journal')}
            className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Open Trade Journal</span>
          </button>
          <button
            onClick={() => navigate('nova-ai')}
            className="flex items-center gap-1 rounded-lg bg-purple-950 px-3 py-1.5 text-xs text-purple-300 border border-purple-800/40 hover:bg-purple-900 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Audit Execution with AI</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Chart & Order Ticket */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InteractiveChart height={480} showToolbar={true} />
        </div>
        <div className="lg:col-span-1">
          <OrderTicket onOrderPlaced={handleOrderPlaced} />
        </div>
      </div>

      {/* Positions and History Table */}
      <PositionsTable
        refreshTrigger={refreshTrigger}
        onOpenJournalModal={(trade) => {
          if (onOpenJournalWithTrade) onOpenJournalWithTrade(trade);
          navigate('journal');
        }}
      />
    </div>
  );
};
