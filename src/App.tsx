import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Languages, 
  Copy, 
  Check, 
  Trash2, 
  Video, 
  Instagram, 
  Facebook, 
  Youtube, 
  History,
  CornerDownLeft,
  ShoppingBag,
  AlertCircle
} from "lucide-react";

// Types
interface SavedCampaign {
  id: string;
  productName: string;
  productDescription: string;
  platform: string;
  tone: string;
  language: "ar" | "en";
  timestamp: string;
  output: {
    hooks: string[];
    script: {
      hook: string;
      body: string;
      cta: string;
    };
    caption: string;
  };
}

// Translations structure
const translations = {
  ar: {
    title: "أدريـمكس AI",
    subtitle: "حوّل تفاصيل منتجاتك إلى نصوص إعلانية وفيديوهات قصيرة جذابة وفيروسية بنقرة واحدة باستخدام الذكاء الاصطناعي.",
    productNameLabel: "اسم المنتج",
    productNamePlaceholder: "مثال: عسل المجرى العضوي، ساعة الفخامة الأنيقة...",
    productDescLabel: "وصف المنتج والفوائد",
    productDescPlaceholder: "اكتب أهم مميزات منتجك، والجمهور المستهدف لإنشاء إعلان دقيق ومقنع...",
    platformLabel: "المنصة المستهدفة",
    toneLabel: "نبرة الصوت والأسلوب الإعلاني",
    generateBtn: "توليد المحتوى الإعلاني بالذكاء الاصطناعي",
    generating: "جاري توليد أفكارك الإعلانية...",
    historyTitle: "سجل الإعلانات المسبقة",
    noHistory: "لا توجد إعلانات محفوظة بعد. ابدأ بالتوليد الآن!",
    copied: "تم النسخ!",
    copyText: "نسخ",
    hooksTab: "الافتتاحيات الجذابة (Hooks)",
    scriptTab: "سيناريو الفيديو (Script)",
    captionTab: "الوصف والوسوم (Caption)",
    videoStructure: {
      hook: "الافتتاحية (3 ثوانٍ الأولى)",
      body: "العرض والفوائد (محتوى الفيديو)",
      cta: "الدعوة لاتخاذ إجراء (CTA)"
    },
    sampleProducts: "جرب أحد النماذج الجاهزة:",
    sample1: "عسل سدر جبلي",
    sample2: "جهاز تدليك الرقبة اللاسلكي",
    sample3: "كريم طبيعي مرطب للوجه",
    feedbackError: "حدث خطأ أثناء الاتصال بالخادم. يرجى التحقق من مفتاح API وإعادة المحاولة.",
    feedbackQuota: "أنت تستخدم الفئة المجانية من Gemini، يرجى المحاولة بعد 30 ثانية لتجنب تخطي الحد المسموح به.",
    historyClear: "مسح السجل",
    platformNames: {
      tiktok: "تيك توك",
      instagram: "إنستغرام ريلز",
      facebook: "إعلان فيسبوك",
      youtube: "يوتيوب شورتس"
    },
    tones: {
      viral: "حماسي وفيرال ⚡",
      sales: "بيع مباشر وإقناع 🎯",
      story: "سرد قصصي ومؤثر 📖",
      edu: "تعليمي ومبسط 💡"
    },
    creativeAngles: "زوايا إبداعية مقترحة",
    resultPlaceholder: "املأ بيانات منتجك واضغط على زر التوليد لمشاهدة السحر الإعلاني هنا ✨"
  },
  en: {
    title: "AdRemix AI",
    subtitle: "Transform your product details into high-converting, viral social scripts, hooks, and captions in a single click using Gemini AI.",
    productNameLabel: "Product Name",
    productNamePlaceholder: "e.g., Organic Sidr Honey, Luxury Sapphire Watch...",
    productDescLabel: "Product Description & Benefits",
    productDescPlaceholder: "Write the key selling points, target audience, and benefits to create a highly tailored and persuasive ad copy...",
    platformLabel: "Target Platform",
    toneLabel: "Campaign Vibe & Tone",
    generateBtn: "Generate Marketing Content",
    generating: "Crafting your viral content...",
    historyTitle: "Ad History",
    noHistory: "No saved generations yet. Start by generating above!",
    copied: "Copied!",
    copyText: "Copy",
    hooksTab: "Attention Hooks",
    scriptTab: "Video Script",
    captionTab: "Caption & Hashtags",
    videoStructure: {
      hook: "Hook (First 3s)",
      body: "Body (Value Prop)",
      cta: "Call to Action (CTA)"
    },
    sampleProducts: "Try a preset example:",
    sample1: "Mountain Sidr Honey",
    sample2: "Wireless Neck Massager",
    sample3: "Natural Facial Hydrating Cream",
    feedbackError: "An error occurred while connecting to the server. Please check your API key and try again.",
    feedbackQuota: "Gemini Free quota limit reached. Please wait 30 seconds and retry.",
    historyClear: "Clear History",
    platformNames: {
      tiktok: "TikTok",
      instagram: "Instagram Reels",
      facebook: "Facebook Ad",
      youtube: "YouTube Shorts"
    },
    tones: {
      viral: "Viral & Energetic ⚡",
      sales: "Direct Conversion 🎯",
      story: "Authentic Storytelling 📖",
      edu: "Educational & Informative 💡"
    },
    creativeAngles: "Creative Suggested Angles",
    resultPlaceholder: "Fill in your product details and hit generate to watch the marketing magic happen here ✨"
  }
};

