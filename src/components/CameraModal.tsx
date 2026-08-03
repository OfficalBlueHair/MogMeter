import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, Sparkles, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setError(null);
    stopCamera();
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Kamera erişim hatası:", err);
      setError("Kameranıza erişilemedi. Lütfen kamera izinlerini kontrol edin veya dosya yükleme yöntemini kullanın.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Mirror image if front camera
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      stopCamera();
      onCapture(dataUrl);
    }
  };

  const startCountdown = () => {
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      handleCapture();
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-800">
          <div className="flex items-center gap-2 text-stone-100 font-semibold text-sm">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>Kamera ile Fotoğraf Çek</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Area */}
        <div className="relative bg-black aspect-4/3 flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-6 text-center max-w-sm">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
              <p className="text-stone-300 text-sm mb-4">{error}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Tekrar Dene
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {/* Face Frame Guide Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-56 h-72 border-2 border-emerald-400/40 rounded-[100px] border-dashed flex items-center justify-center relative shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                  <div className="absolute top-1/3 w-40 border-t border-emerald-400/20" />
                  <div className="absolute top-1/2 w-48 border-t border-emerald-400/20" />
                  <span className="text-[10px] text-emerald-400/70 bg-stone-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    Yüzünüzü Çerçeveye Hizalayın
                  </span>
                </div>
              </div>

              {/* Countdown Overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                  <span className="text-7xl font-bold text-emerald-400 animate-ping">
                    {countdown}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-stone-900 border-t border-stone-800 flex items-center justify-between">
          <button
            onClick={switchCamera}
            disabled={!!error}
            className="p-3 text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors disabled:opacity-50"
            title="Kamerayı Değiştir"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={startCountdown}
              disabled={!!error || countdown !== null}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              3s Zamanlayıcı
            </button>

            <button
              onClick={handleCapture}
              disabled={!!error || countdown !== null}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Fotoğraf Çek</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
