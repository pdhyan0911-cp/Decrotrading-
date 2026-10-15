import React, { useState, useEffect } from 'react';
import { GameChallenge, CHALLENGES } from '../data/challengesData';
import { useAuth } from '../context/AuthContext';
import {
  Gamepad2,
  Trophy,
  Clock,
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Zap,
  Target
} from 'lucide-react';

interface ChallengesPageProps {
  navigate: (route: string) => void;
}

export const ChallengesPage: React.FC<ChallengesPageProps> = ({ navigate }) => {
  const { user, token, refreshUser } = useAuth();
  const [selectedChallenge, setSelectedChallenge] = useState<GameChallenge | null>(null);

  // Active game session state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [earnedXP, setEarnedXP] = useState<number>(0);

  // Timer loop
  useEffect(() => {
    if (!selectedChallenge || isCompleted || isAnswerSubmitted) return;

    if (timeLeft <= 0) {
      // Auto submit time out
      handleSubmitAnswer(-1);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedChallenge, timeLeft, isCompleted, isAnswerSubmitted]);

  const handleStartChallenge = (ch: GameChallenge) => {
    setSelectedChallenge(ch);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setTimeLeft(ch.timePerQuestionSeconds);
    setIsCompleted(false);
    setEarnedXP(0);
  };

  const handleSubmitAnswer = (chosenIndex: number) => {
    if (isAnswerSubmitted || !selectedChallenge) return;
    setSelectedOption(chosenIndex);
    setIsAnswerSubmitted(true);

    const currentQ = selectedChallenge.questions[currentQuestionIdx];
    if (chosenIndex === currentQ.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (!selectedChallenge) return;

    if (currentQuestionIdx + 1 < selectedChallenge.questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTimeLeft(selectedChallenge.timePerQuestionSeconds);
    } else {
      // Game Finished! Submit score to backend
      setIsCompleted(true);
      const finalScore = score + (selectedOption === selectedChallenge.questions[currentQuestionIdx].correctIndex ? 1 : 0);
      const total = selectedChallenge.questions.length;
      const timeSpent = total * selectedChallenge.timePerQuestionSeconds - timeLeft;

      if (token) {
        try {
          const res = await fetch(`/api/challenges/${selectedChallenge.id}/submit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              score: finalScore,
              total,
              timeSpentSeconds: Math.max(10, timeSpent)
            })
          });
          if (res.ok) {
            const data = await res.json();
            setEarnedXP(data.xpReward);
            await refreshUser();
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setEarnedXP(finalScore * 30);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-violet-400" />
            Trading Challenges & Knowledge Duels
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Test your price action recognition, risk management math, and terminology under realistic time limits.
          </p>
        </div>

        <button
          onClick={() => navigate('leaderboard')}
          className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-slate-700 transition"
        >
          <Trophy className="h-3.5 w-3.5" />
          <span>Global Leaderboard</span>
        </button>
      </div>

      {selectedChallenge ? (
        /* Active Game Arena */
        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 shadow-2xl space-y-5">
          {!isCompleted ? (
            <>
              {/* Question progress & timer */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400">
                  {selectedChallenge.title} &bull; Question {currentQuestionIdx + 1} of{' '}
                  {selectedChallenge.questions.length}
                </span>

                <div className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-mono font-bold text-amber-400 border border-slate-800">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{timeLeft}s</span>
                </div>
              </div>

              {/* Scenario & Diagram */}
              {(() => {
                const q = selectedChallenge.questions[currentQuestionIdx];
                return (
                  <div className="space-y-4">
                    <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider block mb-1">
                        Scenario:
                      </span>
                      {q.scenario}
                    </div>

                    <h3 className="font-bold text-white text-sm">{q.question}</h3>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((option, idx) => {
                        let btnStyle = 'border-slate-800 bg-slate-900 text-slate-200 hover:border-violet-500';

                        if (isAnswerSubmitted) {
                          if (idx === q.correctIndex) {
                            btnStyle = 'border-emerald-500 bg-emerald-950/70 text-emerald-300 font-bold';
                          } else if (idx === selectedOption) {
                            btnStyle = 'border-rose-500 bg-rose-950/70 text-rose-300';
                          } else {
                            btnStyle = 'border-slate-800 bg-slate-950 text-slate-500';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSubmitAnswer(idx)}
                            disabled={isAnswerSubmitted}
                            className={`rounded-xl border p-3 text-left text-xs transition flex items-start gap-2 ${btnStyle}`}
                          >
                            <span className="font-mono font-bold opacity-60">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation if submitted */}
                    {isAnswerSubmitted && (
                      <div className="rounded-xl bg-slate-900 p-4 border border-slate-800 text-xs space-y-2">
                        <div className="flex items-center gap-1.5 font-bold">
                          {selectedOption === q.correctIndex ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4" /> Correct Decision! (+{q.xp} XP)
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center gap-1">
                              <XCircle className="h-4 w-4" /> Incorrect
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{q.explanation}</p>

                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={handleNextQuestion}
                            className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-500 transition"
                          >
                            <span>Next Question</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </>
          ) : (
            /* Results Summary */
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20 text-violet-400">
                <Trophy className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Challenge Completed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  You scored <strong className="text-white">{score}</strong> out of{' '}
                  <strong className="text-white">{selectedChallenge.questions.length}</strong> questions correct.
                </p>
              </div>

              <div className="rounded-xl bg-slate-900/90 p-4 border border-slate-800 max-w-sm mx-auto text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Accuracy Rate:</span>
                  <span className="font-mono font-bold text-white">
                    {Math.round((score / selectedChallenge.questions.length) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">XP Reward Credited:</span>
                  <span className="font-mono font-bold text-amber-400">+{earnedXP} XP</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => handleStartChallenge(selectedChallenge)}
                  className="flex items-center gap-1 rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Retry Challenge</span>
                </button>
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="rounded-lg bg-violet-600 px-5 py-2 text-xs font-bold text-white hover:bg-violet-500 transition"
                >
                  All Challenges
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Challenges Catalog */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHALLENGES.map((ch) => (
            <div
              key={ch.id}
              className="rounded-xl border border-slate-800 bg-[#0B0F19] p-5 shadow hover:border-violet-600/50 hover:shadow-violet-900/10 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="rounded bg-violet-950 px-2 py-0.5 text-[10px] font-bold text-violet-300 border border-violet-800/40">
                    {ch.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase ${
                      ch.difficulty === 'Beginner'
                        ? 'text-emerald-400'
                        : ch.difficulty === 'Intermediate'
                        ? 'text-amber-400'
                        : 'text-purple-400'
                    }`}
                  >
                    {ch.difficulty}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-violet-300 transition">
                  {ch.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{ch.subtitle}</p>

                <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                  <span>{ch.totalQuestions} Questions</span>
                  <span>&bull;</span>
                  <span>{ch.timePerQuestionSeconds}s Timer</span>
                  <span>&bull;</span>
                  <span className="text-amber-400 font-bold">Up to +{ch.totalQuestions * 50} XP</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 mt-4">
                <button
                  onClick={() => handleStartChallenge(ch)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-violet-600 py-2.5 text-xs font-bold text-white shadow hover:bg-violet-500 transition"
                >
                  <Gamepad2 className="h-4 w-4" />
                  <span>Start Challenge</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
