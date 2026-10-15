import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

const NOVA_SYSTEM_INSTRUCTION = `You are Nova AI, the premier educational trading assistant on DecroTrade.
Your sole purpose is to educate users on financial market concepts, candlestick analysis, technical indicators, trade journal reviews, risk management mathematics, and trading psychology.

CRITICAL RULES:
1. Always maintain a professional, analytical, and encouraging tone.
2. Under NO circumstances provide personal financial advice, buy/sell recommendations, price targets for real-world investments, or promises of monetary profit.
3. Every response must emphasize sound risk management (the 1% rule, stop-losses, risk-to-reward ratios) and statistical expectancy.
4. Keep explanations structured with markdown headers, concise bullet points, and key educational takeaways.
5. If asked about a trade journal entry, evaluate whether the user adhered to their plan, their emotional state (fear, FOMO, tilt), and risk parameters.
6. Clearly remind the user that all DecroTrade activities are educational and use virtual simulation only.`;

export async function askNovaAI(params: {
  prompt: string;
  contextType?: 'general' | 'terminology' | 'pattern' | 'quiz_generation' | 'journal_review' | 'risk_calculator';
  journalContext?: any;
  userContext?: { name: string; level: number; xp: number };
}): Promise<{ reply: string; isLiveModel: boolean }> {
  const { prompt, contextType, journalContext, userContext } = params;

  // If Gemini API is available and initialized, use real gemini-3.8-flash
  if (ai) {
    try {
      let fullPrompt = prompt;
      if (contextType === 'journal_review' && journalContext) {
        fullPrompt = `Please analyze this student's trade journal entry and provide constructive educational feedback on their execution, psychology, and risk management:\n\nTrade Details: ${JSON.stringify(journalContext, null, 2)}\n\nStudent Reflection: "${prompt}"`;
      } else if (contextType === 'quiz_generation') {
        fullPrompt = `Generate a high-yield 3-question multiple-choice practice quiz on the topic: "${prompt}". For each question provide 4 clear options, the correct answer index, and a comprehensive explanation.`;
      }

      if (userContext) {
        fullPrompt += `\n\n(Student context: Level ${userContext.level}, XP: ${userContext.xp})`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: fullPrompt,
        config: {
          systemInstruction: NOVA_SYSTEM_INSTRUCTION,
          temperature: 0.7
        }
      });

      const reply = response.text || 'Nova AI generated an empty response. Please refine your query.';
      return { reply, isLiveModel: true };
    } catch (err: any) {
      console.warn('Gemini API call encountered an issue, deploying educational fallback engine:', err?.message || err);
    }
  }

  // Educational Fallback Engine (Guarantees responsive high-yield learning even if key is missing/quota restricted)
  const fallbackReply = generateEducationalFallback(prompt, contextType, journalContext);
  return { reply: fallbackReply, isLiveModel: false };
}

