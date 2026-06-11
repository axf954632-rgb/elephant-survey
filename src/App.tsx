import { useState, useCallback, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import InstructionPage from './components/InstructionPage';
import QuestionPage from './components/QuestionPage';
import ResultPage from './components/ResultPage';

type Page = 'landing' | 'instruction' | 'question' | 'result';

const STORAGE_KEY = 'elephant_survey_v1';

function App() {
  const [page, setPage] = useState<Page>('landing');
  const [currentDimension, setCurrentDimension] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // 初始化：检查 localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.answers) {
          setAnswers(data.answers);
        }
        if (data.completedAt) {
          setPage('result');
        } else if (data.currentPage && data.currentPage >= 1) {
          setCurrentDimension(data.currentPage - 1);
          setPage('question');
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const handleStart = useCallback(() => {
    setPage('instruction');
  }, []);

  const handleInstructionStart = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.currentPage && data.currentPage >= 1 && data.currentPage <= 12) {
          setCurrentDimension(data.currentPage - 1);
        }
      } catch {
        // ignore
      }
    }
    setPage('question');
  }, []);

  const handleAnswer = useCallback((questionId: number, score: number) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: score };
      const saved = localStorage.getItem(STORAGE_KEY);
      const data = saved ? JSON.parse(saved) : {};
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...data,
          answers: next,
        })
      );
      return next;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentDimension((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentDimension((prev) => {
      const next = prev + 1;
      if (next >= 12) {
        return prev;
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      const data = saved ? JSON.parse(saved) : {};
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...data,
          currentPage: next + 1,
        })
      );
      return next;
    });
  }, []);

  const handleComplete = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const data = saved ? JSON.parse(saved) : {};
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...data,
        answers,
        currentPage: 13,
        completedAt: new Date().toISOString(),
      })
    );
    setPage('result');
  }, [answers]);

  const handleRestart = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAnswers({});
    setCurrentDimension(0);
    setPage('landing');
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      {page === 'landing' && <LandingPage onStart={handleStart} />}
      {page === 'instruction' && <InstructionPage onStart={handleInstructionStart} />}
      {page === 'question' && (
        <QuestionPage
          currentDimensionIndex={currentDimension}
          answers={answers}
          onAnswer={handleAnswer}
          onPrev={handlePrev}
          onNext={handleNext}
          onComplete={handleComplete}
        />
      )}
      {page === 'result' && (
        <ResultPage answers={answers} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;
