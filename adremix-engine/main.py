#!/usr/bin/env python3
"""
🚀 Adremix AI - المحرك الموحد
منصة الذكاء الاصطناعي الإعلانية المتكاملة
"""

import sys
from pathlib import Path

# إضافة مجلد المشروع إلى مسار Python لضمان استيراد الوحدات بشكل صحيح
sys.path.insert(0, str(Path(__file__).parent))

import json
import os
from datetime import datetime
from config import config
from models.schemas import CampaignInput, ProductInput, Platform, Tone
from engine.campaign_runner import CampaignRunner

def print_banner():
    print("""
╔══════════════════════════════════════════════╗
║          🚀 Adremix AI - المحرك الموحد        ║
║     منصة الذكاء الاصطناعي الإعلانية المتكاملة   ║
╚══════════════════════════════════════════════╝
    """)

def save_report(result: dict, filename: str = None):
    os.makedirs(config.OUTPUT_DIR, exist_ok=True)
    if filename is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"campaign_report_{timestamp}.json"

    filepath = os.path.join(config.OUTPUT_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"\n📁 تم حفظ التقرير: {filepath}")

def main():
    print_banner()
    config.validate()

    # بيانات المنتج التجريبية
    campaign = CampaignInput(
        product=ProductInput(
            name="EcoFlask Pro",
            description="زجاجة مياه ذكية تحافظ على الحرارة والبرودة 24 ساعة",
            price="199 ريال",
            features="عزل حراري، شاشة درجة حرارة، شحن USB، سعة 750ml",
            category="أدوات رياضية",
        ),
        target_audience="الرياضيين، عشاق الهواء الطلق، 20-35 سنة",
        tone=Tone.URGENT,
        platform=Platform.TIKTOK,
    )

    print(f"📦 المنتج: {campaign.product.name}")
    print(f"👥 الجمهور: {campaign.target_audience}")
    print(f"📱 المنصة: {campaign.platform.value}")
    print(f"🎭 النبرة: {campaign.tone.value}")
    print("\n")

    runner = CampaignRunner()
    result = runner.run_full_campaign(campaign)

    save_report(result)

    print("\n" + "=" * 60)
    print("✨ اكتملت جميع المراحل بنجاح!")
    print("=" * 60)

    return result

if __name__ == "__main__":
    main()