function generateEducationalFallback(prompt: string, contextType?: string, journalContext?: any): string {
  const p = prompt.toLowerCase();

  if (contextType === 'journal_review' || p.includes('journal') || p.includes('review my trade')) {
    const symbol = journalContext?.symbol || 'your trade';
    const followedPlan = journalContext?.followedPlan !== false;
    return `### 📊 Nova AI Trade Journal Review

**Asset Analyzed**: \`${symbol}\`  
**Execution Assessment**: ${followedPlan ? '✅ Plan Adherence Maintained' : '⚠️ Deviated from Written Protocol'}

#### 1. Key Psychological Observations
- **Emotional Equilibrium**: In trading, whether you win or lose an individual trade is statistically irrelevant; what matters is whether you executed according to predefined technical criteria.
- **Self-Discipline Check**: If you followed your stop-loss and position sizing, this was a successful execution regardless of the dollar outcome.

#### 2. Risk Management Audit
- Ensure your position size never exposed more than **1% of your virtual account balance**.
- Confirm that your technical stop was placed at a level where your original thesis was invalidated, rather than a random round number.
- Always maintain a target that offers at least a **1:2 Risk-to-Reward ratio**.

#### 3. Prescribed Next Step
Record this setup in your personal playbook. If a mistake tag was triggered, write down the exact corrective behavior before opening your next virtual position.`;
  }

  if (p.includes('fvg') || p.includes('fair value gap')) {
    return `### ⚡ Fair Value Gap (FVG) Explained

A **Fair Value Gap (FVG)**, also termed an *imbalance* or *inefficiency*, is a three-candle price formation where aggressive buying or selling creates a void in the order book.

#### The Three-Candle Structure:
1. **Candle 1**: The initial move.
2. **Candle 2 (Displacement Candle)**: A massive, explosive body moving violently in one direction.
3. **Candle 3**: The follow-through candle.

*The Gap*: If Candle 1's high does not overlap with Candle 3's low (in an uptrend), the intervening space is a Fair Value Gap.

#### Why Do Markets Respect FVGs?
Because price moved too rapidly for normal two-way trade matching to occur, the market frequently pulls back to "rebalance" or re-test this price vacuum before continuing the dominant expansion leg.

💡 **Educational Tip**: Use FVGs as high-probability entry pullbacks aligned with higher-timeframe trend direction.`;
  }

  if (p.includes('liquidity') || p.includes('sweep') || p.includes('stop hunt')) {
    return `### 🌊 Liquidity Sweeps & Institutional Stop Runs

Financial markets run on **liquidity**—the availability of passive counter-orders to absorb large trades.

#### Where Does Retail Liquidity Cluster?
- **Buy-Side Liquidity (BSL)**: Stop-loss orders of short sellers and breakout buy orders clustered just above obvious equal highs and resistance levels.
- **Sell-Side Liquidity (SSL)**: Stop-loss orders of long buyers clustered just below obvious equal lows and swing supports.

#### The Sweep Mechanism:
Institutions requiring billions of dollars in position size cannot buy at market without causing massive slippage. Therefore, smart money will push price below an obvious support to trigger a cascade of retail stop-loss market sells. Once that sell volume floods the market, institutions absorb it all at a discount and reverse price sharply upward.

💡 **Actionable Lesson**: Never place your stop-loss at the exact, obvious tick where everyone else does. Place it beyond market structure invalidation.`;
  }

  if (p.includes('risk') || p.includes('position size') || p.includes('1% rule')) {
    return `### 🛡️ The 1% Risk Rule & Mathematical Edge

The cornerstone of all profitable trading is **capital preservation**. Without capital, you cannot participate in market opportunities.

#### The Position Sizing Formula:
$$\\text{Position Size (Shares)} = \\frac{\\text{Account Balance} \\times \\text{Risk \\%}}{\\text{Entry Price} - \\text{Stop-Loss Price}}$$

#### Concrete Example:
- **Virtual Balance**: $100,000
- **Risk %**: 1% = $1,000 maximum allowable loss
- **Stock Entry**: $150.00
- **Stop Loss**: $145.00 (Risk per share = $5.00)
- **Calculated Quantity**: $1,000 / $5.00 = **200 shares**

#### Why 1%?
If you risk 1% per trade, you can endure a brutal 10-trade losing streak and still retain over 90% of your account balance. If you risk 10% per trade, that same streak will wipe out 65% of your wealth, requiring a 185% gain to recover.`;
  }

  if (p.includes('rsi') || p.includes('divergence')) {
    return `### 📈 RSI Divergence Masterclass

The **Relative Strength Index (RSI)** measures the internal velocity and magnitude of price movements on a 0–100 scale.

#### 1. Bullish Divergence (Reversal Signal)
- **Price Action**: Prints a **Lower Low** (LL).
- **RSI Indicator**: Prints a **Higher Low** (HL).
- *Interpretation*: Although sellers pushed price to a lower nominal level, downward momentum has significantly weakened. Buyers are absorbing supply.

#### 2. Bearish Divergence (Exhaustion Signal)
- **Price Action**: Prints a **Higher High** (HH).
- **RSI Indicator**: Prints a **Lower High** (LH).
- *Interpretation*: The uptrend is losing momentum despite nominal higher prices. Institutional distribution is likely occurring.

⚠️ **Key Reminder**: Divergence is an early warning signal, not an immediate trigger. Always wait for price action structure confirmation (like a candle close) before entering!`;
  }

  // Default structured educational response
  return `### 🎓 Nova AI Market Analysis

Thank you for your question on **"${prompt}"**.

#### Core Market Concept
In financial analysis, every price movement reflects the dynamic auction between aggressive buyers and sellers. When studying technical setups:

1. **Market Structure First**: Identify whether the higher timeframe (Daily / 4-Hour) is in a clean uptrend (HH/HL), downtrend (LH/LL), or neutral consolidation.
2. **Key Liquidity Levels**: Mark previous day highs, lows, and unmitigated supply/demand zones.
3. **Execution Confluence**: Never rely on a single indicator. Look for 2 to 3 overlapping technical reasons (e.g., Support Zone + 61.8% Fibonacci Retracement + Bullish Engulfing Candle).
4. **Predefined Risk**: Calculate your position size before entering. Know your exact invalidation price.

*Disclaimer: Nova AI provides trading education and market simulation analysis only. All DecroTrade tools operate with virtual funds for practice.*`;
}
