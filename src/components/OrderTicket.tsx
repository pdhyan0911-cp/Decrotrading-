import React, { useState, useEffect } from 'react';
import { useMarket } from '../context/MarketContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, AlertCircle, TrendingUp, TrendingDown, CheckCircle, Calculator } from 'lucide-react';

interface OrderTicketProps {
  onOrderPlaced?: () => void;
}

export const OrderTicket: React.FC<OrderTicketProps> = ({ onOrderPlaced }) => {
  const { selectedInstrument } = useMarket();
  const { user, token, isGuest } = useAuth();

  const [side, setSide] = useState<'long' | 'short'>('long');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [quantity, setQuantity] = useState<number>(10);
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [riskPercent, setRiskPercent] = useState<number>(1); // 1% default
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const price = selectedInstrument?.currentPrice || 100;
  const balance = user?.virtualBalance || 100000;

  // Auto calculate sensible SL/TP based on instrument volatility
  useEffect(() => {
    if (!selectedInstrument) return;
    const p = selectedInstrument.currentPrice;
    const delta = p * 0.02; // 2% distance
    if (side === 'long') {
      setStopLoss((p - delta).toFixed(selectedInstrument.pipSize < 0.01 ? 4 : 2));
      setTakeProfit((p + delta * 2.5).toFixed(selectedInstrument.pipSize < 0.01 ? 4 : 2));
    } else {
      setStopLoss((p + delta).toFixed(selectedInstrument.pipSize < 0.01 ? 4 : 2));
      setTakeProfit((p - delta * 2.5).toFixed(selectedInstrument.pipSize < 0.01 ? 4 : 2));
    }
  }, [selectedInstrument?.symbol, side]);

  // Position sizing helper
  const calculateSizeFromRisk = (pct: number) => {
    setRiskPercent(pct);
    const sl = parseFloat(stopLoss);
    if (!sl || isNaN(sl) || sl === price) return;
    const dollarRisk = balance * (pct / 100);
    const distancePerUnit = Math.abs(price - sl);
    if (distancePerUnit > 0) {
      const calculatedQty = Math.max(1, Math.floor(dollarRisk / distancePerUnit));
      setQuantity(calculatedQty);
    }
  };

  const parsedSL = parseFloat(stopLoss);
  const parsedTP = parseFloat(takeProfit);

  // Risk Reward Calculation
  const riskRewardRatio = (() => {
    if (!parsedSL || !parsedTP || isNaN(parsedSL) || isNaN(parsedTP)) return null;
    const risk = Math.abs(price - parsedSL);
    const reward = Math.abs(parsedTP - price);
    if (risk <= 0) return null;
    return (reward / risk).toFixed(2);
  })();

  const totalRequired = Number((quantity * price).toFixed(2));

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedInstrument) return;
    if (quantity <= 0) {
      setErrorMsg('Please enter a valid position quantity.');
      return;
    }
    if (totalRequired > balance) {
      setErrorMsg(`Insufficient virtual balance ($${balance.toLocaleString()}). Required: $${totalRequired.toLocaleString()}`);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isGuest) {
        // Guest mode simulated trade
        setSuccessMsg(`Simulated virtual ${side.toUpperCase()} order executed for ${quantity} ${selectedInstrument.symbol}!`);
        setIsSubmitting(false);
        if (onOrderPlaced) onOrderPlaced();
        return;
      }

      const res = await fetch('/api/simulator/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          symbol: selectedInstrument.symbol,
          side,
          quantity,
          stopLoss: parsedSL || undefined,
          takeProfit: parsedTP || undefined,
          leverage: 1
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      setSuccessMsg(`Virtual ${side.toUpperCase()} position opened: ${quantity} ${selectedInstrument.symbol} @ $${price}`);
      if (onOrderPlaced) onOrderPlaced();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error executing virtual order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4 text-slate-200 shadow-xl">
      <div className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="font-semibold text-white flex items-center gap-2">
            <span>Practice Order Execution</span>
          </h3>
          <p className="text-xs text-slate-400">Purely simulated capital &bull; Zero real money</p>
        </div>
        <span className="rounded bg-violet-950/80 px-2 py-0.5 text-xs font-mono font-medium text-violet-300 border border-violet-800/40">
          Virtual Funds: ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      <form onSubmit={handlePlaceOrder} className="space-y-4">
        {/* Long / Short Switcher */}
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-900 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setSide('long')}
            className={`flex items-center justify-center gap-1.5 rounded py-2 text-xs font-bold transition ${
              side === 'long'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            BUY / LONG
          </button>
          <button
            type="button"
            onClick={() => setSide('short')}
            className={`flex items-center justify-center gap-1.5 rounded py-2 text-xs font-bold transition ${
              side === 'short'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingDown className="h-4 w-4" />
            SELL / SHORT
          </button>
        </div>

        {/* Order Type & Current Market Price */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Order:</span>
            <button
              type="button"
              onClick={() => setOrderType('market')}
              className={`rounded px-2 py-0.5 font-medium ${
                orderType === 'market' ? 'bg-slate-800 text-violet-400 border border-violet-500/30' : 'text-slate-500'
              }`}
            >
              Market
            </button>
            <button
              type="button"
              onClick={() => setOrderType('limit')}
              className={`rounded px-2 py-0.5 font-medium ${
                orderType === 'limit' ? 'bg-slate-800 text-violet-400 border border-violet-500/30' : 'text-slate-500'
              }`}
            >
              Limit
            </button>
          </div>
          <div className="text-right">
            <span className="text-slate-400">Est. Price: </span>
            <span className="font-mono font-bold text-white">${price.toFixed(selectedInstrument?.pipSize && selectedInstrument.pipSize < 0.01 ? 4 : 2)}</span>
          </div>
        </div>

        {/* Position Quantity & Risk Sizing Pills */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <label className="text-slate-300 flex items-center gap-1">
              <span>Position Quantity:</span>
            </label>
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-500 flex items-center gap-0.5">
                <Calculator className="h-3 w-3" /> Risk Sizing:
              </span>
              {[0.5, 1, 2].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => calculateSizeFromRisk(pct)}
                  className={`rounded px-1.5 py-0.5 font-mono text-[10px] border ${
                    riskPercent === pct
                      ? 'border-violet-500 bg-violet-600/20 text-violet-300'
                      : 'border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
          <input
            type="number"
            min="0.01"
            step={selectedInstrument?.assetClass === 'Crypto' ? '0.01' : '1'}
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-white focus:border-violet-500 focus:outline-none"
            placeholder="Quantity"
          />
        </div>

        {/* Stop Loss & Take Profit */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-rose-300 font-medium flex items-center justify-between">
              <span>Stop-Loss ($)</span>
              <span className="text-[10px] text-slate-500">Protect capital</span>
            </label>
            <input
              type="number"
              step="any"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="w-full rounded-lg border border-rose-950/60 bg-slate-900 px-3 py-2 font-mono text-xs text-rose-300 focus:border-rose-500 focus:outline-none"
              placeholder="Exit if price hits"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-emerald-300 font-medium flex items-center justify-between">
              <span>Take-Profit ($)</span>
              <span className="text-[10px] text-slate-500">Target exit</span>
            </label>
            <input
              type="number"
              step="any"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              className="w-full rounded-lg border border-emerald-950/60 bg-slate-900 px-3 py-2 font-mono text-xs text-emerald-300 focus:border-emerald-500 focus:outline-none"
              placeholder="Exit if target hits"
            />
          </div>
        </div>

        {/* Risk / Reward Preview Card */}
        <div className="rounded-lg bg-slate-900/90 p-3 text-xs border border-slate-800/80 space-y-1.5">
          <div className="flex justify-between text-slate-400">
            <span>Virtual Cost:</span>
            <span className="font-mono text-slate-200">${totalRequired.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Risk-to-Reward:</span>
            <span className={`font-mono font-semibold ${riskRewardRatio && parseFloat(riskRewardRatio) >= 2 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {riskRewardRatio ? `1 : ${riskRewardRatio}` : 'Set SL & TP'}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Max Est. Loss:</span>
            <span className="font-mono text-rose-400">
              {parsedSL ? `-$${Math.abs((price - parsedSL) * quantity).toFixed(2)}` : 'Undefined (Dangerous)'}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg bg-rose-950/50 p-2.5 text-xs text-rose-300 border border-rose-800/50">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-950/50 p-2.5 text-xs text-emerald-300 border border-emerald-800/50">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Submit Execution Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition disabled:opacity-50 ${
            side === 'long'
              ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
              : 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/30'
          }`}
        >
          {isSubmitting ? 'Executing Virtual Order...' : `Execute ${side.toUpperCase()} ${selectedInstrument?.symbol || ''}`}
        </button>

        <p className="text-center text-[10px] text-slate-500">
          Educational simulation only. No brokerage connection, deposits, or cash withdrawals.
        </p>
      </form>
    </div>
  );
};
