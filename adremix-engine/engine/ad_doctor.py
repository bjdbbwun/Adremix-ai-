from models.schemas import DiagnosisResult
from utils.gemini_client import gemini
from config import config

class AdDoctor:
    def __init__(self, client=None):
        self.schema = {
            "type": "object",
            "properties": {
                "hook": {
                    "type": "object",
                    "properties": {
                        "score": {"type": "integer"},
                        "diagnosis": {"type": "string"},
                        "prescription": {"type": "string"},
                    },
                },
                "value_clarity": {
                    "type": "object",
                    "properties": {
                        "score": {"type": "integer"},
                        "diagnosis": {"type": "string"},
                        "prescription": {"type": "string"},
                    },
                },
                "emotional_pull": {
                    "type": "object",
                    "properties": {
                        "score": {"type": "integer"},
                        "diagnosis": {"type": "string"},
                        "prescription": {"type": "string"},
                    },
                },
                "platform_fit": {
                    "type": "object",
                    "properties": {
                        "score": {"type": "integer"},
                        "diagnosis": {"type": "string"},
                        "prescription": {"type": "string"},
                    },
                },
                "cta_power": {
                    "type": "object",
                    "properties": {
                        "score": {"type": "integer"},
                        "diagnosis": {"type": "string"},
                        "prescription": {"type": "string"},
                    },
                },
                "total_score": {"type": "integer"},
                "final_verdict": {"type": "string"},
                "top_priority_fix": {"type": "string"},
            },
        }

    def diagnose(self, ad_text: str, target_audience: str, platform: str) -> DiagnosisResult:
        prompt = f"""
أنت "طبيب الإعلانات" في منصة Adremix AI. فحص وتشخيص الإعلان بدقة وصراحة تسويقية كاملة.

📄 الإعلان:
\"\"\"
{ad_text}
\"\"\"

👥 الجمهور المستهدف: {target_audience}
📱 المنصة: {platform}

حلل في 5 محاور: الخطاف (hook)، وضوح القيمة (value_clarity)، الإقناع العاطفي (emotional_pull)، مناسب للمنصة (platform_fit)، الدعوة للإجراء (cta_power).
لكل محور: score من 10، diagnosis، prescription.
أضف total_score من 50، final_verdict (ناجح/يحتاج علاج)، top_priority_fix.
"""
        raw_res = gemini.generate(prompt, self.schema, config.TEMPERATURE_DOCTOR)
        return DiagnosisResult.model_validate(raw_res)
