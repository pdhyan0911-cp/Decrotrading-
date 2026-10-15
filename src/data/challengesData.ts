export interface ChallengeQuestion {
  id: string;
  scenario: string;
  diagram?: {
    type: 'candle' | 'pattern' | 'metric';
    details: any;
  };
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xp: number;
}

export interface GameChallenge {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timePerQuestionSeconds: number;
  totalQuestions: number;
  badgeId: string;
  questions: ChallengeQuestion[];
}

export const CHALLENGES: GameChallenge[] = [
  {
    id: 'ch-1',
    slug: 'candlestick-recognition',
    title: 'Candlestick Recognition Challenge',
    subtitle: 'Identify key single and dual candlestick patterns under time pressure.',
    category: 'Pattern Recognition',
    difficulty: 'Beginner',
    timePerQuestionSeconds: 20,
    totalQuestions: 5,
    badgeId: 'badge-challenge-champion',
    questions: [
      {
        id: 'cr-1',
        scenario: 'A market has been dropping for 6 consecutive sessions. At major horizontal support, a candle forms with a tiny real body at the very high of the range and a lower shadow 3 times the body length.',
        diagram: {
          type: 'candle',
          details: { name: 'Hammer', color: 'green', bodyHeight: 20, lowerWick: 70, upperWick: 5 }
        },
        question: 'Which high-probability reversal candlestick is this?',
        options: ['Shooting Star', 'Hammer', 'Gravestone Doji', 'Bearish Marubozu'],
        correctIndex: 1,
        explanation: 'A Hammer occurs after a decline, characterized by a small real body near the top of the candle and a long lower wick reflecting aggressive buyer absorption.',
        xp: 50
      },
      {
        id: 'cr-2',
        scenario: 'After an extended rally, the market produces a candle with an open and close at almost the exact same price point, with long shadows both above and below.',
        diagram: {
          type: 'candle',
          details: { name: 'Long-Legged Doji', color: 'gray', bodyHeight: 2, lowerWick: 50, upperWick: 50 }
        },
        question: 'What candle type is this, and what does it communicate?',
        options: [
          'Bullish Marubozu showing strong continuation',
          'Doji signaling market indecision and equilibrium between buyers and sellers',
          'Morning Star confirming a breakout',
          'Inverted Hammer signaling immediate shorting'
        ],
        correctIndex: 1,
        explanation: 'A Doji forms when Open and Close are virtually identical, indicating neither bulls nor bears were able to dominate, reflecting high indecision.',
        xp: 50
      },
      {
        id: 'cr-3',
        scenario: 'At the peak of a bull run, a small green candle is immediately followed by a massive red candle whose body completely covers the entire previous green body.',
        diagram: {
          type: 'candle',
          details: { name: 'Bearish Engulfing', color: 'red', bodyHeight: 60, lowerWick: 15, upperWick: 15 }
        },
        question: 'Identify this powerful bearish reversal signal:',
        options: ['Bearish Engulfing', 'Tweezer Bottom', 'Bullish Harami', 'Dragonfly Doji'],
        correctIndex: 0,
        explanation: 'Bearish Engulfing occurs when sellers overpower the previous session\'s gains entirely, signaling an abrupt change in market control.',
        xp: 50
      },
      {
        id: 'cr-4',
        scenario: 'A candle displays a very long upper wick (3x body) and closes near the session low after an aggressive advance.',
        diagram: {
          type: 'candle',
          details: { name: 'Shooting Star', color: 'red', bodyHeight: 20, lowerWick: 5, upperWick: 75 }
        },
        question: 'What pattern is this?',
        options: ['Hammer', 'Hanging Man', 'Shooting Star', 'Spinning Top'],
        correctIndex: 2,
        explanation: 'The Shooting Star shows buyers tried to push to new highs but were rejected by sellers who drove price back down near the open.',
        xp: 50
      },
      {
        id: 'cr-5',
        scenario: 'A 3-candle sequence: 1st is a long red candle, 2nd is a small gapped-down candle, and 3rd is a large green candle closing well into the body of the 1st candle.',
        diagram: {
          type: 'candle',
          details: { name: 'Morning Star', color: 'green', bodyHeight: 50, lowerWick: 20, upperWick: 20 }
        },
        question: 'What multi-candle bottoming formation is this?',
        options: ['Evening Star', 'Three Black Crows', 'Morning Star', 'Dark Cloud Cover'],
        correctIndex: 2,
        explanation: 'The Morning Star is a textbook three-candle bottom reversal pattern signaling that the bearish momentum has been exhausted and reversed.',
        xp: 50
      }
    ]
  },
  {
    id: 'ch-2',
    slug: 'chart-patterns',
    title: 'Chart Pattern Master Challenge',
    subtitle: 'Decipher consolidation flags, wedges, double tops, and head & shoulders.',
    category: 'Chart Geometry',
    difficulty: 'Intermediate',
    timePerQuestionSeconds: 25,
    totalQuestions: 5,
    badgeId: 'badge-challenge-champion',
    questions: [
      {
        id: 'cp-1',
        scenario: 'Price rallies sharply upward, then gently drifts downward between two parallel descending trendlines on declining volume before breaking out upward.',
        question: 'What classic continuation pattern is this?',
        options: ['Bull Flag', 'Head and Shoulders', 'Rising Wedge', 'Ascending Triangle'],
        correctIndex: 0,
        explanation: 'A Bull Flag consists of an impulse pole followed by a tight downward sloping consolidation channel, which typically resolves in the direction of the initial impulse.',
        xp: 60
      },
      {
        id: 'cp-2',
        scenario: 'A stock makes a high at $200 (Left Shoulder), pulls back to $185, rallies to $215 (Head), pulls back to $185, rallies to $200 (Right Shoulder), and then pierces $185.',
        question: 'What classic reversal pattern is this, and what is $185 called?',
        options: [
          'Triple Top with a resistance cap',
          'Head and Shoulders pattern with $185 as the Neckline',
          'Cup and Handle pattern',
          'Inverted Hammer sequence'
        ],
        correctIndex: 1,
        explanation: 'This describes the classic Head and Shoulders pattern. The horizontal line at $185 connecting the two troughs is the critical Neckline.',
        xp: 60
      },
      {
        id: 'cp-3',
        scenario: 'Price makes higher highs and higher lows, but the trendlines connecting the highs and lows converge upward into an apex while volume continually dries up.',
        question: 'What is this pattern, and which direction does it statistically break?',
        options: [
          'Falling Wedge (bullish continuation)',
          'Rising Wedge (typically breaks down bearisly)',
          'Symmetrical Triangle (always bullish)',
          'Pennant (always continues up)'
        ],
        correctIndex: 1,
        explanation: 'A Rising Wedge reflects deteriorating buying velocity as range narrows. It statistically breaks to the downside more than 68% of the time.',
        xp: 60
      },
      {
        id: 'cp-4',
        scenario: 'A market hits $100, drops to $90, bounces back to $100 and fails to pierce it, then drops below $90 with a surge in volume.',
        question: 'What pattern just confirmed with the break below $90?',
        options: ['Double Bottom', 'Double Top', 'Bullish Pennant', 'Expanding Diagonal'],
        correctIndex: 1,
        explanation: 'A Double Top is confirmed when price fails twice at the same resistance and breaks down below the intermediate trough (neckline).',
        xp: 60
      },
      {
        id: 'cp-5',
        scenario: 'Price bounces between a flat horizontal resistance ceiling at $50 and a series of rising swing lows ($44, $46, $48).',
        question: 'What triangle formation is this?',
        options: ['Ascending Triangle (bullish bias)', 'Descending Triangle (bearish bias)', 'Broadening Wedge', 'Diamond Top'],
        correctIndex: 0,
        explanation: 'An Ascending Triangle features flat overhead resistance while buyers are willing to step in at progressively higher lows, applying upward pressure.',
        xp: 60
      }
    ]
  },
  {
    id: 'ch-3',
    slug: 'bull-vs-bear',
    title: 'Bull vs. Bear Knowledge Duel',
    subtitle: 'Assess rapid market situations: is the edge with the Bulls or the Bears?',
    category: 'Market Bias',
    difficulty: 'Beginner',
    timePerQuestionSeconds: 15,
    totalQuestions: 5,
    badgeId: 'badge-challenge-champion',
    questions: [
      {
        id: 'bvb-1',
        scenario: 'Price is trading above both the 50-day and 200-day SMAs. The 50-day SMA just crossed upward through the 200-day SMA (Golden Cross).',
        question: 'Who holds the structural macro edge?',
        options: ['The Bulls', 'The Bears', 'Strictly Neutral / No Edge'],
        correctIndex: 0,
        explanation: 'A Golden Cross with price above key moving averages is an established bullish macro signal indicating long-term upward momentum.',
        xp: 40
      },
      {
        id: 'bvb-2',
        scenario: 'Price makes a new 52-week high, but the 14-period RSI prints a significantly lower peak than on the previous high, followed by a heavy red candle.',
        question: 'Who is gaining the upper hand?',
        options: ['The Bulls', 'The Bears (momentum divergence)', 'Algorithmic market makers only'],
        correctIndex: 1,
        explanation: 'Bearish divergence indicates internal buying exhaustion, giving the statistical edge to the Bears for an impending correction.',
        xp: 40
      },
      {
        id: 'bvb-3',
        scenario: 'Asset breaks through a multi-month resistance level with 300% above-average volume, and retests the level holding it firmly as new support.',
        question: 'Who dominates the market structure?',
        options: ['The Bulls', 'The Bears', 'Neither'],
        correctIndex: 0,
        explanation: 'High-volume breakout combined with successful support-resistance polarity retest is textbook bullish dominance.',
        xp: 40
      },
      {
        id: 'bvb-4',
        scenario: 'A stock gaps down below its 200-day moving average on disastrous earnings and heavy volume, failing to make any bounce all afternoon.',
        question: 'Who controls the tape?',
        options: ['The Bulls', 'The Bears', 'Market is completely unpredictable'],
        correctIndex: 1,
        explanation: 'Heavy institutional distribution below macro trend filters gives clear control to the Bears.',
        xp: 40
      },
      {
        id: 'bvb-5',
        scenario: 'Price has been falling for 5 days. It dips below the previous month\'s low, rapidly springs back above it within 15 minutes, leaving a long wick.',
        question: 'What just occurred, and who is primed to gain?',
        options: ['Bears just initiated a fresh multi-month trend', 'A Bear Trap / Liquidity Sweep occurred, giving the Bulls edge', 'Exchanges halted trading'],
        correctIndex: 1,
        explanation: 'Price swept sell-side liquidity below the low and immediately snapped back, indicating institutional buyers absorbed sell orders to push price higher.',
        xp: 40
      }
    ]
  },
  {
    id: 'ch-4',
    slug: 'risk-management-challenge',
    title: 'Risk Management Calculator Challenge',
    subtitle: 'Solve real sizing and risk-to-reward problems like a professional risk manager.',
    category: 'Mathematics',
    difficulty: 'Advanced',
    timePerQuestionSeconds: 30,
    totalQuestions: 5,
    badgeId: 'badge-risk-architect',
    questions: [
      {
        id: 'rm-1',
        scenario: 'Your virtual account balance is $100,000. Your strict rule is risking 1% maximum per trade. You want to buy Apple (AAPL) at $200.00 with a stop-loss at $195.00.',
        question: 'What is your exact calculated position size (number of shares)?',
        options: ['100 shares', '200 shares', '500 shares', '1,000 shares'],
        correctIndex: 1,
        explanation: '1% of $100,000 = $1,000 dollar risk. Stop distance = $200 - $195 = $5.00/share. Position Size = $1,000 / $5.00 = 200 shares.',
        xp: 75
      },
      {
        id: 'rm-2',
        scenario: 'You buy Bitcoin at $60,000 with a stop-loss at $58,500 and a profit target at $64,500.',
        question: 'What is the Risk-to-Reward (R:R) ratio of this planned trade?',
        options: ['1:1', '1:2', '1:3', '1:4'],
        correctIndex: 2,
        explanation: 'Risk = $60,000 - $58,500 = $1,500. Reward = $64,500 - $60,000 = $4,500. $4,500 / $1,500 = 1:3 Risk-to-Reward.',
        xp: 75
      },
      {
        id: 'rm-3',
        scenario: 'A trader risks 5% of their account on every trade and encounters a normal 5-trade losing streak.',
        question: 'Approximately what percentage of the account is wiped out?',
        options: ['5%', '12%', 'Over 22% of the account balance', 'Exactly 50%'],
        correctIndex: 2,
        explanation: '(1 - 0.05)^5 = 0.7737 -> roughly 22.6% drawdown, which requires nearly 30% gain just to get back to even.',
        xp: 75
      },
      {
        id: 'rm-4',
        scenario: 'Your account balance is $20,000. You enter a position and set a stop loss such that you will lose $300 if hit.',
        question: 'What percentage of your account are you risking on this trade?',
        options: ['0.5%', '1.5%', '3.0%', '0.15%'],
        correctIndex: 1,
        explanation: '$300 / $20,000 = 0.015 = 1.5% account risk.',
        xp: 75
      },
      {
        id: 'rm-5',
        scenario: 'If you win only 35% of your trades, but your average winning trade makes $400 and your average losing trade loses $100, what happens over 100 trades?',
        question: 'What is the net outcome of this trading system over 100 trades?',
        options: [
          'You lose money because the win rate is below 50%',
          'You break exactly even ($0)',
          'You make +$7,500 net profit due to positive expectancy',
          'Your account suffers a margin call'
        ],
        correctIndex: 2,
        explanation: 'Wins: 35 * $400 = +$14,000. Losses: 65 * $100 = -$6,500. Net profit = +$7,500! A high reward-to-risk ratio overcomes a low win rate.',
        xp: 75
      }
    ]
  },
  {
    id: 'ch-5',
    slug: 'market-terminology',
    title: 'Market Terminology Speed Run',
    subtitle: 'Test your vocabulary across professional Wall Street and algorithmic trading terms.',
    category: 'Foundations',
    difficulty: 'Beginner',
    timePerQuestionSeconds: 15,
    totalQuestions: 5,
    badgeId: 'badge-challenge-champion',
    questions: [
      {
        id: 'mt-1',
        scenario: 'A market phenomenon where your trade executes at a different price than requested due to extreme speed or low liquidity.',
        question: 'What is this called?',
        options: ['Arbitrage', 'Slippage', 'Contango', 'Delta'],
        correctIndex: 1,
        explanation: 'Slippage is the difference between the expected price of a trade and the execution price, frequent in fast or thin markets.',
        xp: 40
      },
      {
        id: 'mt-2',
        scenario: 'The cost paid to borrow funds or maintain open leveraged contracts overnight in derivatives and forex.',
        question: 'What is this financing rate called?',
        options: ['Funding / Swap Rate', 'Call Option', 'Coupon', 'Par Value'],
        correctIndex: 0,
        explanation: 'Swap or overnight funding fee is the interest rate differential charged or paid for holding leveraged positions open across the daily rollover.',
        xp: 40
      },
      {
        id: 'mt-3',
        scenario: 'The difference between the highest price a buyer will pay and the lowest price a seller will accept.',
        question: 'What is this called?',
        options: ['Market Cap', 'Bid-Ask Spread', 'Volume Profile', 'Tick Ratio'],
        correctIndex: 1,
        explanation: 'The bid-ask spread is the gap between the highest current bid and the lowest current offer.',
        xp: 40
      },
      {
        id: 'mt-4',
        scenario: 'A sudden, sharp drop in price designed to trigger retail stop-loss orders before reversing aggressively upward.',
        question: 'What slang term is used for this action?',
        options: ['Dead Cat Bounce', 'Liquidity Sweep / Stop Hunt', 'Backwardation', 'Gamma Squeeze'],
        correctIndex: 1,
        explanation: 'Liquidity sweeps target concentrated clusters of stop-loss orders to accumulate inventory at favorable prices.',
        xp: 40
      },
      {
        id: 'mt-5',
        scenario: 'A statistical measure of an asset\'s rate of price change over a given period, often measured by ATR or standard deviation.',
        question: 'What term defines this price dispersion?',
        options: ['Liquidity', 'Volatility', 'Leverage', 'Beta'],
        correctIndex: 1,
        explanation: 'Volatility measures how wildly or rapidly an asset\'s price fluctuates over time.',
        xp: 40
      }
    ]
  },
  {
    id: 'ch-6',
    slug: 'daily-challenge',
    title: 'Daily Market Mastery Challenge',
    subtitle: 'Daily rotating questions to keep your analytical edge sharp and maintain your streak.',
    category: 'Daily Training',
    difficulty: 'Intermediate',
    timePerQuestionSeconds: 25,
    totalQuestions: 3,
    badgeId: 'badge-streak-3',
    questions: [
      {
        id: 'dc-1',
        scenario: 'The S&P 500 futures are testing the previous all-time high for the third time in 48 hours. Volume is expanding on each upward push.',
        question: 'What is the most probable structural outcome?',
        options: [
          'Immediate crash to zero',
          'Breakout expansion as overhead sell orders are systematically absorbed',
          'Volume will permanently disappear',
          'Trading will be indefinitely suspended'
        ],
        correctIndex: 1,
        explanation: 'Repeated tests of resistance with increasing volume indicate that available supply is being eaten by buyers, paving the way for a breakout.',
        xp: 50
      },
      {
        id: 'dc-2',
        scenario: 'A trader has won 6 trades in a row today and feels "invincible", wanting to increase position size by 500% on the next trade.',
        question: 'What cognitive trading bias is currently threatening this trader?',
        options: ['Sunk Cost Fallacy', 'Overconfidence Bias (leading to catastrophic drawdown)', 'Gambler\'s Fallacy', 'Anchoring Bias'],
        correctIndex: 1,
        explanation: 'Overconfidence bias following winning streaks is one of the most common causes of account blowups as discipline is discarded.',
        xp: 50
      },
      {
        id: 'dc-3',
        scenario: 'A trader enters a long position with a planned stop-loss at $45. When price reaches $45.10, the trader cancels the stop and moves it down to $42 "to give it room".',
        question: 'What major rule violation has been committed?',
        options: [
          'Violating predefined risk parameters and moving stop-losses away from price',
          'Taking profits too early',
          'Trading during non-market hours',
          'Paying too little commission'
        ],
        correctIndex: 0,
        explanation: 'Never move a stop loss away from price! Doing so destroys risk control and turns small calculated losses into catastrophic drawdowns.',
        xp: 50
      }
    ]
  },
  {
    id: 'ch-7',
    slug: 'strategy-reasoning',
    title: 'Strategy Reasoning Exercise',
    subtitle: 'Analyze comprehensive multi-factor scenarios and make sound risk-adjusted decisions.',
    category: 'Strategy & Execution',
    difficulty: 'Advanced',
    timePerQuestionSeconds: 30,
    totalQuestions: 3,
    badgeId: 'badge-risk-architect',
    questions: [
      {
        id: 'sr-1',
        scenario: 'Stock XYZ is in a strong Daily uptrend. On the 15-minute chart, price pulls back to the 50 EMA and the 61.8% Fibonacci retracement level, printing a bullish Hammer with above-average volume. Resistance is $10 away; your invalidation stop is $2 below the hammer.',
        question: 'What is the most disciplined action to take?',
        options: [
          'Enter long on the close of the hammer with stop $2 below, targeting a 1:5 risk-to-reward ratio toward resistance',
          'Wait until price breaks past resistance before buying',
          'Short the stock because the 15-minute chart is in a pullback',
          'Risk 50% of your total account on this setup'
        ],
        correctIndex: 0,
        explanation: 'This setup provides high confluence: Daily trend alignment + EMA support + 61.8% Fib + bullish candle trigger + 1:5 R:R.',
        xp: 80
      },
      {
        id: 'sr-2',
        scenario: 'High-impact Non-Farm Payrolls (NFP) economic data is scheduled to release in 2 minutes. The market is consolidating tightly.',
        question: 'What does institutional risk protocol dictate for an intraday retail trader?',
        options: [
          'Place a huge market order 5 seconds before the release to catch the first spike',
          'Stand aside with no open positions and let the initial violent volatility & spread widening subside before trading clear structure',
          'Borrow maximum margin to trade both sides simultaneously',
          'Assume the news is already 100% priced in and ignore it'
        ],
        correctIndex: 1,
        explanation: 'During high-impact news releases, spreads blow out and slippage is unpredictable. Professional traders wait for post-news price discovery to settle.',
        xp: 80
      },
      {
        id: 'sr-3',
        scenario: 'You have a planned stop-loss at $98 on an open long. Suddenly bad news breaks and the stock gaps down to open at $95 (bypassing your $98 stop).',
        question: 'How does an actual stop order behave during a gap down, and what is your required reaction?',
        options: [
          'The broker cancels the trade and restores your entry price',
          'The stop order turns into a market order at the open and fills at $95; you must accept the loss and not hold onto a broken thesis',
          'You should immediately buy double the shares to average down at $95',
          'You sue the exchange for slippage'
        ],
        correctIndex: 1,
        explanation: 'A stop order triggers when the price is breached and fills at the best available market price ($95). Accepting market realities without emotional resistance is vital.',
        xp: 80
      }
    ]
  }
];
