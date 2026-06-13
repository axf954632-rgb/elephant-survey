import { useEffect, useState } from 'react';
import { toDataURL } from 'qrcode';
import type { DimensionScore } from './ResultPage';

interface PosterProps {
  totalScore: number;
  maxTotalScore: number;
  dimensionScores: DimensionScore[];
  qrCodeUrl: string;
}

export default function Poster({
  totalScore,
  maxTotalScore,
  dimensionScores,
  qrCodeUrl,
}: PosterProps) {
  const [qrSrc, setQrSrc] = useState('');

  useEffect(() => {
    toDataURL(qrCodeUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#2C3E50',
        light: '#FFFFFF',
      },
    }).then(setQrSrc);
  }, [qrCodeUrl]);

  return (
    <div
      id="survey-poster"
      className="w-[320px] bg-[#EDF2F8] p-6 rounded-3xl"
      style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
    >
      {/* 标题 */}
      <div className="text-center mb-5">
        <p className="text-base font-black text-elephant-blue mb-1">个人能力</p>
        <p className="text-xl font-black text-elephant-dark">12维度评估表</p>
      </div>

      {/* 总分 */}
      <div className="neu-card p-4 mb-5 text-center">
        <p className="text-xs text-gray-500 mb-1">我的综合得分</p>
        <p className="text-3xl font-black text-elephant-dark">
          {totalScore}
          <span className="text-base text-gray-400 font-normal">/{maxTotalScore}</span>
        </p>
      </div>

      {/* 维度分数 */}
      <div className="neu-card p-4 mb-5">
        <p className="text-xs text-gray-500 mb-3 text-center">各维度得分</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {dimensionScores.map((dim) => (
            <div key={dim.name} className="flex justify-between text-xs">
              <span className="text-gray-600 truncate mr-2">{dim.name}</span>
              <span className="font-bold text-elephant-dark">{dim.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 二维码区域 */}
      <div className="flex items-center gap-4">
        {qrSrc && (
          <img
            src={qrSrc}
            alt="二维码"
            className="w-20 h-20 rounded-xl"
          />
        )}
        <div className="flex-1">
          <p className="text-xs text-gray-500 leading-relaxed">
            扫码参与测评
            <br />
            生成你的能力雷达图
          </p>
        </div>
      </div>

      {/* 底部 */}
      <p className="text-[10px] text-gray-400 text-center mt-5">
        创始人：醉客 · 今夜何人入睡提供技术支持
      </p>
    </div>
  );
}
