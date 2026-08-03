import React from 'react';
import { MogAnalysisResult } from '../types';
import { Dumbbell, ShieldCheck, Flame, Zap, CheckCircle, Lightbulb } from 'lucide-react';

interface LooksmaxingGuideProps {
  strengths: string[];
  weaknesses: string[];
  tips: MogAnalysisResult['looksmaxingTips'];
}

export const LooksmaxingGuide: React.FC<LooksmaxingGuideProps> = ({ strengths, weaknesses, tips }) => {
  const getImpactBadge = (impact: 'Yüksek' | 'Orta' | 'Hafif') => {
    switch (impact) {
      case 'Yüksek':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Yüksek Etki</span>;
      case 'Orta':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">Orta Etki</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-700 text-stone-300">Hafif Etki</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Güçlü Yönler */}
        <div className="bg-stone-900/90 border border-emerald-900/40 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Genetik & Estetik Avantajlarınız</span>
          </h3>
          <ul className="space-y-2.5">
            {strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-stone-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Geliştirilebilir Yönler */}
        <div className="bg-stone-900/90 border border-amber-900/40 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Potansiyel Gelişim Noktaları</span>
          </h3>
          <ul className="space-y-2.5">
            {weaknesses.map((weak, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-stone-200">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Looksmaxing Tips */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-emerald-400" />
            <span>Kişiselleştirilmiş Looksmaxing Tavsiyeleri</span>
          </h3>
          <span className="text-xs text-stone-500 font-mono">Uygulanabilir Rehber</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip, idx) => (
            <div
              key={idx}
              className="bg-stone-950/70 border border-stone-800/80 rounded-xl p-4 space-y-2 hover:border-stone-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                  {tip.category}
                </span>
                {getImpactBadge(tip.impact)}
              </div>
              <h4 className="text-xs font-semibold text-stone-100">{tip.title}</h4>
              <p className="text-xs text-stone-400 leading-relaxed">{tip.advice}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
