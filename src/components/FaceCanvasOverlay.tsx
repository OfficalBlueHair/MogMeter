import React, { useState } from 'react';
import { MogAnalysisResult } from '../types';
import { Eye, Layers, Maximize2, Check } from 'lucide-react';

interface FaceCanvasOverlayProps {
  imageUrl: string;
  landmarks?: MogAnalysisResult['landmarks'];
  className?: string;
}

export const FaceCanvasOverlay: React.FC<FaceCanvasOverlayProps> = ({
  imageUrl,
  landmarks,
  className = '',
}) => {
  const [activeLayers, setActiveLayers] = useState<{
    jaw: boolean;
    eyes: boolean;
    symmetry: boolean;
    goldenGrid: boolean;
  }>({
    jaw: true,
    eyes: true,
    symmetry: true,
    goldenGrid: true,
  });

  const toggleLayer = (key: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Default fallbacks if AI landmarks missing
  const jaw = landmarks?.jawlinePoints || [
    { x: 30, y: 65 },
    { x: 38, y: 80 },
    { x: 50, y: 88 },
    { x: 62, y: 80 },
    { x: 70, y: 65 },
  ];

  const leftEye = landmarks?.leftEye || [
    { x: 36, y: 40 },
    { x: 44, y: 40 },
    { x: 40, y: 40 },
  ];

  const rightEye = landmarks?.rightEye || [
    { x: 56, y: 40 },
    { x: 64, y: 40 },
    { x: 60, y: 40 },
  ];

  const jawPointsSvg = jaw.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-xl ${className}`}>
      {/* Target Image */}
      <img
        src={imageUrl}
        alt="Yüz Analizi"
        className="w-full h-full object-cover select-none"
      />

      {/* SVG Facial Landmarks Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Golden Ratio Grid lines */}
        {activeLayers.goldenGrid && (
          <g className="stroke-emerald-400/30 stroke-[0.3] stroke-dasharray-[1,1]">
            <line x1="0" y1="33" x2="100" y2="33" />
            <line x1="0" y1="66" x2="100" y2="66" />
            <line x1="33" y1="0" x2="33" y2="100" />
            <line x1="66" y1="0" x2="66" y2="100" />
          </g>
        )}

        {/* Symmetry Vertical Center Line */}
        {activeLayers.symmetry && (
          <g>
            <line
              x1="50"
              y1="10"
              x2="50"
              y2="90"
              className="stroke-cyan-400/60 stroke-[0.5] stroke-dasharray-[1.5,1.5]"
            />
            <circle cx="50" cy="50" r="1" className="fill-cyan-400" />
          </g>
        )}

        {/* Jawline Path */}
        {activeLayers.jaw && (
          <g>
            <polyline
              points={jawPointsSvg}
              fill="none"
              className="stroke-amber-400 stroke-[0.8] stroke-round stroke-linejoin-round"
            />
            {jaw.map((pt, idx) => (
              <circle
                key={`jaw_${idx}`}
                cx={pt.x}
                cy={pt.y}
                r="0.9"
                className="fill-amber-400 stroke-stone-950 stroke-[0.2]"
              />
            ))}
          </g>
        )}

        {/* Eyes & Canthal Tilt Axis */}
        {activeLayers.eyes && (
          <g>
            {/* Left Eye Line */}
            <line
              x1={leftEye[0]?.x || 36}
              y1={leftEye[0]?.y || 40}
              x2={leftEye[1]?.x || 44}
              y2={leftEye[1]?.y || 40}
              className="stroke-emerald-400 stroke-[0.7]"
            />
            {/* Right Eye Line */}
            <line
              x1={rightEye[0]?.x || 56}
              y1={rightEye[0]?.y || 40}
              x2={rightEye[1]?.x || 64}
              y2={rightEye[1]?.y || 40}
              className="stroke-emerald-400 stroke-[0.7]"
            />
            {/* Inter-pupillary distance axis */}
            <line
              x1={leftEye[2]?.x || 40}
              y1={leftEye[2]?.y || 40}
              x2={rightEye[2]?.x || 60}
              y2={rightEye[2]?.y || 40}
              className="stroke-emerald-300/70 stroke-[0.4] stroke-dasharray-[1,1]"
            />
            {/* Pupil points */}
            <circle cx={leftEye[2]?.x || 40} cy={leftEye[2]?.y || 40} r="1.1" className="fill-emerald-400" />
            <circle cx={rightEye[2]?.x || 60} cy={rightEye[2]?.y || 40} r="1.1" className="fill-emerald-400" />
          </g>
        )}
      </svg>

      {/* Layer Controls Bar */}
      <div className="absolute bottom-3 left-3 right-3 bg-stone-950/85 backdrop-blur-md border border-stone-800/80 rounded-xl p-2 flex items-center justify-between gap-1 overflow-x-auto text-[11px]">
        <span className="text-stone-400 font-medium px-2 flex items-center gap-1 shrink-0">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Katmanlar:</span>
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => toggleLayer('jaw')}
            className={`px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${
              activeLayers.jaw
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-medium'
                : 'bg-stone-900/60 text-stone-400 border-stone-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Çene Hattı
          </button>

          <button
            onClick={() => toggleLayer('eyes')}
            className={`px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${
              activeLayers.eyes
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-medium'
                : 'bg-stone-900/60 text-stone-400 border-stone-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Göz Tilti
          </button>

          <button
            onClick={() => toggleLayer('symmetry')}
            className={`px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${
              activeLayers.symmetry
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 font-medium'
                : 'bg-stone-900/60 text-stone-400 border-stone-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Simetri
          </button>

          <button
            onClick={() => toggleLayer('goldenGrid')}
            className={`px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${
              activeLayers.goldenGrid
                ? 'bg-purple-500/15 text-purple-300 border-purple-500/40 font-medium'
                : 'bg-stone-900/60 text-stone-400 border-stone-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Izgara
          </button>
        </div>
      </div>
    </div>
  );
};
