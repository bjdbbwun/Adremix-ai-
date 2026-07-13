/**
 * Ad Doctor Prompt Builder
 */
function buildPrompt({ script, targetAudience, targetPlatform }) {
  return buildAdDoctorPrompt({
    adText: script,
    targetAudience,
    platform: targetPlatform
  });
}

function buildAdDoctorPrompt({ adText, targetAudience, platform }) {
  return `
أنت "طبيب الإعلانات" في منصة Adremix AI. أنت خبير تشخيص إعلاني، مهمتك فحص الإعلان بدقة وإعطاء تقرير طبي مفصل. كن صريحاً وقاسياً.

📄 الإعلان:
"""
${adText}
"""

👥 الجمهور المستهدف: ${targetAudience}
📱 المنصة: ${platform}

📋 حلل الإعلان في 5 محاور:
1. الخطاف (أول 3 ثوان) - score, diagnosis, prescription (خطاف بديل)
2. وضوح القيمة - score, diagnosis, prescription (أعد صياغة جملة القيمة)
3. الإقناع العاطفي - score, diagnosis, prescription (كلمة عاطفية مفقودة)
4. مناسب للمنصة - score, diagnosis, prescription (تكييف مع لغة المنصة)
5. الدعوة للإجراء (CTA) - score, diagnosis, prescription (CTA لا يُقاوم)

أضف totalScore من 50، finalVerdict (ناجح/يحتاج علاج)، topPriorityFix.
`;
}

module.exports = {
  buildPrompt,
  buildAdDoctorPrompt
};
