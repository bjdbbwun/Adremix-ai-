"""
🚀 Adremix AI - واجهة API الرئيسية
منصة الذكاء الاصطناعي الإعلانية المتكاملة
"""

import sys
from pathlib import Path

# إضافة مجلد المشروع إلى مسار Python لضمان استيراد الوحدات بشكل صحيح
sys.path.insert(0, str(Path(__file__).parent))

import json
import os
from datetime import datetime
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from engine.campaign_runner import CampaignRunner
from engine.ad_doctor import AdDoctor
from engine.predictor import Predictor
from engine.gap_analyzer import GapAnalyzer
from models.schemas import CampaignInput, ProductInput, Platform, Tone

# ─── تهيئة التطبيق ───────────────────────────────
app = FastAPI(
    title="Adremix AI API",
    description="منصة الذكاء الاصطناعي الإعلانية المتكاملة",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── المجلدات ────────────────────────────────────
OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ─── نماذج الطلبات ───────────────────────────────
class CampaignRequest(BaseModel):
    product: dict
    target_audience: str = "عام"
    tone: str = "احترافية"
    platform: str = "TikTok"

class DiagnoseRequest(BaseModel):
    ad_text: str
    target_audience: str = "عام"
    platform: str = "TikTok"

class PredictRequest(BaseModel):
    product: str
    ad_text: str
    target_audience: str = "عام"
    platform: str = "TikTok"

class GapRequest(BaseModel):
    product_name: str
    product_description: str
    category: str = "عامة"
    target_audience: str = "عام"

# ─── نقطة البداية ────────────────────────────────
@app.get("/")
def root():
    return {
        "name": "Adremix AI API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": [
            "POST /run-campaign",
            "POST /diagnose",
            "POST /predict",
            "POST /analyze-gap",
            "GET /history",
        ],
    }

# ─── تشغيل حملة كاملة ────────────────────────────
@app.post("/run-campaign")
def run_campaign(request: CampaignRequest):
    """تشغيل المحرك الموحد: سوق ← توليد ← تشخيص ← توقع"""
    try:
        product = ProductInput(**request.product)
        campaign = CampaignInput(
            product=product,
            target_audience=request.target_audience,
            tone=Tone(request.tone),
            platform=Platform(request.platform),
        )

        runner = CampaignRunner()
        result = runner.run_full_campaign(campaign)

        # حفظ التقرير
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"campaign_{product.name}_{timestamp}.json"
        filepath = os.path.join(OUTPUT_DIR, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)

        result["report_file"] = filename
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"فشل تشغيل الحملة: {str(e)}")

# ─── تشخيص إعلان ─────────────────────────────────
@app.post("/diagnose")
def diagnose_ad(request: DiagnoseRequest):
    """تشخيص إعلان في 5 محاور مع وصفة علاجية"""
    try:
        doctor = AdDoctor()
        result = doctor.diagnose(
            ad_text=request.ad_text,
            target_audience=request.target_audience,
            platform=request.platform,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"فشل التشخيص: {str(e)}")

# ─── توقع أداء إعلان ─────────────────────────────
@app.post("/predict")
def predict_performance(request: PredictRequest):
    """توقع الأداء الرقمي قبل النشر"""
    try:
        predictor = Predictor()
        result = predictor.predict(
            product=request.product,
            ad_text=request.ad_text,
            target_audience=request.target_audience,
            platform=request.platform,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"فشل التوقع: {str(e)}")

# ─── تحليل الفجوات الإعلانية ──────────────────────
@app.post("/analyze-gap")
def analyze_gap(request: GapRequest):
    """تحليل فجوات السوق والزوايا غير المستخدمة"""
    try:
        analyzer = GapAnalyzer()
        result = analyzer.analyze(
            product_name=request.product_name,
            product_description=request.product_description,
            category=request.category,
            target_audience=request.target_audience,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"فشل تحليل الفجوات: {str(e)}")

# ─── سجل التقارير ────────────────────────────────
@app.get("/history")
def get_history():
    """استعراض جميع التقارير المحفوظة"""
    try:
        files = []
        if os.path.exists(OUTPUT_DIR):
            for filename in os.listdir(OUTPUT_DIR):
                if filename.endswith(".json"):
                    filepath = os.path.join(OUTPUT_DIR, filename)
                    stat = os.stat(filepath)
                    files.append({
                        "filename": filename,
                        "size_kb": round(stat.st_size / 1024, 2),
                        "created": datetime.fromtimestamp(stat.st_ctime).isoformat(),
                    })
        return {"total": len(files), "reports": sorted(files, key=lambda x: x["created"], reverse=True)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"فشل قراءة السجل: {str(e)}")

# ─── نقطة التشغيل ────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
