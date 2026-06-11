interface ScoreSelectorProps {
  value: number | null;
  onChange: (score: number) => void;
  scoreDescriptions?: Record<number, string>;
}

const defaultLabels = ['', '很低', '较低', '一般', '较高', '很高'];

export default function ScoreSelector({ value, onChange, scoreDescriptions }: ScoreSelectorProps) {
  const currentDescription = value !== null && scoreDescriptions ? scoreDescriptions[value] : null;
  const currentLabel = value !== null && !scoreDescriptions ? defaultLabels[value] : null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((score) => {
          const isSelected = value === score;
          return (
            <button
              key={score}
              onClick={() => onChange(score)}
              className={`
                relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                text-sm sm:text-base font-bold transition-all duration-200 select-none
                ${isSelected
                  ? 'bg-elephant-blue text-white shadow-[inset_2px_2px_6px_rgba(0,0,0,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.1)] scale-110'
                  : 'neu-btn text-gray-500 hover:text-elephant-blue'
                }
              `}
            >
              {score}
            </button>
          );
        })}
      </div>
      <span className="text-xs text-gray-500 font-medium h-4 text-center px-2">
        {currentDescription || currentLabel || ''}
      </span>
    </div>
  );
}
