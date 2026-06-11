interface InstructionPageProps {
  onStart: () => void;
}

export default function InstructionPage({ onStart }: InstructionPageProps) {
  return (
    <div className="min-h-screen min-h-[100svh] bg-surface flex items-center justify-center px-5 py-10 md:px-10">
      <div className="w-full max-w-lg mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-elephant-dark mb-2">
            开始说明
          </h1>
          <div className="w-12 h-1 bg-elephant-blue rounded-full mx-auto" />
        </div>

        {/* 说明卡片 */}
        <div className="neu-card p-6 sm:p-8 mb-8">
          <div className="space-y-4 text-sm sm:text-base text-elephant-dark leading-relaxed">
            <p>
              本网站旨在帮助用户评估自身能力水平，为用户的能力成长指引方向。
            </p>
            <p>
              请注意由于自我评估的主观性，不同人的评估结果未必具有比较价值，请注意甄别。
            </p>
            <p>
              题目中 <span className="font-bold text-elephant-blue">1 为最差，5 为最好</span>。
            </p>
          </div>
        </div>

        {/* 按钮 */}
        <div className="text-center">
          <button
            onClick={onStart}
            className="neu-btn px-10 py-5 rounded-2xl text-elephant-dark font-bold text-xl min-h-[64px] min-w-[200px] select-none active:scale-[0.98]"
          >
            开始测评
          </button>
        </div>
      </div>
    </div>
  );
}
