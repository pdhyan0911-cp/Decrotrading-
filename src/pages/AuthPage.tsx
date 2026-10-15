import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User as UserIcon, Shield, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  navigate: (route: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', navigate }) => {
  const { login, signup, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name.');
          setIsLoading(false);
          return;
        }
        const res = await signup(name, email, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Registration failed');
          setIsLoading(false);
          return;
        }
      } else {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Invalid credentials');
          setIsLoading(false);
          return;
        }
      }
      navigate('dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreFill = (userType: 'trader' | 'admin') => {
    setMode('login');
    setErrorMsg(null);
    if (userType === 'trader') {
      setEmail('trader@decrotrade.com');
      setPassword('TraderPass123!');
    } else {
      setEmail('admin@decrotrade.com');
      setPassword('DecroAdmin2026!');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0A0E18] p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-lg shadow-violet-900/30">
            <span className="font-mono text-xl font-black text-white">D</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back to DecroTrade' : 'Create Your Free Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Access your saved course progress, virtual portfolio, and trade journal.'
              : 'Join thousands mastering price action and mathematical risk management.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="mb-6 grid grid-cols-2 rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`rounded-md py-2 font-semibold transition ${
              mode === 'login' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`rounded-md py-2 font-semibold transition ${
              mode === 'signup' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-950/60 p-3 text-xs text-rose-300 border border-rose-800/60">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-violet-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-900/40 hover:bg-violet-500 transition disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In to DecroTrade' : 'Register Free Account'}
          </button>
        </form>

        {/* Quick Demo Pre-fill helpers */}
        <div className="mt-6 border-t border-slate-800/80 pt-4">
          <span className="block text-[11px] text-center text-slate-400 mb-2 font-medium">
            Instant Test Credentials
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handlePreFill('trader')}
              className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-left hover:border-violet-600/50 hover:bg-slate-800/60 transition"
            >
              <span className="block font-semibold text-slate-200 text-[11px]">Demo Student</span>
              <span className="block text-[10px] text-slate-400 font-mono">trader@decrotrade.com</span>
            </button>
            <button
              type="button"
              onClick={() => handlePreFill('admin')}
              className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-left hover:border-violet-600/50 hover:bg-slate-800/60 transition"
            >
              <span className="block font-semibold text-violet-300 text-[11px]">Administrator</span>
              <span className="block text-[10px] text-slate-400 font-mono">admin@decrotrade.com</span>
            </button>
          </div>
        </div>

        {/* Guest Mode */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              continueAsGuest();
              navigate('dashboard');
            }}
            className="text-xs text-slate-400 hover:text-white underline transition"
          >
            Continue as Guest without account &rarr;
          </button>
        </div>

        <p className="mt-4 text-center text-[10px] text-slate-500">
          Educational platform only &bull; No payments, deposits, or card requirements
        </p>
      </div>
    </div>
  );
};
