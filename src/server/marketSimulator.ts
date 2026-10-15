import { Candle, MarketInstrument } from '../types';
import { MARKET_INSTRUMENTS, generateSeedCandles } from '../data/marketData';
import { db } from './db';

interface InstrumentState {
  instrument: MarketInstrument;
  candles: {
    '1m': Candle[];
    '5m': Candle[];
    '15m': Candle[];
    '1h': Candle[];
    '1D': Candle[];
  };
}

class MarketSimulator {
  private instruments: Map<string, InstrumentState> = new Map();
  private timer: NodeJS.Timeout | null = null;

  constructor() {
    this.initInstruments();
    this.startTickLoop();
  }

  private initInstruments() {
    for (const inst of MARKET_INSTRUMENTS) {
      const candles15m = generateSeedCandles(inst.currentPrice, 80, 0.01);
      const candles5m = generateSeedCandles(inst.currentPrice, 80, 0.007);
      const candles1m = generateSeedCandles(inst.currentPrice, 60, 0.004);
      const candles1h = generateSeedCandles(inst.currentPrice, 80, 0.015);
      const candles1D = generateSeedCandles(inst.currentPrice, 60, 0.025);

      this.instruments.set(inst.symbol, {
        instrument: { ...inst },
        candles: {
          '1m': candles1m,
          '5m': candles5m,
          '15m': candles15m,
          '1h': candles1h,
          '1D': candles1D
        }
      });
    }
  }

  private startTickLoop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.tick();
    }, 2500);
  }

  private tick() {
    for (const [symbol, state] of this.instruments.entries()) {
      const inst = state.instrument;
      const volatility = inst.assetClass === 'Crypto' ? 0.0018 : inst.assetClass === 'Forex' ? 0.0003 : 0.0008;
      const deltaPercent = (Math.random() - 0.495) * volatility;
      const oldPrice = inst.currentPrice;
      const newPrice = Number(Math.max(inst.pipSize, oldPrice * (1 + deltaPercent)).toFixed(inst.pipSize < 0.01 ? 4 : 2));

      inst.currentPrice = newPrice;
      inst.change24h = Number((inst.change24h + (newPrice - oldPrice)).toFixed(2));
      inst.changePercent24h = Number(((inst.change24h / (newPrice - inst.change24h)) * 100).toFixed(2));
      if (newPrice > inst.high24h) inst.high24h = newPrice;
      if (newPrice < inst.low24h) inst.low24h = newPrice;

      // Update the active candle for 1m & 15m
      const candleSets = [state.candles['1m'], state.candles['5m'], state.candles['15m'], state.candles['1h'], state.candles['1D']];
      for (const list of candleSets) {
        if (list.length > 0) {
          const lastCandle = list[list.length - 1];
          lastCandle.close = newPrice;
          if (newPrice > lastCandle.high) lastCandle.high = newPrice;
          if (newPrice < lastCandle.low) lastCandle.low = newPrice;
          lastCandle.volume += Math.floor(Math.random() * 20 + 1);
        }
      }

      // Check all active user positions for this symbol
      this.evaluatePositions(symbol, newPrice);
    }
  }

  private evaluatePositions(symbol: string, currentPrice: number) {
    const allUsers = db.getAllUsers();
    for (const user of allUsers) {
      const positions = db.getUserPositions(user.id);
      for (const pos of positions) {
        if (pos.symbol === symbol) {
          pos.currentPrice = currentPrice;
          const priceDiff = pos.side === 'long'
            ? currentPrice - pos.entryPrice
            : pos.entryPrice - currentPrice;
          pos.unrealizedPnl = Number((priceDiff * pos.quantity).toFixed(2));
          pos.unrealizedPnlPercent = Number(((priceDiff / pos.entryPrice) * 100).toFixed(2));

          // Check automated Stop-Loss trigger
          if (pos.stopLoss) {
            const hitSL = pos.side === 'long' ? currentPrice <= pos.stopLoss : currentPrice >= pos.stopLoss;
            if (hitSL) {
              db.closePosition(user.id, pos.id, currentPrice, 'stop_loss');
              continue;
            }
          }

          // Check automated Take-Profit trigger
          if (pos.takeProfit) {
            const hitTP = pos.side === 'long' ? currentPrice >= pos.takeProfit : currentPrice <= pos.takeProfit;
            if (hitTP) {
              db.closePosition(user.id, pos.id, currentPrice, 'take_profit');
              continue;
            }
          }
        }
      }
    }
  }

  getInstruments(): MarketInstrument[] {
    return Array.from(this.instruments.values()).map((s) => s.instrument);
  }

  getInstrument(symbol: string): MarketInstrument | undefined {
    return this.instruments.get(symbol)?.instrument;
  }

  getCandles(symbol: string, timeframe: '1m' | '5m' | '15m' | '1h' | '1D' = '15m'): Candle[] {
    const state = this.instruments.get(symbol);
    if (!state) return [];
    return state.candles[timeframe] || state.candles['15m'];
  }

  getOrderBook(symbol: string) {
    const inst = this.getInstrument(symbol);
    if (!inst) return { bids: [], asks: [] };

    const price = inst.currentPrice;
    const pip = inst.pipSize;
    const bids = [];
    const asks = [];

    for (let i = 1; i <= 6; i++) {
      const bidPrice = Number((price - i * pip * (price > 1000 ? 5 : 1)).toFixed(pip < 0.01 ? 4 : 2));
      const askPrice = Number((price + i * pip * (price > 1000 ? 5 : 1)).toFixed(pip < 0.01 ? 4 : 2));
      const sizeMultiplier = price > 1000 ? 0.2 : 25;
      bids.push({
        price: bidPrice,
        size: Number((Math.random() * 5 * sizeMultiplier + 1).toFixed(2)),
        total: 0
      });
      asks.push({
        price: askPrice,
        size: Number((Math.random() * 5 * sizeMultiplier + 1).toFixed(2)),
        total: 0
      });
    }

    return { bids, asks, currentPrice: price };
  }
}

export const marketSimulator = new MarketSimulator();
