import React from 'react';
import { AnatomicalRatio, MetricCategory } from '../types';
import { CheckCircle2, AlertTriangle, Sparkles, Sliders } from 'lucide-react';

interface AnatomicalRatiosTableProps {
  ratios: AnatomicalRatio[];
  metrics: {
    jawline: MetricCategory;
    eyeAesthetics: MetricCategory;
    cheekbones: MetricCategory;
    facialSymmetry: MetricCategory;
    goldenRatio: MetricCategory;
    skinQuality: MetricCategory;
  };
}

export const AnatomicalRatiosTable: React.FC<AnatomicalRatiosTableProps> = ({ ratios, metrics }) => {
  const getRatingBadge = (rating: AnatomicalRatio['rating']) => {
    switch (rating) {
      case 'Perfect':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Kusursuz</span>;
      case 'Good':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">İyi</span>;
      case 'Average':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">Ortalama</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">Geliştirilebilir</span>;
    }
  };

  const metricList = [
    metrics.jawline,
    metrics.eyeAesthetics,
    metrics.cheekbones,
    metrics.facialSymmetry,
    metrics.goldenRatio,
    metrics.skinQuality,
  ];

  return (
    <div className="space-y-6">
      {/* Metric Score Bars */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
        <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>Detaylı Yüz Metrikleri Skoru</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metricList.map((m, idx) => (
            <div key={idx} className="bg-stone-950/60 border border-stone-800/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-200">{m.name}</span>
                <span className="font-mono font-bold text-emerald-400">{m.score}/100</span>
              </div>
              <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, m.score))}%` }}
                />
              </div>
              <p className="text-[11px] text-stone-400 leading-normal">{m.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Anatomical Ratios Table */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg overflow-hidden">
        <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Biyometrik & Morfolojik Oranlar</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950 text-stone-400 font-mono text-[10px] uppercase border-b border-stone-800">
              <tr>
                <th className="py-2.5 px-3">Metrik Adı</th>
                <th className="py-2.5 px-3">Ölçülen Değer</th>
                <th className="py-2.5 px-3">İdeal Referans</th>
                <th className="py-2.5 px-3">Değerlendirme</th>
                <th className="py-2.5 px-3">Açıklama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/70">
              {ratios.map((r, i) => (
                <tr key={i} className="hover:bg-stone-850/50 transition-colors">
                  <td className="py-3 px-3 font-medium text-stone-100">{r.name}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-emerald-400">{r.value}</td>
                  <td className="py-3 px-3 font-mono text-stone-400">{r.ideal}</td>
                  <td className="py-3 px-3">{getRatingBadge(r.rating)}</td>
                  <td className="py-3 px-3 text-stone-400 text-[11px] max-w-xs">{r.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
