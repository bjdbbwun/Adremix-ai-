from models.schemas import GapAnalysisResult
from utils.gemini_client import gemini
from config import config

class GapAnalyzer:
    def __init__(self, client=None):
        self.schema = {
            "type": "object",
            "properties": {
                "typical_angles": {"type": "array", "items": {"type": "string"}},
                "fatigue_level": {"type": "integer"},
                "unused_angles": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "angle": {"type": "string"},
                            "why_unused": {"type": "string"},
                        },
                    },
                },
                "contrarian_angle": {
                    "type": "object",
                    "properties": {
                        "angle": {"type": "string"},
                        "risk_level": {"type": "string"},
                        "potential_reward": {"type": "string"},
                    },
                },
                "top_recommendation": {"type": "string"},
                "reason": {"type": "string"},
            },
        }

    def analyze(
        self,
        product_name: str,
        product_description: str,
        category: str,
        target_audience: str,
    ) -> dict:
        prompt = f"""
أنت محلل استخباراتي إعلاني في Adremix AI. اكتشف الفراغ الاستراتيجي في السوق.

🎯 المنتج: {product_name}
📝 وصفه: {product_description}
🏷️ الفئة: {category}
👥 الجمهور: {target_audience}

أخرج:
1. typical_angles: 5 زوايا شائعة ومكررة
2. fatigue_level: درجة إرهاق الجمهور من 10
3. unused_angles: 5 زوايا جديدة كلياً مع سبب تجاهلها
4. contrarian_angle: زاوية جريئة عكس السوق مع مستوى المخاطرة والمكافأة
5. top_recommendation و reason: الزاوية رقم 1 للاستخدام حالاً
"""
        return gemini.generate(prompt, self.schema, config.TEMPERATURE_GAP)

    def analyze_gap(
        self,
        product_name: str,
        product_description: str,
        category: str,
        target_audience: str,
    ) -> GapAnalysisResult:
        raw_res = self.analyze(product_name, product_description, category, target_audience)
        return GapAnalysisResult.model_validate(raw_res)

# Maintain alias compatibility for imports
AdGapAnalyzer = GapAnalyzer
