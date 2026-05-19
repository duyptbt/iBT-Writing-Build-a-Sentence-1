
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SectionType, SentenceQuestion, Feedback } from './types';
import { PRACTICE_1_QUESTIONS, PRACTICE_2_QUESTIONS, SENTENCE_TIME_LIMIT } from './constants';
import { Timer } from './components/Timer';
import { FeedbackDisplay } from './components/FeedbackDisplay';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionType>(SectionType.INTRODUCTION);
  const [practiceSet, setPracticeSet] = useState<'practice_1' | 'practice_2'>('practice_1');
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [shuffledPool, setShuffledPool] = useState<string[]>([]);
  const [userResults, setUserResults] = useState<Record<number, boolean>>({});
  const [currentAttempts, setCurrentAttempts] = useState(2);
  const [showExplanation, setShowExplanation] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' | 'info' } | null>(null);
  
  // Writing States
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const currentQuestions = useMemo(() => {
    return practiceSet === 'practice_1' ? PRACTICE_1_QUESTIONS : PRACTICE_2_QUESTIONS;
  }, [practiceSet]);

  // Initialize sentence building pool
  const resetSentence = useCallback((keepAttempts?: boolean) => {
    const current = currentQuestions[sentenceIndex];
    if (!current) return;
    setShuffledPool([...current.scrambledWords].sort(() => Math.random() - 0.5));
    setSelectedWords([]);
    setFeedback(null);
    if (keepAttempts !== true) {
      setCurrentAttempts(2);
      setShowExplanation(false);
      setMessage(null);
    }
  }, [sentenceIndex, currentQuestions]);

  useEffect(() => {
    if (activeSection === SectionType.SENTENCE_BUILDING) {
      resetSentence();
    }
  }, [activeSection, resetSentence]);

  // Track if current sentence is correct
  const checkCurrentCorrect = useCallback(() => {
    const current = currentQuestions[sentenceIndex];
    if (!current) return false;
    
    const totalSlots = current.correctSegmentCount ?? (current.scrambledWords.length + (current.fixedWords ? Object.keys(current.fixedWords).length : 0));
    const fullSentenceArr = [];
    let selectedIdx = 0;
    
    for (let i = 0; i < totalSlots; i++) {
      const fixedWord = current.fixedWords?.[i];
      if (fixedWord) {
        fullSentenceArr.push(fixedWord);
      } else {
        const userWord = selectedWords[selectedIdx];
        if (userWord) {
          fullSentenceArr.push(userWord);
          selectedIdx++;
        }
      }
    }
    
    return fullSentenceArr.join(" ").toLowerCase() === current.correctAnswer.toLowerCase();
  }, [selectedWords, sentenceIndex, currentQuestions]);

  const handleWordClick = (word: string, fromPool: boolean) => {
    // Prevent interaction if timer isn't active or no attempts left/finished
    const isActuallyCorrect = checkCurrentCorrect();
    const current = currentQuestions[sentenceIndex];
    if (!current) return;
    const isFinished = userResults[current.id] !== undefined;

    if (activeSection === SectionType.SENTENCE_BUILDING && (!isTimerActive || currentAttempts === 0 || isActuallyCorrect || isFinished)) return;

    if (fromPool) {
      const totalSlots = current.correctSegmentCount ?? (current.scrambledWords.length + (current.fixedWords ? Object.keys(current.fixedWords).length : 0));
      const fixedWordsCount = current.fixedWords ? Object.keys(current.fixedWords).length : 0;
      const availableBlanks = totalSlots - fixedWordsCount;
      
      if (selectedWords.length >= availableBlanks) return;

      setSelectedWords([...selectedWords, word]);
      const index = shuffledPool.indexOf(word);
      if (index !== -1) {
        const newPool = [...shuffledPool];
        newPool.splice(index, 1);
        setShuffledPool(newPool);
      }
    } else {
      setShuffledPool([...shuffledPool, word]);
      const newSelected = [...selectedWords];
      const index = newSelected.lastIndexOf(word);
      if (index !== -1) {
        newSelected.splice(index, 1);
        setSelectedWords(newSelected);
      }
    }
  };

  const handleNext = () => {
    if (sentenceIndex < currentQuestions.length - 1) {
      setSentenceIndex(prev => prev + 1);
    } else {
      setActiveSection(SectionType.RESULTS);
      setIsTimerActive(false);
    }
  };

  const handleCheck = () => {
    const isCorrect = checkCurrentCorrect();
    const current = currentQuestions[sentenceIndex];
    if (!current) return;

    if (isCorrect) {
      setUserResults(prev => ({ ...prev, [current.id]: true }));
      setShowExplanation(true);
      setMessage({ text: "Correct! Outstanding work.", type: 'success' });
    } else {
      const nextAttempts = currentAttempts - 1;
      setCurrentAttempts(nextAttempts);
      if (nextAttempts === 0) {
        setUserResults(prev => ({ ...prev, [current.id]: false }));
        setShowExplanation(true);
        setMessage({ text: "Out of attempts. Review the correct answer.", type: 'error' });
      } else {
        setMessage({ text: `Not quite right! You have ${nextAttempts} attempt left.`, type: 'error' });
        // Clear message after a few seconds
        setTimeout(() => setMessage(prev => prev?.text.includes('Not quite') ? null : prev), 3000);
      }
    }
  };

  const forceFinish = () => {
    // Grade current question if not already graded
    const isCorrect = checkCurrentCorrect();
    const current = currentQuestions[sentenceIndex];
    if (current && userResults[current.id] === undefined) {
      setUserResults(prev => ({ ...prev, [current.id]: isCorrect }));
    }
    
    setActiveSection(SectionType.RESULTS);
    setIsTimerActive(false);
  };

  const renderResults = () => {
    const score = Object.values(userResults).filter(Boolean).length;
    const total = currentQuestions.length;
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="max-w-4xl mx-auto space-y-8 py-12 animate-in fade-in duration-700">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black text-slate-900">Practice Results</h1>
          <p className="text-xl text-slate-600">Great job finishing {practiceSet === 'practice_1' ? 'Practice 1' : 'Practice 2'}!</p>
        </div>

        <div className="bg-white p-10 rounded-3xl border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(79,70,229,1)] flex flex-col items-center gap-6">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 80}
                strokeDashoffset={2 * Math.PI * 80 * (1 - score / total)}
                className="text-indigo-600 transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black text-slate-900">{score}/{total}</span>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{percentage}% Correct</span>
            </div>
          </div>

          <p className="text-lg text-slate-700 max-w-xl text-center">
            {percentage === 100 ? "Perfect Score! You have a strong command of grammar." : 
             percentage >= 70 ? "Excellent work! Most of your sentences were perfectly constructed." :
             percentage >= 40 ? "Good start. Focus on word order and complex sentence structures." :
             "Keep practicing. Review the explanations below to improve your grammar patterns."}
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900">Feedback & Explanations</h2>
          {currentQuestions.map((q, idx) => (
            <div key={q.id} className={`p-8 rounded-2xl border-2 ${userResults[q.id] ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${userResults[q.id] ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {idx + 1}
                  </span>
                  <h3 className="text-xl font-bold text-slate-800">{q.context}</h3>
                </div>
                {userResults[q.id] ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-black uppercase">Correct</span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-black uppercase">Incorrect</span>
                )}
              </div>
              
              <div className="space-y-4 ml-13">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Correct Answer</p>
                  <p className="text-lg text-slate-900 font-medium">
                    {q.prefix && <span className="mr-1">{q.prefix}</span>}
                    {q.correctAnswer}
                    {q.suffix && <span>{q.suffix}</span>}
                  </p>
                </div>
                
                {q.explanation && (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Grammar Note</p>
                    <p className="text-slate-600 leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-8">
          <button
            onClick={() => {
              setActiveSection(SectionType.PRACTICE_SELECTION);
              setSentenceIndex(0);
              setUserResults({});
              setIsTimerActive(false);
            }}
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center gap-3"
          >
            Finish & Return to Selection
          </button>
        </div>
      </div>
    );
  };

  const renderIntroduction = () => {
    return (
      <div className="max-w-4xl mx-auto space-y-12 py-12 animate-in fade-in duration-700">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-black text-slate-900 tracking-tight">Build a Sentence</h1>
          <div className="max-w-2xl mx-auto space-y-6 text-left bg-white p-10 rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl text-slate-800 font-bold leading-relaxed">
              The Build a Sentence task measures the following key skills:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-lg text-slate-700">
                <span className="text-indigo-600 font-black text-2xl leading-none">•</span>
                <span>Your knowledge of sentence-level grammar</span>
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-700">
                <span className="text-indigo-600 font-black text-2xl leading-none">•</span>
                <span>Your ability to construct appropriate responses in short interactions</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button
            onClick={() => {
              setActiveSection(SectionType.PRACTICE_SELECTION);
              setIsTimerActive(false);
            }}
            className="group relative px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-2xl hover:bg-slate-900 transition-all border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(79,70,229,0.3)] hover:shadow-none active:translate-x-1 active:translate-y-1 flex items-center gap-3"
          >
            Get Started
            <svg className="w-8 h-8 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderPracticeSelection = () => {
    const sets = [
      { id: 'practice_1', name: 'Practice 1', count: PRACTICE_1_QUESTIONS.length, description: 'Basic grammar and common conversational patterns.' },
      { id: 'practice_2', name: 'Practice 2', count: PRACTICE_2_QUESTIONS.length, description: 'Advanced conjunctions and complex sentence structures.' }
    ];

    return (
      <div className="max-w-4xl mx-auto py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-slate-900">Choose your practice set</h2>
          <p className="text-slate-500 text-lg">Select a task to begin your sentence building practice.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sets.map((set) => (
            <button
              key={set.id}
              onClick={() => {
                setPracticeSet(set.id as any);
                setSentenceIndex(0);
                setUserResults({});
                setActiveSection(SectionType.SENTENCE_BUILDING);
              }}
              className="flex flex-col items-start p-8 bg-white border-4 border-slate-900 rounded-3xl text-left hover:bg-indigo-50 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 group"
            >
              <div className="flex justify-between items-center w-full mb-4">
                <span className="text-2xl font-black text-slate-900">{set.name}</span>
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">{set.count} Items</span>
              </div>
              <p className="text-slate-600 mb-6 flex-grow">{set.description}</p>
              <div className="flex items-center gap-2 text-indigo-600 font-bold group-hover:gap-4 transition-all">
                Select Task
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const renderSentenceBuilding = () => {
    const current = currentQuestions[sentenceIndex];
    if (!current) return null;
    const isFinished = userResults[current.id] !== undefined;

    const renderSentenceSlots = () => {
      const totalSlots = current.correctSegmentCount ?? (current.scrambledWords.length + (current.fixedWords ? Object.keys(current.fixedWords).length : 0));
      const elements = [];
      let selectedIdx = 0;

      for (let i = 0; i < totalSlots; i++) {
        const fixedWord = current.fixedWords?.[i];
        if (fixedWord) {
          elements.push(
            <span key={`fixed-${i}`} className="text-slate-800 font-bold px-1 transition-all">
              {fixedWord}
            </span>
          );
        } else {
          const userWord = selectedWords[selectedIdx];
          if (userWord) {
            const displayWord = (i === 0 && isFinished && userResults[current.id] && !current.prefix) 
              ? userWord.charAt(0).toUpperCase() + userWord.slice(1) 
              : userWord;
            elements.push(
              <button
                key={`selected-${i}`}
                disabled={isFinished || !isTimerActive}
                onClick={() => handleWordClick(userWord, false)}
                className={`pb-1 px-1 border-b-2 transition-all ${isFinished && userResults[current.id] ? 'text-green-600 border-green-600 cursor-default' : isFinished && !userResults[current.id] ? 'text-red-600 border-red-600 cursor-default' : 'text-indigo-600 border-indigo-400 hover:text-indigo-800'} ${!isTimerActive ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {displayWord}
              </button>
            );
            selectedIdx++;
          } else {
            elements.push(
              <span key={`blank-${i}`} className={`w-16 border-b-2 border-slate-300 h-8 flex-shrink-0 ${!isTimerActive ? 'border-slate-100' : ''}`}></span>
            );
          }
        }
      }
      return elements;
    };

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-800">Build a Sentence: {practiceSet === 'practice_1' ? 'Practice 1' : 'Practice 2'}</h2>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-slate-600 italic text-sm">Move the words in the word pool to create grammatical sentences.</p>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-slate-500 text-sm font-medium">{Math.round(SENTENCE_TIME_LIMIT / 60)} minutes allotted</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {!isTimerActive ? (
                <button
                  onClick={() => setIsTimerActive(true)}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-all active:scale-95 text-sm"
                >
                  Start Timer
                </button>
              ) : (
                <Timer 
                  initialSeconds={SENTENCE_TIME_LIMIT} 
                  isActive={isTimerActive} 
                  onTimeUp={forceFinish} 
                />
              )}
              
              <button 
                onClick={() => resetSentence(true)}
                disabled={!isTimerActive}
                className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 text-sm font-semibold disabled:opacity-20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear
              </button>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className={`p-4 bg-slate-50 rounded-xl border border-slate-200 transition-opacity ${!isTimerActive ? 'opacity-40' : 'opacity-100'}`}>
              <div className="flex items-start">
                <span className="text-slate-800 font-bold mr-2 text-xl">{sentenceIndex + 1}.</span>
                <span className="text-xl text-slate-800 font-bold">{current.context}</span>
              </div>
            </div>

            <div className={`min-h-[100px] py-4 px-2 flex flex-wrap gap-x-3 gap-y-6 items-center text-xl font-medium transition-all ${!isTimerActive ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
              {current.prefix && <span className="text-slate-800">{current.prefix}</span>}
              {renderSentenceSlots()}
              {current.suffix && (
                <span className={`transition-colors ${isFinished ? 'text-slate-800' : 'text-slate-500'}`}>
                  {current.suffix}
                </span>
              )}
            </div>

            {isFinished && !userResults[current.id] && (
               <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-800 animate-in fade-in duration-300">
                  <p className="font-bold mb-1">Correct Sentence:</p>
                  <p className="text-lg">
                    {current.prefix && <span className="mr-1">{current.prefix}</span>}
                    {current.correctAnswer}
                    {current.suffix && <span>{current.suffix}</span>}
                  </p>
               </div>
            )}

            {!isFinished && isTimerActive && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {message && !isFinished && (
                  <div className={`p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-bold">{message.text}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                   <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Word Pool</p>
                   <p className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Attempts Left: {currentAttempts}</p>
                </div>
                <div className="flex flex-wrap gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
                  {shuffledPool.map((word, i) => (
                    <button
                      key={`pool-${i}`}
                      onClick={() => handleWordClick(word, true)}
                      className="px-5 py-2.5 bg-white text-slate-700 rounded-xl border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-md transition-all font-semibold shadow-sm"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isTimerActive && !isFinished && (
              <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100 text-center animate-pulse">
                <p className="text-indigo-700 font-bold text-lg mb-2">Ready to test your grammar?</p>
                <p className="text-indigo-600/70 text-sm">Click "Start Timer" at the top to begin the {Math.round(SENTENCE_TIME_LIMIT / 60)}-minute practice session.</p>
              </div>
            )}

            {isFinished && (
              <div className={`p-4 rounded-xl flex flex-col gap-3 animate-in zoom-in duration-300 ${userResults[current.id] ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                <div className="flex items-center gap-3">
                  {userResults[current.id] ? (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold text-lg">Correct! Well done.</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold text-lg">Out of attempts. Review the correct answer above.</span>
                    </>
                  )}
                </div>
                {showExplanation && current.explanation && (
                  <div className="mt-2 text-sm italic border-t border-current/20 pt-2">
                    {current.explanation}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end items-center pt-8 border-t border-slate-100">
              
              {!isFinished ? (
                <button
                  disabled={!isTimerActive || selectedWords.length === 0}
                  onClick={handleCheck}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-slate-900 transition-all font-bold shadow-lg shadow-indigo-100 disabled:opacity-50"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-slate-900 transition-all font-bold shadow-lg shadow-indigo-100"
                >
                  {sentenceIndex < currentQuestions.length - 1 ? 'Next' : 'Finish Practice'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm mb-8">
        <div className="max-w-6xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveSection(SectionType.INTRODUCTION); setIsTimerActive(false); }}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">TOEFL iBT Writing Pro</h1>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => { setActiveSection(SectionType.SENTENCE_BUILDING); setFeedback(null); setIsTimerActive(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeSection === SectionType.SENTENCE_BUILDING ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Practice
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4">
        {activeSection === SectionType.INTRODUCTION && renderIntroduction()}
        {activeSection === SectionType.PRACTICE_SELECTION && renderPracticeSelection()}
        {activeSection === SectionType.SENTENCE_BUILDING && renderSentenceBuilding()}
        {activeSection === SectionType.RESULTS && renderResults()}
      </main>
    </div>
  );
};

export default App;
