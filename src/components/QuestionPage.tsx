import { useCallback, useEffect } from 'react';
import { dimensions } from '../data/questions';
import type { Dimension } from '../data/questions';
import ScoreSelector from './ScoreSelector';

interface QuestionPageProps {
  currentDimensionIndex: number; // 0-11
  answers: Record<number, number>;
  onAnswer: (questionId: number, score: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onComplete: () => void;
}

export default function QuestionPage({
  currentDimensionIndex,
  answers,
  onAnswer,
  onPrev,
  onNext,
  onComplete,
}: QuestionPageProps) {
  const dimension: Dimension = dimensions[currentDimensionIndex];
  const isFirst = currentDimensionIndex === 0;
  const isLast = currentDimensionIndex === dimensions.length - 1;

  // 检查当前页是否全部作答
  const allAnswered = dimension.questions.every((q) => answers[q.id] !== undefined);

  // 键盘快捷键 1-5
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 5) {
        // 找到当前第一个未答的题，或者最后一道题
        const unanswered = dimension.questions.find((q) => answers[q.id] === undefined);
        const target = unanswered || dimension.questions[dimension.questions.length - 1];
        if (target) {
          onAnswer(target.id, num);
        }
      }
      if (e.key === 'Enter' && allAnswered) {
        if (isLast) {
          onComplete();
        } else {
          onNext();
        }
      }
    },
    [dimension, answers, allAnswered, isLast, onAnswer, onNext, onComplete]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // 自动保存
  useEffect(() => {
    const saved = localStorage.getItem('elephant_survey_v1');
    const data = saved ? JSON.parse(saved) : {};
    localStorage.setItem(
      'elephant_survey_v1',
      JSON.stringify({
        ...data,
        answers,
        currentPage: currentDimensionIndex + 1,
      })
    );
  }, [answers, currentDimensionIndex]);

  return (
    <div className="min-h-screen min-h-[100svh] bg-surface flex flex-col">
      {/* 顶部进度条 */}
      <div className="px-5 pt-6 pb-2">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">
              维度 {currentDimensionIndex + 1} / {dimensions.length}
            </span>
            <span className="text-xs text-elephant-blue font-bold">
              {Math.round(((currentDimensionIndex + 1) / dimensions.length) * 100)}%
            </span>
          </div>
          <div className="h-2.5 rounded-full neu-inset overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-elephant-blue to-[#6BA5E7] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentDimensionIndex + 1) / dimensions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex items-center justify-center px-5 py-6">
        <div className="w-full max-w-xl">
          {/* 维度标题卡片 */}
          <div className="neu-card p-5 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-elephant-orange font-semibold px-2 py-0.5 rounded-full bg-elephant-orange/10">
                {dimension.category}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-elephant-dark">
              {dimension.name}
            </h2>
          </div>

          {/* 题目列表 */}
          <div className="space-y-5 sm:space-y-6">
            {dimension.questions.map((q) => (
              <div key={q.id} className="neu-card p-4 sm:p-5">
                <div className="flex gap-3 mb-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-elephant-blue/10 text-elephant-blue text-sm font-bold flex items-center justify-center">
                    {q.id}
                  </span>
                  <p className="text-sm sm:text-base text-elephant-dark font-medium leading-relaxed pt-0.5">
                    {q.text}
                  </p>
                </div>
                <ScoreSelector
                  value={answers[q.id] ?? null}
                  onChange={(score) => onAnswer(q.id, score)}
                  scoreDescriptions={q.scoreDescriptions}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部导航 */}
      <div className="px-5 py-4 sm:py-6">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          {!isFirst ? (
            <button
              onClick={onPrev}
              className="neu-btn px-5 py-3 rounded-xl text-sm font-bold min-w-[100px] select-none active:scale-[0.98]"
            >
              上一页
            </button>
          ) : (
            <div className="min-w-[100px]" />
          )}

          <div className="flex-1 text-center px-2">
            <span className="text-xs text-gray-400 leading-relaxed">
              {allAnswered ? '按 Enter 继续' : '本网站旨在帮助用户评估自身能力水平，为用户的能力成长指引方向；请注意由于自我评估的主观性，不同人的评估结果未必具有比较价值，请注意甄别；题目中1为最差，5为最好'}
            </span>
          </div>

          {isLast ? (
            <button
              onClick={onComplete}
              disabled={!allAnswered}
              className={`
                neu-btn px-5 py-3 rounded-xl text-sm font-bold min-w-[100px] select-none
                ${!allAnswered ? 'opacity-40 cursor-not-allowed' : 'active:scale-[0.98]'}
              `}
            >
              查看结果
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={!allAnswered}
              className={`
                neu-btn px-5 py-3 rounded-xl text-sm font-bold min-w-[100px] select-none
                ${!allAnswered ? 'opacity-40 cursor-not-allowed' : 'active:scale-[0.98]'}
              `}
            >
              下一页
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
