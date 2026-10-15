import React from 'react';
import { ShieldCheck, HelpCircle, FileText, Lock, AlertTriangle } from 'lucide-react';

export const HelpFaqPage: React.FC = () => {
  const faqs = [
    {
      q: 'Does DecroTrade execute real financial market orders?',
      a: 'No. DecroTrade is strictly an educational learning and practice platform. All balances ($100,000 starting capital) are simulated virtual funds. There is zero connection to real brokerage accounts.'
    },
    {
      q: 'Can I deposit real money, buy coins, or withdraw cash?',
      a: 'Absolutely not. DecroTrade prohibits deposits, withdrawals, paid virtual currency, subscriptions, or financial transactions. All courses, tools, and challenges are 100% free and educational.'
    },
    {
      q: 'How does Nova AI work?',
      a: 'Nova AI is powered by Google Gemini (gemini-3.8-flash) on our secure backend. Nova breaks down trading concepts, reviews your trade journal reflections for discipline, and generates custom quizzes. Nova AI provides educational instruction only, never financial advice.'
    },
    {
      q: 'How is my quiz and lesson progress saved?',
      a: 'Your progress is stored persistently in the DecroTrade server database. When you log in with your account credentials, your completed lessons, quiz scores, level, XP, and virtual portfolio are automatically restored.'
    },
    {
      q: 'What is the 1% Risk Management Rule taught in the curriculum?',
      a: 'The 1% rule states that on any single trade, your maximum allowed dollar loss (if your stop-loss is hit) should never exceed 1% of your total account balance. This protects you from catastrophic drawdowns during normal market volatility.'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-800/80 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-violet-400" />
          Frequently Asked Questions (FAQ)
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Clear answers about DecroTrade platform policies and functionality.</p>
      </div>

      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-[#0B0F19] p-5 shadow space-y-2">
            <h3 className="font-bold text-white text-sm">{f.q}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SafetyDisclaimerPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-800/80 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-amber-400" />
          Safety & Educational Disclaimer
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Legal notice and risk disclosure regarding simulated trading.</p>
      </div>

      <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-6 text-xs text-slate-300 leading-relaxed space-y-4">
        <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>Non-Financial Advice & Virtual-Only Notice</span>
        </div>

        <p>
          DecroTrade (including all curriculum modules, simulated charts, practice portfolios, challenge exercises, and Nova AI responses) is provided solely for general educational and illustrative purposes.
        </p>

        <p>
          <strong>No Investment Advice:</strong> Nothing contained within DecroTrade constitutes personal financial, legal, tax, or investment advice. Trading in actual financial markets (such as equities, foreign exchange, derivatives, commodities, and cryptocurrencies) carries substantial financial risk, including the possible loss of all invested capital.
        </p>

        <p>
          <strong>No Real Money Transactions:</strong> DecroTrade does not accept real money deposits, does not hold customer funds, does not execute transactions with financial brokerages, and does not provide withdrawals, cash-outs, or monetary rewards. All currencies and XP displayed are virtual and hold zero monetary cash value.
        </p>

        <p>
          <strong>Past Simulated Performance:</strong> Hypothetical or simulated performance results have inherent limitations. Unlike an actual performance record, simulated results do not represent actual trading and may not account for real liquidity constraints, severe slippage, or psychological stress of real capital.
        </p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-800/80 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-violet-400" />
          Terms of Service
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Agreement governing the use of the DecroTrade educational platform.</p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-6 text-xs text-slate-300 leading-relaxed space-y-4">
        <h3 className="font-bold text-white text-sm">1. Acceptance of Terms</h3>
        <p>By creating an account or accessing DecroTrade, you agree to comply with these Terms of Service. If you do not agree, please discontinue using the platform.</p>

        <h3 className="font-bold text-white text-sm">2. Educational Use Only</h3>
        <p>You acknowledge that DecroTrade is an educational simulator. You agree not to treat any platform outputs as financial or investment counsel.</p>

        <h3 className="font-bold text-white text-sm">3. User Conduct</h3>
        <p>You agree not to post abusive, fraudulent, or harmful content in the Community feed, or attempt to compromise server infrastructure.</p>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-800/80 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Lock className="h-5 w-5 text-violet-400" />
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">How DecroTrade protects user privacy and handles account data.</p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-6 text-xs text-slate-300 leading-relaxed space-y-4">
        <h3 className="font-bold text-white text-sm">1. Information We Collect</h3>
        <p>We collect only necessary account information: your display name, email address, and hashed credentials. We never collect payment card numbers or bank information.</p>

        <h3 className="font-bold text-white text-sm">2. Password Security</h3>
        <p>Passwords are never stored in plaintext. They are salted and cryptographically hashed with scrypt before persisting to storage.</p>

        <h3 className="font-bold text-white text-sm">3. No Sale of Personal Data</h3>
        <p>DecroTrade does not sell, rent, or monetize personal user information.</p>
      </div>
    </div>
  );
};
