import { MarketInstrument, Candle } from '../types';

export const MARKET_INSTRUMENTS: MarketInstrument[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    assetClass: 'Equities',
    currentPrice: 228.45,
    change24h: 3.25,
    changePercent24h: 1.44,
    high24h: 229.80,
    low24h: 224.50,
    volume24h: 48920000,
    baseCurrency: 'AAPL',
    quoteCurrency: 'USD',
    pipSize: 0.01,
    description: 'Global consumer technology leader in personal computing, smartphones, wearable devices, and digital subscription services.'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    assetClass: 'Equities',
    currentPrice: 124.80,
    change24h: -1.75,
    changePercent24h: -1.38,
    high24h: 127.40,
    low24h: 123.10,
    volume24h: 68140000,
    baseCurrency: 'NVDA',
    quoteCurrency: 'USD',
    pipSize: 0.01,
    description: 'Pioneer of GPU-accelerated computing and dominant architecture for artificial intelligence and datacenter infrastructure.'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    assetClass: 'Equities',
    currentPrice: 218.60,
    change24h: 6.80,
    changePercent24h: 3.21,
    high24h: 221.50,
    low24h: 211.20,
    volume24h: 54100000,
    baseCurrency: 'TSLA',
    quoteCurrency: 'USD',
    pipSize: 0.01,
    description: 'Electric vehicle manufacturing, battery energy storage systems, and autonomous robotics development.'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    assetClass: 'Equities',
    currentPrice: 422.30,
    change24h: 2.10,
    changePercent24h: 0.50,
    high24h: 425.00,
    low24h: 419.80,
    volume24h: 21300000,
    baseCurrency: 'MSFT',
    quoteCurrency: 'USD',
    pipSize: 0.01,
    description: 'Global cloud computing provider (Azure), enterprise productivity software (Office 365), and gaming.'
  },
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    assetClass: 'Crypto',
    currentPrice: 64250.00,
    change24h: 1420.00,
    changePercent24h: 2.26,
    high24h: 64800.00,
    low24h: 62500.00,
    volume24h: 28400000000,
    baseCurrency: 'BTC',
    quoteCurrency: 'USD',
    pipSize: 0.5,
    description: 'Decentralized peer-to-peer digital monetary network and store-of-value benchmark with fixed 21M supply cap.'
  },
  {
    symbol: 'ETH/USD',
    name: 'Ethereum',
    assetClass: 'Crypto',
    currentPrice: 2640.50,
    change24h: -32.50,
    changePercent24h: -1.22,
    high24h: 2695.00,
    low24h: 2610.00,
    volume24h: 14200000000,
    baseCurrency: 'ETH',
    quoteCurrency: 'USD',
    pipSize: 0.1,
    description: 'Smart-contract computational platform powering decentralized finance, rollups, and digital asset protocols.'
  },
  {
    symbol: 'SOL/USD',
    name: 'Solana',
    assetClass: 'Crypto',
    currentPrice: 152.80,
    change24h: 5.40,
    changePercent24h: 3.66,
    high24h: 156.20,
    low24h: 146.50,
    volume24h: 3100000000,
    baseCurrency: 'SOL',
    quoteCurrency: 'USD',
    pipSize: 0.05,
    description: 'High-throughput layer-1 blockchain engineered for sub-second settlement and ultra-low transaction costs.'
  },
  {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    assetClass: 'Forex',
    currentPrice: 1.0875,
    change24h: 0.0018,
    changePercent24h: 0.17,
    high24h: 1.0895,
    low24h: 1.0842,
    volume24h: 420000000000,
    baseCurrency: 'EUR',
    quoteCurrency: 'USD',
    pipSize: 0.0001,
    description: 'The world\'s most heavily traded foreign exchange currency pair representing European and US central bank policy differential.'
  },
  {
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    assetClass: 'Forex',
    currentPrice: 149.25,
    change24h: -0.45,
    changePercent24h: -0.30,
    high24h: 150.10,
    low24h: 148.80,
    volume24h: 290000000000,
    baseCurrency: 'USD',
    quoteCurrency: 'JPY',
    pipSize: 0.01,
    description: 'Key Asian-Pacific macro FX pair sensitive to Federal Reserve and Bank of Japan yield curve control dynamics.'
  },
  {
    symbol: 'XAU/USD',
    name: 'Gold (Ounce)',
    assetClass: 'Commodities',
    currentPrice: 2654.20,
    change24h: 18.60,
    changePercent24h: 0.71,
    high24h: 2665.00,
    low24h: 2632.00,
    volume24h: 48000000000,
    baseCurrency: 'XAU',
    quoteCurrency: 'USD',
    pipSize: 0.1,
    description: 'The ancient store-of-value commodity, hedge against monetary debasement and geopolitical uncertainty.'
  },
  {
    symbol: 'WTI/USD',
    name: 'Crude Oil (Barrel)',
    assetClass: 'Commodities',
    currentPrice: 74.80,
    change24h: -1.20,
    changePercent24h: -1.58,
    high24h: 76.40,
    low24h: 73.90,
    volume24h: 32000000000,
    baseCurrency: 'WTI',
    quoteCurrency: 'USD',
    pipSize: 0.01,
    description: 'West Texas Intermediate crude oil benchmark reflective of global energy demand and OPEC+ production quotas.'
  }
];

