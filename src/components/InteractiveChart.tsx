import React, { useState, useRef, useMemo } from 'react';
import { Candle } from '../types';
import { useMarket } from '../context/MarketContext';
import {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateBollingerBands
} from '../data/marketData';
import {
  Maximize2,
  TrendingUp,
  Activity,
  Layers,
  BarChart2,
  Sliders,
  Eye,
  Info
} from 'lucide-react';

interface InteractiveChartProps {
  height?: number;
  showToolbar?: boolean;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  height = 520,
  showToolbar = true
}) => {
  const {
    selectedInstrument,
    candles,
    timeframe,
    setTimeframe,
    chartType,
    setChartType,
    indicators,
    toggleIndicator,
    showSupportResistance,
    setShowSupportResistance
  } = useMarket();

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pre-calculate technical indicators
  const sma20 = useMemo(() => calculateSMA(candles, 20), [candles]);
  const ema50 = useMemo(() => calculateEMA(candles, 50), [candles]);
  const rsi = useMemo(() => calculateRSI(candles, 14), [candles]);
  const bollinger = useMemo(() => calculateBollingerBands(candles, 20, 2), [candles]);

  // Support & Resistance levels from swing points
  const supportResistanceLevels = useMemo(() => {
    if (candles.length < 15) return { support: null, resistance: null };
    let lowest = Infinity;
    let highest = -Infinity;
    for (const c of candles) {
      if (c.low < lowest) lowest = c.low;
      if (c.high > highest) highest = c.high;
    }
    // Middle recent swings
    const recent = candles.slice(-25);
    const recentHigh = Math.max(...recent.map((c) => c.high));
    const recentLow = Math.min(...recent.map((c) => c.low));
    return { support: recentLow, resistance: recentHigh };
  }, [candles]);

  // Layout dimensions
  const chartWidth = 900;
  const mainHeight = indicators.rsi ? height - 140 : height - 50;
  const rsiHeight = indicators.rsi ? 90 : 0;
  const padding = { top: 20, right: 65, bottom: 25, left: 15 };

  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = mainHeight - padding.top - padding.bottom;

  // Price Extents
  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    if (candles.length === 0) return { minPrice: 0, maxPrice: 100, maxVolume: 1000 };
    let min = Infinity;
    let max = -Infinity;
    let maxVol = 0;

    candles.forEach((c, idx) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > maxVol) maxVol = c.volume;

      // Include bollinger bands in scale if active
      if (indicators.bollinger && bollinger.upper[idx] !== null) {
        if (bollinger.upper[idx]! > max) max = bollinger.upper[idx]!;
        if (bollinger.lower[idx]! < min) min = bollinger.lower[idx]!;
      }
    });

    const buffer = (max - min) * 0.08 || 1;
    return {
      minPrice: min - buffer,
      maxPrice: max + buffer,
      maxVolume: maxVol || 1
    };
  }, [candles, indicators.bollinger, bollinger]);

  // Coordinate scales
  const candleCount = candles.length;
  const candleStep = plotWidth / Math.max(candleCount, 1);
  const candleBodyWidth = Math.max(2, Math.min(12, candleStep * 0.7));

  const getY = (price: number) => {
    const range = maxPrice - minPrice;
    if (range <= 0) return plotHeight / 2;
    return padding.top + plotHeight - ((price - minPrice) / range) * plotHeight;
  };

  const getX = (index: number) => {
    return padding.left + index * candleStep + candleStep / 2;
  };

  const hoveredCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];

  // Mouse interaction
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - svgRect.left;
    const clientY = e.clientY - svgRect.top;

    // Relative to scale
    const svgX = (clientX / svgRect.width) * chartWidth;
    const svgY = (clientY / svgRect.height) * height;

    const relativeX = svgX - padding.left;
    const idx = Math.floor(relativeX / candleStep);

    if (idx >= 0 && idx < candleCount) {
      setHoverIndex(idx);
      setCrosshairPos({ x: getX(idx), y: svgY });
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setCrosshairPos(null);
  };

  // Generate SVG path for line indicators
  const generateLinePath = (values: (number | null)[]) => {
    let path = '';
    values.forEach((val, idx) => {
      if (val === null) return;
      const x = getX(idx);
      const y = getY(val);
      if (!path) path = `M ${x} ${y}`;
      else path += ` L ${x} ${y}`;
    });
    return path;
  };

  // Generate Price Grid Lines
  const gridSteps = 5;
  const priceGrid = useMemo(() => {
    const lines = [];
    const step = (maxPrice - minPrice) / gridSteps;
    for (let i = 0; i <= gridSteps; i++) {
      const p = minPrice + step * i;
      lines.push({ price: p, y: getY(p) });
    }
    return lines;
  }, [minPrice, maxPrice, plotHeight]);

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-[#0A0E17] p-4 text-slate-200 shadow-xl">
      {/* Top Toolbar */}
      {showToolbar && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 text-xs">
          {/* Instrument summary */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-base font-bold text-white tracking-wide">
              {selectedInstrument?.symbol || 'ASSET'}
            </span>
            <span className="text-slate-400 hidden sm:inline">{selectedInstrument?.name}</span>
            <span className="rounded bg-violet-950/70 px-2 py-0.5 text-[11px] font-semibold text-violet-300 border border-violet-800/40">
              {selectedInstrument?.assetClass}
            </span>
            <span className="font-mono text-sm font-semibold text-white">
              ${selectedInstrument?.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </span>
            <span
              className={`font-mono text-xs font-semibold ${
                (selectedInstrument?.changePercent24h || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {(selectedInstrument?.changePercent24h || 0) >= 0 ? '+' : ''}
              {selectedInstrument?.changePercent24h.toFixed(2)}%
            </span>
          </div>

          {/* Timeframe Selectors */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-900/90 p-0.5 border border-slate-800">
            {(['1m', '5m', '15m', '1h', '1D'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`rounded px-2.5 py-1 font-mono text-xs font-medium transition ${
                  timeframe === tf
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Style Switcher */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-900/90 p-0.5 border border-slate-800">
            <button
              onClick={() => setChartType('candlestick')}
              className={`rounded px-2 py-1 text-xs transition ${
                chartType === 'candlestick' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Candlestick Chart"
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`rounded px-2 py-1 text-xs transition ${
                chartType === 'line' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Line Chart"
            >
              Line
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`rounded px-2 py-1 text-xs transition ${
                chartType === 'bar' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="OHLC Bar Chart"
            >
              Bars
            </button>
          </div>

          {/* Indicator Toggles */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => toggleIndicator('sma20')}
              className={`rounded px-2 py-1 text-xs font-mono font-medium transition border ${
                indicators.sma20
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              SMA 20
            </button>
            <button
              onClick={() => toggleIndicator('ema50')}
              className={`rounded px-2 py-1 text-xs font-mono font-medium transition border ${
                indicators.ema50
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              EMA 50
            </button>
            <button
              onClick={() => toggleIndicator('bollinger')}
              className={`rounded px-2 py-1 text-xs font-mono font-medium transition border ${
                indicators.bollinger
                  ? 'border-violet-500/40 bg-violet-500/10 text-violet-300'
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              BB 20,2
            </button>
            <button
              onClick={() => toggleIndicator('rsi')}
              className={`rounded px-2 py-1 text-xs font-mono font-medium transition border ${
                indicators.rsi
                  ? 'border-purple-500/40 bg-purple-500/10 text-purple-300'
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              RSI 14
            </button>
            <button
              onClick={() => setShowSupportResistance((v) => !v)}
              className={`rounded px-2 py-1 text-xs font-medium transition border ${
                showSupportResistance
                  ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              S/R Zones
            </button>
          </div>
        </div>
      )}

      {/* OHLC Header Stats on Hover */}
      <div className="mb-2 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
        {hoveredCandle ? (
          <div className="flex flex-wrap items-center gap-4">
            <span>
              O: <strong className="text-slate-100">{hoveredCandle.open.toFixed(2)}</strong>
            </span>
            <span>
              H: <strong className="text-emerald-400">{hoveredCandle.high.toFixed(2)}</strong>
            </span>
            <span>
              L: <strong className="text-rose-400">{hoveredCandle.low.toFixed(2)}</strong>
            </span>
            <span>
              C: <strong className={hoveredCandle.close >= hoveredCandle.open ? 'text-emerald-400' : 'text-rose-400'}>{hoveredCandle.close.toFixed(2)}</strong>
            </span>
            <span>
              Vol: <strong className="text-slate-300">{hoveredCandle.volume.toLocaleString()}</strong>
            </span>
            {hoverIndex !== null && rsi[hoverIndex] !== null && (
              <span className="text-purple-300">
                RSI: <strong>{rsi[hoverIndex]}</strong>
              </span>
            )}
          </div>
        ) : (
          <div>Hover across chart to inspect candlestick metrics</div>
        )}

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Simulated Market Feed / Educational Real-time Tick Engine</span>
        </div>
      </div>

      {/* Main SVG Chart Canvas */}
      <div ref={containerRef} className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${chartWidth} ${height}`}
          className="w-full h-auto cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Background grid lines & Price Labels */}
          {priceGrid.map((grid, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={grid.y}
                x2={chartWidth - padding.right}
                y2={grid.y}
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={chartWidth - padding.right + 6}
                y={grid.y + 4}
                fill="#64748B"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                {grid.price.toFixed(grid.price > 500 ? 1 : 2)}
              </text>
            </g>
          ))}

          {/* Support and Resistance Horizontal Lines */}
          {showSupportResistance && supportResistanceLevels.resistance && (
            <g>
              <line
                x1={padding.left}
                y1={getY(supportResistanceLevels.resistance)}
                x2={chartWidth - padding.right}
                y2={getY(supportResistanceLevels.resistance)}
                stroke="#F43F5E"
                strokeWidth="1.5"
                strokeDasharray="5 3"
              />
              <text
                x={padding.left + 5}
                y={getY(supportResistanceLevels.resistance) - 4}
                fill="#FDA4AF"
                fontSize="10"
                fontWeight="600"
              >
                Resistance: ${supportResistanceLevels.resistance.toFixed(2)}
              </text>
            </g>
          )}

          {showSupportResistance && supportResistanceLevels.support && (
            <g>
              <line
                x1={padding.left}
                y1={getY(supportResistanceLevels.support)}
                x2={chartWidth - padding.right}
                y2={getY(supportResistanceLevels.support)}
                stroke="#10B981"
                strokeWidth="1.5"
                strokeDasharray="5 3"
              />
              <text
                x={padding.left + 5}
                y={getY(supportResistanceLevels.support) + 12}
                fill="#6EE7B7"
                fontSize="10"
                fontWeight="600"
              >
                Support: ${supportResistanceLevels.support.toFixed(2)}
              </text>
            </g>
          )}

          {/* Bollinger Bands Shaded Area */}
          {indicators.bollinger && (
            <path
              d={`${generateLinePath(bollinger.upper)} L ${generateLinePath(bollinger.lower).replace('M', '').split('L').reverse().join('L ')} Z`}
              fill="#8B5CF6"
              fillOpacity="0.08"
            />
          )}

          {/* Volume Histogram (bottom 20% of main plot) */}
          {indicators.volume &&
            candles.map((candle, idx) => {
              const x = getX(idx);
              const volHeight = (candle.volume / maxVolume) * (plotHeight * 0.22);
              const y = padding.top + plotHeight - volHeight;
              const isUp = candle.close >= candle.open;
              return (
                <rect
                  key={`vol-${idx}`}
                  x={x - candleBodyWidth / 2}
                  y={y}
                  width={candleBodyWidth}
                  height={volHeight}
                  fill={isUp ? '#10B981' : '#F43F5E'}
                  opacity={hoverIndex === idx ? 0.6 : 0.25}
                />
              );
            })}

          {/* Main Price Action: Candlesticks / Line / Bars */}
          {chartType === 'candlestick' &&
            candles.map((candle, idx) => {
              const x = getX(idx);
              const isUp = candle.close >= candle.open;
              const openY = getY(candle.open);
              const closeY = getY(candle.close);
              const highY = getY(candle.high);
              const lowY = getY(candle.low);
              const topY = Math.min(openY, closeY);
              const bodyHeight = Math.max(2, Math.abs(closeY - openY));

              const color = isUp ? '#10B981' : '#F43F5E';
              const isSelected = hoverIndex === idx;

              return (
                <g key={`candle-${idx}`}>
                  {/* Upper & Lower Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={color}
                    strokeWidth={isSelected ? '2' : '1.2'}
                  />
                  {/* Real Body */}
                  <rect
                    x={x - candleBodyWidth / 2}
                    y={topY}
                    width={candleBodyWidth}
                    height={bodyHeight}
                    fill={color}
                    rx="1"
                    stroke={color}
                    strokeWidth="0.5"
                    className="transition-all"
                  />
                </g>
              );
            })}

          {chartType === 'line' && (
            <path
              d={generateLinePath(candles.map((c) => c.close))}
              fill="none"
              stroke="#A78BFA"
              strokeWidth="2.5"
            />
          )}

          {chartType === 'bar' &&
            candles.map((candle, idx) => {
              const x = getX(idx);
              const isUp = candle.close >= candle.open;
              const openY = getY(candle.open);
              const closeY = getY(candle.close);
              const highY = getY(candle.high);
              const lowY = getY(candle.low);
              const color = isUp ? '#10B981' : '#F43F5E';

              return (
                <g key={`bar-${idx}`}>
                  <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="1.5" />
                  <line x1={x - 3} y1={openY} x2={x} y2={openY} stroke={color} strokeWidth="1.5" />
                  <line x1={x} y1={closeY} x2={x + 3} y2={closeY} stroke={color} strokeWidth="1.5" />
                </g>
              );
            })}

          {/* SMA 20 Overlay */}
          {indicators.sma20 && (
            <path
              d={generateLinePath(sma20)}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.8"
            />
          )}

          {/* EMA 50 Overlay */}
          {indicators.ema50 && (
            <path
              d={generateLinePath(ema50)}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="1.8"
            />
          )}

          {/* Bollinger Bands Lines */}
          {indicators.bollinger && (
            <>
              <path
                d={generateLinePath(bollinger.upper)}
                fill="none"
                stroke="#C084FC"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
              <path
                d={generateLinePath(bollinger.lower)}
                fill="none"
                stroke="#C084FC"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
            </>
          )}

          {/* Current Price Horizontal Ray */}
          {candles.length > 0 && (
            <g>
              <line
                x1={padding.left}
                y1={getY(candles[candles.length - 1].close)}
                x2={chartWidth - padding.right}
                y2={getY(candles[candles.length - 1].close)}
                stroke="#8B5CF6"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <rect
                x={chartWidth - padding.right + 2}
                y={getY(candles[candles.length - 1].close) - 9}
                width={56}
                height={18}
                rx="3"
                fill="#7C3AED"
              />
              <text
                x={chartWidth - padding.right + 6}
                y={getY(candles[candles.length - 1].close) + 3}
                fill="#FFFFFF"
                fontSize="10"
                fontWeight="700"
                fontFamily="JetBrains Mono, monospace"
              >
                {candles[candles.length - 1].close.toFixed(2)}
              </text>
            </g>
          )}

          {/* Crosshair & Cursor tracking */}
          {crosshairPos && (
            <g>
              {/* Vertical line */}
              <line
                x1={crosshairPos.x}
                y1={padding.top}
                x2={crosshairPos.x}
                y2={padding.top + plotHeight}
                stroke="#94A3B8"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.7"
              />
              {/* Horizontal line */}
              <line
                x1={padding.left}
                y1={crosshairPos.y}
                x2={chartWidth - padding.right}
                y2={crosshairPos.y}
                stroke="#94A3B8"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.7"
              />
            </g>
          )}

          {/* RSI Sub-Panel */}
          {indicators.rsi && (
            <g transform={`translate(0, ${mainHeight + 15})`}>
              {/* Divider & Header */}
              <line x1={padding.left} y1={0} x2={chartWidth - padding.right} y2={0} stroke="#334155" strokeWidth="1" />
              <text x={padding.left + 5} y={14} fill="#C084FC" fontSize="10" fontWeight="600">
                RSI 14 (Overbought 70 / Oversold 30)
              </text>

              {/* 70 & 30 Reference lines */}
              <line x1={padding.left} y1={25} x2={chartWidth - padding.right} y2={25} stroke="#F43F5E" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <text x={chartWidth - padding.right + 5} y={28} fill="#F43F5E" fontSize="9">70</text>

              <line x1={padding.left} y1={55} x2={chartWidth - padding.right} y2={55} stroke="#334155" strokeWidth="0.8" strokeDasharray="2 2" />
              <text x={chartWidth - padding.right + 5} y={58} fill="#64748B" fontSize="9">50</text>

              <line x1={padding.left} y1={85} x2={chartWidth - padding.right} y2={85} stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <text x={chartWidth - padding.right + 5} y={88} fill="#10B981" fontSize="9">30</text>

              {/* RSI Curve */}
              <path
                d={(() => {
                  let path = '';
                  rsi.forEach((val, idx) => {
                    if (val === null) return;
                    const x = getX(idx);
                    // Scale 0-100 into height 90
                    const y = 100 - (val / 100) * 80 + 10;
                    if (!path) path = `M ${x} ${y}`;
                    else path += ` L ${x} ${y}`;
                  });
                  return path;
                })()}
                fill="none"
                stroke="#C084FC"
                strokeWidth="1.8"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Educational Bottom Bar */}
      <div className="mt-2 flex flex-wrap items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400"></span> SMA 20
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-400"></span> EMA 50
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-purple-400"></span> RSI 14
          </span>
        </div>
        <div className="text-right">
          Virtual Practice Terminal &bull; Zero Real Capital At Risk
        </div>
      </div>
    </div>
  );
};
