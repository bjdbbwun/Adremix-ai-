import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Layout, 
  Server, 
  Database, 
  Cloud, 
  ShieldAlert, 
  Cpu, 
  Lock, 
  FolderGit, 
  Milestone, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Copy, 
  Download, 
  RotateCw, 
  Terminal, 
  BookOpen, 
  ChevronRight, 
  Sliders, 
  Layers, 
  Tv, 
  Instagram as InstaIcon, 
  Facebook as FaceIcon, 
  Youtube as YtIcon, 
  Bookmark, 
  Trash2,
  ExternalLink,
  HelpCircle,
  FileCode,
  Compass,
  LogIn,
  LogOut,
  GitCompare,
  Coins,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  PieChart,
  Users
} from "lucide-react";
import { AdHook, AdScene, PlatformAd, GenerationResponse, GenerationInput, SavedAdCampaign } from "./types";
import { architectureTopics, ArchitectureTopic } from "./architectureData";
import { defaultCampaignInput, defaultCampaignOutput } from "./defaultCampaign";
import { investorsDeckData } from "./investorsDeck";
import { auth, googleProvider, db, functions } from "./firebase";
import { User, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import promptsIndex from "./promptsIndex.json";
import productRoadmap from "./productRoadmap.json";

const GROWTH_HACK_TIPS = [
  "Calibrating micro-hook pattern interrupts for short-form video retention...",
  "Synthesizing demographic pain-point triggers from product description...",
  "Structuring dual-loop narrative arcs (tension building, product resolution)...",
  "Enforcing strict 1.5-second scroll-stopper rules for TikTok UGC algorithm...",
  "Optimizing CTA urgency layers for direct-response performance...",
  "Assembling visual camera cue guidelines and multi-speaker script beats...",
  "Generating high-indexing relevant hashtag buckets and placement rules..."
];

export default function App() {
  // Navigation State: 'blueprint' | 'playground' | 'investors' | 'scalability'
  const [activeView, setActiveView] = useState<"blueprint" | "playground" | "investors" | "scalability">("playground");
  
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  
  // Selected Blueprint topic for modal detail view
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  
  // Interactive MVP Sandbox input state
  const [inputState, setInputState] = useState<GenerationInput>({
    productName: defaultCampaignInput.productName,
    productDescription: defaultCampaignInput.productDescription,
    targetAudience: defaultCampaignInput.targetAudience,
    campaignGoal: "Direct conversions & Sales (Shopify/Woo)",
    platforms: ["tiktok", "instagram"],
    toneStyle: "Authentic UGC, Energetic, Problem-Solution",
    abTestMode: false
  });

  // Active variation tab for A/B Testing mode
  const [activeVariation, setActiveVariation] = useState<"A" | "B">("A");

  // Active investor slide key
  const [activeInvestorSlide, setActiveInvestorSlide] = useState<string>("problem");

  // Active platform tab in campaign output
  const [activePlatformTab, setActivePlatformTab] = useState<string>("TikTok");

  // Output States
  const [adResult, setAdResult] = useState<GenerationResponse | null>(defaultCampaignOutput);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loaderTipIndex, setLoaderTipIndex] = useState<number>(0);
  const [loaderProgress, setLoaderProgress] = useState<number>(0);
  const [apiError, setApiError] = useState<string | null>(null);

  // Clipboard Feedbacks
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  // History / Saved generations
  const [savedCampaigns, setSavedCampaigns] = useState<SavedAdCampaign[]>([]);

  // Prompts & Scalability States
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number>(0);
  const [promptVariables, setPromptVariables] = useState<{ [key: string]: string }>({});

  // Live Callable Functions States
  const [liveResult, setLiveResult] = useState<any>(null);
  const [isLiveLoading, setIsLiveLoading] = useState<boolean>(false);
  const [liveError, setLiveError] = useState<string | null>(null);

  const getVariableDefault = (variableName: string) => {
    switch (variableName) {
      case "productName": return "EcoFlask Pro";
      case "productData": return "EcoFlask Pro: زجاجة ذكية بسعة 750 مل مع شاشة LED ذكية لقياس درجة حرارة الماء وتنبيهات اهتزازية للشرب.";
      case "targetAudience": return "عشاق الرياضة والرشاقة، وموظفو المكاتب المزدحمة بالمهام";
      case "targetPlatform": return "TikTok & Instagram Reels";
      case "chosenHook": return "توقف عن شرب الماء البلاستيكي الدافئ! إليك الحل الحقيقي لتغيير روتينك اليومي.";
      case "duration": return "30";
      case "languageTone": return "لهجة سعودية عامية حيوية محببة وقريبة للشباب";
      case "tone": return "حماسي وتفاعلي واقعي (UGC Style)";
      case "competitorAd": return "زجاجة مياه رائعة تحافظ على البرودة طوال اليوم. اشتر الآن واحصل على خصم 10%!";
      case "script": return "مشهد 1: شخص يلهث من العطش في صالة رياضية. مشهد 2: يلمس غطاء زجاجة EcoFlask فتضيء الشاشة LED بـ 4 درجات. مشهد 3: الابتسام والارتواء التام.";
      case "dialect": return "لهجة خليجية سعودية بيضاء ملائمة لـ UGC";
      case "vocalTone": return "حماسي وواثق ويملأه الفضول والارتياح";
      case "productAssets": return "3 صور بفتحات إضاءة استوديو وثنائية تصوير لخطوات التعبئة والاستخدام العملي";
      case "chosenScript": return "خطاف إثارة فضول حول جفاف الجسم، متبوعاً بحل EcoFlask العملي، ثم دعوة واضحة للشراء.";
      case "aspectRatio": return "9:16 vertical screen";
      case "category": return "مستلزمات رياضية وإكسسوارات ذكية";
      default: return "";
    }
  };

  const getVariableLabel = (variableName: string) => {
    switch (variableName) {
      case "productName": return "اسم المنتج / SaaS Name";
      case "productData": return "وصف وبيانات المنتج / Product Details";
      case "targetAudience": return "الجمهور المستهدف / Target Audience";
      case "targetPlatform": return "المنصة المستهدفة / Target Platform";
      case "chosenHook": return "الخطاف المحدد / Chosen Hook";
      case "duration": return "مدة الفيديو بالثواني / Video Duration (Seconds)";
      case "languageTone": return "لغة ونبرة الصوت / Language & Vocal Tone";
      case "tone": return "أسلوب ونبرة المحتوى / Content Tone Style";
      case "competitorAd": return "الإعلان المنافس المستهدف / Competitor Ad Copy";
      case "script": return "سيناريو السكربت المكتوب / Script Content";
      case "dialect": return "اللهجة المستهدفة / Vocal Dialect";
      case "vocalTone": return "نبرة الصوت المحددة / Vocal Tone Style";
      case "productAssets": return "أصول وصور وفيديوهات المنتج / Product Assets";
      case "chosenScript": return "السيناريو الإعلاني المختار / Chosen Script Timeline";
      case "aspectRatio": return "أبعاد الفيديو / Video Aspect Ratio";
      case "category": return "فئة المنتج التسويقية / Product Category";
      default: return variableName;
    }
  };

  // Pre-populate variables when selected prompt changes
  useEffect(() => {
    setLiveResult(null);
    setLiveError(null);
    setIsLiveLoading(false);

    const activePrompt = promptsIndex.prompts[selectedPromptIndex];
    if (!activePrompt) return;
    
    const regex = /\{\{([^}]+)\}\}/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(activePrompt.promptTemplate)) !== null) {
      matches.push(match[1]);
    }
    const placeholders = Array.from(new Set(matches));
    
    const initialVars: { [key: string]: string } = {};
    placeholders.forEach((p) => {
      initialVars[p] = getVariableDefault(p);
    });
    setPromptVariables(initialVars);
  }, [selectedPromptIndex]);

  // Load saved campaigns on mount or user change
  useEffect(() => {
    setIsAuthLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load from firestore
        try {
          const q = query(
            collection(db, "campaigns"),
            where("ownerId", "==", currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          const campaigns: SavedAdCampaign[] = [];
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            campaigns.push({
              id: docSnap.id,
              timestamp: new Date(data.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" }),
              input: data.input,
              output: data.output,
              createdAt: data.createdAt
            });
          });
          // Sort locally by creation date
          campaigns.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setSavedCampaigns(campaigns.slice(0, 8));
        } catch (err) {
          console.error("Error fetching campaigns from firestore:", err);
        }
      } else {
        // Guest mode - load from localStorage
        try {
          const saved = localStorage.getItem("adremix_campaign_history");
          if (saved) {
            setSavedCampaigns(JSON.parse(saved));
          } else {
            setSavedCampaigns([]);
          }
        } catch (e) {
          console.error("Failed to load local campaign history:", e);
        }
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Interval for progressive loader tips
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    if (isLoading) {
      setLoaderProgress(5);
      interval = setInterval(() => {
        setLoaderTipIndex((prev) => (prev + 1) % GROWTH_HACK_TIPS.length);
      }, 3500);

      progressInterval = setInterval(() => {
        setLoaderProgress((prev) => {
          if (prev >= 92) return prev; // Hold until complete
          return prev + Math.floor(Math.random() * 8) + 2;
        });
      }, 500);
    } else {
      setLoaderProgress(0);
    }

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [isLoading]);

  // Utility to copy text with feedback animation
  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  // Select platform tag toggle
  const handleTogglePlatform = (platform: string) => {
    setInputState((prev) => {
      const current = [...prev.platforms];
      if (current.includes(platform)) {
        if (current.length === 1) return prev; // Keep at least one platform active
        return { ...prev, platforms: current.filter((p) => p !== platform) };
      } else {
        return { ...prev, platforms: [...current, platform] };
      }
    });
  };

  // Call Express Server Route to Generate Ad Assets
  const handleGenerateAds = async () => {
    setIsLoading(true);
    setApiError(null);
    setAdResult(null);

    try {
      const response = await fetch("/api/transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(inputState)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to communicate with transformation API.");
      }

      const data: GenerationResponse = await response.json();
      setAdResult(data);
      
      // Auto-set the active tab to the first returned platform name
      if (data.platforms && data.platforms.length > 0) {
        setActivePlatformTab(data.platforms[0].platformName);
      }

      // Save campaign in history
      let savedId = "camp_" + Date.now();
      const createdAtStr = new Date().toISOString();

      if (user) {
        try {
          const docRef = await addDoc(collection(db, "campaigns"), {
            input: { ...inputState },
            output: data,
            ownerId: user.uid,
            createdAt: createdAtStr
          });
          savedId = docRef.id;
        } catch (fErr) {
          console.error("Error saving campaign to Firestore:", fErr);
        }
      }

      const newCampaign: SavedAdCampaign = {
        id: savedId,
        timestamp: new Date(createdAtStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" }),
        input: { ...inputState },
        output: data,
        createdAt: createdAtStr
      };

      if (user) {
        setSavedCampaigns((prev) => [newCampaign, ...prev].slice(0, 8));
      } else {
        const updatedHistory = [newCampaign, ...savedCampaigns].slice(0, 8); // Keep last 8 items
        setSavedCampaigns(updatedHistory);
        localStorage.setItem("adremix_campaign_history", JSON.stringify(updatedHistory));
      }
      setLoaderProgress(100);
    } catch (err) {
      console.error("AdRemix API Execution Error:", err);
      setApiError(err instanceof Error ? err.message : "An unknown architecture error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset sandbox form to pristine state
  const handleResetForm = () => {
    setInputState({
      productName: "",
      productDescription: "",
      targetAudience: "",
      campaignGoal: "Direct conversions & Sales (Shopify/Woo)",
      platforms: ["tiktok", "instagram"],
      toneStyle: "Authentic UGC, Energetic, Problem-Solution"
    });
    setAdResult(null);
    setApiError(null);
  };

  // Load custom compiler variables into interactive MVP sandbox
  const handleLoadInPlayground = (activePrompt: any) => {
    setInputState((prev) => {
      const updated = { ...prev };
      if (promptVariables.productName) updated.productName = promptVariables.productName;
      if (promptVariables.productDescription) updated.productDescription = promptVariables.productDescription;
      if (promptVariables.productData) updated.productDescription = promptVariables.productData;
      if (promptVariables.targetAudience) updated.targetAudience = promptVariables.targetAudience;
      return updated;
    });
    setActiveView("playground");
  };

  // Run live analysis using the local Python FastAPI endpoints directly via Express proxies
  const handleRunLiveAnalysis = async (promptId: number) => {
    setIsLiveLoading(true);
    setLiveError(null);
    setLiveResult(null);

    try {
      if (promptId === 7) {
        // طبيب الإعلانات
        const response = await fetch("/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ad_text: promptVariables["script"] || "",
            target_audience: promptVariables["targetAudience"] || "عام",
            platform: promptVariables["targetPlatform"] || "TikTok"
          })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || "Failed to communicate with diagnose API");
        }
        const rawData = await response.json();
        const mappedData = {
          hook: rawData.hook,
          valueClarity: rawData.value_clarity,
          emotionalPull: rawData.emotional_pull,
          platformFit: rawData.platform_fit,
          cta: rawData.cta_power,
          totalScore: rawData.total_score,
          finalVerdict: rawData.final_verdict,
          topPriorityFix: rawData.top_priority_fix
        };
        setLiveResult({ type: "doctor", data: mappedData });
      } else if (promptId === 8) {
        // محلل الفجوة
        const response = await fetch("/analyze-gap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_name: promptVariables["productName"] || "",
            product_description: promptVariables["productData"] || "",
            category: promptVariables["category"] || "عامة",
            target_audience: promptVariables["targetAudience"] || "عام"
          })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || "Failed to communicate with analyze-gap API");
        }
        const rawData = await response.json();
        const mappedData = {
          typicalAnglesUsed: rawData.typical_angles,
          angleFatigueLevel: rawData.fatigue_level,
          unusedAngles: rawData.unused_angles ? rawData.unused_angles.map((u: any) => ({ angle: u.angle, whyUnused: u.why_unused })) : [],
          contrarianAngle: rawData.contrarian_angle ? {
            angle: rawData.contrarian_angle.angle,
            riskLevel: rawData.contrarian_angle.risk_level,
            potentialReward: rawData.contrarian_angle.potential_reward
          } : null,
          topRecommendation: rawData.top_recommendation,
          reason: rawData.reason
        };
        setLiveResult({ type: "gap", data: mappedData });
      } else if (promptId === 9) {
        // متنبئ الأداء
        const response = await fetch("/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product: promptVariables["productName"] || "",
            ad_text: promptVariables["script"] || "",
            target_audience: promptVariables["targetAudience"] || "عام",
            platform: promptVariables["targetPlatform"] || "TikTok"
          })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || "Failed to communicate with predict API");
        }
        const rawData = await response.json();
        const mappedData = {
          reach: rawData.reach ? {
            estimatedReach: rawData.reach.estimated_reach,
            viralPotential: rawData.reach.viral_potential,
            reasonForViralScore: rawData.reach.reason_for_viral_score
          } : null,
          engagement: rawData.engagement ? {
            estimatedEngagementRate: rawData.engagement.estimated_engagement_rate,
            likesEstimate: rawData.engagement.likes_estimate,
            sharesEstimate: rawData.engagement.shares_estimate,
            commentsEstimate: rawData.engagement.comments_estimate,
            savesEstimate: rawData.engagement.saves_estimate
          } : null,
          sales: rawData.sales ? {
            estimatedCTR: rawData.sales.estimated_ctr,
            estimatedConversionRate: rawData.sales.estimated_conversion_rate,
            estimatedSalesValue: rawData.sales.estimated_sales_value
          } : null,
          strongestElement: rawData.strongest_element,
          weakestElement: rawData.weakest_element,
          overallScore: rawData.overall_score,
          successProbability: rawData.success_probability,
          recommendation: rawData.recommendation
        };
        setLiveResult({ type: "predictor", data: mappedData });
      }
    } catch (err) {
      console.error("Live Analysis Error:", err);
      setLiveError(err instanceof Error ? err.message : "حدث خطأ أثناء الاتصال بـ API المحلي.");
    } finally {
      setIsLiveLoading(false);
    }
  };

  // Load a historic campaign
  const handleLoadSavedCampaign = (campaign: SavedAdCampaign) => {
    setInputState(campaign.input);
    setAdResult(campaign.output);
    setApiError(null);
    if (campaign.output.platforms && campaign.output.platforms.length > 0) {
      setActivePlatformTab(campaign.output.platforms[0].platformName);
    }
  };

  // Copy full investor deck script
  const handleCopyInvestorDeckScript = () => {
    let text = `=== ${investorsDeckData.title} ===\n${investorsDeckData.subtitle}\n\n`;
    text += `مستهدف التمويل: ${investorsDeckData.targetAmount}\n`;
    text += `الحد الأدنى للاستثمار: ${investorsDeckData.minimumInvestment}\n\n`;
    
    Object.values(investorsDeckData.sections).forEach((section) => {
      text += `\n--- ${section.title} ---\n`;
      text += `${section.subtitle}\n`;
      if (section.bullets) {
        section.bullets.forEach((b) => {
          text += `- ${b.title} ${b.desc}\n`;
        });
      }
    });
    
    navigator.clipboard.writeText(text);
    handleCopyText(text, "investor_deck_script_full");
  };

  // Delete specific history item
  const handleDeleteHistoryItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      try {
        await deleteDoc(doc(db, "campaigns", id));
        setSavedCampaigns((prev) => prev.filter((item) => item.id !== id));
      } catch (fErr) {
        console.error("Failed to delete campaign from Firestore:", fErr);
      }
    } else {
      const filtered = savedCampaigns.filter((item) => item.id !== id);
      setSavedCampaigns(filtered);
      localStorage.setItem("adremix_campaign_history", JSON.stringify(filtered));
    }
  };

  // Google Sign-In and Sign-Out Handlers
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Google Sign-In Error:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign-Out Error:", err);
    }
  };

  // Export campaign results as a beautiful Markdown document
  const handleExportMarkdown = (platformAd: PlatformAd) => {
    const mdContent = `
# AdRemix AI Campaign Plan: ${inputState.productName || "Product"}
**Platform**: ${platformAd.platformName}
**Campaign Goal**: ${inputState.campaignGoal}
**Target Audience**: ${inputState.targetAudience || "General Target"}
**Tone / Creative Style**: ${inputState.toneStyle}

---

## 🚀 SCROLL-STOPPER HOOKS DECK
Analyze these native pattern-interrupt hooks to spark instant user attention:

${platformAd.hooks.map((hook, i) => `### Hook ${i + 1}: [${hook.type}]
* "${hook.text}"
* **Conversion Potential Rating**: ${hook.conversionRating}/100
`).join("\n")}

---

## 🎬 30-SECOND DIRECTOR VIDEO SCRIPT
*Concept Title*: **${platformAd.videoScript.title}**
*Duration*: ${platformAd.videoScript.duration} seconds

| Scene | Section | Visual Directions | Spoken Script / Audio Cue | Screen Text Overlay |
| :---: | :--- | :--- | :--- | :--- |
${platformAd.videoScript.scenes.map((scene) => `| ${scene.id} | ${scene.section} | ${scene.visual} | ${scene.audio} | "${scene.textOverlay}" |`).join("\n")}

---

## 📱 HIGH-CONVERTING SOCIAL CAPTION & COPY
\`\`\`text
${platformAd.socialPost.caption}
\`\`\`

**Optimized Hashtags**:
${platformAd.socialPost.hashtags.join(", ")}

---

## 🎯 PLATFORM-SPECIFIC TARGETING SUGGESTIONS
${platformAd.targetingTips.map((tip) => `* ${tip}`).join("\n")}

---
*Created using AdRemix AI Startup Architecture. Zero-Trust Direct-Response Framework.*
`;

    const blob = new Blob([mdContent.trim()], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `AdRemix_AI_${platformAd.platformName}_Campaign.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Map Lucide icons dynamically for topics
  const getTopicIcon = (name: string, active: boolean) => {
    const baseClass = `w-6 h-6 transition-colors duration-300 ${active ? "text-emerald-400" : "text-slate-400"}`;
    switch (name) {
      case "Layout": return <Layout className={baseClass} />;
      case "Server": return <Server className={baseClass} />;
      case "Database": return <Database className={baseClass} />;
      case "Cloud": return <Cloud className={baseClass} />;
      case "ShieldAlert": return <ShieldAlert className={baseClass} />;
      case "Cpu": return <Cpu className={baseClass} />;
      case "Lock": return <Lock className={baseClass} />;
      case "FolderGit": return <FolderGit className={baseClass} />;
      case "Milestone": return <Milestone className={baseClass} />;
      default: return <BookOpen className={baseClass} />;
    }
  };

  const selectedTopic = architectureTopics.find((t) => t.id === selectedTopicId);

  const currentPlatforms = (adResult?.isABTest && activeVariation === "B")
    ? (adResult.platformsB || adResult.platforms)
    : (adResult?.platforms || []);

  return (
    <div id="adremix-platform-root" className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-400">
      
      {/* HEADER BAR */}
      <header id="adremix-header" className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div id="adremix-logo-badge" className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/10">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                  AdRemix AI
                </span>
                <span className="text-[10px] uppercase tracking-widest font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-emerald-400 font-semibold shadow-inner">
                  v1.0.0 Stable
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full-Stack Growth Ad Transformer Platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* VIEWS CONTROLS */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
              <button
                id="view-playground-btn"
                onClick={() => setActiveView("playground")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeView === "playground" 
                    ? "bg-slate-800 text-emerald-400 shadow-md border-t border-slate-700" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Interactive MVP Sandbox
              </button>
              <button
                id="view-blueprint-btn"
                onClick={() => setActiveView("blueprint")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeView === "blueprint" 
                    ? "bg-slate-800 text-emerald-400 shadow-md border-t border-slate-700" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                CTO Architecture Blueprint
              </button>
              <button
                id="view-investors-btn"
                onClick={() => setActiveView("investors")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeView === "investors" 
                    ? "bg-slate-800 text-emerald-400 shadow-md border-t border-slate-700 font-bold" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                للمستثمرين (Investors Desk)
              </button>
              <button
                id="view-scalability-btn"
                onClick={() => setActiveView("scalability")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeView === "scalability" 
                    ? "bg-slate-800 text-emerald-400 shadow-md border-t border-slate-700 font-bold" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                بوابة التطوير والمستقبل (Developer & Future Hub)
              </button>
            </div>

            {/* FIREBASE AUTH COMPONENT */}
            <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
              {isAuthLoading ? (
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
              ) : user ? (
                <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-1.5 pr-3.5 rounded-xl">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-lg border border-emerald-500/30 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400 uppercase">
                      {user.email?.slice(0, 2) || "US"}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-[11px] font-bold text-slate-200 leading-tight">
                      {user.displayName || "Active User"}
                    </p>
                    <p className="text-[9px] font-mono text-emerald-400/80 leading-tight">
                      Cloud Account synced
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    title="Sign Out"
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-950 rounded-lg transition-colors border border-transparent hover:border-slate-800 ml-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 text-xs font-bold tracking-wide transition-all shadow-inner cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Cloud Backup (Sign In)
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* SUB-HEADER CONSOLE STATUS */}
      <div className="bg-slate-900/30 border-b border-slate-800/60 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Architecture Node: <span className="text-slate-300">Cloud Run Service</span></span>
          </div>
          <div className="flex items-center gap-4">
            <span>Model: <span className="text-emerald-400 font-bold">gemini-3.5-flash</span></span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline">Telemetry Agent: <span className="text-slate-300">aistudio-build</span></span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {/* VIEW 1: INTERACTIVE BLUEPRINT */}
        {activeView === "blueprint" && (
          <motion.div
            key="blueprint-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="border border-emerald-500/10 bg-emerald-950/10 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Compass className="w-6 h-6 text-emerald-400" />
                  Full-Stack Technical Architecture Specifications
                </h1>
                <p className="text-sm text-slate-400">
                  Detailed system design, database blueprints, zero-trust security rules, and product roadmap compiled by the Startup CTO.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs font-mono text-slate-400">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Verified: Standard Compliance</span>
              </div>
            </div>

            {/* BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {architectureTopics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className="group relative bg-slate-900 border border-slate-800/80 rounded-2xl p-6 cursor-pointer overflow-hidden transition-all hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-950/10"
                >
                  {/* Decorative background number */}
                  <span className="absolute right-4 top-2 text-8xl font-black text-slate-800/15 pointer-events-none group-hover:text-emerald-500/5 select-none transition-all duration-300">
                    {index + 1}
                  </span>

                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl group-hover:border-emerald-500/20 transition-all duration-300">
                      {getTopicIcon(topic.iconName, false)}
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                      Spec {index + 1}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2">
                    <h3 className="font-extrabold text-lg text-slate-100 group-hover:text-emerald-400 transition-colors duration-300">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {topic.shortDesc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 group-hover:text-emerald-400 transition-colors duration-300">
                    <span className="font-medium">Explore Architecture Spec</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* DETAILED BLUEPRINT MODAL */}
            <AnimatePresence>
              {selectedTopicId && selectedTopic && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
                  >
                    {/* Modal Header */}
                    <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                          {getTopicIcon(selectedTopic.iconName, true)}
                        </div>
                        <div>
                          <h2 className="text-xl font-extrabold text-white">{selectedTopic.title}</h2>
                          <p className="text-xs text-slate-400 mt-0.5">{selectedTopic.shortDesc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedTopicId(null)}
                        className="text-slate-400 hover:text-slate-100 bg-slate-900 hover:bg-slate-800/60 p-2 rounded-xl transition-all border border-slate-800 text-xs font-semibold"
                      >
                        ✕ Close
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 overflow-y-auto space-y-6 max-h-[60vh] text-slate-300 leading-relaxed text-sm">
                      
                      {/* Detailed Description */}
                      <div className="space-y-2">
                        <h4 className="text-xs uppercase tracking-widest font-mono text-emerald-400 font-bold">Deep Dive Analysis</h4>
                        <p>{selectedTopic.details}</p>
                      </div>

                      {/* Bullet Highlights */}
                      <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-widest font-mono text-emerald-400 font-bold">Architecture Highlights</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedTopic.highlights.map((highlight, hIdx) => (
                            <div key={hIdx} className="flex items-start gap-2.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="text-xs text-slate-300">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technical Blueprint Visual Diagram */}
                      {selectedTopic.diagramText && (
                        <div className="space-y-3">
                          <h4 className="text-xs uppercase tracking-widest font-mono text-emerald-400 font-bold">Technical Asset Diagram</h4>
                          <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto text-xs font-mono text-emerald-400/90 whitespace-pre leading-5">
                            {selectedTopic.diagramText}
                          </pre>
                        </div>
                      )}

                      {/* Code Sample / Config Blueprint file */}
                      {selectedTopic.codeSnippet && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs uppercase tracking-widest font-mono text-emerald-400 font-bold">Recommended Source Code Structure</h4>
                            <span className="text-xs font-mono text-slate-500">{selectedTopic.codeSnippet.fileName}</span>
                          </div>
                          <div className="relative group">
                            <button
                              onClick={() => handleCopyText(selectedTopic.codeSnippet!.code, "spec_code_" + selectedTopic.id)}
                              className="absolute right-3 top-3 z-10 text-xs font-mono bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm"
                            >
                              {copiedStates["spec_code_" + selectedTopic.id] ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                                  Copy Code
                                </>
                              )}
                            </button>
                            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-5 overflow-x-auto text-xs font-mono text-slate-300 leading-5">
                              <code>{selectedTopic.codeSnippet.code}</code>
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Modal Footer */}
                    <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <span>AdRemix AI System Blueprints &middot; Confidential Startup IP</span>
                      <button
                        onClick={() => setSelectedTopicId(null)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 rounded-lg transition-all"
                      >
                        Understood, Continue
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* VIEW 2: INTERACTIVE PLAYGROUND (MVP CLIENT) */}
        {activeView === "playground" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT SIDE: CREATIVE PARAMS CONTROL FORM (5 columns) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Campaign Inputs Panel */}
              <div id="campaign-params-panel" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <h2 className="font-extrabold text-lg text-white">Remix Creator Engine</h2>
                  </div>
                  <button
                    onClick={handleResetForm}
                    className="text-[10px] font-mono text-slate-400 hover:text-slate-200 uppercase tracking-wider bg-slate-950 border border-slate-800 px-2 py-1 rounded-md transition-all"
                  >
                    Clear Form
                  </button>
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                  {/* Product Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest font-mono text-slate-400 font-bold">Product / SaaS Name</label>
                    <input
                      type="text"
                      placeholder="e.g. EcoFlask Pro, SkillSync SaaS"
                      value={inputState.productName}
                      onChange={(e) => setInputState((prev) => ({ ...prev, productName: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors duration-200"
                    />
                  </div>

                  {/* Product Details Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest font-mono text-slate-400 font-bold">Core Features & Value Proposition</label>
                    <textarea
                      placeholder="Describe what your product does, its key benefits, pain points it solves, and why people love it..."
                      rows={5}
                      value={inputState.productDescription}
                      onChange={(e) => setInputState((prev) => ({ ...prev, productDescription: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors duration-200 resize-none leading-relaxed"
                    />
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>Provide high-quality variables for optimized AI mapping.</span>
                      <span>{inputState.productDescription.length} chars</span>
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest font-mono text-slate-400 font-bold">Target Audience Demographic</label>
                    <input
                      type="text"
                      placeholder="e.g. Gen Z skincare buyers, Busy remote programmers"
                      value={inputState.targetAudience}
                      onChange={(e) => setInputState((prev) => ({ ...prev, targetAudience: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors duration-200"
                    />
                  </div>

                  {/* Campaign Goal */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest font-mono text-slate-400 font-bold">Primary Campaign Goal</label>
                    <select
                      value={inputState.campaignGoal}
                      onChange={(e) => setInputState((prev) => ({ ...prev, campaignGoal: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors duration-200"
                    >
                      <option>Direct conversions & Sales (Shopify/Woo)</option>
                      <option>App Installs & Software Signups</option>
                      <option>High-quality Lead Generation</option>
                      <option>Aesthetic Brand Building & Awareness</option>
                    </select>
                  </div>

                  {/* Tone / Creative Direction */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-widest font-mono text-slate-400 font-bold">Tone & Style Direction</label>
                    <select
                      value={inputState.toneStyle}
                      onChange={(e) => setInputState((prev) => ({ ...prev, toneStyle: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors duration-200"
                    >
                      <option>Authentic UGC, Energetic, Problem-Solution</option>
                      <option>Educational, Stat-Driven, Authority Tone</option>
                      <option>High-Energy, Hype Trend, Fast-paced cuts</option>
                      <option>Minimalist, Aesthetic, Premium Luxury feel</option>
                      <option>Humorous, Meme-y, Pattern Interrupt focus</option>
                    </select>
                  </div>

                  {/* Platforms Choice */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-mono text-slate-400 font-bold block">Ad Platforms Optimization</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {["tiktok", "instagram", "youtube", "facebook"].map((plat) => {
                        const active = inputState.platforms.includes(plat);
                        const label = plat.charAt(0).toUpperCase() + plat.slice(1);
                        return (
                          <button
                            key={plat}
                            type="button"
                            onClick={() => handleTogglePlatform(plat)}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-semibold tracking-wide transition-all ${
                              active 
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300 hover:bg-slate-900"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${active ? "bg-emerald-400 shadow-lg shadow-emerald-400" : "bg-slate-700"}`}></span>
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* A/B Testing Mode Toggle */}
                  <div className="pt-3 border-t border-slate-800/60">
                    <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-500/30 transition-all">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg border transition-all ${
                          inputState.abTestMode 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : "bg-slate-900 border-slate-800 text-slate-500"
                        }`}>
                          <GitCompare className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-white block">A/B Testing Mode</span>
                          <span className="text-[10px] text-slate-400 block leading-relaxed max-w-[190px] sm:max-w-none">
                            Generate two distinct hook angles and script flows to test performance differences.
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setInputState((prev) => ({ ...prev, abTestMode: !prev.abTestMode }))}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          inputState.abTestMode ? "bg-emerald-500" : "bg-slate-800"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            inputState.abTestMode ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transform Action Button */}
                <button
                  type="button"
                  disabled={isLoading || !inputState.productName || !inputState.productDescription}
                  onClick={handleGenerateAds}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
                      Remixing Ad Concepts...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      Transform Product details into Viral Ads
                    </>
                  )}
                </button>
              </div>

              {/* SAVED HISTORY BLOCK */}
              {savedCampaigns.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <h3 className="font-bold text-sm text-slate-300 flex items-center gap-1.5 uppercase tracking-wide">
                    <Bookmark className="w-4 h-4 text-emerald-400" />
                    History & Saved Campaigns
                  </h3>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto">
                    {savedCampaigns.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleLoadSavedCampaign(item)}
                        className="group flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/20 hover:bg-slate-900/40 cursor-pointer transition-all"
                      >
                        <div className="space-y-1 max-w-[80%]">
                          <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">{item.input.productName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{item.timestamp} &middot; {item.input.platforms.join(", ")}</p>
                        </div>
                        <button
                          onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDE: BEAUTIFUL AD RENDERER / LOADER (7 columns) */}
            <div className="lg:col-span-7 space-y-6">

              {/* PROGRESS LOADER SCREEN */}
              {isLoading && (
                <div className="bg-slate-900 border border-emerald-500/10 rounded-2xl p-8 shadow-2xl min-h-[480px] flex flex-col justify-center items-center space-y-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-slate-950">
                    <motion.div 
                      className="h-full bg-emerald-400 shadow-md shadow-emerald-400" 
                      initial={{ width: "0%" }}
                      animate={{ width: `${loaderProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  <div className="relative">
                    <div className="p-5 bg-slate-950 border border-slate-800 rounded-full animate-pulse relative">
                      <Cpu className="w-10 h-10 text-emerald-400 animate-spin duration-1000" />
                    </div>
                  </div>

                  <div className="space-y-2 max-w-md">
                    <h3 className="text-lg font-bold text-white tracking-tight">Startup Growth Proxy Active</h3>
                    <p className="text-xs text-emerald-400 font-mono h-8 flex items-center justify-center">
                      {GROWTH_HACK_TIPS[loaderTipIndex]}
                    </p>
                  </div>

                  <div className="w-full max-w-sm space-y-2">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>API: POST /api/transform</span>
                      <span>{loaderProgress}% Complete</span>
                    </div>
                  </div>
                </div>
              )}

              {/* EXPLAINER DEFAULT VIEW (IF NO RESULT / LOADING) */}
              {!isLoading && !adResult && !apiError && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center min-h-[450px] flex flex-col justify-center items-center space-y-5">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-emerald-400">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h3 className="font-extrabold text-lg text-white">Generate High-Converting Ad Formulates</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Enter your product details on the left, choose your target platform parameters, and generate high-converting short-form video hooks, timelines, captions, and targeting suggestions.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setInputState(defaultCampaignInput);
                      setAdResult(defaultCampaignOutput);
                    }}
                    className="text-xs font-semibold bg-slate-800 border border-slate-700 text-emerald-400 hover:text-emerald-300 hover:bg-slate-700 px-4 py-2.5 rounded-xl transition-all"
                  >
                    Load EcoFlask Pro Demo
                  </button>
                </div>
              )}

              {/* ERROR STATE */}
              {apiError && (
                <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-8 text-center min-h-[400px] flex flex-col justify-center items-center space-y-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-full text-red-400">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h3 className="font-bold text-lg text-white">Architecture Verification Error</h3>
                    <p className="text-xs font-mono text-red-400 bg-slate-950 border border-slate-850 p-4 rounded-xl leading-relaxed select-all">
                      {apiError}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Please ensure your <span className="font-mono text-slate-300">GEMINI_API_KEY</span> is set securely inside the Secrets panel.
                  </p>
                </div>
              )}

              {/* CAMPAIGN OUTPUTS CARD */}
              {adResult && !isLoading && !apiError && (
                <div className="space-y-6">

                  {/* A/B COMPARISON STRATEGY BOARD */}
                  {adResult.isABTest && adResult.abComparison && (
                    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
                      <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
                        <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                          <GitCompare className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">A/B Testing & Creative Strategy Report</h3>
                          <p className="text-[10px] text-slate-500">AI-powered breakdown of variant differentiators and audience appeal</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Hook Strategy Card */}
                        <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2.5 hover:border-emerald-500/10 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <h4 className="text-xs uppercase tracking-widest font-mono text-slate-400 font-extrabold">Hook Angle Comparison</h4>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            {adResult.abComparison.hookStrategyComparison}
                          </p>
                        </div>

                        {/* Script Flow Card */}
                        <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2.5 hover:border-emerald-500/10 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                            <h4 className="text-xs uppercase tracking-widest font-mono text-slate-400 font-extrabold">Script Flow Comparison</h4>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            {adResult.abComparison.scriptFlowComparison}
                          </p>
                        </div>
                      </div>

                      {/* Winning Hypothesis Banner */}
                      <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-3.5 shadow-inner">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg shrink-0">
                          <Sparkles className="w-4 h-4 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-extrabold">AI Predictive Winning Hypothesis</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {adResult.abComparison.winningHypothesis}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Outer Control Frame */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-4">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md font-semibold">
                          Active Campaign Assets
                        </span>
                        <h2 className="font-extrabold text-xl text-white mt-2">
                          {inputState.productName || "Direct Response Campaign"}
                        </h2>
                      </div>
                      
                      {/* Markdown Downloader */}
                      {currentPlatforms.find((p) => p.platformName.toLowerCase() === activePlatformTab.toLowerCase()) && (
                        <button
                          onClick={() => handleExportMarkdown(currentPlatforms.find((p) => p.platformName.toLowerCase() === activePlatformTab.toLowerCase())!)}
                          className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all self-start cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download Campaign (.md)
                        </button>
                      )}
                    </div>

                    {/* A/B Testing Variation Selector */}
                    {adResult.isABTest && (
                      <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-inner">
                        <div className="flex items-center gap-2.5 self-start md:self-auto">
                          <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg animate-pulse">
                            <GitCompare className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-emerald-400 block uppercase tracking-wider font-extrabold">A/B Testing Active</span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">Toggle distinct hooks and visual scripts:</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800 w-full md:w-auto">
                          <button
                            type="button"
                            onClick={() => setActiveVariation("A")}
                            className={`flex-1 md:flex-initial px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                              activeVariation === "A" 
                                ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold" 
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            Variation A: Value-First
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveVariation("B")}
                            className={`flex-1 md:flex-initial px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                              activeVariation === "B" 
                                ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold" 
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            Variation B: Storytelling UGC
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Platform Selector Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto bg-slate-950 p-1 rounded-xl border border-slate-800/60">
                      {adResult.platforms.map((plat) => {
                        const active = activePlatformTab.toLowerCase() === plat.platformName.toLowerCase();
                        let icon = <Tv className="w-3.5 h-3.5" />;
                        if (plat.platformName.toLowerCase().includes("tiktok")) icon = <Tv className="w-3.5 h-3.5" />;
                        else if (plat.platformName.toLowerCase().includes("instagram")) icon = <InstaIcon className="w-3.5 h-3.5" />;
                        else if (plat.platformName.toLowerCase().includes("youtube")) icon = <YtIcon className="w-3.5 h-3.5" />;
                        else if (plat.platformName.toLowerCase().includes("facebook")) icon = <FaceIcon className="w-3.5 h-3.5" />;

                        return (
                          <button
                            key={plat.platformName}
                            onClick={() => setActivePlatformTab(plat.platformName)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                              active 
                                ? "bg-slate-900 text-emerald-400 border border-slate-800" 
                                : "text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            {icon}
                            {plat.platformName}
                          </button>
                        );
                      })}
                    </div>

                    {/* PLATFORM SPECIFIC DATA DISPLAY */}
                    {currentPlatforms
                      .filter((p) => p.platformName.toLowerCase() === activePlatformTab.toLowerCase())
                      .map((pAd) => (
                        <div key={pAd.platformName} className="space-y-6">

                          {/* 1. HOOK DECK CARDS */}
                          <div className="space-y-3">
                            <h3 className="text-xs uppercase tracking-widest font-mono text-slate-400 font-bold flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-emerald-400" />
                              Scroll-Stopper Hook Options
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {pAd.hooks.map((hook, hIdx) => (
                                <div key={hIdx} className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl flex flex-col justify-between space-y-3 hover:border-emerald-500/20 transition-colors">
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[9px] font-mono bg-slate-900 border border-slate-800 text-emerald-400 px-1.5 py-0.5 rounded-md leading-3">
                                        Hook {hIdx + 1}
                                      </span>
                                      <button
                                        onClick={() => handleCopyText(hook.text, `hook_${activePlatformTab}_${hIdx}`)}
                                        className="text-slate-500 hover:text-slate-300 p-1"
                                      >
                                        {copiedStates[`hook_${activePlatformTab}_${hIdx}`] ? (
                                          <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    </div>
                                    <p className="text-xs font-medium text-slate-200 leading-relaxed italic">
                                      "{hook.text}"
                                    </p>
                                  </div>

                                  <div className="space-y-2 pt-2 border-t border-slate-900">
                                    <span className="text-[10px] font-mono text-slate-500 block truncate">
                                      Type: {hook.type}
                                    </span>
                                    {/* Conversion Potential Rating */}
                                    <div className="space-y-1">
                                      <div className="flex justify-between items-center text-[9px] font-mono">
                                        <span className="text-slate-500">Conv. Potential</span>
                                        <span className="text-emerald-400 font-semibold">{hook.conversionRating}%</span>
                                      </div>
                                      <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-emerald-400 rounded-full" 
                                          style={{ width: `${hook.conversionRating}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 2. DIRECTOR TIMELINE SCRIPT */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xs uppercase tracking-widest font-mono text-slate-400 font-bold flex items-center gap-1.5">
                                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                                Scene-by-Scene Script Timeline
                              </h3>
                              <span className="text-xs font-mono text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                Concept: {pAd.videoScript.title} &middot; {pAd.videoScript.duration}s
                              </span>
                            </div>

                            <div className="space-y-3 relative border-l border-slate-800 ml-3 pl-5">
                              {pAd.videoScript.scenes.map((scene) => (
                                <div key={scene.id} className="relative space-y-2 bg-slate-950 border border-slate-800/80 p-4 rounded-xl">
                                  {/* Timeline Node dot */}
                                  <div className="absolute -left-[26px] top-4 bg-slate-900 border-2 border-emerald-400/80 w-3 h-3 rounded-full shadow-md" />
                                  
                                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                                    <span className="text-xs font-bold text-emerald-400 font-mono">
                                      {scene.section}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-500">
                                      Scene {scene.id}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-2 text-slate-300">
                                    <div className="space-y-1">
                                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Visual Direction</span>
                                      <p className="leading-relaxed text-slate-400">{scene.visual}</p>
                                    </div>
                                    <div className="space-y-1 bg-slate-900/40 p-2.5 border border-slate-900 rounded-lg">
                                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Voiceover / Audio Cue</span>
                                      <p className="leading-relaxed italic text-slate-200">"{scene.audio}"</p>
                                    </div>
                                  </div>

                                  <div className="pt-2 border-t border-slate-900 flex items-center gap-2 text-xs">
                                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Text Overlay:</span>
                                    <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md font-mono text-emerald-400 text-[11px]">
                                      "{scene.textOverlay}"
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 3. CAPTION PREVIEW (MOCK MOBILE VIEW) */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            
                            {/* Copy caption (5 cols) */}
                            <div className="md:col-span-7 space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="text-xs uppercase tracking-widest font-mono text-slate-400 font-bold">
                                  Primary Caption Text
                                </h3>
                                <button
                                  onClick={() => handleCopyText(pAd.socialPost.caption, "caption_" + activePlatformTab)}
                                  className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedStates["caption_" + activePlatformTab] ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                                      Copied Caption!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      Copy Caption
                                    </>
                                  )}
                                </button>
                              </div>
                              <textarea
                                readOnly
                                rows={8}
                                value={pAd.socialPost.caption}
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl p-4 text-xs text-slate-300 leading-relaxed font-mono resize-none focus:outline-none"
                              />
                              
                              {/* Hashtags display */}
                              <div className="space-y-1.5">
                                <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500 block">Optimized Tags</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {pAd.socialPost.hashtags.map((tag) => (
                                    <span key={tag} className="text-xs bg-slate-950 border border-slate-850 px-2 py-1 rounded-md text-emerald-400/90 font-mono">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Mobile smartphone Mockup (5 cols) */}
                            <div className="md:col-span-5 space-y-3">
                              <h3 className="text-xs uppercase tracking-widest font-mono text-slate-400 font-bold block text-center md:text-left">
                                Smartphone Ad Mockup
                              </h3>
                              <div className="bg-slate-950 border-4 border-slate-800 rounded-[32px] overflow-hidden shadow-2xl relative w-full max-w-[260px] mx-auto min-h-[380px] flex flex-col justify-between">
                                {/* Speaker cutout */}
                                <div className="w-24 h-4 bg-slate-800 mx-auto rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 z-10" />

                                {/* Mock Video Body */}
                                <div className="bg-gradient-to-b from-slate-900 to-slate-950 flex-1 flex flex-col justify-center items-center p-4 relative pt-10">
                                  {/* Decorative play button */}
                                  <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-full shadow-lg text-emerald-400 opacity-80 backdrop-blur-sm">
                                    <Tv className="w-6 h-6" />
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-500 mt-2 block uppercase tracking-wider">Simulated Preview</span>

                                  {/* On screen overlay simulated */}
                                  {pAd.videoScript.scenes[0] && (
                                    <div className="absolute bottom-16 left-3 right-3 bg-slate-900/90 border border-emerald-500/20 p-2 rounded-lg text-center backdrop-blur-md">
                                      <p className="text-[10px] font-mono text-emerald-400 font-extrabold leading-relaxed uppercase">
                                        "{pAd.videoScript.scenes[0].textOverlay}"
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Mock Caption Footer */}
                                <div className="bg-slate-900/95 border-t border-slate-850 p-3 space-y-1.5 text-left">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                      <Sparkles className="w-2.5 h-2.5 text-slate-950" />
                                    </div>
                                    <span className="text-[10px] font-bold text-white font-mono">adremix.agency</span>
                                    <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded font-semibold uppercase tracking-widest leading-3">Sponsored</span>
                                  </div>
                                  <p className="text-[9px] text-slate-400 line-clamp-2 leading-relaxed">
                                    {pAd.socialPost.caption}
                                  </p>
                                  <div className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-center font-extrabold text-[9px] uppercase py-1.5 rounded-lg transition-colors cursor-pointer">
                                    Learn More / Claim Offer
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 4. PLATFORM TARGETING SUGGESTIONS */}
                          <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-2">
                            <span className="text-xs font-mono text-slate-400 block uppercase font-bold">
                              Platform Targeting Recommendations
                            </span>
                            <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
                              {pAd.targetingTips.map((tip, idx) => (
                                <li key={idx} className="leading-relaxed">
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>

                        </div>
                      ))}
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* VIEW 3: INTERACTIVE INVESTORS PORTAL (للمستثمرين) */}
        {activeView === "investors" && (
          <motion.div
            key="investors-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 text-right"
            dir="rtl"
          >
            {/* Header / Vision Banner */}
            <div className="bg-gradient-to-r from-emerald-950/20 via-slate-900 to-teal-950/20 border border-emerald-500/10 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-mono bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-emerald-400 font-extrabold shadow-inner inline-block">
                  بوابة المستثمرين &middot; Pitch Portal
                </span>
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-emerald-400 shrink-0 ml-1" />
                  منصة عرض الاستثمار في مشروع Adremix AI
                </h1>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  <strong>الرؤية:</strong> {investorsDeckData.vision}
                </p>
              </div>
              <button
                onClick={handleCopyInvestorDeckScript}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10 shrink-0 self-stretch md:self-auto justify-center cursor-pointer"
              >
                {copiedStates["investor_deck_script_full"] ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    تم نسخ النص بالكامل!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-950" />
                    نسخ النص الكامل للعرض 📋
                  </>
                )}
              </button>
            </div>

            {/* Quick Metrics KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 hover:border-emerald-500/20 transition-all shadow-md">
                <span className="text-[10px] text-slate-500 font-mono block uppercase tracking-wider">مستهدف جولة التمويل</span>
                <p className="text-2xl font-black text-emerald-400 tracking-tight">{investorsDeckData.targetAmount}</p>
                <span className="text-[10px] text-slate-400 block">جولة ملاكية أولية مخصصة للنمو السريع</span>
              </div>
              
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 hover:border-emerald-500/20 transition-all shadow-md">
                <span className="text-[10px] text-slate-500 font-mono block uppercase tracking-wider">الحد الأدنى للمشاركة</span>
                <p className="text-2xl font-black text-white tracking-tight">{investorsDeckData.minimumInvestment}</p>
                <span className="text-[10px] text-slate-400 block">مفتوح للمستثمرين المؤهلين والصناديق</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 hover:border-emerald-500/20 transition-all shadow-md">
                <span className="text-[10px] text-slate-500 font-mono block uppercase tracking-wider">النموذج التقني الأساسي</span>
                <p className="text-sm font-bold text-teal-400 leading-snug">Gemini AI + Firebase</p>
                <span className="text-[10px] text-slate-400 block">Firestore DB + Google auth جاهز ومثبت</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 hover:border-emerald-500/20 transition-all shadow-md">
                <span className="text-[10px] text-slate-500 font-mono block uppercase tracking-wider">طبيعة نموذج العمل</span>
                <p className="text-sm font-bold text-white leading-snug">اشتراكات SaaS شهرية مكررة</p>
                <span className="text-[10px] text-slate-400 block">Starter ($29) / Pro ($79) / Agency ($199)</span>
              </div>
            </div>

            {/* Main Interactive Deck Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* SIDEBAR TABS: Right col (4 cols) on desktop */}
              <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl space-y-2">
                <h3 className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-400 px-3 py-2 border-b border-slate-800/60 block">
                  محاور العرض الاستثماري (8 شرائح)
                </h3>
                <div className="flex flex-col gap-1 max-h-[480px] overflow-y-auto pr-1">
                  {[
                    { key: "problem", label: "1. المشكلة (The Problem)", icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 ml-2" /> },
                    { key: "solution", label: "2. الحل (The Solution)", icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400 ml-2" /> },
                    { key: "market", label: "3. السوق المستهدف (Market)", icon: <TrendingUp className="w-3.5 h-3.5 text-teal-400 ml-2" /> },
                    { key: "techStack", label: "4. التقنيات (Tech Stack)", icon: <Cpu className="w-3.5 h-3.5 text-blue-400 ml-2" /> },
                    { key: "revenueModel", label: "5. نموذج الإيرادات (Revenue)", icon: <Coins className="w-3.5 h-3.5 text-emerald-400 ml-2" /> },
                    { key: "team", label: "6. الفريق المطلوب (Team)", icon: <Users className="w-3.5 h-3.5 text-purple-400 ml-2" /> },
                    { key: "roadmap", label: "7. خريطة الطريق (Roadmap)", icon: <Milestone className="w-3.5 h-3.5 text-orange-400 ml-2" /> },
                    { key: "resources", label: "8. الموارد المتاحة (Resources)", icon: <PieChart className="w-3.5 h-3.5 text-pink-400 ml-2" /> }
                  ].map((tab) => {
                    const isActive = activeInvestorSlide === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveInvestorSlide(tab.key)}
                        className={`flex items-center text-right px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                          isActive 
                            ? "bg-slate-800 border border-emerald-500/30 text-emerald-400 font-bold shadow-md" 
                            : "bg-transparent border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                        }`}
                      >
                        {tab.icon}
                        <span className="flex-1 text-right">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SLIDE CANVAS VIEW: Left col (8 cols) on desktop */}
              <div className="lg:col-span-8 space-y-6">
                {(() => {
                  const slide = investorsDeckData.sections[activeInvestorSlide as keyof typeof investorsDeckData.sections];
                  if (!slide) return null;
                  return (
                    <motion.div
                      key={activeInvestorSlide}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6"
                    >
                      {/* Slide Header */}
                      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 ml-1">
                          {activeInvestorSlide === "problem" && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                          {activeInvestorSlide === "solution" && <Sparkles className="w-5 h-5 text-emerald-400" />}
                          {activeInvestorSlide === "market" && <TrendingUp className="w-5 h-5 text-teal-400" />}
                          {activeInvestorSlide === "techStack" && <Cpu className="w-5 h-5 text-blue-400" />}
                          {activeInvestorSlide === "revenueModel" && <Coins className="w-5 h-5 text-emerald-400" />}
                          {activeInvestorSlide === "team" && <Users className="w-5 h-5 text-purple-400" />}
                          {activeInvestorSlide === "roadmap" && <Milestone className="w-5 h-5 text-orange-400" />}
                          {activeInvestorSlide === "resources" && <PieChart className="w-5 h-5 text-pink-400" />}
                        </div>
                        <div>
                          <h2 className="text-lg font-black text-white">{slide.title}</h2>
                          <p className="text-xs text-slate-400 mt-0.5">{slide.subtitle}</p>
                        </div>
                      </div>

                      {/* Interactive Visual/Chart component for certain slides */}
                      {activeInvestorSlide === "resources" && (
                        <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3.5">
                          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-extrabold block">خريطة توزيع الموارد التمويلية المقترحة</span>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-300">أبحاث وتطوير المنتج والتقنية والـ AI</span>
                                <span className="text-emerald-400 font-bold">45%</span>
                              </div>
                              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "45%" }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-300">التسويق وجلب المتاجر والاستحواذ</span>
                                <span className="text-teal-400 font-bold">35%</span>
                              </div>
                              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-teal-400 rounded-full" style={{ width: "35%" }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-300">خدمات الاستضافة السحابية والتشغيل والتراخيص</span>
                                <span className="text-purple-400 font-bold">20%</span>
                              </div>
                              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full" style={{ width: "20%" }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeInvestorSlide === "market" && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                          <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl text-center">
                            <span className="text-[10px] text-slate-500 block font-mono">حجم الإنفاق الإعلاني السنوي</span>
                            <span className="text-xl font-extrabold text-teal-400 block mt-1">6 مليار دولار</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">في الخليج العربي والشرق الأوسط</span>
                          </div>
                          <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl text-center">
                            <span className="text-[10px] text-slate-500 block font-mono">المستهدف الأولي (SOM)</span>
                            <span className="text-xl font-extrabold text-emerald-400 block mt-1">150,000+ متجر</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">على سلة وزد وشوبيفاي محلياً</span>
                          </div>
                          <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl text-center">
                            <span className="text-[10px] text-slate-500 block font-mono">النمو السنوي المركب</span>
                            <span className="text-xl font-extrabold text-purple-400 block mt-1">+20% سنوياً</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">قطاع التجارة الإلكترونية الواعد</span>
                          </div>
                        </div>
                      )}

                      {/* Content Bullets */}
                      {slide.bullets && (
                        <div className="space-y-4">
                          {slide.bullets.map((b, index) => (
                            <div key={index} className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-850 hover:border-emerald-500/10 transition-colors">
                              <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                                {index + 1}
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-xs font-bold text-slate-200">{b.title}</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tech highlight badge for Tech Stack Slide */}
                      {activeInvestorSlide === "techStack" && (
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-3.5 shadow-inner">
                          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                            <Cpu className="w-4 h-4 animate-spin" />
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            تم دمج هذه التقنيات وتأكيد فعاليتها بالكامل داخل المشروع الحالي، مما يثبت جاهزية النموذج الأولي (MVP) للعمل والإنتاج السريع مباشرة.
                          </p>
                        </div>
                      )}

                    </motion.div>
                  );
                })()}
              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 4: SCALABILITY & DEVELOPMENT GATEWAY (بوابة التطوير والمستقبل) */}
        {activeView === "scalability" && (
          <motion.div
            key="scalability-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 text-right"
            dir="rtl"
          >
            {/* Header / Vision Banner */}
            <div className="bg-gradient-to-r from-emerald-950/20 via-slate-900 to-teal-950/20 border border-emerald-500/10 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-emerald-400" />
                  بوابة المطورين والتوسّع المستقبلي (SaaS Scalability & Prompts Hub)
                </h1>
                <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                  هذا القسم مخصص للفرق التقنية ومطوري الذكاء الاصطناعي لضمان قابلة توسع النظام مستقبلاً. هنا يمكنك تفكيك وتعديل واختبار الموجهات (Prompts) الفنية، واستعراض خارطة تطور المنتج، ونموذج تسعير النظام كخدمة (SaaS).
                </p>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs font-mono text-emerald-400">
                <FileCode className="w-4 h-4 animate-pulse" />
                <span>Engine Version: v1.0.0 Stable</span>
              </div>
            </div>

            {/* PRODUCT VISION & CORE COMPETITIVE MOATS */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Product Vision Side */}
              <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-sm text-white">رؤية المنتج الأساسية</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {productRoadmap.vision}
                </p>
                <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">مسؤول المنتج:</span>
                    <span className="text-slate-300 font-medium">{productRoadmap.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">آخر تحديث:</span>
                    <span className="text-slate-300 font-mono">{productRoadmap.lastUpdated}</span>
                  </div>
                </div>
              </div>

              {/* Competitive Moats */}
              <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-sm text-white">{productRoadmap.competitiveAdvantage.moat}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {productRoadmap.competitiveAdvantage.points.map((pt: any, idx: number) => (
                    <div key={idx} className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2 hover:border-emerald-500/20 transition-all duration-300">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <span className="w-5 h-5 rounded bg-emerald-500/10 text-xs font-extrabold flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-xs text-slate-100">{pt.name}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {pt.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SEPARATOR: PROMPT SANDBOX */}
            <div className="border-t border-slate-900 my-8"></div>

            {/* INTERACTIVE PROMPT ENGINE SANDBOX */}
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  دليل ومحرر موجهات الذكاء الاصطناعي (Prompt Engineer Playground)
                </h2>
                <p className="text-xs text-slate-400">
                  قم باختيار موجه من الفهرس الفني المعتمد للمنصة، ثم عبّئ المتغيرات لتجميع واختبار الموجه النهائي فوراً.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Prompt List Sidebar (4 columns) */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 overflow-y-auto max-h-[600px]">
                  <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest px-2 pb-2 border-b border-slate-800 mb-2">
                    الفهرس المعتمد ({promptsIndex.prompts.length} موجهات)
                  </div>
                  {promptsIndex.prompts.map((p: any, idx: number) => {
                    const active = selectedPromptIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedPromptIndex(idx)}
                        className={`w-full text-right p-3 rounded-xl border transition-all duration-250 flex flex-col gap-1.5 ${
                          active 
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-950/10" 
                            : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-xs text-slate-200 group-hover:text-white">
                            {idx + 1}. {p.title}
                          </span>
                          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                            p.phase === "Phase 1: MVP Core" 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                              : p.phase === "Phase 2: Scale & Growth"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                          }`}>
                            {p.phase.replace("Phase ", "P")}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-1">
                          {p.purpose}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Prompt Sandbox Details (8 columns) */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                  {(() => {
                    const activePrompt = promptsIndex.prompts[selectedPromptIndex];
                    if (!activePrompt) return null;
                    
                    // Extract placeholders
                    const regex = /\{\{([^}]+)\}\}/g;
                    const matches: string[] = [];
                    let match;
                    while ((match = regex.exec(activePrompt.promptTemplate)) !== null) {
                      matches.push(match[1]);
                    }
                    const placeholders = Array.from(new Set(matches));

                    // Compile current
                    let compiled = activePrompt.promptTemplate;
                    placeholders.forEach((p) => {
                      compiled = compiled.replace(new RegExp(`\\{\\{${p}\\}\\}`, 'g'), promptVariables[p] || `[${p}]`);
                    });

                    return (
                      <div className="space-y-6">
                        {/* Selected Prompt Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                              {activePrompt.phase}
                            </span>
                            <h3 className="text-lg font-extrabold text-white">
                              {activePrompt.title}
                            </h3>
                          </div>
                          <div className="flex gap-2">
                            {(activePrompt.id === 7 || activePrompt.id === 8 || activePrompt.id === 9) && (
                              <button
                                onClick={() => handleRunLiveAnalysis(activePrompt.id)}
                                disabled={isLiveLoading}
                                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-1.5 ${
                                  isLiveLoading
                                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                    : "bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/10 cursor-pointer"
                                }`}
                              >
                                {isLiveLoading ? (
                                  <>
                                    <span className="w-3.5 h-3.5 border-2 border-slate-500 border-t-white rounded-full animate-spin"></span>
                                    جاري التحليل...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-3.5 h-3.5" />
                                    تشغيل تحليل حي عبر API
                                  </>
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => handleLoadInPlayground(activePrompt)}
                              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center gap-1.5"
                            >
                              <Sliders className="w-3.5 h-3.5" />
                              تشغيل في الـ Sandbox
                            </button>
                          </div>
                        </div>

                        {/* Purpose & Target outputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-850">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-mono block">الغرض التقني / Purpose:</span>
                            <p className="text-xs text-slate-300 leading-relaxed font-semibold">{activePrompt.purpose}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-mono block">المدخلات الفنية المطلوبة / Inputs:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {activePrompt.requiredInputs.map((inp: string, iIdx: number) => (
                                <span key={iIdx} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                                  {inp}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Interactive Placeholders Form */}
                        {placeholders.length > 0 && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
                              <Layers className="w-4 h-4 text-emerald-400" />
                              <span>متغيرات الموجه (Fill Placeholders):</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {placeholders.map((p) => (
                                <div key={p} className="space-y-1 text-right">
                                  <label className="text-[11px] font-mono text-slate-400 block font-bold">
                                    {getVariableLabel(p)}
                                  </label>
                                  {p === "productData" || p === "script" || p === "chosenScript" ? (
                                    <textarea
                                      rows={2}
                                      value={promptVariables[p] || ""}
                                      onChange={(e) => setPromptVariables((prev) => ({ ...prev, [p]: e.target.value }))}
                                      className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500/50 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-colors duration-200 resize-none leading-relaxed"
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      value={promptVariables[p] || ""}
                                      onChange={(e) => setPromptVariables((prev) => ({ ...prev, [p]: e.target.value }))}
                                      className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-colors duration-200"
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Compiled Prompt Output Codeblock */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
                              <Cpu className="w-4 h-4 text-emerald-400" />
                              <span>الموجه المجمّع الفعلي (Compiled Prompt Preview):</span>
                            </div>
                            <button
                              onClick={() => handleCopyText(compiled, "compiled_prompt_" + selectedPromptIndex)}
                              className="text-xs font-mono bg-slate-950 border border-slate-800 text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
                            >
                              {copiedStates["compiled_prompt_" + selectedPromptIndex] ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  تم النسخ!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  نسخ الموجه المجمع
                                </>
                              )}
                            </button>
                          </div>
                          <div className="relative">
                            <pre className="bg-slate-950 border border-slate-850 rounded-xl p-4 overflow-y-auto max-h-[250px] text-xs font-mono text-emerald-400/90 whitespace-pre-wrap text-left leading-relaxed shadow-inner" dir="ltr">
                              {compiled}
                            </pre>
                          </div>
                        </div>

                        {/* Live Cloud Function Results Renderer */}
                        {(isLiveLoading || liveResult || liveError) && (
                          <div className="mt-6 bg-slate-950/60 border border-slate-800 rounded-2xl p-6 space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
                                <h4 className="font-extrabold text-sm text-white">نتائج التحليل المباشر (Live API Analysis Output)</h4>
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                                {liveResult ? "API Response OK" : isLiveLoading ? "Querying Cloud Function..." : "Error"}
                              </span>
                            </div>

                            {isLiveLoading && (
                              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                                <div className="relative">
                                  <div className="w-12 h-12 rounded-full border-2 border-teal-500/20 border-t-teal-400 animate-spin"></div>
                                  <Sparkles className="w-5 h-5 text-teal-400 animate-pulse absolute top-3.5 right-3.5" />
                                </div>
                                <div className="space-y-1 text-center font-sans">
                                  <p className="text-xs text-slate-300 font-bold">جاري تشغيل خوارزمية Adremix AI بالخلفية...</p>
                                  <p className="text-[10px] text-slate-500">يقوم نموذج Gemini بفحص وتحليل المكونات والمطابقة مع المنصة الإعلانية</p>
                                </div>
                              </div>
                            )}

                            {liveError && (
                              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 text-right">
                                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                                <div className="space-y-1 font-sans">
                                  <h5 className="text-xs font-bold text-red-400">فشل الاتصال بالخادم</h5>
                                  <p className="text-[11px] text-slate-400 leading-relaxed">{liveError}</p>
                                </div>
                              </div>
                            )}

                            {liveResult && liveResult.type === "doctor" && liveResult.data && (
                              <div className="space-y-6 font-sans">
                                {/* Doctor Header Card */}
                                <div className="bg-gradient-to-r from-teal-950/30 to-slate-900 border border-teal-500/15 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                                  <div className="space-y-1.5 text-right">
                                    <div className="text-[10px] font-mono text-teal-400 font-bold uppercase">النتيجة والتشخيص النهائي</div>
                                    <h5 className="text-sm font-extrabold text-white">{liveResult.data.finalVerdict}</h5>
                                    <p className="text-[11px] text-slate-400">المجموع الكلي: <span className="font-bold text-teal-300 font-mono">{liveResult.data.totalScore}</span> من 50 نقطة</p>
                                  </div>
                                  <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 flex flex-col items-center justify-center">
                                    <span className="text-lg font-extrabold text-teal-300 font-mono">{liveResult.data.totalScore ? liveResult.data.totalScore * 2 : 0}%</span>
                                    <span className="text-[8px] uppercase font-mono text-teal-400">Audit</span>
                                  </div>
                                </div>

                                {/* Top Priority Warning */}
                                {liveResult.data.topPriorityFix && (
                                  <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl space-y-1.5 text-right">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                                      <AlertTriangle className="w-4 h-4" />
                                      <span>الأولوية القصوى للعلاج والاصطلاح الفوري</span>
                                    </div>
                                    <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">{liveResult.data.topPriorityFix}</p>
                                  </div>
                                )}

                                {/* Detailed 5 axis metrics */}
                                <div className="space-y-4">
                                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-slate-850 pb-1">الفحص الميكروسكوبي للمحاور الخمسة</div>
                                  {[
                                    { name: "جودة الخطاف (Hook Quality)", key: "hook" },
                                    { name: "وضوح القيمة (Value Clarity)", key: "valueClarity" },
                                    { name: "الإقناع العاطفي (Emotional Pull)", key: "emotionalPull" },
                                    { name: "مناسبة المنصة (Platform Fit)", key: "platformFit" },
                                    { name: "قوة الدعوة للإجراء (CTA Power)", key: "cta" }
                                  ].map((axis) => {
                                    const metric = liveResult.data[axis.key];
                                    if (!metric) return null;
                                    const percentage = (metric.score || 0) * 10;
                                    return (
                                      <div key={axis.key} className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-3 hover:border-slate-800 transition-all">
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs font-bold text-slate-200">{axis.name}</span>
                                          <span className="text-xs font-bold text-teal-400 font-mono">{metric.score} / 10</span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                                          <div className="h-full bg-teal-400 rounded-full" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed pt-1">
                                          <div className="bg-slate-950/40 p-2.5 rounded-lg text-right">
                                            <span className="text-[10px] text-slate-500 font-mono block mb-1">التشخيص (Diagnosis):</span>
                                            <p className="text-slate-300">{metric.diagnosis}</p>
                                          </div>
                                          <div className="bg-teal-950/10 border border-teal-500/10 p-2.5 rounded-lg text-right">
                                            <span className="text-[10px] text-teal-500/80 font-mono block mb-1">الوصفة الإعلانية البديلة (Prescription):</span>
                                            <p className="text-teal-300 font-semibold">{metric.prescription}</p>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {liveResult && liveResult.type === "gap" && liveResult.data && (
                              <div className="space-y-6 font-sans">
                                {/* Marketing Intelligence Info */}
                                <div className="bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-500/15 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                                  <div className="space-y-1 text-right">
                                    <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">الخلاصة الاستراتيجية والتوصية</div>
                                    <h5 className="text-sm font-extrabold text-white">{liveResult.data.topRecommendation}</h5>
                                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1"><span className="text-slate-300 font-semibold">السبب:</span> {liveResult.data.reason}</p>
                                  </div>
                                  <div className="w-18 h-18 rounded-full bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center shrink-0">
                                    <span className="text-lg font-extrabold text-amber-300 font-mono">{liveResult.data.angleFatigueLevel} / 10</span>
                                    <span className="text-[8px] uppercase font-mono text-amber-400 text-center">Fatigue Level</span>
                                  </div>
                                </div>

                                {/* Typical Angles */}
                                {liveResult.data.typicalAnglesUsed && liveResult.data.typicalAnglesUsed.length > 0 && (
                                  <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-3 text-right">
                                    <div className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-1">الزوايا التقليدية الشائعة المكررة (typicalAnglesUsed)</div>
                                    <ul className="space-y-2 list-disc list-inside text-xs text-slate-400 pr-2">
                                      {liveResult.data.typicalAnglesUsed.map((angle: string, i: number) => (
                                        <li key={i} className="leading-relaxed">{angle}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Unused Angles / The Golden Strategic Gaps */}
                                {liveResult.data.unusedAngles && liveResult.data.unusedAngles.length > 0 && (
                                  <div className="space-y-3">
                                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-slate-850 pb-1">المناطق الإعلانية المجهولة - الفراغ الاستراتيجي (unusedAngles)</div>
                                    <div className="grid grid-cols-1 gap-3">
                                      {liveResult.data.unusedAngles.map((angleObj: any, i: number) => (
                                        <div key={i} className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-1.5 hover:border-amber-500/20 transition-all text-right">
                                          <div className="flex items-center gap-2 justify-start">
                                            <span className="w-5 h-5 rounded-full bg-amber-500/10 text-[10px] font-extrabold text-amber-400 flex items-center justify-center font-mono">{i + 1}</span>
                                            <h5 className="text-xs font-bold text-slate-200">{angleObj.angle || angleObj}</h5>
                                          </div>
                                          {angleObj.whyUnused && (
                                            <p className="text-[11px] text-slate-400 pr-7"><span className="text-slate-500 font-mono">لماذا لم تُستخدم؟</span> {angleObj.whyUnused}</p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Contrarian Angle */}
                                {liveResult.data.contrarianAngle && (
                                  <div className="bg-slate-900 border border-purple-500/10 p-4 rounded-xl space-y-3 text-right">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                                        <Sparkles className="w-4 h-4" />
                                        <span>الزاوية المضادة الجريئة (Contrarian Angle)</span>
                                      </div>
                                      <div className="flex gap-1.5 text-[9px] font-mono uppercase">
                                        <span className="bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded">Risk: {liveResult.data.contrarianAngle.riskLevel || "Medium"}</span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <h5 className="text-xs font-bold text-slate-200">{liveResult.data.contrarianAngle.angle}</h5>
                                      <p className="text-[11px] text-slate-400 leading-relaxed"><span className="text-purple-400/80 font-bold">لماذا هي الفائزة (Potential Reward):</span> {liveResult.data.contrarianAngle.potentialReward}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {liveResult && liveResult.type === "predictor" && liveResult.data && (
                              <div className="space-y-6 font-sans">
                                {/* Overall Predictor Header */}
                                <div className="bg-gradient-to-r from-emerald-950/30 to-slate-900 border border-emerald-500/15 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                                  <div className="space-y-1.5 text-right">
                                    <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">القرار والتوصية النهائية</div>
                                    <h5 className="text-sm font-extrabold text-white">{liveResult.data.recommendation}</h5>
                                    <p className="text-[11px] text-slate-400">نسبة نجاح الحملة المتوقعة: <span className="font-bold text-emerald-300 font-mono">{liveResult.data.successProbability}</span></p>
                                  </div>
                                  <div className="w-18 h-18 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center shrink-0 font-sans">
                                    <span className="text-lg font-extrabold text-emerald-300 font-mono">{liveResult.data.overallScore}</span>
                                    <span className="text-[8px] uppercase font-mono text-emerald-400">Score</span>
                                  </div>
                                </div>

                                {/* Forecasting Highlights */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
                                  {/* Reach Forecast */}
                                  <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-2.5">
                                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-slate-850 pb-1">توقعات الوصول (Reach)</div>
                                    <div className="space-y-1">
                                      <span className="text-[10px] text-slate-500 block">الوصول التقريبي (Reach):</span>
                                      <span className="text-xs font-bold text-slate-200 block">{liveResult.data.reach?.estimatedReach}</span>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[10px] text-slate-500 block">قابلية الانتشار الفيروسي (Viral Potential):</span>
                                      <span className="text-xs font-bold text-emerald-400 block font-mono">{liveResult.data.reach?.viralPotential} / 10</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed mt-2">{liveResult.data.reach?.reasonForViralScore}</p>
                                  </div>

                                  {/* Engagement Forecast */}
                                  <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-2.5">
                                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-slate-850 pb-1">التفاعل المتوقع (Engagement)</div>
                                    <div className="space-y-1.5 text-xs text-slate-300">
                                      <div className="flex justify-between">
                                        <span className="text-slate-500 text-[10px]">معدل التفاعل:</span>
                                        <span className="font-bold text-emerald-400 font-mono">{liveResult.data.engagement?.estimatedEngagementRate}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-500 text-[10px]">الإعجابات:</span>
                                        <span className="font-medium">{liveResult.data.engagement?.likesEstimate}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-500 text-[10px]">المشاركات:</span>
                                        <span className="font-medium">{liveResult.data.engagement?.sharesEstimate}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-500 text-[10px]">التعليقات:</span>
                                        <span className="font-medium">{liveResult.data.engagement?.commentsEstimate}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-500 text-[10px]">الحفظ:</span>
                                        <span className="font-medium">{liveResult.data.engagement?.savesEstimate}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Sales Forecast */}
                                  <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-2.5">
                                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-slate-850 pb-1">التحويل والمبيعات (ROI)</div>
                                    <div className="space-y-1.5 text-xs text-slate-300">
                                      <div className="flex justify-between">
                                        <span className="text-slate-500 text-[10px]">معدل النقر CTR:</span>
                                        <span className="font-bold text-emerald-400 font-mono">{liveResult.data.sales?.estimatedCTR}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-500 text-[10px]">معدل التحويل:</span>
                                        <span className="font-bold text-emerald-400 font-mono">{liveResult.data.sales?.estimatedConversionRate}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-500 text-[10px]">قيمة المبيعات المتوقعة:</span>
                                        <span className="font-bold text-emerald-300">{liveResult.data.sales?.estimatedSalesValue}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Strongest and Weakest Element */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl space-y-1 text-right">
                                    <span className="text-[10px] text-emerald-400 font-bold block">العنصر الأقوى (Strongest Element):</span>
                                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">{liveResult.data.strongestElement}</p>
                                  </div>
                                  <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl space-y-1 text-right">
                                    <span className="text-[10px] text-red-400 font-bold block">العنصر الأضعف (Weakest Element):</span>
                                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">{liveResult.data.weakestElement}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    );
                  })()}
                </div>

              </div>
            </div>

            {/* SEPARATOR: PRODUCT ROADMAP */}
            <div className="border-t border-slate-900 my-8"></div>

            {/* EXPANDABLE ROADMAP & SAAS PRICING */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Product Roadmap Phases (7 columns) */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Milestone className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-extrabold text-base text-white">تفاصيل خارطة طريق المنتج (Product Roadmap Specifications)</h3>
                </div>

                <div className="space-y-6 relative border-r-2 border-slate-800 pr-4 mr-2">
                  
                  {/* Phase 1 */}
                  <div className="relative space-y-2">
                    <span className="absolute -right-6.5 top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></span>
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-white">{productRoadmap.productRoadmap.phase1_MVP.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                        {productRoadmap.productRoadmap.phase1_MVP.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {productRoadmap.productRoadmap.phase1_MVP.features.map((f: any, fIdx: number) => (
                        <div key={fIdx} className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                          <h5 className="text-xs font-bold text-slate-200">{f.featureName}</h5>
                          <p className="text-[10px] text-slate-400 leading-relaxed">{f.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phase 2 */}
                  <div className="relative space-y-2">
                    <span className="absolute -right-6.5 top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-500/20"></span>
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-white">{productRoadmap.productRoadmap.phase2_Growth.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium">
                        {productRoadmap.productRoadmap.phase2_Growth.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {productRoadmap.productRoadmap.phase2_Growth.features.map((f: any, fIdx: number) => (
                        <div key={fIdx} className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1 hover:border-amber-500/20 transition-all duration-300">
                          <h5 className="text-xs font-bold text-slate-200">{f.featureName}</h5>
                          <p className="text-[10px] text-slate-400 leading-relaxed">{f.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div className="relative space-y-2">
                    <span className="absolute -right-6.5 top-1 w-3 h-3 rounded-full bg-teal-500 ring-4 ring-teal-500/20"></span>
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-white">{productRoadmap.productRoadmap.phase3_Future.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 font-medium">
                        {productRoadmap.productRoadmap.phase3_Future.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {productRoadmap.productRoadmap.phase3_Future.features.map((f: any, fIdx: number) => (
                        <div key={fIdx} className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1 hover:border-teal-500/20 transition-all duration-300">
                          <h5 className="text-xs font-bold text-slate-200">{f.featureName}</h5>
                          <p className="text-[10px] text-slate-400 leading-relaxed">{f.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* SaaS Revenue & Subscriptions Pricing (5 columns) */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Coins className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-extrabold text-base text-white">باقات الاشتراك المقترحة (SaaS Pricing Models)</h3>
                </div>

                <div className="space-y-4">
                  {productRoadmap.proposedBusinessModel.tiers.map((tier: any, idx: number) => (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-xl border transition-all ${
                        tier.tierName.includes("الاحترافية") 
                          ? "bg-emerald-500/5 border-emerald-500/20 shadow-lg shadow-emerald-950/10" 
                          : "bg-slate-950 border-slate-850"
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            tier.tierName.includes("الأساسية") 
                              ? "bg-slate-500" 
                              : tier.tierName.includes("الاحترافية") 
                                ? "bg-emerald-400" 
                                : "bg-purple-400"
                          }`} />
                          <h4 className="font-extrabold text-xs text-slate-200">{tier.tierName}</h4>
                        </div>
                        <span className="text-xs font-extrabold text-emerald-400 font-mono">{tier.price}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed pt-2">
                        {tier.limits}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Scaling Note */}
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2 text-right">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">بنية مأتمتة بالكامل (Zero Ops)</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    تم بناء جميع خدمات الخلفية بالاعتماد على خوادم سحابية لا خادومية (Serverless) مثل Google Cloud Run وFirestore، مما يسمح للمنصة بالتوسع تلقائياً من مستخدم واحد إلى ملايين المستخدمين المتزامنين دون أي تدخل بشري في إدارة البنية التحتية.
                  </p>
                </div>
              </div>

            </div>

          </motion.div>
        )}

      </main>

      {/* FOOTER */}
      <footer id="adremix-footer" className="mt-20 border-t border-slate-900 bg-slate-950 py-8 px-6 text-xs text-slate-500 text-center space-y-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <span className="font-bold text-slate-400">AdRemix AI</span>
            <span>&middot; Startup Technical Blueprint Dashboard</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Enterprise Firestore Edition</span>
            <span>&middot;</span>
            <span>Google-level Architecture</span>
          </div>
        </div>
        <p className="max-w-2xl mx-auto text-[11px] text-slate-600 leading-relaxed">
          Disclaimer: This workspace contains both static CTO code specifications and a fully functioning client-side representation connected securely to a server-side Gemini 3.5 proxy. Always review your final security policies on Firebase console before scaling broad public operations.
        </p>
      </footer>

    </div>
  );
}