export default function App() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [platform, setPlatform] = useState("tiktok");
  const [tone, setTone] = useState("viral");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"hooks" | "script" | "caption">("hooks");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Current output state
  const [output, setOutput] = useState<{
    hooks: string[];
    script: {
      hook: string;
      body: string;
      cta: string;
    };
    caption: string;
  } | null>(null);

  // History state
  const [history, setHistory] = useState<SavedCampaign[]>([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem("adremix_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save history helper
  const saveToHistory = (item: SavedCampaign) => {
    const updated = [item, ...history].slice(0, 20); // Keep last 20
    setHistory(updated);
    localStorage.setItem("adremix_history", JSON.stringify(updated));
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("adremix_history");
  };

  // Quick preset loader
  const loadPreset = (presetIndex: number) => {
    if (presetIndex === 1) {
      if (lang === "ar") {
        setProductName("عسل السدر الجبلي العضوي");
        setProductDescription("عسل طبيعي نقي 100% مستخلص من زهور السدر في أعالي الجبال. يعزز المناعة، غني بمضادات الأكسدة، ومثالي للأطفال والرياضيين بديلًا طبيعيًا تمامًا للسكر المكرر.");
      } else {
        setProductName("Premium Organic Sidr Honey");
        setProductDescription("100% pure raw honey harvested from wild Sidr trees. Rich in antioxidants, naturally boosts immunity, and serves as an elite healthy sugar alternative for fitness enthusiasts and kids.");
      }
    } else if (presetIndex === 2) {
      if (lang === "ar") {
        setProductName("جهاز تدليك الرقبة والكتف الذكي");
        setProductDescription("جهاز تدليك مريح لاسلكي يعتمد تقنية النبضات الحرارية لتخفيف آلام الرقبة والتشنجات الناتجة عن الجلوس الطويل أمام شاشات الكمبيوتر والعمل المكتبي الشاق.");
      } else {
        setProductName("Smart Neck & Shoulder Massager");
        setProductDescription("Wireless ergonomic neck massager featuring deep-kneading heat technology. Melts away neck stiffness and stress caused by prolonged office work and screen time.");
      }
    } else if (presetIndex === 3) {
      if (lang === "ar") {
        setProductName("كريم هيدرا-غلو للترطيب العميق");
        setProductDescription("كريم مرطب طبيعي للوجه بتركيبة حمض الهيالورونيك وخلاصة نبات الصبار العضوي. يمنح نضارة تدوم 24 ساعة، يخفي الخطوط التعبيرية الدقيقة، ومناسب للبشرة الحساسة.");
      } else {
        setProductName("Hydra-Glow Deep Hydrating Cream");
        setProductDescription("All-natural face moisturizer powered by plant-based hyaluronic acid and organic Aloe Vera extract. Guarantees 24-hour dewiness, plumps fine lines, and is dermatologically tested for hypersensitive skin.");
      }
    }
  };

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle Generate
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !productDescription.trim()) return;

    setLoading(true);
    setErrorMessage("");
    setOutput(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          productDescription,
          platform,
          tone,
          language: lang
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error && data.error.includes("429")) {
          throw new Error("quota");
        }
        throw new Error(data.message || data.error || "failed");
      }

      if (data.output) {
        setOutput(data.output);
        
        // Save to local history
        const newCamp: SavedCampaign = {
          id: Date.now().toString(),
          productName,
          productDescription,
          platform,
          tone,
          language: lang,
          timestamp: new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" }),
          output: data.output
        };
        saveToHistory(newCamp);
      } else {
        throw new Error("Invalid output format returned");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === "quota") {
        setErrorMessage(translations[lang].feedbackQuota);
      } else {
        setErrorMessage(translations[lang].feedbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const t = translations[lang];
  const isRtl = lang === "ar";

  return (
    <div 
      dir={isRtl ? "rtl" : "ltr"} 
      className="min-h-screen text-slate-100 bg-gradient-to-b from-[#0b0f19] to-[#131a2b] transition-all duration-300 px-4 py-8 md:px-8"
    >
      {/* Top Header Navbar */}
      <header id="app-header" className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4 pb-6 border-b border-slate-800 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shadow-lg shadow-emerald-500/5">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-xs text-slate-400 font-medium">Powering Creators with Gemini AI</p>
          </div>
        </div>

        {/* Language switch toggle */}
        <button 
          id="lang-toggle"
          onClick={() => {
            setLang(lang === "ar" ? "en" : "ar");
            setOutput(null); // Reset output when language swaps to prevent mix-ups
            setErrorMessage("");
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 text-sm font-semibold transition-all duration-200 shadow-sm"
        >
          <Languages className="w-4 h-4 text-emerald-400" />
          <span>{lang === "ar" ? "English" : "العربية"}</span>
        </button>
      </header>

      {/* Main Body Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 animate-fade-in">
        {/* Left Column (Input Controls) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                {lang === "ar" ? "تفاصيل الحملة والمنتج" : "Campaign & Product Details"}
              </h2>
            </div>

            {/* Presets Grid */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-medium block">{t.sampleProducts}</span>
              <div className="flex flex-wrap gap-2">
                <button
                  id="preset-1"
                  type="button"
                  onClick={() => loadPreset(1)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition duration-150"
                >
                  🍯 {t.sample1}
                </button>
                <button
                  id="preset-2"
                  type="button"
                  onClick={() => loadPreset(2)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition duration-150"
                >
                  ⚡ {t.sample2}
                </button>
                <button
                  id="preset-3"
                  type="button"
                  onClick={() => loadPreset(3)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition duration-150"
                >
                  🌸 {t.sample3}
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Product Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 block">{t.productNameLabel}</label>
                <input 
                  id="product-name-input"
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder={t.productNamePlaceholder}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition duration-150"
                />
              </div>

              {/* Product Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 block">{t.productDescLabel}</label>
                <textarea 
                  id="product-desc-textarea"
                  required
                  rows={4}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder={t.productDescPlaceholder}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition duration-150 resize-none leading-relaxed"
                />
              </div>

              {/* Platform selection - interactive grid */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 block">{t.platformLabel}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "tiktok", name: t.platformNames.tiktok, icon: Video, color: "text-rose-400 border-rose-500/20 bg-rose-500/5" },
                    { id: "instagram", name: t.platformNames.instagram, icon: Instagram, color: "text-pink-400 border-pink-500/20 bg-pink-500/5" },
                    { id: "facebook", name: t.platformNames.facebook, icon: Facebook, color: "text-blue-400 border-blue-500/20 bg-blue-500/5" },
                    { id: "youtube", name: t.platformNames.youtube, icon: Youtube, color: "text-red-400 border-red-500/20 bg-red-500/5" },
                  ].map((p) => {
                    const Icon = p.icon;
                    const isSelected = platform === p.id;
                    return (
                      <button
                        id={`platform-btn-${p.id}`}
                        key={p.id}
                        type="button"
                        onClick={() => setPlatform(p.id)}
                        className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border text-sm transition-all duration-200 ${
                          isSelected 
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold shadow-sm"
                            : "border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900/50 text-slate-400"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? "text-emerald-400" : p.color.split(" ")[0]}`} />
                        <span>{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tone Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 block">{t.toneLabel}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "viral", label: t.tones.viral },
                    { id: "sales", label: t.tones.sales },
                    { id: "story", label: t.tones.story },
                    { id: "edu", label: t.tones.edu },
                  ].map((o) => {
                    const isSelected = tone === o.id;
                    return (
                      <button
                        id={`tone-btn-${o.id}`}
                        key={o.id}
                        type="button"
                        onClick={() => setTone(o.id)}
                        className={`px-3 py-2.5 rounded-xl border text-xs text-center transition-all duration-200 ${
                          isSelected 
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold"
                            : "border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900/50 text-slate-400"
                        }`}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error Message banner */}
              {errorMessage && (
                <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs leading-relaxed animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Action Button */}
              <button
                id="submit-gen-btn"
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  loading 
                    ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/20 cursor-not-allowed" 
                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:shadow-emerald-500/10"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-emerald-300" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{t.generating}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t.generateBtn}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (Output Display & History) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Generation Output Display */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl relative min-h-[400px] flex flex-col">
            {output ? (
              <div className="flex-1 flex flex-col space-y-5 animate-fade-in">
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase">
                      {platform}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                      {tone === "viral" ? t.tones.viral : tone === "sales" ? t.tones.sales : tone === "story" ? t.tones.story : t.tones.edu}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">Live Ad Draft</span>
                </div>

                {/* Tab selectors */}
                <div className="flex border-b border-slate-800 bg-slate-950/40 p-1.5 rounded-xl">
                  {[
                    { id: "hooks", name: t.hooksTab },
                    { id: "script", name: t.scriptTab },
                    { id: "caption", name: t.captionTab }
                  ].map((tab) => (
                    <button
                      id={`tab-btn-${tab.id}`}
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-slate-800 text-emerald-400 shadow-sm"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>

                {/* Tab Contents */}
                <div className="flex-1 py-2">
                  {activeTab === "hooks" && (
                    <div className="space-y-4">
                      {output.hooks.map((h, idx) => (
                        <div key={idx} className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 relative group">
                          <p className="text-sm md:text-base text-slate-100 font-medium leading-relaxed pr-10 pl-2">
                            {h}
                          </p>
                          <button
                            id={`copy-hook-${idx}`}
                            onClick={() => handleCopy(h, `hook-${idx}`)}
                            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition"
                            title="Copy Hook"
                          >
                            {copiedId === `hook-${idx}` ? (
                              <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "script" && (
                    <div className="space-y-4">
                      {[
                        { key: "hook", label: t.videoStructure.hook, content: output.script.hook },
                        { key: "body", label: t.videoStructure.body, content: output.script.body },
                        { key: "cta", label: t.videoStructure.cta, content: output.script.cta }
                      ].map((sec) => (
                        <div key={sec.key} className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 relative">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                            {sec.label}
                          </span>
                          <p className="text-sm md:text-base text-slate-100 leading-relaxed pr-10">
                            {sec.content}
                          </p>
                          <button
                            id={`copy-script-${sec.key}`}
                            onClick={() => handleCopy(sec.content, `script-${sec.key}`)}
                            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition"
                            title="Copy Section"
                          >
                            {copiedId === `script-${sec.key}` ? (
                              <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "caption" && (
                    <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-5 relative min-h-[150px]">
                      <p className="text-sm md:text-base text-slate-200 leading-relaxed whitespace-pre-wrap pr-10">
                        {output.caption}
                      </p>
                      <button
                        id="copy-caption-btn"
                        onClick={() => handleCopy(output.caption, "caption-all")}
                        className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition"
                        title="Copy Caption"
                      >
                        {copiedId === "caption-all" ? (
                          <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-500 border border-slate-800/80 mb-4 animate-bounce">
                  <Sparkles className="w-7 h-7 text-slate-400" />
                </div>
                <p className="text-sm md:text-base text-slate-400 max-w-md leading-relaxed">
                  {t.resultPlaceholder}
                </p>
              </div>
            )}
          </div>

          {/* History Panel */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
                <History className="w-5 h-5 text-emerald-400" />
                {t.historyTitle}
              </h2>
              {history.length > 0 && (
                <button
                  id="clear-history-btn"
                  onClick={clearHistory}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {t.historyClear}
                </button>
              )}
            </div>

            {history.length > 0 ? (
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {history.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3.5 bg-slate-950/40 border border-slate-850 hover:border-slate-800 rounded-xl transition duration-150 flex flex-wrap justify-between items-start gap-3"
                  >
                    <div className="space-y-1 max-w-[70%]">
                      <h4 className="text-sm font-bold text-slate-200 truncate">{item.productName}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{item.productDescription}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] font-medium bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded uppercase">
                          {item.platform}
                        </span>
                        <span className="text-[10px] font-medium bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                          {item.tone === "viral" ? t.tones.viral : item.tone === "sales" ? t.tones.sales : item.tone === "story" ? t.tones.story : t.tones.edu}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {item.timestamp}
                        </span>
                      </div>
                    </div>

                    <button
                      id={`restore-history-${item.id}`}
                      onClick={() => {
                        setProductName(item.productName);
                        setProductDescription(item.productDescription);
                        setPlatform(item.platform);
                        setTone(item.tone);
                        setLang(item.language);
                        setOutput(item.output);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-500/20 transition flex items-center gap-1 self-center"
                    >
                      <span>{lang === "ar" ? "استعادة" : "Restore"}</span>
                      <CornerDownLeft className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">{t.noHistory}</p>
            )}
          </div>
        </div>
      </main>

      {/* Footer credits and information */}
      <footer className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 space-y-2">
        <p>© 2026 AdRemix AI - All Rights Reserved</p>
        <p>Built server-side using Gemini 3.5 Flash & Plus Jakarta Sans typography</p>
      </footer>
    </div>
  );
}
