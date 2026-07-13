from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class Platform(str, Enum):
    TIKTOK = "TikTok"
    INSTAGRAM = "Instagram"
    YOUTUBE = "YouTube"
    FACEBOOK = "Facebook"

class Tone(str, Enum):
    FUNNY = "فكاهية"
    LUXURY = "فاخرة"
    URGENT = "عاجلة"
    EMOTIONAL = "عاطفية"
    PROFESSIONAL = "احترافية"

class ProductInput(BaseModel):
    name: str = Field(..., description="اسم المنتج")
    description: str = Field(default="", description="وصف المنتج")
    price: str = Field(default="غير محدد", description="السعر")
    features: str = Field(default="", description="المميزات الرئيسية")
    category: str = Field(default="عامة", description="فئة المنتج")

class CampaignInput(BaseModel):
    product: ProductInput
    target_audience: str = Field(default="عام", description="الجمهور المستهدف")
    tone: Tone = Field(default=Tone.PROFESSIONAL, description="النبرة الإبداعية")
    platform: Platform = Field(default=Platform.TIKTOK, description="المنصة المستهدفة")

class DiagnosisResult(BaseModel):
    hook: dict = Field(
        ..., 
        description="Evaluation of the opening hook with keys: 'score' (int out of 10), 'diagnosis' (str), 'prescription' (str)"
    )
    value_clarity: dict = Field(
        ..., 
        description="Evaluation of how clearly the product's value is stated with keys: 'score' (int out of 10), 'diagnosis' (str), 'prescription' (str)"
    )
    emotional_pull: dict = Field(
        ..., 
        description="Evaluation of emotional/psychological pull with keys: 'score' (int out of 10), 'diagnosis' (str), 'prescription' (str)"
    )
    platform_fit: dict = Field(
        ..., 
        description="Evaluation of appropriateness for the platform with keys: 'score' (int out of 10), 'diagnosis' (str), 'prescription' (str)"
    )
    cta_power: dict = Field(
        ..., 
        description="Evaluation of CTA strength with keys: 'score' (int out of 10), 'diagnosis' (str), 'prescription' (str)"
    )
    total_score: int = Field(..., description="Aggregated score from all 5 categories (out of 50)", ge=0, le=50)
    final_verdict: str = Field(..., description="Overall diagnostic summary verdict of the ad quality")
    top_priority_fix: str = Field(..., description="The single highest impact, critical change that must be applied immediately")

    def __getitem__(self, item):
        try:
            return getattr(self, item)
        except AttributeError:
            raise KeyError(item)

    def get(self, key, default=None):
        return getattr(self, key, default)

class GapAnalysisResult(BaseModel):
    typical_angles: List[str] = Field(..., description="List of standard, over-saturated angles currently over-indexed by competitors")
    fatigue_level: int = Field(..., description="Current market fatigue level for typical angles (1 to 10)", ge=1, le=10)
    unused_angles: List[dict] = Field(
        ..., 
        description="Blue-ocean angles neglecting competitors, with dictionary keys: 'angle' (str), 'why_unused' (str)"
    )
    contrarian_angle: dict = Field(
        ..., 
        description="A bold contrarian angle with dictionary keys: 'angle' (str), 'risk_level' (str, e.g. Low/Medium/High), 'potential_reward' (str)"
    )
    top_recommendation: str = Field(..., description="Primary high-level strategic recommendation for the product's next creative asset")
    reason: str = Field(..., description="Analytical justification for this recommendation")

    def __getitem__(self, item):
        try:
            return getattr(self, item)
        except AttributeError:
            raise KeyError(item)

    def get(self, key, default=None):
        return getattr(self, key, default)

class PredictionResult(BaseModel):
    reach: dict = Field(
        ..., 
        description="Reach and virality predictions with keys: 'estimated_reach' (str), 'viral_potential' (int out of 10), 'reason_for_viral_score' (str)"
    )
    engagement: dict = Field(
        ..., 
        description="Predicted interactive community engagement with keys: 'estimated_engagement_rate' (str), 'likes_estimate' (str), 'shares_estimate' (str), 'comments_estimate' (str), 'saves_estimate' (str)"
    )
    sales: dict = Field(
        ..., 
        description="Predicted direct ROI with keys: 'estimated_ctr' (str), 'estimated_conversion_rate' (str), 'estimated_sales_value' (str)"
    )
    strongest_element: str = Field(..., description="The single strongest component driving success")
    weakest_element: str = Field(..., description="The main friction element capping conversion/reach")
    overall_score: int = Field(..., description="Overall performance score (out of 100)", ge=0, le=100)
    success_probability: str = Field(..., description="Overall calculated percentage of campaign success probability (e.g. '82%')")
    recommendation: str = Field(..., description="Summary action recommendation based on predicted performance")

    def __getitem__(self, item):
        try:
            return getattr(self, item)
        except AttributeError:
            raise KeyError(item)

    def get(self, key, default=None):
        return getattr(self, key, default)

class FullCampaignResult(BaseModel):
    product_name: str = Field(..., description="اسم المنتج")
    platform: str = Field(..., description="المنصة")
    target_audience: Optional[str] = Field(default="عام", description="الجمهور المستهدف")
    gap_analysis: GapAnalysisResult = Field(..., description="نتائج تحليل الفجوات")
    generated_ads: List[dict] = Field(
        ..., 
        description="List of optimized ad scripts, each containing: 'title' (str), 'hook' (str), 'body' (str), 'cta' (str)"
    )
    diagnosis: DiagnosisResult = Field(..., description="نتائج التدقيق والتشخيص")
    prediction: PredictionResult = Field(..., description="توقعات الأداء")
    final_verdict: str = Field(..., description="القرار النهائي لنجاح الحملة")
    ready_to_publish: bool = Field(..., description="هل الإعلان جاهز للنشر الفوري")
