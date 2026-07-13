from typing import Dict, Any, List, Optional
from models.schemas import FullCampaignResult, DiagnosisResult, GapAnalysisResult, PredictionResult, Tone, Platform, ProductInput, CampaignInput
from utils.gemini_client import GeminiClient
from engine.ad_doctor import AdDoctor
from engine.gap_analyzer import GapAnalyzer
from engine.predictor import Predictor
from pydantic import BaseModel, Field

class GeneratedAdModel(BaseModel):
    title: str = Field(..., description="High-converting headline or hook title")
    hook: str = Field(..., description="The opening hook (first 3 seconds or headline text)")
    body: str = Field(..., description="Core persuasive body copy or video script description")
    cta: str = Field(..., description="Clear call to action")

class AdGenerationSchema(BaseModel):
    ads: List[GeneratedAdModel]

class CampaignRunner:
    def __init__(self, client: GeminiClient = None):
        from utils.gemini_client import gemini
        self.client = client or gemini
        self.doctor = AdDoctor()
        self.gap_analyzer = GapAnalyzer()
        self.predictor = Predictor()

    def run_full_campaign(self, campaign: CampaignInput) -> Dict[str, Any]:
        print(f"🚀 بدء الحملة الكاملة لـ: {campaign.product.name}")
        print("=" * 60)

        # المرحلة 1: تحليل الفجوة السوقية
        print("🕵️ [1/4] تحليل الفجوة السوقية...")
        gap_result = self.gap_analyzer.analyze(
            product_name=campaign.product.name,
            product_description=campaign.product.description,
            category=campaign.product.category,
            target_audience=campaign.target_audience,
        )

        # المرحلة 2: توليد إعلان بالزاوية الأفضل
        print("✍️ [2/4] توليد الإعلان بالزاوية المثلى...")
        ad_text = self._generate_ad_with_angle(
            product=campaign.product,
            angle=gap_result["top_recommendation"],
            target_audience=campaign.target_audience,
            tone=campaign.tone.value,
            platform=campaign.platform.value,
        )

        # المرحلة 3: تشخيص الإعلان
        print("🩺 [3/4] تشخيص الإعلان...")
        diagnosis_result = self.doctor.diagnose(
            ad_text=ad_text["body"],
            target_audience=campaign.target_audience,
            platform=campaign.platform.value,
        )

        # المرحلة 4: توقع الأداء
        print("🔮 [4/4] توقع أداء الإعلان...")
        prediction_result = self.predictor.predict(
            product=f"{campaign.product.name} - {campaign.product.price}",
            ad_text=ad_text["body"],
            target_audience=campaign.target_audience,
            platform=campaign.platform.value,
        )

        # تجميع النتائج
        ready = (
            diagnosis_result["total_score"] >= 35
            and prediction_result["overall_score"] >= 65
        )

        result = {
            "product_name": campaign.product.name,
            "platform": campaign.platform.value,
            "gap_analysis": gap_result,
            "generated_ads": [ad_text],
            "diagnosis": diagnosis_result,
            "prediction": prediction_result,
            "final_verdict": (
                "✅ جاهز للنشر"
                if ready
                else "⚠️ يحتاج تحسينات قبل النشر"
            ),
            "ready_to_publish": ready,
        }

        print("=" * 60)
        print(f"النتيجة النهائية: {result['final_verdict']}")
        print(f"جاهز للنشر: {'نعم' if ready else 'لا'}")

        return result

    def _generate_ad_with_angle(
        self,
        product,
        angle: str,
        target_audience: str,
        tone: str,
        platform: str,
    ) -> dict:
        prompt = f"""
أنت كاتب إعلانات محترف في Adremix AI.

🎯 المنتج: {product.name}
📝 وصفه: {product.description}
💵 السعر: {product.price}
✨ المميزات: {product.features}
👥 الجمهور: {target_audience}
🎭 النبرة: {tone}
📱 المنصة: {platform}
💡 الزاوية الإعلانية المطلوبة: "{angle}"

اكتب إعلاناً كاملاً بهذه الزاوية. أخرج:
- angle_name: اسم الزاوية
- hook: الخطاف (أول 3 ثوان)
- body: نص الإعلان الكامل (150-200 كلمة)
- cta: الدعوة للإجراء
- hashtags: 5 هاشتاغات مناسبة
"""
        from utils.gemini_client import gemini
        from config import config

        schema = {
            "type": "object",
            "properties": {
                "angle_name": {"type": "string"},
                "hook": {"type": "string"},
                "body": {"type": "string"},
                "cta": {"type": "string"},
                "hashtags": {"type": "array", "items": {"type": "string"}},
            },
        }
        return gemini.generate(prompt, schema, 0.9)

    def run_full_suite(
        self, 
        product_name: str, 
        product_description: str, 
        ad_text: str, 
        category: str, 
        target_audience: str, 
        platform: str,
        price: str = "غير محدد",
        features: str = "",
        tone: str = "احترافية"
    ) -> FullCampaignResult:
        """
        Orchestrates and executes a complete suite of audits, gaps, and forecasting for an ad campaign,
        and generates highly optimized ad variations.
        """
        print(f"[*] Initializing Unified Adremix Run for product: {product_name} on {platform}...")
        
        # 1. Run Gap Analyzer to establish strategic coordinates
        print("[*] Stage 1/4: Executing competitor intelligence and gap analysis...")
        gap_res = self.gap_analyzer.analyze_gap(
            product_name=product_name,
            product_description=product_description,
            category=category,
            target_audience=target_audience
        )

        # 2. Generate Optimized Ad Copy variations based on gap analysis
        print("[*] Stage 2/4: Generating high-converting optimized ad variations...")
        system_instruction_ads = (
            "You are an elite, high-converting direct-response copywriter specialized in creating "
            "viral ad copy and scripts for TikTok, Instagram, YouTube, and Facebook. "
            "You generate highly engaging, persuasive, and channel-appropriate ad options matching a specific tone and platform. "
            "Ensure the output language matches the input language (default is Arabic or English depending on input)."
        )

        prompt_ads = f"""
        Generate 3 high-converting ad copy/script variations for:
        PRODUCT: {product_name} ({product_description})
        PRICE: {price}
        FEATURES: {features}
        TONE: {tone}
        PLATFORM: {platform}
        TARGET AUDIENCE: {target_audience}
        
        Use these strategic insights from our competitor gap analysis to make the ads highly unique and competitive:
        - Top Recommendation: {gap_res.top_recommendation}
        - Contrarian Angle: {gap_res.contrarian_angle.get('angle', '')}
        """

        from utils.gemini_client import gemini
        client_to_use = self.client or gemini
        ads_result = client_to_use.generate_structured(
            prompt=prompt_ads,
            schema_class=AdGenerationSchema,
            system_instruction=system_instruction_ads
        )
        generated_ads_list = [ad.model_dump() for ad in ads_result.ads]

        # Use the first generated ad if no user-supplied ad_text was provided
        active_ad_text = ad_text
        if not active_ad_text.strip() and generated_ads_list:
            top_ad = generated_ads_list[0]
            active_ad_text = f"Title: {top_ad['title']}\nHook: {top_ad['hook']}\nBody: {top_ad['body']}\nCTA: {top_ad['cta']}"
            print("[*] No custom ad copy provided. Auditing the top-performing AI-generated ad instead.")

        # 3. Run Ad Doctor
        print("[*] Stage 3/4: Running microscopic copy audit (Ad Doctor)...")
        doctor_res = self.doctor.diagnose(
            ad_text=active_ad_text,
            target_audience=target_audience,
            platform=platform
        )

        # 4. Run Performance Predictor
        print("[*] Stage 4/4: Simulating distribution performance and conversions...")
        product_detail_combined = f"{product_name} - {product_description} (Price: {price}, Features: {features})"
        predictor_res = self.predictor.predict_performance(
            product=product_detail_combined,
            ad_text=active_ad_text,
            target_audience=target_audience,
            platform=platform
        )

        print("[+] Unified run completed successfully.")
        
        # Determine publishing readiness
        ready_to_publish = (predictor_res.overall_score >= 70) and (doctor_res.total_score >= 35)

        return FullCampaignResult(
            product_name=product_name,
            platform=platform,
            target_audience=target_audience,
            gap_analysis=gap_res,
            generated_ads=generated_ads_list,
            diagnosis=doctor_res,
            prediction=predictor_res,
            final_verdict=doctor_res.final_verdict,
            ready_to_publish=ready_to_publish
        )
