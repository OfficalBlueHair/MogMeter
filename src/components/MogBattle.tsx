import React, { useState } from 'react';
import { MogAnalysisResult, SampleFace } from '../types';
import { SAMPLE_FACES } from '../data/sampleFaces';
import { Swords, Trophy, Upload, Sparkles, Loader2, ArrowRight, ShieldAlert, RefreshCw } from 'lucide-react';

interface MogBattleProps {
  onAnalyzeImage: (base64: string, name?: string) => Promise<MogAnalysisResult>;
}

export const MogBattle: React.FC<MogBattleProps> = ({ onAnalyzeImage }) => {
  const [faceA, setFaceA] = useState<{ image: string; name: string; result?: MogAnalysisResult }>({
    image: SAMPLE_FACES[0].imageUrl,
    name: SAMPLE_FACES[0].name,
  });

  const [faceB, setFaceB] = useState<{ image: string; name: string; result?: MogAnalysisResult }>({
    image: SAMPLE_FACES[1].imageUrl,
    name: SAMPLE_FACES[1].name,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'A' | 'B') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (target === 'A') {
        setFaceA({ image: base64, name: file.name.replace(/\.[^/.]+$/, ''), result: undefined });
      } else {
        setFaceB({ image: base64, name: file.name.replace(/\.[^/.]+$/, ''), result: undefined });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: SampleFace, target: 'A' | 'B') => {
    if (target === 'A') {
      setFaceA({ image: sample.imageUrl, name: sample.name, result: undefined });
    } else {
      setFaceB({ image: sample.imageUrl, name: sample.name, result: undefined });
    }
  };

  const runBattle = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resA, resB] = await Promise.all([
        faceA.result ? Promise.resolve(faceA.result) : onAnalyzeImage(faceA.image, faceA.name),
        faceB.result ? Promise.resolve(faceB.result) : onAnalyzeImage(faceB.image, faceB.name),
      ]);

      setFaceA(prev => ({ ...prev, result: resA }));
      setFaceB(prev => ({ ...prev, result: resB }));
    } catch (err: any) {
      console.error("Savaş Analizi Hatası:", err);
      setError(err?.message || "Savaş analizi sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const scoreA = faceA.result?.mogScore || 0;
  const scoreB = faceB.result?.mogScore || 0;
  const isAWin = scoreA > scoreB;
  const isTie = scoreA === scoreB;
  const scoreDiff = Math.abs(scoreA - scoreB);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Swords className="w-3.5 h-3.5" />
          <span>Mogging Battle Arena</span>
        </div>
        <h2 className="text-2xl font-bold text-stone-100 tracking-tight">
          Kim Kimi Mogluyor? (Yüz Karşılaştırması)
        </h2>
        <p className="text-stone-400 text-xs max-w-md mx-auto">
          İki yüz fotoğrafı seçin veya yükleyin. Yapay zeka ikisini de aynı biyometrik kriterlerle analiz edip kimin baskın olduğunu belirlesin.
        </p>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Versus Badge */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-stone-900 border-2 border-emerald-500 shadow-xl items-center justify-center font-extrabold text-sm text-emerald-400 font-mono">
          VS
        </div>

        {/* Face A Card */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider">1. Yüz (Savaşçı A)</h3>
            <span className="text-xs text-stone-500 font-mono">{faceA.name}</span>
          </div>

          <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-950 border border-stone-800">
            <img src={faceA.image} alt="Yüz A" className="w-full h-full object-cover" />
            {faceA.result && (
              <div className="absolute top-3 left-3 bg-stone-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-500/30">
                <span className="text-xs text-stone-400 block font-mono">Mog Puanı</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">{faceA.result.mogScore}</span>
              </div>
            )}
          </div>

          {/* Upload / Preset controls */}
          <div className="flex items-center gap-2">
            <label className="flex-1 py-2 px-3 bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-medium rounded-xl border border-stone-700 cursor-pointer text-center flex items-center justify-center gap-2 transition-colors">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Yükle A</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'A')}
                className="hidden"
              />
            </label>

            <select
              onChange={(e) => {
                const sample = SAMPLE_FACES.find((s) => s.id === e.target.value);
                if (sample) handleSelectSample(sample, 'A');
              }}
              className="py-2 px-3 bg-stone-800 text-stone-200 text-xs rounded-xl border border-stone-700 font-medium focus:outline-none"
            >
              <option value="">Örnek Yüz Seç</option>
              {SAMPLE_FACES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Face B Card */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider">2. Yüz (Savaşçı B)</h3>
            <span className="text-xs text-stone-500 font-mono">{faceB.name}</span>
          </div>

          <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-950 border border-stone-800">
            <img src={faceB.image} alt="Yüz B" className="w-full h-full object-cover" />
            {faceB.result && (
              <div className="absolute top-3 left-3 bg-stone-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/30">
                <span className="text-xs text-stone-400 block font-mono">Mog Puanı</span>
                <span className="text-lg font-bold text-cyan-400 font-mono">{faceB.result.mogScore}</span>
              </div>
            )}
          </div>

          {/* Upload / Preset controls */}
          <div className="flex items-center gap-2">
            <label className="flex-1 py-2 px-3 bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-medium rounded-xl border border-stone-700 cursor-pointer text-center flex items-center justify-center gap-2 transition-colors">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Yükle B</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'B')}
                className="hidden"
              />
            </label>

            <select
              onChange={(e) => {
                const sample = SAMPLE_FACES.find((s) => s.id === e.target.value);
                if (sample) handleSelectSample(sample, 'B');
              }}
              className="py-2 px-3 bg-stone-800 text-stone-200 text-xs rounded-xl border border-stone-700 font-medium focus:outline-none"
            >
              <option value="">Örnek Yüz Seç</option>
              {SAMPLE_FACES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl inline-flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={runBattle}
          disabled={loading}
          className="px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-stone-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center gap-3 mx-auto transition-all transform active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Yapay Zeka Karşılaştırmayı Yapıyor...</span>
            </>
          ) : (
            <>
              <Swords className="w-5 h-5" />
              <span>Mogging Savaşını Başlat</span>
            </>
          )}
        </button>
      </div>

      {/* Battle Results Panel */}
      {faceA.result && faceB.result && (
        <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-fade-in">
          {/* Winner Banner */}
          <div className="bg-gradient-to-r from-stone-950 via-emerald-950/40 to-stone-950 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-2">
            <Trophy className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-extrabold text-stone-100">
              {isTie
                ? "Muazzam Beraberlik! İki Yüz De Eşit Güçte!"
                : `${isAWin ? faceA.name : faceB.name} Tarafı MOGLADI!`}
            </h3>
            <p className="text-emerald-400 text-xs font-mono font-medium">
              {!isTie && `Fark: +${scoreDiff} Puan Ustunluk`}
            </p>
          </div>

          {/* Metric Comparison Bars */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider text-center">
              Kafa Kafaya Metrik Karşılaştırması
            </h4>

            <div className="space-y-3">
              {[
                { label: 'Çene Hattı', key: 'jawline' },
                { label: 'Göz Yapısı', key: 'eyeAesthetics' },
                { label: 'Elmacık Kemikleri', key: 'cheekbones' },
                { label: 'Simetri', key: 'facialSymmetry' },
                { label: 'Altın Oran', key: 'goldenRatio' },
                { label: 'Cilt Kalitesi', key: 'skinQuality' },
              ].map(({ label, key }) => {
                const sA = (faceA.result?.metrics as any)?.[key]?.score || 0;
                const sB = (faceB.result?.metrics as any)?.[key]?.score || 0;
                return (
                  <div key={key} className="bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-emerald-400 font-mono">{sA}</span>
                      <span className="text-stone-300">{label}</span>
                      <span className="text-cyan-400 font-mono">{sB}</span>
                    </div>
                    <div className="flex gap-1 h-2">
                      <div className="flex-1 bg-stone-800 rounded-l-full overflow-hidden flex justify-end">
                        <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: `${sA}%` }} />
                      </div>
                      <div className="flex-1 bg-stone-800 rounded-r-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-r-full" style={{ width: `${sB}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
