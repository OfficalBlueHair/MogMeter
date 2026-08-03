import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { MetricCategory } from '../types';

interface RadarChartCardProps {
  metrics: {
    jawline: MetricCategory;
    eyeAesthetics: MetricCategory;
    cheekbones: MetricCategory;
    facialSymmetry: MetricCategory;
    goldenRatio: MetricCategory;
    skinQuality: MetricCategory;
  };
}

export const RadarChartCard: React.FC<RadarChartCardProps> = ({ metrics }) => {
  const chartData = [
    { subject: 'Çene Hattı', score: metrics.jawline.score, fullMark: 100 },
    { subject: 'Göz Yapısı', score: metrics.eyeAesthetics.score, fullMark: 100 },
    { subject: 'Elmacık Kemikleri', score: metrics.cheekbones.score, fullMark: 100 },
    { subject: 'Simetri', score: metrics.facialSymmetry.score, fullMark: 100 },
    { subject: 'Altın Oran', score: metrics.goldenRatio.score, fullMark: 100 },
    { subject: 'Cilt Kalitesi', score: metrics.skinQuality.score, fullMark: 100 },
  ];

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wider">
          Estetik Radar Profili
        </h3>
        <span className="text-xs text-stone-500 font-mono">6 Boyutlu Analiz</span>
      </div>

      <div className="w-full h-64 my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#374151" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#D1D5DB', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 9 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                borderColor: '#27272a',
                borderRadius: '0.75rem',
                color: '#f4f4f5',
                fontSize: '12px',
              }}
              formatter={(value: any) => [`${value} / 100`, 'Puan']}
            />
            <Radar
              name="Estetik Oranı"
              dataKey="score"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-800 text-center text-xs">
        <div>
          <p className="text-stone-500 text-[10px]">Ortalama Puan</p>
          <p className="text-stone-200 font-semibold font-mono">
            {Math.round(
              chartData.reduce((acc, curr) => acc + curr.score, 0) / chartData.length
            )}
            /100
          </p>
        </div>
        <div>
          <p className="text-stone-500 text-[10px]">En Yüksek Vurgu</p>
          <p className="text-emerald-400 font-semibold truncate font-mono">
            {chartData.reduce((prev, current) => (prev.score > current.score ? prev : current)).subject}
          </p>
        </div>
        <div>
          <p className="text-stone-500 text-[10px]">Gelişim Alanı</p>
          <p className="text-amber-400 font-semibold truncate font-mono">
            {chartData.reduce((prev, current) => (prev.score < current.score ? prev : current)).subject}
          </p>
        </div>
      </div>
    </div>
  );
};
