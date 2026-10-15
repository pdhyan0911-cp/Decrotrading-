import React, { useState } from 'react';
import { Course, Lesson, QuizQuestion, Certificate } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { useAuth } from '../context/AuthContext';
import { EducationalDiagram } from '../components/EducationalDiagrams';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Award,
  Clock,
  Sparkles,
  HelpCircle,
  FileCheck,
  Printer
} from 'lucide-react';

interface LearningCenterPageProps {
  selectedCourseId?: string | null;
  onClearSelectedCourse?: () => void;
  navigate: (route: string) => void;
}

export const LearningCenterPage: React.FC<LearningCenterPageProps> = ({
  selectedCourseId: initialCourseId,
  navigate
}) => {
  const { user, token, refreshUser } = useAuth();
  const [filterLevel, setFilterLevel] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(() => {
    if (initialCourseId) {
      return COURSES_DATA.find((c) => c.id === initialCourseId) || null;
    }
    return null;
  });
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Quiz state for active lesson
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [lessonCompleted, setLessonCompleted] = useState<boolean>(false);
  const [earnedCert, setEarnedCert] = useState<Certificate | null>(null);

  const completedLessonIds = user?.completedLessons || [];
  const completedCourseIds = user?.completedCourses || [];

  const filteredCourses = COURSES_DATA.filter((c) => filterLevel === 'All' || c.level === filterLevel);

  const handleOpenCourse = (course: Course) => {
    setSelectedCourse(course);
    setActiveLesson(course.modules[0]?.lessons[0] || null);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setLessonCompleted(false);
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setLessonCompleted(completedLessonIds.includes(lesson.id));
  };

  const handleCompleteLesson = async () => {
    if (!activeLesson || !selectedCourse) return;
    if (token) {
      try {
        await fetch(`/api/lessons/${activeLesson.id}/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ courseId: selectedCourse.id })
        });
        await refreshUser();
      } catch (e) {
        console.error(e);
      }
    }
    setLessonCompleted(true);
  };

  const handleQuizOptionSelect = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuiz = async (quizQuestions: QuizQuestion[]) => {
    setQuizSubmitted(true);
    let correctCount = 0;
    quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    if (token && activeLesson) {
      try {
        await fetch(`/api/quizzes/${activeLesson.id}/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            score: correctCount,
            total: quizQuestions.length
          })
        });
        await refreshUser();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleClaimCertificate = async () => {
    if (!selectedCourse || !token) return;
    try {
      const res = await fetch('/api/certificates/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: selectedCourse.id,
          courseTitle: selectedCourse.title,
          scorePercent: 100
        })
      });
      if (res.ok) {
        const cert = await res.json();
        setEarnedCert(cert);
        await refreshUser();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Course Detail View with Lesson Reader */}
      {selectedCourse ? (
        <div className="space-y-6">
          {/* Back button & Course Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <button
              onClick={() => {
                setSelectedCourse(null);
                setActiveLesson(null);
              }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All 10 Courses</span>
            </button>
            <span className="rounded bg-violet-950 px-2 py-0.5 text-xs font-semibold text-violet-300 border border-violet-800/40">
              {selectedCourse.level} &bull; {selectedCourse.category}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left: Modules & Lessons Navigation Tree */}
            <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-4 lg:col-span-1 space-y-4">
              <div>
                <h3 className="font-bold text-white text-sm">{selectedCourse.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{selectedCourse.tagline}</p>
              </div>

              <div className="space-y-3">
                {selectedCourse.modules.map((mod) => (
                  <div key={mod.id} className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      {mod.title}
                    </span>
                    <div className="space-y-1">
                      {mod.lessons.map((lesson) => {
                        const isDone = completedLessonIds.includes(lesson.id);
                        const isCurrent = activeLesson?.id === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleSelectLesson(lesson)}
                            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition ${
                              isCurrent
                                ? 'bg-violet-600/20 text-violet-300 font-semibold border-l-2 border-violet-500'
                                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                            }`}
                          >
                            <span className="truncate pr-2">{lesson.title}</span>
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            ) : (
                              <span className="text-[10px] text-slate-600 font-mono shrink-0">
                                {lesson.readTimeMinutes}m
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Assessment & Certificate trigger */}
              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={handleClaimCertificate}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 border border-slate-700 py-2 text-xs font-semibold text-amber-300 hover:bg-slate-800 transition"
                >
                  <Award className="h-4 w-4 text-amber-400" />
                  <span>Claim Certificate</span>
                </button>
              </div>
            </div>

            {/* Right: Active Lesson Reader & Interactive Quiz */}
            <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-6 lg:col-span-3 space-y-6">
              {activeLesson ? (
                <>
                  {/* Lesson Title & Meta */}
                  <div className="border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2 text-xs text-violet-400 font-semibold mb-1">
                      <span>Lesson {activeLesson.order}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {activeLesson.readTimeMinutes} min read
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      {activeLesson.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">{activeLesson.summary}</p>
                  </div>

                  {/* Visual Diagram if supported */}
                  {activeLesson.visualDiagramType && (
                    <EducationalDiagram type={activeLesson.visualDiagramType} />
                  )}

                  {/* Lesson Markdown-style Content */}
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {activeLesson.content}
                  </div>

                  {/* Key Takeaways Card */}
                  <div className="rounded-xl border border-violet-900/40 bg-violet-950/20 p-4">
                    <h4 className="text-xs font-bold text-violet-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> Key Architectural Takeaways
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {activeLesson.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-violet-400 font-bold">&bull;</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interactive Quiz / Knowledge Check */}
                  {activeLesson.quiz && activeLesson.quiz.length > 0 && (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-cyan-400" />
                          <span>Knowledge Check & Comprehension Quiz</span>
                        </h4>
                        <span className="text-xs text-slate-400 font-mono">
                          {activeLesson.quiz.length} Questions
                        </span>
                      </div>

                      <div className="space-y-4">
                        {activeLesson.quiz.map((q, qIdx) => {
                          const userSelected = selectedAnswers[q.id];
                          const isAnswered = userSelected !== undefined;
                          const isCorrect = userSelected === q.correctAnswer;

                          return (
                            <div key={q.id} className="rounded-lg bg-slate-950/60 p-4 border border-slate-900 space-y-2">
                              <span className="text-xs font-bold text-white block">
                                {qIdx + 1}. {q.question}
                              </span>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                {q.options.map((opt, optIdx) => {
                                  const isOptionChosen = userSelected === optIdx;
                                  let btnStyle = 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700';

                                  if (quizSubmitted) {
                                    if (optIdx === q.correctAnswer) {
                                      btnStyle = 'border-emerald-500 bg-emerald-950/60 text-emerald-300 font-bold';
                                    } else if (isOptionChosen && !isCorrect) {
                                      btnStyle = 'border-rose-500 bg-rose-950/60 text-rose-300';
                                    }
                                  } else if (isOptionChosen) {
                                    btnStyle = 'border-violet-500 bg-violet-950/50 text-violet-200 font-semibold';
                                  }

                                  return (
                                    <button
                                      key={optIdx}
                                      onClick={() => handleQuizOptionSelect(q.id, optIdx)}
                                      disabled={quizSubmitted}
                                      className={`rounded-lg border p-2.5 text-left text-xs transition ${btnStyle}`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>

                              {quizSubmitted && (
                                <div className={`rounded p-2 text-xs mt-2 ${isCorrect ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40' : 'bg-rose-950/40 text-rose-300 border border-rose-800/40'}`}>
                                  <strong>{isCorrect ? 'Correct! ' : 'Explanation: '}</strong>
                                  {q.explanation}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {!quizSubmitted ? (
                        <button
                          onClick={() => handleSubmitQuiz(activeLesson.quiz!)}
                          disabled={Object.keys(selectedAnswers).length < activeLesson.quiz.length}
                          className="w-full rounded-lg bg-cyan-600 py-2.5 text-xs font-bold text-white hover:bg-cyan-500 transition disabled:opacity-40"
                        >
                          Submit Answers & Check Accuracy
                        </button>
                      ) : (
                        <div className="flex items-center justify-between text-xs text-slate-300 pt-2">
                          <span>Quiz completed and score logged to your learning analytics!</span>
                          <button
                            onClick={() => {
                              setSelectedAnswers({});
                              setQuizSubmitted(false);
                            }}
                            className="text-violet-400 underline hover:text-white"
                          >
                            Retake Quiz
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Completion Action */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4">
                    <div className="text-xs text-slate-400">
                      {lessonCompleted
                        ? '✅ This lesson is marked as completed in your profile.'
                        : 'Click complete to log your educational progress and receive +50 XP.'}
                    </div>

                    <button
                      onClick={handleCompleteLesson}
                      disabled={lessonCompleted}
                      className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold transition shadow ${
                        lessonCompleted
                          ? 'bg-slate-800 text-slate-400 cursor-default'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/30'
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{lessonCompleted ? 'Lesson Completed' : 'Mark as Complete (+50 XP)'}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-xs text-slate-500">
                  Select a lesson from the left panel to begin studying.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Course Catalog Grid */
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-violet-400" />
                DecroTrade Learning Curriculum
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                10 structured courses built on professional market microstructure, price action, and capital preservation.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1 rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs">
              {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className={`rounded px-3 py-1 font-semibold transition ${
                    filterLevel === lvl
                      ? 'bg-violet-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, idx) => {
              const isCompleted = completedCourseIds.includes(course.id);
              const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
              const completedInCourse = course.modules.reduce(
                (sum, m) => sum + m.lessons.filter((l) => completedLessonIds.includes(l.id)).length,
                0
              );
              const progressPct = Math.round((completedInCourse / (totalLessons || 1)) * 100);

              return (
                <div
                  key={course.id}
                  onClick={() => handleOpenCourse(course)}
                  className="rounded-xl border border-slate-800 bg-[#0A0E18] p-5 shadow hover:border-violet-600/50 hover:shadow-violet-900/10 cursor-pointer transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        0{idx + 1}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          course.level === 'Beginner'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                            : course.level === 'Intermediate'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                            : 'bg-purple-950 text-purple-400 border border-purple-800/40'
                        }`}
                      >
                        {course.level}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base group-hover:text-violet-300 transition">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{course.description}</p>

                    <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                      <span>{course.modules.length} Modules</span>
                      <span>&bull;</span>
                      <span>{totalLessons} Lessons</span>
                      <span>&bull;</span>
                      <span>~{course.estimatedHours}h</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Progress</span>
                      <span className="font-mono font-bold text-white">{progressPct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-violet-500 transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Earned Certificate Modal */}
      {earnedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-amber-500/50 bg-[#0B0E17] p-8 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
              <Award className="h-10 w-10" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Official Completion Certificate
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">{earnedCert.courseTitle}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Issued to <strong className="text-white">{earnedCert.userName}</strong> on {earnedCert.issueDate}
              </p>
            </div>

            <div className="rounded-lg bg-slate-900/90 p-4 border border-slate-800 text-xs font-mono text-slate-300">
              Verification Code: <strong className="text-amber-300">{earnedCert.verificationCode}</strong>
              <div className="text-[11px] text-slate-500 mt-1">
                DecroTrade Academic Standards &bull; 100% Score Verified
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
              >
                <Printer className="h-4 w-4" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setEarnedCert(null)}
                className="rounded-lg bg-violet-600 px-5 py-2 text-xs font-bold text-white hover:bg-violet-500 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
