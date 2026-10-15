import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { InteractiveChart } from '../components/InteractiveChart';
import {
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  Info,
  Sliders,
  ShieldCheck,
  Layers,
  ArrowRight
} from 'lucide-react';

interface MarketAnalysisPageProps {
  navigate: (route: string) => void;
}

export const MarketAnalysisPage: React.FC<MarketAnalysisPageProps> = ({ navigate }) => {
  const {
    instruments,
    selectedSymbol,
    selectedInstrument,
    setSelectedSymbol,
    orderBook,
    watchlist,
    toggleWatchlist
  } = useMarket();

  const [searchQuery, setSearchQuery] = useState('');
  const [assetFilter, setAssetFilter] = useState<'All' | 'Equities' | 'Crypto' | 'Forex' | 'Commodities'>('All');

  const filteredInstruments = instruments.filter((inst) => {
    const matchesSearch =
      inst.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = assetFilter === 'All' || inst.assetClass === assetFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Market Analysis Workspace</span>
            <span className="rounded bg-violet-950/80 px-2 py-0.5 text-[11px] font-mono text-violet-300 border border-violet-800/40">
              Interactive Terminal
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional multi-asset technical charting, order book depth, and liquidity analysis.
          </p>
        </div>

        <button
          onClick={() => navigate('practice')}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-emerald-500 transition"
        >
          <span>Practice Trade on {selectedSymbol}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Main Grid: Watchlist & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Searchable Instruments List */}
        <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4 lg:col-span-1 space-y-4">
          <div className="space-y-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symbol or asset..."
                className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-2 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1 text-[10px]">
              {(['All', 'Equities', 'Crypto', 'Forex', 'Commodities'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAssetFilter(filter)}
                  className={`rounded px-2 py-0.5 font-medium transition ${
                    assetFilter === filter
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Instruments Scroll List */}
          <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-800/60">
            {filteredInstruments.map((inst) => {
              const isSelected = inst.symbol === selectedSymbol;
              const isSaved = watchlist.includes(inst.symbol);

              return (
                <div
                  key={inst.symbol}
                  onClick={() => setSelectedSymbol(inst.symbol)}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition ${
                    isSelected ? 'bg-violet-950/40 border-l-2 border-violet-500' : 'hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(inst.symbol);
                      }}
                      className="text-slate-600 hover:text-amber-400"
                      aria-label="Toggle watchlist"
                    >
                      <Star className={`h-3.5 w-3.5 ${isSaved ? 'text-amber-400 fill-amber-400' : ''}`} />
                    </button>
                    <div>
                      <span className="font-mono font-bold text-xs text-white block">{inst.symbol}</span>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[100px]">{inst.name}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold text-white block">
                      ${inst.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </span>
                    <span
                      className={`font-mono text-[10px] font-semibold ${
                        inst.changePercent24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {inst.changePercent24h >= 0 ? '+' : ''}
                      {inst.changePercent24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center & Right: Interactive SVG Chart */}
        <div className="lg:col-span-3 space-y-6">
          <InteractiveChart height={540} showToolbar={true} />

          {/* Two Bottom Cards: Order Book Depth & Price Movement Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Simulated Order Book Depth */}
            <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-violet-400" />
                  Order Book Liquidity Depth
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  Spread: $
                  {orderBook.asks[0] && orderBook.bids[0]
                    ? (orderBook.asks[0].price - orderBook.bids[0].price).toFixed(
                        selectedInstrument?.pipSize && selectedInstrument.pipSize < 0.01 ? 4 : 2
                      )
                    : '0.01'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono text-[11px]">
                {/* Bids Column */}
                <div>
                  <div className="flex justify-between text-slate-500 mb-1 font-sans text-[10px] uppercase">
                    <span>Bid (Buy Limit)</span>
                    <span>Volume</span>
                  </div>
                  <div className="space-y-1">
                    {orderBook.bids.map((b, i) => (
                      <div key={i} className="flex justify-between text-emerald-400">
                        <span>${b.price.toFixed(selectedInstrument?.pipSize && selectedInstrument.pipSize < 0.01 ? 4 : 2)}</span>
                        <span className="text-slate-400">{b.size}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Asks Column */}
                <div>
                  <div className="flex justify-between text-slate-500 mb-1 font-sans text-[10px] uppercase">
                    <span>Ask (Sell Limit)</span>
                    <span>Volume</span>
                  </div>
                  <div className="space-y-1">
                    {orderBook.asks.map((a, i) => (
                      <div key={i} className="flex justify-between text-rose-400">
                        <span>${a.price.toFixed(selectedInstrument?.pipSize && selectedInstrument.pipSize < 0.01 ? 4 : 2)}</span>
                        <span className="text-slate-400">{a.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Movement & Asset Structural Driver */}
            <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-cyan-400" />
                  Asset Profile & Movement Explanation
                </span>
                <span className="text-[10px] text-slate-500">{selectedInstrument?.assetClass}</span>
              </div>

              <p className="text-slate-300 leading-relaxed text-[11px]">
                {selectedInstrument?.description}
              </p>

              <div className="rounded-lg bg-slate-900/80 p-3 border border-slate-800/80 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>24h Range:</span>
                  <span className="font-mono text-white">
                    ${selectedInstrument?.low24h.toFixed(2)} &mdash; ${selectedInstrument?.high24h.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>24h Est. Volume:</span>
                  <span className="font-mono text-white">
                    ${(selectedInstrument?.volume24h || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Market Feed Mode:</span>
                  <span className="font-mono text-emerald-400 font-semibold">Simulated Real-Time Tick</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
