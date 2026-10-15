import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MarketInstrument, Candle } from '../types';

interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
}

interface MarketContextType {
  instruments: MarketInstrument[];
  selectedSymbol: string;
  selectedInstrument: MarketInstrument | undefined;
  timeframe: '1m' | '5m' | '15m' | '1h' | '1D';
  candles: Candle[];
  orderBook: { bids: OrderBookLevel[]; asks: OrderBookLevel[]; currentPrice: number };
  chartType: 'candlestick' | 'line' | 'bar';
  indicators: {
    sma20: boolean;
    ema50: boolean;
    rsi: boolean;
    bollinger: boolean;
    volume: boolean;
  };
  showSupportResistance: boolean;
  watchlist: string[];
  isLoading: boolean;
  setSelectedSymbol: (symbol: string) => void;
  setTimeframe: (tf: '1m' | '5m' | '15m' | '1h' | '1D') => void;
  setChartType: (type: 'candlestick' | 'line' | 'bar') => void;
  toggleIndicator: (key: 'sma20' | 'ema50' | 'rsi' | 'bollinger' | 'volume') => void;
  setShowSupportResistance: (val: boolean | ((prev: boolean) => boolean)) => void;
  toggleWatchlist: (symbol: string) => void;
  refreshCandles: () => Promise<void>;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [instruments, setInstruments] = useState<MarketInstrument[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '1D'>('15m');
  const [candles, setCandles] = useState<Candle[]>([]);
  const [orderBook, setOrderBook] = useState<{ bids: OrderBookLevel[]; asks: OrderBookLevel[]; currentPrice: number }>({
    bids: [],
    asks: [],
    currentPrice: 0
  });
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'bar'>('candlestick');
  const [indicators, setIndicators] = useState({
    sma20: true,
    ema50: true,
    rsi: true,
    bollinger: false,
    volume: true
  });
  const [showSupportResistance, setShowSupportResistance] = useState(true);
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('decrotrade_watchlist');
      return saved ? JSON.parse(saved) : ['AAPL', 'BTC/USD', 'NVDA', 'EUR/USD', 'XAU/USD'];
    } catch {
      return ['AAPL', 'BTC/USD', 'NVDA', 'EUR/USD', 'XAU/USD'];
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchInstruments = useCallback(async () => {
    try {
      const res = await fetch('/api/market/instruments');
      if (res.ok) {
        const data = await res.json();
        setInstruments(data);
      }
    } catch (e) {
      console.error('Failed to fetch instruments:', e);
    }
  }, []);

  const fetchCandles = useCallback(async (sym: string, tf: string) => {
    try {
      const encoded = encodeURIComponent(sym);
      const res = await fetch(`/api/market/candles/${encoded}?timeframe=${tf}`);
      if (res.ok) {
        const data = await res.json();
        setCandles(data);
      }
    } catch (e) {
      console.error('Failed to fetch candles:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOrderBook = useCallback(async (sym: string) => {
    try {
      const encoded = encodeURIComponent(sym);
      const res = await fetch(`/api/market/orderbook/${encoded}`);
      if (res.ok) {
        const data = await res.json();
        setOrderBook(data);
      }
    } catch (e) {
      console.error('Failed to fetch order book:', e);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchInstruments();
    const interval = setInterval(fetchInstruments, 3000);
    return () => clearInterval(interval);
  }, [fetchInstruments]);

  // Load candles & order book on symbol/timeframe change
  useEffect(() => {
    setIsLoading(true);
    fetchCandles(selectedSymbol, timeframe);
    fetchOrderBook(selectedSymbol);

    const interval = setInterval(() => {
      fetchCandles(selectedSymbol, timeframe);
      fetchOrderBook(selectedSymbol);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedSymbol, timeframe, fetchCandles, fetchOrderBook]);

  const toggleIndicator = (key: 'sma20' | 'ema50' | 'rsi' | 'bollinger' | 'volume') => {
    setIndicators((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol];
      localStorage.setItem('decrotrade_watchlist', JSON.stringify(next));
      return next;
    });
  };

  const selectedInstrument = instruments.find((i) => i.symbol === selectedSymbol);

  return (
    <MarketContext.Provider
      value={{
        instruments,
        selectedSymbol,
        selectedInstrument,
        timeframe,
        candles,
        orderBook,
        chartType,
        indicators,
        showSupportResistance,
        watchlist,
        isLoading,
        setSelectedSymbol,
        setTimeframe,
        setChartType,
        toggleIndicator,
        setShowSupportResistance,
        toggleWatchlist,
        refreshCandles: () => fetchCandles(selectedSymbol, timeframe)
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) throw new Error('useMarket must be used within a MarketProvider');
  return context;
};
