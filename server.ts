import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for high-res base64 images
app.use(express.json({ limit: "25mb" }));

// Initialize Gemini client on server side
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Endpoint for Facial Mogging & Aesthetics Analysis
app.post("/api/analyze-face", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", faceName } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Fotoğraf verisi (imageBase64) zorunludur." });
    }

    let finalBase64 = "";
    let finalMimeType = mimeType || "image/jpeg";

    if (imageBase64.startsWith("http://") || imageBase64.startsWith("https://")) {
      const imgRes = await fetch(imageBase64);
      if (!imgRes.ok) {
        throw new Error("Fotoğraf URL'sinden indirilemedi.");
      }
      const arrayBuffer = await imgRes.arrayBuffer();
      finalBase64 = Buffer.from(arrayBuffer).toString("base64");
      const contentType = imgRes.headers.get("content-type");
      if (contentType) {
        finalMimeType = contentType.split(";")[0];
      }
    } else if (imageBase64.startsWith("data:")) {
      const matches = imageBase64.match(/data:(.*?);base64,/);
      if (matches && matches[1]) {
        finalMimeType = matches[1];
      }
      finalBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
    } else {
      finalBase64 = imageBase64;
    }

    const ai = getGeminiClient();

    const systemInstruction = `
Sen dünya standartlarında uzman bir Yüz Estetiği, Altın Oran ve Facial Morphology (Looksmaxing / Mogging) Analizcisisin.
Sana verilen insan yüzü fotoğrafını titizlikle, hızlıca ve doğrudan incele. RASTGELE SAYILAR ÜRETME! Fotoğraftaki gerçek kemik yapısını, çene hatlarını, göz kapağı sarkmasını/canthal tilt açısını, elmacık kemiklerini, cilt parlaklığını ve simetriyi ölçerek GERÇEKÇİ analiz yap.

Türkçe yanıt ver ve tüm analizleri özlü, etkili, profesyonel bilimsel terimlerle (FWH Ratio, Positive Canthal Tilt, Mandibular Angle vb.) açıkla. Gereksiz dolgu cümleler kullanma.

Yanıtını kesinlikle aşağıdaki JSON yapısına tam uygun olarak döndür:
{
  "mogScore": number (0 ile 100 arasında fotoğraftaki gerçek estetik ve mogging gücünü yansıtan sayı),
  "tierName": string (Seçenekler: "Gigachad / Apex Mogger", "Chad", "Chadlite", "High Tier Normalite", "Mid Tier Normalite", "Subfive / Mogged"),
  "tierColor": string (Örn: "#10B981" veya "#F59E0B" veya "#EC4899" veya "#8B5CF6"),
  "summary": string (Yüzün genel yapısını ve ilk izlenimini anlatan 2-3 cümlelik özet),
  "metrics": {
    "jawline": {
      "name": "Çene Hattı & Gonial Açı",
      "score": number (0-100),
      "description": string (Çene keskinliği, gonial açı ve mandibula genişliği değerlendirmesi),
      "details": string
    },
    "eyeAesthetics": {
      "name": "Göz Yapısı & Canthal Tilt",
      "score": number (0-100),
      "description": string (Canthal tilt açısı, hunter eyes görünümü, üst göz kapağı maruziyeti),
      "details": string
    },
    "cheekbones": {
      "name": "Elmacık Kemikleri & Yüz Genişliği",
      "score": number (0-100),
      "description": string (Zygomatic genişlik, hollow cheeks potansiyeli),
      "details": string
    },
    "facialSymmetry": {
      "name": "Yüz Simetrisi",
      "score": number (0-100),
      "description": string (Sağ ve sol yüz yarısı arasındaki simetri oranı),
      "details": string
    },
    "goldenRatio": {
      "name": "Altın Oran & Yüz Kompaktlığı",
      "score": number (0-100),
      "description": string (Yüz üçte bir oranları, FWHR ve neotenik/morfolojik denge),
      "details": string
    },
    "skinQuality": {
      "name": "Cilt Kalitesi & Yağ Oranı İllüzyonu",
      "score": number (0-100),
      "description": string (Cilt berraklığı, lekesizlik, yüz yağ oranı ve tanım),
      "details": string
    }
  },
  "ratios": [
    {
      "name": "FWHR (Yüz Genişlik/Yükseklik)",
      "value": string (Örn: "1.92"),
      "ideal": "1.90 - 2.05",
      "rating": "Perfect" | "Good" | "Average" | "Needs Improvement",
      "explanation": string
    },
    {
      "name": "Canthal Tilt Açısı",
      "value": string (Örn: "+4.5° Pozitif"),
      "ideal": "Pozitif (+3° ile +6°)",
      "rating": "Perfect" | "Good" | "Average" | "Needs Improvement",
      "explanation": string
    },
    {
      "name": "Gonial Çene Açısı",
      "value": string (Örn: "116°"),
      "ideal": "110° - 120°",
      "rating": "Perfect" | "Good" | "Average" | "Needs Improvement",
      "explanation": string
    },
    {
      "name": "Orta Yüz Kompaktlığı (Midface Ratio)",
      "value": string (Örn: "1.02"),
      "ideal": "0.95 - 1.05",
      "rating": "Perfect" | "Good" | "Average" | "Needs Improvement",
      "explanation": string
    },
    {
      "name": "Alt/Üst Yüz Oranı",
      "value": string (Örn: "1.61"),
      "ideal": "1.618 (Altın Oran)",
      "rating": "Perfect" | "Good" | "Average" | "Needs Improvement",
      "explanation": string
    }
  ],
  "strengths": [ string listesi (3-4 adet en güçlü estetik özellik) ],
  "weaknesses": [ string listesi (2-3 adet geliştirilebilir fiziki alan) ],
  "looksmaxingTips": [
    {
      "category": "Grooming & Saç" | "Cilt Bakımı" | "Duruş & Mewing" | "Vücut Yağı & Diyet" | "Göz & Bakış",
      "title": string,
      "advice": string,
      "impact": "Yüksek" | "Orta" | "Hafif"
    }
  ],
  "landmarks": {
    "jawlinePoints": [ {"x": number(0-100), "y": number(0-100)} (Çene hattı boyunca 5-7 nokta) ],
    "leftEye": [ {"x": number(0-100), "y": number(0-100)} (Sol göz köşe ve göz bebeği noktaları 3 nokta) ],
    "rightEye": [ {"x": number(0-100), "y": number(0-100)} (Sağ göz köşe ve göz bebeği noktaları 3 nokta) ],
    "noseBridge": [ {"x": number(0-100), "y": number(0-100)} (Burun kemiği ve ucu 3 nokta) ],
    "mouthPoints": [ {"x": number(0-100), "y": number(0-100)} (Dudak kenarları ve ortası 3 nokta) ],
    "cheekbones": [ {"x": number(0-100), "y": number(0-100)} (Sol ve sağ elmacık kemiği vurgu noktaları 2 nokta) ],
    "goldenGridCenter": {"x": number(0-100), "y": number(0-100)}
  }
}

Not: x ve y koordinatları 0 ile 100 arasında yüzde değerler olmalıdır (Örn x: 50 yüzün tam ortası, y: 50 tam ortası). Landmark noktalarını görsel üstüne overlay çizeceğimiz için yüzün gerçek konumuna uygun tahmin et.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: finalMimeType,
              data: finalBase64,
            },
          },
          {
            text: `Lütfen fotoğraftaki yüzü incele. ${faceName ? `Kişinin adı: ${faceName}.` : ''} Detaylı estetik, kemik yapısı ve mogging analizini JSON olarak sağla.`,
          },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Gemini API'den boş yanıt alındı.");
    }

    const parsedResult = JSON.parse(text);

    const fullResult = {
      id: "analysis_" + Date.now(),
      timestamp: Date.now(),
      imageUrl: imageBase64.startsWith("http://") || imageBase64.startsWith("https://") || imageBase64.startsWith("data:")
        ? imageBase64
        : `data:${finalMimeType};base64,${finalBase64}`,
      faceName: faceName || "Analiz Edilen Yüz",
      ...parsedResult,
    };

    return res.json(fullResult);
  } catch (error: any) {
    console.error("Yüz Analizi Hatası:", error);
    return res.status(500).json({
      error: error?.message || "Yüz analiz edilirken bir hata oluştu.",
    });
  }
});

async function startServer() {
  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MogMeter AI Sunucusu running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
