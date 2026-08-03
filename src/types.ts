export interface LandmarkPoint {
  x: number; // 0 - 100 percentage
  y: number; // 0 - 100 percentage
  label?: string;
}

export interface MetricCategory {
  name: string;
  score: number; // 0-100
  description: string;
  details: string;
}

export interface AnatomicalRatio {
  name: string;
  value: string;
  ideal: string;
  rating: 'Perfect' | 'Good' | 'Average' | 'Needs Improvement';
  explanation: string;
}

export interface MogAnalysisResult {
  id: string;
  timestamp: number;
  imageUrl: string;
  faceName?: string;
  mogScore: number; // 0 - 100
  tierName: 'Gigachad / Apex Mogger' | 'Chad' | 'Chadlite' | 'High Tier Normalite' | 'Mid Tier Normalite' | 'Subfive / Mogged';
  tierColor: string;
  summary: string;
  metrics: {
    jawline: MetricCategory;
    eyeAesthetics: MetricCategory;
    cheekbones: MetricCategory;
    facialSymmetry: MetricCategory;
    goldenRatio: MetricCategory;
    skinQuality: MetricCategory;
  };
  ratios: AnatomicalRatio[];
  strengths: string[];
  weaknesses: string[];
  looksmaxingTips: {
    category: 'Grooming & Saç' | 'Cilt Bakımı' | 'Duruş & Mewing' | 'Vücut Yağı & Diyet' | 'Göz & Bakış';
    title: string;
    advice: string;
    impact: 'Yüksek' | 'Orta' | 'Hafif';
  }[];
  landmarks: {
    jawlinePoints: LandmarkPoint[];
    leftEye: LandmarkPoint[];
    rightEye: LandmarkPoint[];
    noseBridge: LandmarkPoint[];
    mouthPoints: LandmarkPoint[];
    cheekbones: LandmarkPoint[];
    goldenGridCenter: LandmarkPoint;
  };
}

export interface SampleFace {
  id: string;
  name: string;
  tag: string;
  imageUrl: string;
  gender: 'male' | 'female';
}
