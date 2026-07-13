from models.schemas import PredictionResult
from utils.gemini_client import gemini
from config import config

class Predictor:
    def __init__(self, client=None):
        self.schema = {
            "type": "object",
            "properties": {
                "reach": {
                    "type": "object",
                    "properties": {
                        "estimated_reach": {"type": "string"},
                        "viral_potential": {"type": "integer"},
                        "reason": {"type": "string"},
                    },
                },
                "engagement": {
                    "type": "object",
                    "properties": {
                        "engagement_rate": {"type": "string"},
                        "likes": {"type": "string"},
                        "shares": {"type": "string"},
                        "comments": {"type": "string"},
                        "saves": {"type": "string"},
                    },
                },
                "sales": {
                    "type": "object",
                    "properties": {
                        "ctr": {"type": "string"},
                        "conversion_rate": {"type": "string"},
                        "sales_value": {"type": "string"},
                    },
                },
                "strongest_element": {"type": "string"},
                "weakest_element": {"type": "string"},
                "overall_score": {"type": "integer"},
                "success_probability": {"type": "string"},
                "recommendation": {"type": "string"},
            },
        }

    def predict(
        self,
        product: str,
        ad_text: str,
        target_audience: str,
        platform: str,
    ) -> dict:
        prompt = f"""
أنت "متنبئ الأداء" في Adremix AI. أعط توقعات رقمية دقيقة لأداء الإعلان قبل نشره.

🎯 المنتج: {product}
📄 الإعلان:
\"\"\"
{ad_text}
\"\"\"
👥 الجمهور: {target_audience}
📱 المنصة: {platform}

أخرج توقعات رقمية للوصول، التفاعل، المبيعات، مع overallScore من 100،
successProbability، و recommendation (انشر فوراً / عدّله أولاً).
"""
        return gemini.generate(prompt, self.schema, config.TEMPERATURE_PREDICTOR)

    def predict_performance(
        self,
        product: str,
        ad_text: str,
        target_audience: str,
        platform: str,
    ) -> PredictionResult:
        """
        Runs a predictive performance simulation and returns a PredictionResult.
        """
        raw_res = self.predict(product, ad_text, target_audience, platform)
        
        # Transform keys to match PredictionResult's expected structure in schemas.py
        reach_raw = raw_res.get("reach", {})
        eng_raw = raw_res.get("engagement", {})
        sales_raw = raw_res.get("sales", {})
        
        mapped_reach = {
            "estimated_reach": reach_raw.get("estimated_reach", ""),
            "viral_potential": reach_raw.get("viral_potential", 0),
            "reason_for_viral_score": reach_raw.get("reason", "")
        }
        
        mapped_engagement = {
            "estimated_engagement_rate": eng_raw.get("engagement_rate", ""),
            "likes_estimate": eng_raw.get("likes", ""),
            "shares_estimate": eng_raw.get("shares", ""),
            "comments_estimate": eng_raw.get("comments", ""),
            "saves_estimate": eng_raw.get("saves", "")
        }
        
        mapped_sales = {
            "estimated_ctr": sales_raw.get("ctr", ""),
            "estimated_conversion_rate": sales_raw.get("conversion_rate", ""),
            "estimated_sales_value": sales_raw.get("sales_value", "")
        }
        
        transformed_res = {
            "reach": mapped_reach,
            "engagement": mapped_engagement,
            "sales": mapped_sales,
            "strongest_element": raw_res.get("strongest_element", ""),
            "weakest_element": raw_res.get("weakest_element", ""),
            "overall_score": raw_res.get("overall_score", 0),
            "success_probability": raw_res.get("success_probability", ""),
            "recommendation": raw_res.get("recommendation", "")
        }
        
        return PredictionResult.model_validate(transformed_res)

# Maintain alias compatibility for imports
PerformancePredictor = Predictor
