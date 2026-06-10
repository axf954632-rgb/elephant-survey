import { useMemo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { dimensions } from '../data/questions';

interface ResultPageProps {
  answers: Record<number, number>;
  onRestart: () => void;
}

interface DimensionScore {
  name: string;
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
}

const interpretations: Record<string, string[]> = {
  '敏锐学习': [
    '学习动力不足，建议从培养兴趣开始',
    '有学习意愿但方法单一，需拓展学习渠道',
    '学习能力尚可，但体系化程度有待提升',
    '学习能力较强，已建立初步学习体系',
    '学习能力极强，拥有成熟的学习成长体系',
  ],
  '自律自洽': [
    '目标感薄弱，行动缺乏方向，建议从设定小目标开始',
    '偶有目标但执行力不足，需加强自我约束',
    '基本能约束自己，但长期目标不够清晰',
    '目标明确且自律较强，行动与目标基本对齐',
    '高度自律自洽，长期目标清晰，行动无悔',
  ],
  '情绪韧性': [
    '情绪状态较差，建议关注心理健康，寻求支持',
    '情绪波动较大，调节能力有待提升',
    '情绪状态一般，偶尔需要主动调节',
    '情绪稳定，能较好地应对压力和波动',
    '情绪韧性极强，内心平和且幸福感高',
  ],
  '逻辑思辨': [
    '逻辑思维较弱，建议从基础逻辑训练开始',
    '有一定逻辑意识，但表达和论证不够清晰',
    '逻辑能力一般，批判性思维有待培养',
    '逻辑清晰，具备较好的批判性思维和表达能力',
    '逻辑思辨能力极强，思维缜密且表达精准',
  ],
  '系统思考': [
    '缺乏系统思维，习惯片面看问题',
    '开始意识到系统性，但难以把握全局',
    '能理解系统性，但对反馈回路等概念不熟',
    '具备系统思维，能运用于部分实践场景',
    '系统思考能力极强，善于把握全局和内在联系',
  ],
  '决策判断': [
    '决策犹豫，缺乏承担后果的勇气',
    '敢于决策但过滤信息的能力不足',
    '能做出决策，但经验尚浅，效果不稳定',
    '决策果断，能有效过滤偏见，经验丰富',
    '决策能力极强，多维度认知框架成熟',
  ],
  '执行效率': [
    '执行力弱，目标拆解和排序能力不足',
    '能拆解目标但执行中容易分心放弃',
    '基本能按计划执行，但效率有待提升',
    '执行力强，专注且注重结果和改进',
    '执行效率极高，善于拆解目标并高效达成',
  ],
  '业务能力': [
    '业务知识薄弱，领域聚焦和跨界涉猎均不足',
    '有基础储备但深度和广度都有欠缺',
    '业务能力一般，深度或广度有一项偏弱',
    '业务能力强，既有深度又有一定广度',
    '业务能力极强，深度与广度兼备，实践成果显著',
  ],
  '复盘改进': [
    '缺乏复盘意识，成长缓慢',
    '偶尔复盘，但缺乏系统方法论',
    '有复盘习惯，但方法不够科学',
    '复盘能力强，能运用科学方法持续改进',
    '复盘能力极强，是成长的发动机，经验沉淀丰富',
  ],
  '沟通情商': [
    '情商和沟通能力较弱，人际关系需要改善',
    '能感知部分情绪，但沟通和同理心不足',
    '情商一般，沟通方式有待优化',
    '情商较高，掌握科学沟通方式，人际口碑好',
    '沟通情商极高，深度同理心，人际关系和谐',
  ],
  '上下协作': [
    '协作意识薄弱，与上下级关系处理有困难',
    '能完成基本协作，但冲突处理能力不足',
    '协作尚可，但效率和效果有待提升',
    '协作高效有序，能合理处理冲突',
    '上下协作能力极强，经验丰富，结果出色',
  ],
  '领导管理': [
    '缺乏领导管理经验，方法论不熟悉',
    '有初步认知，但缺乏实践和系统方法',
    '有一定经验，但领导能力有待全面提升',
    '领导管理能力较强，能激励团队并把控方向',
    '领导管理能力极强，战略决策与团队培养俱佳',
  ],
};

function getInterpretation(dimension: string, score: number): string {
  const level = Math.ceil(score / 3);
  const clamped = Math.max(1, Math.min(5, level));
  return interpretations[dimension]?.[clamped - 1] ?? '暂无解读';
}

function getLevelLabel(score: number): string {
  if (score <= 5) return '待提升';
  if (score <= 8) return '一般';
  if (score <= 11) return '良好';
  if (score <= 13) return '优秀';
  return '卓越';
}

function getLevelColor(score: number): string {
  if (score <= 5) return '#EF4444';
  if (score <= 8) return '#F59E0B';
  if (score <= 11) return '#3B82F6';
  if (score <= 13) return '#10B981';
  return '#8B5CF6';
}

export default function ResultPage({ answers, onRestart }: ResultPageProps) {
  // 计算各维度得分
  const dimensionScores: DimensionScore[] = useMemo(() => {
    return dimensions.map((dim) => {
      const scores = dim.questions.map((q) => answers[q.id] || 0);
      const total = scores.reduce((a, b) => a + b, 0);
      return {
        name: dim.name,
        category: dim.category,
        score: total,
        maxScore: 15,
        percentage: Math.round((total / 15) * 100),
      };
    });
  }, [answers]);

  // 雷达图数据
  const radarData = useMemo(() => {
    return dimensionScores.map((d) => ({
      dimension: d.name,
      score: d.score,
      fullMark: 15,
    }));
  }, [dimensionScores]);

  // 四大维度汇总
  const categorySummary = useMemo(() => {
    const map: Record<string, { total: number; count: number; scores: number[] }> = {};
    dimensionScores.forEach((d) => {
      if (!map[d.category]) {
        map[d.category] = { total: 0, count: 0, scores: [] };
      }
      map[d.category].total += d.score;
      map[d.category].count += 1;
      map[d.category].scores.push(d.score);
    });
    return Object.entries(map).map(([name, data]) => ({
      name,
      score: data.total,
      maxScore: data.count * 15,
      percentage: Math.round((data.total / (data.count * 15)) * 100),
    }));
  }, [dimensionScores]);

  // 总分
  const totalScore = useMemo(
    () => dimensionScores.reduce((a, b) => a + b.score, 0),
    [dimensionScores]
  );
  const maxTotalScore = dimensionScores.length * 15;



  // 自定义雷达图 Tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { dimension: string; score: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="neu-card px-4 py-2 text-sm">
          <p className="font-bold text-elephant-dark">{data.dimension}</p>
          <p className="text-elephant-blue font-semibold">{data.score} / 15</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen min-h-[100svh] bg-surface">
      <div className="bg-surface">
      {/* 顶部标题 */}
      <div className="px-5 pt-8 pb-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-elephant-dark mb-2">
          测评结果
        </h1>
        <p className="text-sm text-gray-500">
          总分 <span className="text-elephant-blue font-bold text-lg">{totalScore}</span> / {maxTotalScore}
        </p>
      </div>

      {/* 雷达图 */}
      <div className="px-5 pb-6">
        <div className="max-w-lg mx-auto">
          <div className="neu-card p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <PolarGrid stroke="#D1D9E6" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 15]}
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  tickCount={4}
                />
                <Radar
                  name="得分"
                  dataKey="score"
                  stroke="#4A90E2"
                  strokeWidth={2.5}
                  fill="#4A90E2"
                  fillOpacity={0.15}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 四大维度汇总 */}
      <div className="px-5 pb-6">
        <div className="max-w-lg mx-auto">
          <h2 className="text-lg font-bold text-elephant-dark mb-3 px-1">四大维度概览</h2>
          <div className="grid grid-cols-2 gap-3">
            {categorySummary.map((cat) => (
              <div key={cat.name} className="neu-card p-3 sm:p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">{cat.name}</p>
                <p className="text-xl font-black text-elephant-dark">
                  {cat.score}<span className="text-sm text-gray-400 font-normal">/{cat.maxScore}</span>
                </p>
                <div className="mt-2 h-2 rounded-full neu-inset overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-elephant-blue to-[#6BA5E7] transition-all duration-700"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 十二维度明细 */}
      <div className="px-5 pb-6">
        <div className="max-w-lg mx-auto">
          <h2 className="text-lg font-bold text-elephant-dark mb-3 px-1">十二维度详解</h2>
          <div className="space-y-3">
            {dimensionScores.map((dim) => (
              <div key={dim.name} className="neu-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{dim.category}</span>
                    <span className="text-sm font-bold text-elephant-dark">{dim.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: getLevelColor(dim.score) }}
                    >
                      {getLevelLabel(dim.score)}
                    </span>
                    <span className="text-lg font-black text-elephant-blue">
                      {dim.score}
                      <span className="text-sm text-gray-400 font-normal">/15</span>
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full neu-inset overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${dim.percentage}%`,
                      backgroundColor: getLevelColor(dim.score),
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {getInterpretation(dim.name, dim.score)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      </div>

      {/* 底部按钮 */}
      <div className="px-5 py-8 text-center">
        <button
          onClick={onRestart}
          className="neu-btn px-10 py-4 rounded-2xl text-elephant-dark font-bold text-lg select-none active:scale-[0.98]"
        >
          重新测评
        </button>
      </div>
    </div>
  );
}
