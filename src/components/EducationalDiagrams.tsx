import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Shield, TrendingUp, Info } from 'lucide-react';

interface DiagramProps {
  type: 'candlestick' | 'support_resistance' | 'risk_reward' | 'indicators' | 'order_book';
}

export const EducationalDiagram: React.FC<DiagramProps> = ({ type }) => {
  const [selectedCandleType, setSelectedCandleType] = useState<'bullish' | 'hammer' | 'shooting_star'>('bullish');
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [accountSize, setAccountSize] = useState<number>(100000);

  if (type === 'candlestick') {
    return (
      <div className="rounded-xl border border-slate-800 bg-[#0A0D15] p-5 my-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-400"></span>
              Interactive Candlestick Anatomical Model
            </h4>
            <p className="text-xs text-slate-400">Select candle archetype to observe real body and wick forces</p>
          </div>
          <div className="flex gap-1 rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedCandleType('bullish')}
              className={`rounded px-2.5 py-1 font-medium transition ${
                selectedCandleType === 'bullish' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Standard Bullish
            </button>
            <button
              onClick={() => setSelectedCandleType('hammer')}
              className={`rounded px-2.5 py-1 font-medium transition ${
                selectedCandleType === 'hammer' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bullish Hammer
            </button>
            <button
              onClick={() => setSelectedCandleType('shooting_star')}
              className={`rounded px-2.5 py-1 font-medium transition ${
                selectedCandleType === 'shooting_star' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Shooting Star
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* SVG Diagram */}
          <div className="flex justify-center bg-slate-950/60 rounded-lg p-6 border border-slate-900">
            <svg width="220" height="260" viewBox="0 0 220 260">
              {selectedCandleType === 'bullish' && (
                <g>
                  {/* Upper Wick */}
                  <line x1="110" y1="30" x2="110" y2="70" stroke="#10B981" strokeWidth="3" />
                  <text x="125" y="35" fill="#10B981" fontSize="11" fontWeight="bold">High ($155)</text>

                  {/* Body */}
                  <rect x="75" y="70" width="70" height="110" fill="#10B981" rx="2" stroke="#059669" strokeWidth="1" />
                  <text x="125" y="78" fill="#FFFFFF" fontSize="11" fontWeight="bold">Close ($150)</text>
                  <text x="125" y="175" fill="#E2E8F0" fontSize="11" fontWeight="bold">Open ($135)</text>

                  {/* Lower Wick */}
                  <line x1="110" y1="180" x2="110" y2="230" stroke="#10B981" strokeWidth="3" />
                  <text x="125" y="235" fill="#10B981" fontSize="11" fontWeight="bold">Low ($130)</text>
                </g>
              )}

              {selectedCandleType === 'hammer' && (
                <g>
                  {/* Upper Wick - minimal */}
                  <line x1="110" y1="35" x2="110" y2="40" stroke="#10B981" strokeWidth="3" />
                  <text x="125" y="40" fill="#10B981" fontSize="11" fontWeight="bold">High ($102)</text>

                  {/* Body - small near top */}
                  <rect x="75" y="40" width="70" height="40" fill="#10B981" rx="2" stroke="#059669" strokeWidth="1" />
                  <text x="125" y="55" fill="#FFFFFF" fontSize="11" fontWeight="bold">Close ($101.5)</text>
                  <text x="125" y="75" fill="#E2E8F0" fontSize="11" fontWeight="bold">Open ($100)</text>

                  {/* Long Lower Wick */}
                  <line x1="110" y1="80" x2="110" y2="240" stroke="#10B981" strokeWidth="3" />
                  <text x="125" y="240" fill="#10B981" fontSize="11" fontWeight="bold">Low ($88) - Rejection</text>
                </g>
              )}

              {selectedCandleType === 'shooting_star' && (
                <g>
                  {/* Long Upper Wick */}
                  <line x1="110" y1="20" x2="110" y2="180" stroke="#F43F5E" strokeWidth="3" />
                  <text x="125" y="30" fill="#F43F5E" fontSize="11" fontWeight="bold">High ($115) - Exhaustion</text>

                  {/* Body - near bottom */}
                  <rect x="75" y="180" width="70" height="40" fill="#F43F5E" rx="2" stroke="#E11D48" strokeWidth="1" />
                  <text x="125" y="195" fill="#FFFFFF" fontSize="11" fontWeight="bold">Open ($102)</text>
                  <text x="125" y="215" fill="#E2E8F0" fontSize="11" fontWeight="bold">Close ($100)</text>

                  {/* Minimal Lower Wick */}
                  <line x1="110" y1="220" x2="110" y2="235" stroke="#F43F5E" strokeWidth="3" />
                  <text x="125" y="235" fill="#F43F5E" fontSize="11" fontWeight="bold">Low ($99)</text>
                </g>
              )}
            </svg>
          </div>

          {/* Explanation Panel */}
          <div className="space-y-3 text-xs text-slate-300">
            <div className="rounded-lg bg-slate-900/80 p-3 border border-slate-800">
              <span className="font-semibold text-white block mb-1">
                {selectedCandleType === 'bullish' && 'Conviction Expansion Body'}
                {selectedCandleType === 'hammer' && 'Bullish Absorption & Wick Rejection'}
                {selectedCandleType === 'shooting_star' && 'Bearish Overhead Supply Rejection'}
              </span>
              <p className="text-slate-400 leading-relaxed">
                {selectedCandleType === 'bullish' &&
                  'The wide green body indicates sustained buying pressure from the opening bell right into the closing auction. Buyers dominated across the timeframe.'}
                {selectedCandleType === 'hammer' &&
                  'Sellers initially pushed price down aggressively to $88. However, smart-money buyers stepped in with high volume, rejecting the lower prices and driving the close back to the session peak.'}
                {selectedCandleType === 'shooting_star' &&
                  'Bulls made an enthusiastic bid upward to $115, but were met with overwhelming institutional sell orders that shoved price back down to close near the session low.'}
              </p>
            </div>
            <div className="text-[11px] text-slate-400 space-y-1">
              <div>&bull; <strong>Real Body:</strong> Measures net directional conviction between Open and Close.</div>
              <div>&bull; <strong>Wicks (Shadows):</strong> Measure price rejection and liquidity discovery.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'support_resistance') {
    return (
      <div className="rounded-xl border border-slate-800 bg-[#0A0D15] p-5 my-4">
        <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-violet-400"></span>
          The Polarity Principle: Broken Support Flips to New Resistance
        </h4>
        <p className="text-xs text-slate-400 mb-4">Observe how buyers trapped during a breakdown become eager sellers on the retest.</p>

        <div className="bg-slate-950/60 rounded-lg p-4 border border-slate-900 flex justify-center">
          <svg width="480" height="200" viewBox="0 0 480 200" className="w-full max-w-xl">
            {/* The Horizontal Flip Level */}
            <line x1="20" y1="100" x2="460" y2="100" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="6 4" />
            <text x="25" y="92" fill="#C4B5FD" fontSize="11" fontWeight="bold">Key Level: $150.00</text>

            {/* Support Zone Label */}
            <rect x="25" y="105" width="120" height="22" rx="4" fill="#065F46" fillOpacity="0.4" />
            <text x="32" y="120" fill="#34D399" fontSize="10" fontWeight="bold">Former Support Zone</text>

            {/* Resistance Zone Label */}
            <rect x="310" y="70" width="140" height="22" rx="4" fill="#881337" fillOpacity="0.4" />
            <text x="318" y="85" fill="#FB7185" fontSize="10" fontWeight="bold">New Resistance Zone</text>

            {/* Price Curve */}
            <path
              d="M 30 50 Q 60 98, 80 100 T 130 60 T 180 100 T 220 160 T 290 100 T 360 100 T 420 170"
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="2.5"
            />

            {/* Bounce 1 */}
            <circle cx="80" cy="100" r="4" fill="#10B981" />
            {/* Bounce 2 */}
            <circle cx="180" cy="100" r="4" fill="#10B981" />
            {/* Breakdown */}
            <circle cx="220" cy="120" r="4" fill="#F43F5E" />
            {/* Retest as Resistance */}
            <circle cx="325" cy="100" r="4" fill="#F59E0B" />
          </svg>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="rounded bg-slate-900 p-2 border border-slate-800">
            <span className="text-emerald-400 font-bold block">1. Established Support</span>
            <span className="text-slate-400 text-[11px]">Price bounces cleanly off $150 multiple times as buyers defend value.</span>
          </div>
          <div className="rounded bg-slate-900 p-2 border border-slate-800">
            <span className="text-rose-400 font-bold block">2. High-Volume Breakdown</span>
            <span className="text-slate-400 text-[11px]">Sellers overwhelm bids. Buyers at $150 are now underwater at an open loss.</span>
          </div>
          <div className="rounded bg-slate-900 p-2 border border-slate-800">
            <span className="text-amber-400 font-bold block">3. Polarity Retest</span>
            <span className="text-slate-400 text-[11px]">Trapped buyers sell to break even at $150, transforming it into strong overhead resistance.</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'risk_reward') {
    const riskDollar = accountSize * (riskPercent / 100);
    const stopDistance = 4.0;
    const targetDistance = stopDistance * 2.5; // 1:2.5
    const shares = Math.floor(riskDollar / stopDistance);

    return (
      <div className="rounded-xl border border-slate-800 bg-[#0A0D15] p-5 my-4">
        <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-400" />
          Interactive 1% Position Sizing Calculator
        </h4>
        <p className="text-xs text-slate-400 mb-4">Adjust your risk parameters to see mathematical position sizing in real time.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Account Balance ($)</label>
            <input
              type="number"
              value={accountSize}
              onChange={(e) => setAccountSize(parseFloat(e.target.value) || 10000)}
              className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-1.5 font-mono text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Account Risk %</label>
            <div className="flex gap-1">
              {[0.5, 1, 2].map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskPercent(r)}
                  className={`flex-1 rounded py-1.5 font-mono text-xs font-semibold ${
                    riskPercent === r ? 'bg-violet-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Max Dollar Loss Allowed</label>
            <div className="rounded bg-rose-950/40 border border-rose-900/50 px-3 py-1.5 font-mono text-xs font-bold text-rose-300">
              ${riskDollar.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-slate-900/80 p-4 border border-slate-800 text-xs space-y-2">
          <div className="flex justify-between items-center text-slate-300">
            <span>Hypothetical Stock Entry:</span>
            <span className="font-mono font-bold text-white">$100.00</span>
          </div>
          <div className="flex justify-between items-center text-rose-400">
            <span>Technical Invalidation Stop-Loss:</span>
            <span className="font-mono font-bold">$96.00 (Risk: $4.00/share)</span>
          </div>
          <div className="flex justify-between items-center text-emerald-400">
            <span>Target Price (1:2.5 R:R):</span>
            <span className="font-mono font-bold">$110.00 (Reward: $10.00/share)</span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
            <span className="text-violet-300">Calculated Safe Quantity:</span>
            <span className="font-mono text-white bg-violet-950 px-2 py-0.5 rounded border border-violet-800">
              {shares.toLocaleString()} shares
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0A0D15] p-4 text-xs text-slate-400 my-4 flex items-center gap-2">
      <Info className="h-4 w-4 text-violet-400" />
      <span>Diagram model active for conceptual instruction.</span>
    </div>
  );
};
