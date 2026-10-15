import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Send,
  HelpCircle,
  ShieldCheck,
  BookOpen,
  Award,
  Zap,
  RefreshCw,
  User,
  Bot
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  isLiveModel?: boolean;
  timestamp: string;
}

const PRESET_PROMPTS = [
  'Explain Fair Value Gaps (FVG) and how institutions use them',
  'What is a Liquidity Sweep and where do retail stop clusters sit?',
  'How do I calculate position size using the 1% risk rule?',
  'Explain Bearish RSI Divergence and how to confirm it',
  'Generate a 3-question quiz on Candlestick Reversals',
  'How do I overcome revenge trading after a losing streak?'
];

export const NovaAiPage: React.FC = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I am **Nova AI**, your institutional trading education tutor on DecroTrade.

I can help you:
- Deconstruct complex market terminology (Fair Value Gaps, Order Blocks, Liquidity Sweeps)
- Step-by-step technical pattern identification and divergence confirmation
- Compute position sizes using mathematical risk preservation rules
- Generate customized knowledge checks on any trading discipline

What market concept would you like to master today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/nova-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          prompt: text.trim(),
          contextType: text.toLowerCase().includes('quiz') ? 'quiz_generation' : 'general'
        })
      });

      const data = await res.json();
      const aiReply: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Nova AI could not process that request. Please try again.',
        isLiveModel: data.isLiveModel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Encountered a network communication issue. Please verify your connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header Banner */}
      <div className="rounded-xl border border-purple-900/40 bg-gradient-to-r from-purple-950/40 via-slate-900 to-[#0A0D15] p-4 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow">
            <Sparkles className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Nova AI Learning Assistant</span>
              <span className="rounded bg-purple-950 px-2 py-0.5 text-[10px] font-mono text-purple-300 border border-purple-800/40">
                Gemini 3.8 Flash
              </span>
            </div>
            <span className="text-slate-400 text-[11px]">
              Trained on market microstructure, technical geometry, and institutional risk management.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-950/40 px-3 py-1 rounded-lg border border-amber-800/30">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Educational Instruction Only &bull; Never Financial Advice</span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-[#0A0E18] p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-900/60 text-purple-300 border border-purple-700/50">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow ${
                  isUser
                    ? 'bg-violet-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none space-y-2'
                }`}
              >
                <div className="prose prose-invert max-w-none text-xs leading-relaxed whitespace-pre-line">
                  {msg.text}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/40 mt-2 font-mono">
                  <span>{msg.timestamp}</span>
                  {!isUser && msg.isLiveModel !== undefined && (
                    <span className="text-[9px] text-purple-400">
                      {msg.isLiveModel ? '● Live Gemini Model' : '● Educational Fallback'}
                    </span>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center text-xs text-purple-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-900/40 border border-purple-800/40">
              <Bot className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl bg-slate-900 p-3 border border-slate-800 flex items-center gap-2">
              <span className="animate-pulse">Nova AI is synthesizing market mechanics...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-1.5 shrink-0">
        {PRESET_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1 text-[11px] text-slate-300 hover:border-purple-600/60 hover:text-white transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Nova AI about any chart pattern, order book mechanics, or risk calculation..."
          className="flex-1 rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none shadow-lg"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 text-white shadow hover:bg-purple-500 transition disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
