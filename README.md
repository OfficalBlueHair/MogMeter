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

### 3. Ortam Değişkenlerini Ayarlayın (Opsiyonel)

Kök dizinde `.env` dosyası oluşturun:

```env
GEMINI_API_KEY="AIzaSy..."
```

**Önemli:** Artık kullanıcılar kendi API anahtarlarını kullanabilir! `.env` dosyasındaki anahtar sadece yedek (fallback) olarak kullanılacaktır. Kullanıcılar arayüzden kendi anahtarlarını girdiklerinde sistem o anahtarı kullanır.

*(API anahtarınızı [Google AI Studio](https://aistudio.google.com/) üzerinden ücretsiz temin edebilirsiniz.)*

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

---

## 👤 Kullanıcı API Anahtarı Nasıl Kullanılır?

MogMeter AI artık **kullanıcı bazlı API anahtarı** desteği sunuyor. Bu sayede her kullanıcı kendi Gemini API anahtarını kullanarak analiz yapabilir.

### Adım Adım Kullanım:

1. **Uygulamayı Açın**: `http://localhost:3000` adresine gidin.
2. **API Anahtarınızı Girin**: Sayfanın üst kısmında bulunan **"Gemini API Anahtarınız"** input alanına Google AI Studio'dan aldığınız API anahtarını yapıştırın.
   - Input alanı `type="password"` olduğu için anahtar gizli görünür.
   - Yanındaki 👁️ ikonuna tıklayarak anahtarı geçici olarak görebilirsiniz.
3. **Otomatik Kayıt**: Anahtarınızı girdiğinizde tarayıcının `localStorage` alanına güvenli bir şekilde kaydedilir.
4. **Analiz Yapın**: Fotoğraf yükleyin veya kamera ile çekim yapın. Sistem kayıtlı API anahtarınızı otomatik olarak kullanacaktır.
5. **Tekrar Giriş Yok**: Tarayıcıyı kapatıp tekrar açsanız bile API anahtarınız hatırlanır, yeniden girmenize gerek yoktur.

### ⚠️ Önemli Notlar:

- Eğer API anahtarı girilmeden analiz yapılmaya çalışılırsa, sistem **"Lütfen önce API anahtarınızı girin"** uyarısı verecektir.
- API anahtarınız yalnızca tarayıcınızda (`localStorage`) saklanır, sunucuya kalıcı olarak kaydedilmez.
- Her analiz isteğinde anahtarınız güvenli bir şekilde backend'e gönderilir ve Gemini API'ye iletilir.
- `.env` dosyasındaki `GEMINI_API_KEY` artık sadece yedek amaçlıdır; kullanıcı anahtarı girilmediğinde devreye girer.

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

- **Kullanıcı Bazlı API Anahtarı**: Her kullanıcı kendi Gemini API anahtarını tarayıcısında (`localStorage`) saklar. Bu sayede sunucu maliyeti ortadan kalkar.
- **Güvenli İletim**: Kullanıcı API anahtarı her istekte şifreli HTTPS üzerinden backend'e iletilir ve doğrudan Gemini API'ye forwarded edilir, sunucuda loglanmaz veya kaydedilmez.
- **Yedek Anahtar Desteği**: `.env` dosyasındaki `GEMINI_API_KEY` sadece kullanıcı anahtarı girilmediğinde devreye giren bir fallback mekanizmasıdır.
- **Veri Gizliliği**: Kullanıcı fotoğrafları üçüncü taraf veritabanlarına kaydedilmez, yalnızca anlık analiz için kullanılır ve bellekten silinir.
- **Local Storage**: API anahtarınız yalnızca kendi tarayıcınızda saklanır, başka hiçbir yere gönderilmez.

---

## 📄 Lisans

Apache 2.0 License