// Generate deterministic realistic candles for any instrument
export function generateSeedCandles(basePrice: number, count: number = 80, volatility: number = 0.012): Candle[] {
  const candles: Candle[] = [];
  let price = basePrice * 0.94; // start a bit lower
  const now = Date.now();
  const intervalMs = 15 * 60 * 1000; // 15 min default
  let time = now - count * intervalMs;

  for (let i = 0; i < count; i++) {
    const trendFactor = Math.sin(i / 10) * 0.003 + (i / count) * 0.008;
    const randomShock = (Math.random() - 0.49) * volatility;
    const changePercent = trendFactor + randomShock;

    const open = price;
    const close = Math.max(open * (1 + changePercent), open * 0.98);
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.7);
    const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.7);
    const baseVolume = basePrice > 1000 ? 50 : 25000;
    const volume = Math.round(baseVolume * (0.6 + Math.random() * 0.8 + Math.abs(changePercent) * 20));

    candles.push({
      time: time + i * intervalMs,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume
    });

    price = close;
  }

  // Ensure last candle matches current price closely
  const last = candles[candles.length - 1];
  if (last) {
    const factor = basePrice / last.close;
    candles.forEach((c) => {
      c.open = Number((c.open * factor).toFixed(2));
      c.high = Number((c.high * factor).toFixed(2));
      c.low = Number((c.low * factor).toFixed(2));
      c.close = Number((c.close * factor).toFixed(2));
    });
  }

  return candles;
}

// Indicator Calculation Helpers
export function calculateSMA(candles: Candle[], period: number = 20): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += candles[i - j].close;
      }
      result.push(Number((sum / period).toFixed(2)));
    }
  }
  return result;
}

export function calculateEMA(candles: Candle[], period: number = 20): (number | null)[] {
  const result: (number | null)[] = [];
  const k = 2 / (period + 1);
  let previousEMA: number | null = null;

  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      let sum = 0;
      for (let j = 0; j < period; j++) sum += candles[i - j].close;
      previousEMA = sum / period;
      result.push(Number(previousEMA.toFixed(2)));
    } else {
      const currentPrice: number = candles[i].close;
      const prev: number = previousEMA !== null ? previousEMA : currentPrice;
      const currentVal: number = currentPrice * k + prev * (1 - k);
      previousEMA = currentVal;
      result.push(Number(currentVal.toFixed(2)));
    }
  }
  return result;
}

export function calculateRSI(candles: Candle[], period: number = 14): (number | null)[] {
  const result: (number | null)[] = [];
  if (candles.length <= period) return candles.map(() => null);

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = 0; i < period; i++) {
    result.push(null);
  }

  const initialRS = avgLoss === 0 ? 100 : avgGain / avgLoss;
  result.push(Number((100 - 100 / (1 + initialRS)).toFixed(1)));

  for (let i = period + 1; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    const currentGain = diff > 0 ? diff : 0;
    const currentLoss = diff < 0 ? Math.abs(diff) : 0;

    avgGain = (avgGain * (period - 1) + currentGain) / period;
    avgLoss = (avgLoss * (period - 1) + currentLoss) / period;

    if (avgLoss === 0) {
      result.push(100);
    } else {
      const rs = avgGain / avgLoss;
      result.push(Number((100 - 100 / (1 + rs)).toFixed(1)));
    }
  }

  return result;
}

export function calculateBollingerBands(candles: Candle[], period: number = 20, multiplier: number = 2) {
  const sma = calculateSMA(candles, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];

  for (let i = 0; i < candles.length; i++) {
    const mid = sma[i];
    if (mid === null) {
      upper.push(null);
      lower.push(null);
    } else {
      let sumSquares = 0;
      for (let j = 0; j < period; j++) {
        sumSquares += Math.pow(candles[i - j].close - mid, 2);
      }
      const stdDev = Math.sqrt(sumSquares / period);
      upper.push(Number((mid + multiplier * stdDev).toFixed(2)));
      lower.push(Number((mid - multiplier * stdDev).toFixed(2)));
    }
  }

  return { middle: sma, upper, lower };
}
