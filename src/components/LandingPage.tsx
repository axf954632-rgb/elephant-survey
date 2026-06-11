import { useEffect, useState } from 'react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [hasProgress, setHasProgress] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('elephant_survey_v1');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.currentPage > 0 && data.currentPage < 13 && !data.completedAt) {
          setHasProgress(true);
        }
      } catch {
        setHasProgress(false);
      }
    }
  }, []);

  const handleRestart = () => {
    localStorage.removeItem('elephant_survey_v1');
    onStart();
  };

  return (
    <div className="min-h-screen min-h-[100svh] bg-surface flex items-center justify-center px-5 py-10 md:px-10">
      <div className="w-full max-w-6xl mx-auto">
        {/* 响应式布局：移动端图在上，PC端左右分栏 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 lg:gap-24">
          
          {/* 左侧文字区域 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-lg order-2 md:order-1">
            {/* 主标题 */}
            <h1 className="mb-4 md:mb-5">
              <span className="block text-[1.75rem] sm:text-4xl md:text-[2.75rem] lg:text-[3.25rem] font-black leading-[1.15] text-elephant-blue tracking-tight">
                个人能力
              </span>
              <span className="block text-[1.75rem] sm:text-4xl md:text-[2.75rem] lg:text-[3.25rem] font-black leading-[1.15] text-elephant-dark tracking-tight">
                12维度评估表
              </span>
            </h1>
            
            {/* 小字 */}
            <p className="text-sm sm:text-base text-gray-500 font-medium mb-1.5">
              创始人：醉客
            </p>
            <p className="text-xs sm:text-sm text-gray-400 mb-8 md:mb-10">
              今夜何人入睡提供技术支持
            </p>
            
            {/* 按钮区域 */}
            <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
              {hasProgress ? (
                <>
                  <button
                    onClick={onStart}
                    className="neu-btn px-8 py-4 rounded-2xl text-elephant-dark font-bold text-lg min-h-[56px] select-none active:scale-[0.98]"
                  >
                    继续测评
                  </button>
                  <button
                    onClick={handleRestart}
                    className="neu-btn px-8 py-4 rounded-2xl text-gray-500 font-medium text-base min-h-[56px] select-none active:scale-[0.98]"
                  >
                    重新开始
                  </button>
                </>
              ) : (
                <button
                  onClick={onStart}
                  className="neu-btn px-10 py-5 rounded-2xl text-elephant-dark font-bold text-xl min-h-[64px] min-w-[200px] select-none active:scale-[0.98]"
                >
                  开始测评
                </button>
              )}
            </div>
            
            {/* 底部小提示 */}
            <p className="mt-6 text-xs text-gray-400 tracking-wide">
              共 12 个维度 · 36 道题 · 约需 5-8 分钟
            </p>
          </div>
          
          {/* 右侧大象图 */}
          <div className="flex-shrink-0 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[26rem] lg:h-[26rem] order-1 md:order-2 animate-float">
            <img
              src="/elephant.png"
              alt="问问大象"
              className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(74,144,226,0.15)]"
              draggable={false}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}
