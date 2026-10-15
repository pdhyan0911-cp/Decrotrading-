import { Course } from '../types';

export const COURSES_DATA: Course[] = [
  {
    id: 'course-1',
    slug: 'market-fundamentals',
    title: 'Market Fundamentals',
    tagline: 'Understand how financial markets tick, liquidity mechanics, and participants.',
    level: 'Beginner',
    category: 'Foundations',
    description: 'Learn the underlying structure of global financial markets, the role of liquidity, order types, bid-ask spreads, and how institutional vs. retail participants interact.',
    learningObjectives: [
      'Identify different asset classes (Equities, Forex, Crypto, Commodities)',
      'Understand how the order book functions: bids, asks, and market depth',
      'Distinguish market orders, limit orders, and stop orders',
      'Understand liquidity, slippage, and spread economics'
    ],
    estimatedHours: 3.5,
    icon: 'Landmark',
    modules: [
      {
        id: 'mod-1-1',
        title: 'Module 1: How Markets Work',
        lessons: [
          {
            id: 'les-1-1-1',
            courseId: 'course-1',
            title: 'The Anatomy of a Market & Asset Classes',
            readTimeMinutes: 6,
            summary: 'An introduction to financial exchanges, buyers, sellers, and asset class dynamics.',
            order: 1,
            visualDiagramType: 'order_book',
            content: `Financial markets exist to facilitate the exchange of capital and risk between participants. At any given second, millions of buyers and sellers meet through an electronic matching engine called an exchange (such as the NYSE, NASDAQ, or CME).

### Major Asset Classes

1. **Equities (Stocks)**: Fractional ownership in public corporations. Price is influenced by company earnings, balance sheet strength, macro interest rates, and forward economic guidance.
2. **Forex (Currencies)**: The foreign exchange market is the largest, most liquid market globally with over $7.5 trillion traded daily. Traded in currency pairs like EUR/USD or USD/JPY.
3. **Commodities**: Physical raw goods such as Gold (XAU), Crude Oil (WTI/Brent), and agricultural products. Heavily influenced by geopolitical events and supply/demand cycles.
4. **Crypto**: Decentralized digital assets operating on blockchain protocols, operating 24/7/365 with elevated volatility.

### What Moves Price?
Price does not move randomly; it shifts when there is an imbalance between aggressive market buyers and aggressive market sellers. When buyers absorb all available sell limit orders at a given price level, price must tick up to find the next willing seller.`,
            keyTakeaways: [
              'Markets move through supply/demand order imbalances, not mystical lines.',
              'Forex is decentralized and the most liquid; Equities trade on centralized regulated exchanges.',
              'Price discovery is the continuous process of determining fair market value.'
            ],
            quiz: [
              {
                id: 'q-1-1-1',
                question: 'What fundamentally causes the market price of an asset to increase?',
                options: [
                  'More people having a positive opinion about the stock',
                  'Aggressive market buy orders exhausting available sell limit orders at current prices',
                  'Automatic algorithms raising prices every 5 minutes',
                  'Only institutional central banks printing money'
                ],
                correctAnswer: 1,
                explanation: 'Price increases when aggressive buyers execute market orders that absorb all available passive sell orders (liquidity) at the current ask price, pushing the best ask upward.'
              },
              {
                id: 'q-1-1-2',
                question: 'Which market operates 24 hours a day, 7 days a week?',
                options: ['US Stock Market (NYSE)', 'Cryptocurrency markets', 'London Metal Exchange', 'Chicago Mercantile Exchange (CME)'],
                correctAnswer: 1,
                explanation: 'Cryptocurrency protocols and spot exchanges operate continuously without weekend closures or official market opening bells.'
              }
            ]
          },
          {
            id: 'les-1-1-2',
            courseId: 'course-1',
            title: 'Order Types, Spreads, and Liquidity',
            readTimeMinutes: 7,
            summary: 'Learn the critical differences between Market, Limit, and Stop orders, plus bid-ask spreads.',
            order: 2,
            visualDiagramType: 'order_book',
            content: `To trade effectively, you must understand the mechanisms you use to enter and exit positions.

### The Bid-Ask Spread
- **Bid**: The highest price a buyer is currently willing to pay.
- **Ask (Offer)**: The lowest price a seller is currently willing to accept.
- **Spread**: The difference between Ask and Bid. Liquid assets (like AAPL or EUR/USD) feature tight spreads (pennies or fractional pips), while illiquid assets have wider spreads that represent immediate friction cost.

### Core Order Types

1. **Market Order**: Executes immediately at the best available current market price. Guarantees execution speed, but does NOT guarantee exact price (subject to slippage).
2. **Limit Order**: Specifies the exact maximum price you will pay (Buy Limit) or minimum price you will accept (Sell Limit). Guarantees price, but does NOT guarantee fill if the market doesn't reach your level.
3. **Stop-Loss Order**: An order placed with a broker to sell an asset when it reaches a specific price threshold to restrict loss on a position.`,
            keyTakeaways: [
              'Market orders pay the spread and take liquidity; Limit orders provide liquidity.',
              'Slippage occurs when market orders sweep through multiple price tiers in thin books.',
              'Never enter a trade without an predefined Stop-Loss.'
            ],
            quiz: [
              {
                id: 'q-1-1-3',
                question: 'If you want guaranteed immediate execution regardless of small price fluctuations, which order should you use?',
                options: ['Limit Order', 'Market Order', 'Good-Till-Cancelled (GTC) Order', 'Iceberg Order'],
                correctAnswer: 1,
                explanation: 'Market orders execute immediately against the best opposing limit orders currently on the book.'
              }
            ]
          }
        ]
      }
    ],
    finalAssessment: [
      {
        id: 'fa-1-1',
        question: 'What is the primary danger of using a market order during high-impact economic news releases?',
        options: [
          'The order will be permanently cancelled by the exchange',
          'Wide bid-ask spreads and severe slippage can lead to an unfavorable fill price',
          'The broker automatically charges double commission',
          'Your account will be suspended for 24 hours'
        ],
        correctAnswer: 1,
        explanation: 'During high volatility events, passive limit orders disappear from the book, causing spreads to widen significantly and market orders to slip far beyond the expected quote.'
      },
      {
        id: 'fa-1-2',
        question: 'Which role do Limit Orders play in the market ecosystem?',
        options: [
          'They consume liquidity and move price immediately',
          'They provide liquidity to the order book and wait to be filled',
          'They are only used by retail traders',
          'They bypass exchange transaction fees'
        ],
        correctAnswer: 1,
        explanation: 'Limit orders sit on the order book as passive liquidity, waiting for aggressive market orders to fill them.'
      }
    ]
  },
  {
    id: 'course-2',
    slug: 'candlestick-patterns',
    title: 'Candlestick Patterns',
    tagline: 'Master single, dual, and multi-candle formations and the psychology behind them.',
    level: 'Beginner',
    category: 'Technical',
    description: 'Deconstruct Japanese candlesticks from first principles. Understand the psychological battle between bulls and bears embedded within real bodies, upper shadows, and lower wicks.',
    learningObjectives: [
      'Read Open, High, Low, and Close (OHLC) in a single glance',
      'Identify Hammer, Shooting Star, and Doji variations',
      'Recognize Bullish & Bearish Engulfing, Morning Star, and Evening Star',
      'Interpret wick rejection as price rejection and institutional absorption'
    ],
    estimatedHours: 4.0,
    icon: 'CandlestickChart',
    modules: [
      {
        id: 'mod-2-1',
        title: 'Module 1: The Language of Candlesticks',
        lessons: [
          {
            id: 'les-2-1-1',
            courseId: 'course-2',
            title: 'Deconstructing the Japanese Candlestick',
            readTimeMinutes: 5,
            summary: 'The building blocks: Real Body, Upper Shadow, Lower Shadow, and Color Significance.',
            order: 1,
            visualDiagramType: 'candlestick',
            content: `Developed in 18th-century Japan by rice merchant Munehisa Homma, candlestick charts provide far richer visual information than simple line charts.

### The Four Price Points
Every candle encapsulates four critical data points over a selected timeframe (e.g., 5-minute, 1-hour, or 1-day):
- **Open (O)**: The price at the first trade of the session.
- **High (H)**: The highest price reached during the session.
- **Low (L)**: The lowest price reached during the session.
- **Close (C)**: The final price traded when the candle closed.

### Reading the Psychology
- **Green (Bullish) Candle**: Close > Open. Buyers dominated the session.
- **Red (Bearish) Candle**: Close < Open. Sellers pushed price lower.
- **Long Upper Wick**: Buyers tried to push price up, but sellers aggressively rejected higher prices and forced it back down.
- **Long Lower Wick**: Sellers tried to dump price, but buyers stepped in, absorbed the selling, and drove price back up.`,
            keyTakeaways: [
              'Wicks represent price rejection; wide bodies represent directional conviction.',
              'Candle patterns must always be viewed in the context of the overarching trend and key levels.',
              'Never trade a candlestick pattern before the candle has officially closed.'
            ],
            quiz: [
              {
                id: 'q-2-1-1',
                question: 'What does a long lower wick (shadow) on a candle indicate?',
                options: [
                  'Sellers maintained total dominance throughout the session',
                  'Buyers stepped in and rejected lower price levels before the candle closed',
                  'The market is closing permanently',
                  'High probability of a gap-down open'
                ],
                correctAnswer: 1,
                explanation: 'A long lower wick shows that although price dropped, aggressive buyers absorbed the supply and drove the price back up toward the close, signaling buying interest.'
              }
            ]
          },
          {
            id: 'les-2-1-2',
            courseId: 'course-2',
            title: 'High-Probability Reversal Patterns',
            readTimeMinutes: 7,
            summary: 'Learn the Hammer, Shooting Star, Inverted Hammer, and Bullish/Bearish Engulfing patterns.',
            order: 2,
            visualDiagramType: 'candlestick',
            content: `### 1. The Hammer (Bullish Reversal)
Occurs at the bottom of a downtrend.
- Small real body near the top of the candle range.
- Lower wick is at least 2x the size of the real body.
- Minimal or zero upper wick.
- *Psychology*: Sellers pushed aggressively, but buyers stepped in with overwhelming strength to bring price back to near the open.

### 2. The Shooting Star (Bearish Reversal)
Occurs at the peak of an uptrend.
- Small real body near the bottom of the range.
- Long upper wick at least 2x the body length.
- Minimal lower wick.
- *Psychology*: Buyers attempted a new high, but encountered heavy institutional selling that drove price right back down.

### 3. Engulfing Patterns
- **Bullish Engulfing**: A small red candle followed by a large green candle whose body completely engulfs the prior red candle's body. Signals strong shift in momentum.
- **Bearish Engulfing**: A small green candle followed by a large red candle whose body engulfs the prior green candle.`,
            keyTakeaways: [
              'A hammer at key support has much higher statistical win-rate than in the middle of a range.',
              'Confirmation candle closing above the hammer high is recommended before executing.',
              'Engulfing patterns reflect a complete change in supply/demand control.'
            ],
            quiz: [
              {
                id: 'q-2-1-2',
                question: 'In a Bearish Engulfing pattern, which candle completely envelopes the other?',
                options: [
                  'The first green candle envelopes the second red candle',
                  'The second red candle body completely covers the first green candle body',
                  'Both candles have identical wicks',
                  'The pattern requires three consecutive red candles'
                ],
                correctAnswer: 1,
                explanation: 'A Bearish Engulfing occurs when the second session opens higher or equal, but strong selling completely engulfs the previous session\'s bullish body.'
              }
            ]
          }
        ]
      }
    ],
    finalAssessment: [
      {
        id: 'fa-2-1',
        question: 'Why is waiting for a candle to officially CLOSE critical before executing a trade based on its pattern?',
        options: [
          'Exchanges do not permit orders on unclosed candles',
          'A candle that looks like a hammer with 30 seconds left can change into a full red body before completion',
          'Wicks only appear after the candle has closed',
          'Stop losses cannot be calculated on open candles'
        ],
        correctAnswer: 1,
        explanation: 'Until the timeframe closes, the candle is still forming and can completely change shape, invalidating the pattern before your eyes.'
      }
    ]
  },
  {
    id: 'course-3',
    slug: 'charts-and-price-action',
    title: 'Charts and Price Action',
    tagline: 'Read pure price dynamics without relying on lagging indicators.',
    level: 'Beginner',
    category: 'Price Action',
    description: 'Learn pure price action methodology: higher highs, higher lows, market structure breaks, head & shoulders, double tops/bottoms, and consolidation ranges.',
    learningObjectives: [
      'Define clear uptrends, downtrends, and sideways ranges',
      'Identify Market Structure Breaks (MSB / BOS)',
      'Recognize classic chart patterns: Flags, Wedges, Triangles, and Head & Shoulders',
      'Understand fakeouts and liquidity traps'
    ],
    estimatedHours: 4.5,
    icon: 'TrendingUp',
    modules: [
      {
        id: 'mod-3-1',
        title: 'Module 1: Market Structure',
        lessons: [
          {
            id: 'les-3-1-1',
            courseId: 'course-3',
            title: 'Market Structure & Dow Theory',
            readTimeMinutes: 6,
            summary: 'Higher Highs (HH), Higher Lows (HL), Lower Highs (LH), and Lower Lows (LL).',
            order: 1,
            visualDiagramType: 'support_resistance',
            content: `The foundation of technical analysis begins with Charles Dow's principles formulated over a century ago: **Price moves in trends consisting of impulse moves and retracements.**

### The Trend Definitions
- **Uptrend (Bullish)**: A sequence of Higher Highs (HH) and Higher Lows (HL). As long as subsequent pullbacks respect the prior low, the uptrend remains intact.
- **Downtrend (Bearish)**: A sequence of Lower Highs (LH) and Lower Lows (LL).
- **Ranging / Consolidation**: Price bounces between a defined horizontal resistance ceiling and support floor.

### Break of Structure (BOS)
When price fails to make a higher high in an uptrend and breaks below the previous higher low with conviction, market structure transitions from bullish to bearish. This early structural clue frequently precedes major trend reversals.`,
            keyTakeaways: [
              'Trading with the higher-timeframe trend gives the greatest statistical edge.',
              'A trend remains valid until the most recent swing low (uptrend) or swing high (downtrend) is violated.',
              'Never anticipate a break; wait for price to confirm the structural shift.'
            ],
            quiz: [
              {
                id: 'q-3-1-1',
                question: 'What defines a confirmed uptrend in price action?',
                options: [
                  'Price is above the 200 EMA regardless of candle swings',
                  'A succession of Higher Highs (HH) and Higher Lows (HL)',
                  'Three green candles in a row on the 1-minute chart',
                  'Increasing trade volume with no price movement'
                ],
                correctAnswer: 1,
                explanation: 'An uptrend is strictly defined by market structure producing higher swing highs followed by higher swing lows.'
              }
            ]
          }
        ]
      }
    ],
    finalAssessment: [
      {
        id: 'fa-3-1',
        question: 'When a market forms a "Double Bottom" pattern at major support, what neckline behavior signals confirmation?',
        options: [
          'Immediate entry before price reaches the neckline',
          'A strong breakout and close above the swing high neckline, ideally followed by a successful retest',
          'The price dropping below both bottoms',
          'Volume dropping to absolute zero'
        ],
        correctAnswer: 1,
        explanation: 'A double bottom is only confirmed when price decisively breaks and closes above the intervening resistance neckline.'
      }
    ]
  },
  {
    id: 'course-4',
    slug: 'technical-analysis',
    title: 'Technical Analysis',
    tagline: 'Combine chart geometry, volume analysis, and multi-timeframe confluence.',
    level: 'Intermediate',
    category: 'Technical',
    description: 'Bridge chart patterns with multi-timeframe analysis (top-down), volume profiling, Fibonacci retracements, and fair value gaps.',
    learningObjectives: [
      'Master Top-Down Multi-Timeframe Analysis (Daily -> 4H -> 15m)',
      'Use Volume Spread Analysis to detect smart-money accumulation',
      'Apply Fibonacci Retracement levels (0.382, 0.50, 0.618 golden ratio)',
      'Construct high-probability trade setups with confluence'
    ],
    estimatedHours: 5.0,
    icon: 'LineChart',
    modules: [
      {
        id: 'mod-4-1',
        title: 'Module 1: Multi-Timeframe Confluence',
        lessons: [
          {
            id: 'les-4-1-1',
            courseId: 'course-4',
            title: 'Top-Down Analysis: Macro to Micro Execution',
            readTimeMinutes: 7,
            summary: 'Aligning macro directional bias with micro execution precision.',
            order: 1,
            visualDiagramType: 'support_resistance',
            content: `One of the most common mistakes among novice traders is trading on a low timeframe (like the 1-minute or 5-minute chart) in isolation, completely blind to the dominant direction of the Daily or 4-Hour trend.

### The Rule of Three Timeframes
1. **Higher Timeframe (Macro - Daily/4H)**: Establishes overall trend, major support/resistance levels, and market regime (trending or ranging).
2. **Intermediate Timeframe (Structure - 1H/15m)**: Reveals the sub-structure, recent swing points, and pullback depth.
3. **Execution Timeframe (Trigger - 5m/1m)**: Provides precise entry timing, reduced stop-loss distance, and favorable risk-to-reward ratios.

### Fibonacci Golden Pocket
When a market completes an impulse leg, it naturally breathes. Measuring from the swing low to swing high, the 61.8% (0.618) and 65% retracement zone is historically regarded as the institutional "Golden Pocket" where buyers look to re-enter at value.`,
            keyTakeaways: [
              'Never buy into higher-timeframe resistance, even if the 1-minute chart looks bullish.',
              'Higher timeframe levels always trump lower timeframe signals.',
              'Confluence is when 2 or 3 distinct technical reasons align at the same price zone.'
            ],
            quiz: [
              {
                id: 'q-4-1-1',
                question: 'Why do professional traders analyze the Daily chart before entering a 5-minute day trade?',
                options: [
                  'Daily charts load faster on trading terminals',
                  'To avoid taking long trades directly into major Daily resistance levels',
                  'Because the SEC requires Daily chart inspection',
                  'To see tomorrow\'s opening price in advance'
                ],
                correctAnswer: 1,
                explanation: 'A trade on a low timeframe that opposes a massive Daily resistance or supply zone has a dramatically lower win rate.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-5',
    slug: 'support-and-resistance',
    title: 'Support and Resistance',
    tagline: 'Locate dynamic and horizontal levels where institutional orders cluster.',
    level: 'Intermediate',
    category: 'Price Action',
    description: 'Learn how true support and resistance levels are formed by institutional supply/demand, role reversals (polarity principle), and liquidity sweeps.',
    learningObjectives: [
      'Map static horizontal support and resistance zones rather than single lines',
      'Understand the Polarity Principle (old support becomes new resistance)',
      'Identify dynamic support using moving averages and trend channels',
      'Recognize liquidity sweeps and fakeouts around obvious key levels'
    ],
    estimatedHours: 4.0,
    icon: 'Layers',
    modules: [
      {
        id: 'mod-5-1',
        title: 'Module 1: Zones of Value',
        lessons: [
          {
            id: 'les-5-1-1',
            courseId: 'course-5',
            title: 'Zones vs. Lines & The Polarity Principle',
            readTimeMinutes: 6,
            summary: 'Why drawing single price lines fails and how broken levels flip polarity.',
            order: 1,
            visualDiagramType: 'support_resistance',
            content: `### Why Think in Zones, Not Lines
A common novice pitfall is drawing a razor-thin horizontal line at $150.00 and expecting price to bounce to the penny. In reality:
- Institutional orders are distributed across a **range** (e.g., $149.20 to $150.50).
- Stop-loss orders accumulate just above and below obvious lines.
- Treating levels as **Zones** prevents you from getting shaken out by natural market noise.

### The Polarity Principle (The Flip)
When a strong support floor is finally broken to the downside by aggressive selling:
1. Buyers who bought at that support are now trapped at a loss.
2. When price bounces back to retest that broken level, those trapped buyers sell to break even.
3. Fresh short sellers enter, seeing the broken support.
4. Result: **Former Support becomes New Resistance** (and vice versa).`,
            keyTakeaways: [
              'Draw rectangles/zones that encapsulate both candle wicks and candle body closes.',
              'The more times a level is touched, the weaker it often becomes as orders get absorbed.',
              'Look for the Retest: buying the first bounce after a broken resistance has superior edge.'
            ],
            quiz: [
              {
                id: 'q-5-1-1',
                question: 'What is the Polarity Principle in technical analysis?',
                options: [
                  'Magnetic poles influence electronic exchange servers',
                  'When an established support level is broken, it typically flips to become resistance',
                  'Positive earnings always result in negative price action',
                  'Bullish candles must always be followed by bearish candles'
                ],
                correctAnswer: 1,
                explanation: 'The polarity principle states that once support is broken, it becomes a new resistance level when tested from below.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-6',
    slug: 'indicators-and-trend-analysis',
    title: 'Indicators and Trend Analysis',
    tagline: 'Harness Moving Averages, RSI, MACD, and Bollinger Bands accurately.',
    level: 'Intermediate',
    category: 'Technical',
    description: 'Demystify mathematical indicators. Learn how to use them as objective filters rather than magic buy/sell triggers, including momentum divergences.',
    learningObjectives: [
      'Configure Simple (SMA) and Exponential Moving Averages (EMA 9, 21, 50, 200)',
      'Calculate Relative Strength Index (RSI) and spot Regular vs. Hidden Divergence',
      'Interpret MACD signal line crosses and histogram momentum shifts',
      'Measure volatility expansions and squeezes with Bollinger Bands'
    ],
    estimatedHours: 4.5,
    icon: 'Activity',
    modules: [
      {
        id: 'mod-6-1',
        title: 'Module 1: Momentum & Divergence',
        lessons: [
          {
            id: 'les-6-1-1',
            courseId: 'course-6',
            title: 'Mastering RSI & Regular Divergences',
            readTimeMinutes: 7,
            summary: 'Beyond simple 70/30 overbought/oversold: trading powerful divergences.',
            order: 1,
            visualDiagramType: 'indicators',
            content: `The Relative Strength Index (RSI), developed by J. Welles Wilder, is an oscillator measuring the speed and magnitude of recent price changes on a scale of 0 to 100.

### The Flaw of "Overbought / Oversold"
Novice traders often short when RSI crosses above 70. However, in a strong bull market, RSI can stay "overbought" above 70 for weeks while price doubles!

### The True Superpower: Regular Divergence
Divergence occurs when price action and the oscillator move in opposite directions, signaling weakening internal momentum before the price turns:
- **Bearish Divergence**: Price makes a **Higher High**, but RSI makes a **Lower High**. This shows buyers are pushing price up with diminishing velocity; institutional distribution is occurring.
- **Bullish Divergence**: Price makes a **Lower Low**, but RSI makes a **Higher Low**. Downward selling pressure has dried up.`,
            keyTakeaways: [
              'Do not short solely because RSI is over 70; look for structure exhaustion.',
              'Bearish divergence at key resistance is a premier reversal signal.',
              'Combine divergence with a candlestick trigger for confirmation.'
            ],
            quiz: [
              {
                id: 'q-6-1-1',
                question: 'What constitutes a Bearish RSI Divergence?',
                options: [
                  'Price makes a higher high while RSI makes a lower high',
                  'Price and RSI both drop below 30 simultaneously',
                  'RSI reaches 100 on high volume',
                  'Price stays flat while moving averages cross'
                ],
                correctAnswer: 0,
                explanation: 'A bearish divergence occurs when price prints a higher high, but the oscillator prints a lower high, indicating waning bullish momentum.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-7',
    slug: 'risk-management',
    title: 'Risk Management',
    tagline: 'The mathematical lifeblood of trading: protect your capital above all else.',
    level: 'Beginner',
    category: 'Risk',
    description: 'Risk management is the single factor separating surviving traders from blown accounts. Master position sizing, 1% rule, risk/reward math, and maximum drawdown limits.',
    learningObjectives: [
      'Calculate exact position sizes based on dollar account risk, not gut feeling',
      'Enforce the 1% to 2% maximum account risk rule',
      'Analyze Risk-to-Reward Ratios (minimum 1:2) and breakeven win rates',
      'Implement daily and weekly loss circuit breakers to avoid tilt'
    ],
    estimatedHours: 5.0,
    icon: 'ShieldCheck',
    modules: [
      {
        id: 'mod-7-1',
        title: 'Module 1: The Mathematics of Survival',
        lessons: [
          {
            id: 'les-7-1-1',
            courseId: 'course-7',
            title: 'The 1% Rule & Position Sizing Formula',
            readTimeMinutes: 8,
            summary: 'Learn the exact math required to calculate shares or contracts per trade.',
            order: 1,
            visualDiagramType: 'risk_reward',
            content: `No matter how confident you are in a chart pattern, any individual trade has a statistical chance of failing. If you risk 10% of your account per trade, four consecutive losses will crush your capital by 35%—requiring a 54% return just to get back to even!

### The Asymmetric Pain of Drawdown
- 10% Loss requires +11% to break even.
- 20% Loss requires +25% to break even.
- 50% Loss requires **+100%** just to break even!
- 80% Loss requires **+400%** return!

### The Universal Position Sizing Formula
Never ask "How many shares can I afford?" Ask **"Where does my stop-loss belong, and how many shares make that risk equal 1%?"**

\`\`\`
Account Risk ($) = Account Balance * Risk % (e.g. 1% = 0.01)
Stop Distance ($) = Entry Price - Stop Loss Price
Position Size (Quantity) = Account Risk ($) / Stop Distance ($)
\`\`\`

**Example Walkthrough**:
- Account Balance: $100,000
- Planned Risk: 1% = $1,000 maximum loss
- Stock Entry: $150.00
- Technical Stop Loss: $145.00
- Stop Distance: $5.00
- Max Position Size: $1,000 / $5.00 = **200 shares**.
If the trade fails and hits your stop at $145, you lose exactly $1,000 (1%) and survive to trade another day.`,
            keyTakeaways: [
              'Position size is determined by your stop-loss distance, never by account margin.',
              'Limiting risk to 1% allows you to endure a 10-trade losing streak with minimal damage.',
              'Protect your emotional capital by trading at a size where a loss does not trigger anxiety.'
            ],
            quiz: [
              {
                id: 'q-7-1-1',
                question: 'If you have a $50,000 account and adhere to a 1% risk rule, what is your maximum allowed dollar loss on any single trade?',
                options: ['$5,000', '$1,000', '$500', '$250'],
                correctAnswer: 2,
                explanation: '$50,000 * 0.01 (1%) = $500 maximum risk.'
              },
              {
                id: 'q-7-1-2',
                question: 'If an account suffers a 50% drawdown, what percentage gain is required to return to the original balance?',
                options: ['50%', '75%', '100%', '200%'],
                correctAnswer: 2,
                explanation: 'If a $100k account drops to $50k (-50%), growing $50k back to $100k requires gaining $50k, which is a 100% gain on the remaining capital.'
              }
            ]
          }
        ]
      }
    ],
    finalAssessment: [
      {
        id: 'fa-7-1',
        question: 'With a 1:3 Risk-to-Reward ratio (risking $100 to make $300), what win-rate is required to break even over 100 trades?',
        options: ['50%', '33.3%', '25%', '15%'],
        correctAnswer: 2,
        explanation: 'At 1:3 R:R, 25 winning trades generate 25 * $300 = $7,500. 75 losing trades lose 75 * $100 = $7,500. Net PnL is $0 (Breakeven). You can be wrong 75% of the time and still not lose money!'
      }
    ]
  },
  {
    id: 'course-8',
    slug: 'trading-psychology',
    title: 'Trading Psychology',
    tagline: 'Conquer fear, greed, FOMO, revenge trading, and emotional discipline.',
    level: 'Intermediate',
    category: 'Psychology',
    description: 'Explore the behavioral biases that sabotage traders: loss aversion, revenge trading, overconfidence after winning streaks, and how to develop emotional detachment.',
    learningObjectives: [
      'Overcome Loss Aversion and accept losses as the routine cost of doing business',
      'Recognize the psychological triggers of "Tilt" and Revenge Trading',
      'Neutralize Fear of Missing Out (FOMO) when chasing parabolic moves',
      'Maintain an objective Trade Journal to track mental state alongside P&L'
    ],
    estimatedHours: 3.5,
    icon: 'Brain',
    modules: [
      {
        id: 'mod-8-1',
        title: 'Module 1: Mastering Your Mind',
        lessons: [
          {
            id: 'les-8-1-1',
            courseId: 'course-8',
            title: 'The Psychology of Tilt & Loss Aversion',
            readTimeMinutes: 6,
            summary: 'Why your brain is biologically wired to make bad trading decisions and how to override it.',
            order: 1,
            visualDiagramType: 'risk_reward',
            content: `In everyday human life, admitting you made a mistake and suffering a physical or social loss triggers fight-or-flight hormones. Nobel laureates Daniel Kahneman and Amos Tversky proved that the pain of losing $1,000 is psychologically twice as intense as the joy of gaining $1,000 (Loss Aversion).

### The Destructive Cycle of "Revenge Trading"
1. A trader experiences a painful loss or gets stopped out on what they considered a "guaranteed" setup.
2. The ego is bruised. Frustration and anger surge.
3. Instead of stepping away, the trader immediately enters a new position with 3x larger size to "make it back quickly".
4. The market has zero emotion. The oversized revenge trade fails, resulting in devastating losses.

### The Professional Mindset
A casino owner does not celebrate every time someone loses at blackjack, nor do they panic when someone hits 21. They simply rely on their mathematical edge over tens of thousands of repetitions. Professional traders adopt this exact statistical mindset.`,
            keyTakeaways: [
              'A loss does not mean you are a bad trader; it is simply an operating expense.',
              'Set a strict Daily Max Loss limit (e.g., 3 losses in a day = shut down the screen).',
              'Never increase position size immediately after a losing trade.'
            ],
            quiz: [
              {
                id: 'q-8-1-1',
                question: 'What is the most effective protocol when you notice yourself feeling angry or tempted to revenge trade?',
                options: [
                  'Double your position size to recover the loss in one quick candle',
                  'Switch to an asset you have never traded before',
                  'Close your platform, step away from screens, and review your trade journal calmly later',
                  'Enter a market short on any random asset'
                ],
                correctAnswer: 2,
                explanation: 'Stepping away resets your cognitive faculties and prevents emotional tilt from destroying weeks of disciplined gains.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-9',
    slug: 'strategy-development',
    title: 'Strategy Development',
    tagline: 'Design, backtest, and refine rule-based trading systems with quantifiable edge.',
    level: 'Advanced',
    category: 'Strategy',
    description: 'Transform subjective chart reading into an objective, rule-based trading plan. Define entry triggers, invalidation criteria, trade management, and performance metrics.',
    learningObjectives: [
      'Formulate explicit rules for Setup, Trigger, Stop, and Target',
      'Calculate Expectancy and Profit Factor from historical trade logs',
      'Avoid curve-fitting and survivorship bias in strategy testing',
      'Build a written Trading Plan operating manual'
    ],
    estimatedHours: 4.5,
    icon: 'Compass',
    modules: [
      {
        id: 'mod-9-1',
        title: 'Module 1: Quantifying Your Edge',
        lessons: [
          {
            id: 'les-9-1-1',
            courseId: 'course-9',
            title: 'Expectancy Formula & Trade Plan Architecture',
            readTimeMinutes: 7,
            summary: 'How to verify whether your trading strategy has a mathematically positive expected value.',
            order: 1,
            visualDiagramType: 'risk_reward',
            content: `A trading strategy is not a collection of hopes. It is an algorithm with positive statistical expectancy.

### The Mathematical Expectancy Formula
\`\`\`
Expectancy = (Win Rate % * Average Win Size) - (Loss Rate % * Average Loss Size)
\`\`\`

If Expectancy is positive, the system will reliably generate profit over a large sample size of trades. If Expectancy is negative, even the most disciplined trader will eventually lose all capital.

### The 4 Pillars of Every Complete Trade Plan
1. **Market Context**: What market conditions must be met? (e.g., Daily trend bullish, 20 EMA above 50 EMA).
2. **Entry Trigger**: What exact price event triggers execution? (e.g., 5-minute hammer rejection at 61.8% Fib retracement).
3. **Invalidation Level (Stop-Loss)**: Where does the thesis become completely false?
4. **Profit Target & Exit Rules**: Where are targets taken? (e.g., Scale 50% at 1:2 R:R, trail remainder behind moving average).`,
            keyTakeaways: [
              'Without defined written rules, you cannot determine if a loss was bad luck or user error.',
              'A low win rate (40%) can be vastly profitable if your average win is 3x your average loss.',
              'Never modify your rules mid-trade in response to tick-by-tick emotions.'
            ],
            quiz: [
              {
                id: 'q-9-1-1',
                question: 'If a strategy has a 40% win rate, but an average win of $300 and an average loss of $100, what is its expectancy per trade?',
                options: [
                  '+$60 per trade',
                  '-$20 per trade',
                  '+$120 per trade',
                  '$0 (breakeven)'
                ],
                correctAnswer: 0,
                explanation: 'Expectancy = (0.40 * $300) - (0.60 * $100) = $120 - $60 = +$60 positive edge per trade!'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-10',
    slug: 'advanced-market-concepts',
    title: 'Advanced Market Concepts',
    tagline: 'Explore order flow, liquidity pools, fair value gaps, and institutional footprints.',
    level: 'Advanced',
    category: 'Advanced',
    description: 'Dive into modern institutional trading concepts: Smart Money Concepts (SMC), Liquidity Sweeps, Fair Value Gaps (FVG), Volume Profile, and Market Maker models.',
    learningObjectives: [
      'Understand Buy-Side and Sell-Side Liquidity pools (BSL / SSL)',
      'Spot Fair Value Gaps (FVG) and order block rebalances',
      'Identify institutional stop runs and judas swings',
      'Synthesize institutional concepts with traditional risk management'
    ],
    estimatedHours: 5.5,
    icon: 'Cpu',
    modules: [
      {
        id: 'mod-10-1',
        title: 'Module 1: Liquidity & Institutional Delivery',
        lessons: [
          {
            id: 'les-10-1-1',
            courseId: 'course-10',
            title: 'Liquidity Sweeps & Fair Value Gaps (FVG)',
            readTimeMinutes: 8,
            summary: 'Understanding where retail stops rest and how institutions engineer liquidity.',
            order: 1,
            visualDiagramType: 'order_book',
            content: `Institutions and hedge funds operate with positions so large (hundreds of millions of dollars) that they cannot simply click "Buy Market" without instantly moving the market against themselves. They require **counter-liquidity**.

### Where Does Counter-Liquidity Rest?
- Retail traders place stop-losses just above obvious double tops (Buy-Stop liquidity).
- Retail traders place stop-losses just below obvious swing lows (Sell-Stop liquidity).
To buy massive quantities, institutions will purposely drive price down into sell-stop zones to absorb all those retail sell orders at a discounted price (Liquidity Sweep).

### Fair Value Gap (FVG) / Imbalance
A 3-candle sequence where Candle 2 moves with such extreme displacement that Candle 1's high does not touch Candle 3's low. This leaves an unfilled price vacuum where only one side of the market was offered. Markets frequently retrace to rebalance this gap before continuing the primary expansion.`,
            keyTakeaways: [
              'Do not place your stops where every beginner places them—you become liquidity for institutions.',
              'A liquidity sweep followed by a sharp displacement candle often marks an institutional reversal.',
              'Fair Value Gaps serve as magnetic pull zones for institutional pullback entries.'
            ],
            quiz: [
              {
                id: 'q-10-1-1',
                question: 'Why do institutions engineer moves below obvious swing lows?',
                options: [
                  'To trigger retail sell-stop orders, providing the liquidity needed to fill large buy orders',
                  'Because exchanges close whenever a swing low is pierced',
                  'To prevent dividends from paying out',
                  'To comply with government regulations'
                ],
                correctAnswer: 0,
                explanation: 'A retail sell-stop order becomes a market sell order when hit. Large buyers need sellers to buy from; triggering stop clusters provides that required volume.'
              }
            ]
          }
        ]
      }
    ]
  }
];

export const BADGES_DATA = [
  {
    id: 'badge-first-step',
    name: 'First Spark',
    description: 'Completed your very first lesson on DecroTrade.',
    icon: 'Sparkles',
    category: 'learning',
    xpReward: 100
  },
  {
    id: 'badge-quiz-ace',
    name: 'Master Mind',
    description: 'Achieved 100% score on any course quiz.',
    icon: 'Award',
    category: 'learning',
    xpReward: 200
  },
  {
    id: 'badge-paper-pioneer',
    name: 'Virtual Pioneer',
    description: 'Executed your first virtual practice trade.',
    icon: 'PlayCircle',
    category: 'practice',
    xpReward: 150
  },
  {
    id: 'badge-risk-architect',
    name: 'Risk Guardian',
    description: 'Executed a practice trade with strict Stop-Loss & Take-Profit defined.',
    icon: 'ShieldCheck',
    category: 'practice',
    xpReward: 250
  },
  {
    id: 'badge-streak-3',
    name: 'Momentum Builder',
    description: 'Maintained a 3-day active learning streak.',
    icon: 'Flame',
    category: 'streak',
    xpReward: 300
  },
  {
    id: 'badge-challenge-champion',
    name: 'Pattern Ace',
    description: 'Scored over 80% on the Candlestick Recognition Challenge.',
    icon: 'Target',
    category: 'challenge',
    xpReward: 350
  },
  {
    id: 'badge-course-grad',
    name: 'Certified Scholar',
    description: 'Completed a full course curriculum and earned a certificate.',
    icon: 'GraduationCap',
    category: 'learning',
    xpReward: 500
  },
  {
    id: 'badge-journal-keeper',
    name: 'Disciplined Scribe',
    description: 'Recorded your thoughts and emotional review in the Trade Journal.',
    icon: 'BookOpen',
    category: 'practice',
    xpReward: 200
  }
];
