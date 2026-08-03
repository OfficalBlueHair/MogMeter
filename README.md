# MogMeter AI ⚡ - Yüz Estetiği & Mogging Oranı Analiz Platformu

**MogMeter AI**, Google Gemini AI (`gemini-2.5-flash`) entegrasyonu ile fotoğraflar üzerindeki biyometrik yüz işaretleyicilerini (jawline, canthal tilt, midface compactness, gonial angle, facial symmetry) analiz eden tam donanımlı web uygulamasıdır.

---

## 🌟 Özellikler

- 📸 **Kamera ile Fotoğraf Çekimi & Yükleme**: Doğrudan web kameranızdan veya dosya yöneticinizden yüz fotoğrafı yükleyin.
- 🧬 **Yapay Zeka Destekli Biyometrik Analiz**: Gemini 2.5 Flash ile gerçek zamanlı yüz morfolojisi, kemik yapısı, altın oran ve simetri analizi.
- 🎯 **Görsel Vektör Katmanları (Landmarks Overlay)**: Çene hattı, canthal tilt açısı, simetri ekseni ve altın oran ızgarasını fotoğraf üstünde interaktif gösterim.
- 📊 **6-Boyutlu Radar Profili (Recharts)**: Çene hattı, göz yapısı, elmacık kemikleri, simetri, altın oran ve cilt kalitesi skor grafiği.
- ⚔️ **Mog Battle (Kafa Kafaya Karşılaştırma)**: İki farklı yüzü yan yana kıyaslama ve kimin daha üstün olduğunu ölçen savaş arenası.
- 🎴 **Kimlik Kartı İndir & Paylaş**: Analiz sonuçlarını özel tasarlanmış mogging sertifikasına dönüştürün.
- 📜 **Yerel Analiz Geçmişi (LocalStorage)**: Geçmiş analizlerinizi saklayın ve dilediğiniz zaman tekrar inceleyin.

---

## 🛠️ Teknolojiler

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts
- **Backend**: Express.js, TypeScript (`server.ts`)
- **Yapay Zeka SDK**: `@google/genai` (Google Gemini API)
- **Derleme / Build**: Vite, esbuild, tsx

---

## 🚀 Kurulum ve Çalıştırma

### 1. Repoyu Kopyalayın

```bash
git clone https://github.com/KULLANICI_ADI/mogmeter-ai.git
cd mogmeter-ai
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarlayın

Kök dizinde `.env` dosyası oluşturun ve Gemini API anahtarınızı ekleyin:

```env
GEMINI_API_KEY="AIzaSy..."
```

*(API anahtarınızı [Google AI Studio](https://aistudio.google.com/) üzerinden ücretsiz temin edebilirsiniz.)*

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

---

## 📦 Üretim Derlemesi (Production Build)

```bash
# Projeyi derleyin
npm run build

# Üretim sunucusunu başlatın
npm start
```

---

## 🛡️ Güvenlik ve Gizlilik

- Gemini API anahtarı istemciye (tarayıcıya) **asla gönderilmez**. Tüm AI istekleri sunucu tarafındaki Express proxy (`/api/analyze-face`) üzerinden güvenli bir şekilde iletilir.
- Kullanıcı fotoğrafları üçüncü taraf veritabanlarına kaydedilmez, yalnızca anlık analiz için kullanılır.

---

## 📄 Lisans

Apache 2.0 License
