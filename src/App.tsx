import React, { useState, useEffect } from 'react';
import { MogAnalysisResult, SampleFace } from './types';
import { SAMPLE_FACES } from './data/sampleFaces';
import { CameraModal } from './components/CameraModal';
import { FaceCanvasOverlay } from './components/FaceCanvasOverlay';
import { RadarChartCard } from './components/RadarChartCard';
import { AnatomicalRatiosTable } from './components/AnatomicalRatiosTable';
import { LooksmaxingGuide } from './components/LooksmaxingGuide';
import { MogBattle } from './components/MogBattle';
import { ShareCardModal } from './components/ShareCardModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import {
  Sparkles,
  Camera,
  Upload,
  Swords,
  History,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Zap,
  HelpCircle,
  Sliders,
  ShieldCheck,
  UserCheck,
  Key,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'single' | 'battle'>('single');
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_FACES[0].imageUrl);
  const [faceName, setFaceName] = useState<string>(SAMPLE_FACES[0].name);

  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('Yüz yapısı inceleniyor...');
  const [error, setError] = useState<string | null>(null);

  const [analysisResult, setAnalysisResult] = useState<MogAnalysisResult | null>(null);
  const [history, setHistory] = useState<MogAnalysisResult[]>([]);

  // Gemini API Key state
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);

  // Load history and API key from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mogmeter_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
      const savedApiKey = localStorage.getItem('user_gemini_api_key');
      if (savedApiKey) {
        setGeminiApiKey(savedApiKey);
      }
    } catch (e) {
      console.error('Geçmiş okunamadı:', e);
    }
  }, []);

  // Save API key to localStorage when changed
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setGeminiApiKey(newKey);
    if (newKey.trim()) {
      localStorage.setItem('user_gemini_api_key', newKey.trim());
    } else {
      localStorage.removeItem('user_gemini_api_key');
    }
  };

  const saveToHistory = (res: MogAnalysisResult) => {
    setHistory((prev) => {
      const updated = [res, ...prev.filter((h) => h.id !== res.id)].slice(0, 15);
      try {
        localStorage.setItem('mogmeter_history', JSON.stringify(updated));
      } catch (e) {
        console.error('Geçmiş kaydedilemedi:', e);
      }
      return updated;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSelectedImage(base64);
      setFaceName(file.name.replace(/\.[^/.]+$/, ''));
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: SampleFace) => {
    setSelectedImage(sample.imageUrl);
    setFaceName(sample.name);
    setAnalysisResult(null);
  };

  const executeAnalysis = async (imgBase64: string, name?: string): Promise<MogAnalysisResult> => {
    // Check if API key is provided
    const apiKey = geminiApiKey.trim();
    if (!apiKey) {
      throw new Error('Lütfen önce API anahtarınızı girin');
    }

    const response = await fetch('/api/analyze-face', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: imgBase64,
        faceName: name || faceName || 'Analiz Edilen Yüz',
        userApiKey: apiKey,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Yüz analizi sunucudan başarısız döndü.');
    }

    const data: MogAnalysisResult = await response.json();
    return data;
  };

  const startSingleAnalysis = async () => {
    if (!selectedImage) return;
    setLoading(true);
    setError(null);

    const steps = [
      'Gözler, çene hattı ve elmacık kemikleri taranıyor...',
      'Mandibular gonial açı ve FWH oranı hesaplanıyor...',
      'Yüz simetrisi ve altın oran matrisi eşleştiriliyor...',
      'Biyometrik analiz ve rehber tamamlanıyor...',
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setLoadingStep(steps[stepIdx]);
    }, 400);

    try {
      const result = await executeAnalysis(selectedImage, faceName);
      setAnalysisResult(result);
      saveToHistory(result);
    } catch (err: any) {
      console.error('Analiz Hatası:', err);
      setError(err?.message || 'Yüz analiz edilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-emerald-500 selection:text-stone-950">
      {/* API Key Banner */}
      <div className="bg-stone-900/90 border-b border-stone-800 px-4 md:px-8 py-3">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <Key className="w-4 h-4" />
            <span className="text-xs font-semibold">Gemini API Anahtarı</span>
          </div>
          <div className="flex-1 w-full sm:max-w-md relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={geminiApiKey}
              onChange={handleApiKeyChange}
              placeholder="AIzaSy... ile başlayan anahtarınızı girin"
              className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-emerald-500 pr-20"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
              type="button"
            >
              {showApiKey ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-[10px] text-stone-500 hidden sm:block">
            Anahtarınız sadece tarayıcınızda saklanır ve analiz için kullanılır.
          </p>
        </div>
      </div>

      {/* Top Header */}
      <header className="border-b border-stone-800/80 bg-stone-900/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-stone-950 font-black flex items-center justify-center text-sm shadow-lg shadow-emerald-500/20 font-mono">
            M
          </div>
          <div>
            <h1 className="text-base font-extrabold text-stone-100 tracking-tight flex items-center gap-2">
              <span>MogMeter AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v2.5 Vision
              </span>
            </h1>
            <p className="text-[11px] text-stone-400 hidden sm:block">
              Yapay Zeka Destekli Yüz Estetiği & Mogging Oranı Analizcisi
            </p>
          </div>
        </div>

        {/* Tab & Action Controls */}
        <div className="flex items-center gap-2">
          <div className="bg-stone-950/80 p-1 rounded-xl border border-stone-800 flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'single'
                  ? 'bg-stone-800 text-emerald-400 font-semibold shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Tekli Yüz Analizi</span>
            </button>

            <button
              onClick={() => setActiveTab('battle')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'battle'
                  ? 'bg-stone-800 text-emerald-400 font-semibold shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Mog Battle (VS)</span>
            </button>
          </div>

          <button
            onClick={() => setIsHistoryOpen(true)}
            className="p-2.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-xl border border-stone-800 transition-colors relative"
            title="Analiz Geçmişi"
          >
            <History className="w-4 h-4" />
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-stone-950 text-[10px] font-bold flex items-center justify-center font-mono">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {activeTab === 'battle' ? (
          <MogBattle onAnalyzeImage={executeAnalysis} />
        ) : (
          <div className="space-y-8">
            {/* Top Selection & Upload Area */}
            <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-stone-100 tracking-tight flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Fotoğraf Çekin veya Yükleyin</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Yapay zeka yüz yapısını, simetriyi ve kemik morfolojisini gerçek görüntünüz üzerinden inceleyecektir.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCameraOpen(true)}
                    className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-semibold rounded-xl border border-stone-700 flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                  >
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Fotoğraf Çek</span>
                  </button>

                  <label className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-semibold rounded-xl border border-stone-700 flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span>Dosya Yükle</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Sample Faces Carousel/Presets */}
              <div className="space-y-2">
                <span className="text-xs text-stone-400 font-medium">Hızlı Test İçin Örnek Yüzler:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SAMPLE_FACES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className={`p-2 rounded-xl border transition-all text-left flex items-center gap-3 ${
                        selectedImage === sample.imageUrl
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                          : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-300'
                      }`}
                    >
                      <img
                        src={sample.imageUrl}
                        alt={sample.name}
                        className="w-10 h-10 rounded-lg object-cover bg-stone-900 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{sample.name}</p>
                        <p className="text-[10px] text-stone-500 truncate">{sample.tag}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Image Preview & Action */}
              {selectedImage && (
                <div className="flex flex-col md:flex-row items-center gap-6 pt-2">
                  <div className="w-48 h-60 rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shrink-0 shadow-lg relative">
                    <img
                      src={selectedImage}
                      alt="Seçilen Yüz"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <label className="text-xs text-stone-400 block mb-1">Kişi / Yüz İsmi (İsteğe Bağlı):</label>
                      <input
                        type="text"
                        value={faceName}
                        onChange={(e) => setFaceName(e.target.value)}
                        placeholder="Örn: Görkem, Model A..."
                        className="w-full max-w-sm px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      onClick={startSingleAnalysis}
                      disabled={loading}
                      className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-stone-950 font-extrabold text-sm rounded-xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>{loadingStep}</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 fill-current" />
                          <span>Yapay Zeka Mogging Analizini Başlat</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Results View */}
            {analysisResult && (
              <div className="space-y-8 animate-fade-in">
                {/* Executive Score Hero Banner */}
                <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 border border-stone-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-mono">
                        <span>Yüz İsmi:</span>
                        <strong className="text-stone-100">{analysisResult.faceName}</strong>
                      </div>

                      <h2 className="text-3xl font-extrabold text-stone-100 tracking-tight">
                        {analysisResult.tierName}
                      </h2>

                      <p className="text-stone-300 text-xs md:text-sm max-w-xl leading-relaxed">
                        {analysisResult.summary}
                      </p>

                      <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                        <button
                          onClick={() => setIsShareOpen(true)}
                          className="px-4 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Kimlik Kartı İndir / Paylaş</span>
                        </button>
                      </div>
                    </div>

                    {/* Big Mog Score Dial */}
                    <div className="flex flex-col items-center justify-center bg-stone-950/80 border border-stone-800 rounded-2xl p-6 min-w-44 text-center shadow-inner">
                      <span className="text-xs text-stone-400 font-mono uppercase tracking-wider mb-1">
                        Mogging Oranı
                      </span>
                      <div className="text-5xl font-black text-emerald-400 font-mono tracking-tight">
                        {analysisResult.mogScore}
                        <span className="text-xs text-stone-500 font-normal">/100</span>
                      </div>
                      <span
                        className="mt-2 px-3 py-0.5 rounded-full text-[10px] font-bold text-stone-950 uppercase"
                        style={{ backgroundColor: analysisResult.tierColor || '#10B981' }}
                      >
                        {analysisResult.tierName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visual Landmarks + Radar Profile Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Face Canvas Overlay */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wider flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-emerald-400" />
                      <span>Biyometrik Yüz İşaretleyicileri & Vektörler</span>
                    </h3>
                    <FaceCanvasOverlay
                      imageUrl={analysisResult.imageUrl}
                      landmarks={analysisResult.landmarks}
                      className="aspect-4/3"
                    />
                  </div>

                  {/* Recharts Radar Chart */}
                  <RadarChartCard metrics={analysisResult.metrics} />
                </div>

                {/* Anatomical Ratios & Score Breakdown Table */}
                <AnatomicalRatiosTable
                  ratios={analysisResult.ratios}
                  metrics={analysisResult.metrics}
                />

                {/* Actionable Looksmaxing Guide */}
                <LooksmaxingGuide
                  strengths={analysisResult.strengths}
                  weaknesses={analysisResult.weaknesses}
                  tips={analysisResult.looksmaxingTips}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(base64) => {
          setSelectedImage(base64);
          setFaceName('Kamera Fotoğrafı');
          setIsCameraOpen(false);
          setAnalysisResult(null);
        }}
      />

      {analysisResult && (
        <ShareCardModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          result={analysisResult}
        />
      )}

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={(item) => {
          setAnalysisResult(item);
          setSelectedImage(item.imageUrl);
          setFaceName(item.faceName || 'Analiz');
          setActiveTab('single');
        }}
        onClearHistory={() => {
          localStorage.removeItem('mogmeter_history');
          setHistory([]);
        }}
      />
    </div>
  );
}
