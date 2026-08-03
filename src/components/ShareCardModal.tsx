import React, { useRef } from 'react';
import { MogAnalysisResult } from '../types';
import { ShieldCheck, Download, Share2, Sparkles, X, Trophy } from 'lucide-react';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: MogAnalysisResult;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ isOpen, onClose, result }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Mogging analiz linkiniz panoya kopyalandı!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl space-y-4 p-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2 text-stone-100 font-semibold text-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Mogging Kimlik Kartı</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Printable Aesthetic Card */}
        <div
          ref={cardRef}
          className="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 border-2 border-emerald-500/40 rounded-2xl p-5 shadow-2xl space-y-4 relative overflow-hidden"
        >
          {/* Subtle Ambient Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Card Top Brand */}
          <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-500 text-stone-950 font-bold flex items-center justify-center text-xs font-mono">
                M
              </div>
              <span className="text-xs font-bold text-stone-200 tracking-wider">MOGMETER AI</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
              Resmi Sertifika
            </span>
          </div>

          {/* Photo + Scores */}
          <div className="flex gap-4 items-center">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-900 border border-stone-700 shrink-0">
              <img src={result.imageUrl} alt="Kişi" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-stone-400 font-mono block">Mogging Skor</span>
              <div className="text-4xl font-extrabold text-emerald-400 font-mono leading-none">
                {result.mogScore}
                <span className="text-xs text-stone-500 font-normal ml-1">/100</span>
              </div>
              <div className="inline-block mt-1">
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold text-stone-950 uppercase tracking-wide inline-block"
                  style={{ backgroundColor: result.tierColor || '#10B981' }}
                >
                  {result.tierName}
                </span>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2">
            <div className="bg-stone-900/80 p-2 rounded-lg border border-stone-800">
              <span className="text-[10px] text-stone-500 block">Çene Hattı</span>
              <span className="font-mono font-semibold text-stone-200">{result.metrics.jawline.score}/100</span>
            </div>
            <div className="bg-stone-900/80 p-2 rounded-lg border border-stone-800">
              <span className="text-[10px] text-stone-500 block">Canthal Tilt</span>
              <span className="font-mono font-semibold text-emerald-400">
                {result.ratios[1]?.value || '+4.5°'}
              </span>
            </div>
          </div>

          {/* Card Footer timestamp */}
          <div className="text-[9px] text-stone-500 text-center pt-1 border-t border-stone-800/60 font-mono">
            Tarih: {new Date(result.timestamp).toLocaleDateString('tr-TR')} • Doğrulanmış Yapay Zeka Biyometrik Analizi
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopyLink}
            className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Paylaş / Kopyala</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold rounded-xl transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
