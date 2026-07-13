/**
 * Performance Predictor Prompt Builder
 */

function buildPredictorPrompt({ product, adText, targetAudience, platform }) {
  return `
أنت "متنبئ الأداء" في Adremix AI. مهمتك إعطاء توقعات رقمية دقيقة لأداء الإعلان قبل نشره.

🎯 المنتج: ${product}
📄 الإعلان:
"""
${adText}
"""
👥 الجمهور: ${targetAudience}
📱 المنصة: ${platform}

📋 أخرج توقعاتك الرقمية:
1. reach: estimatedReach, viralPotential من 10, reasonForViralScore.
2. engagement: estimatedEngagementRate, likesEstimate, sharesEstimate, commentsEstimate, savesEstimate.
3. sales: estimatedCTR, estimatedConversionRate, estimatedSalesValue.
4. strongestElement, weakestElement.
5. overallScore من 100, successProbability, recommendation (انشر فوراً / عدّله أولاً).
`;
}

function buildPrompt({ productName, price, script, targetAudience, targetPlatform }) {
  return buildPredictorPrompt({
    product: `${productName}${price ? ` (سعر: ${price})` : ""}`,
    adText: script,
    targetAudience,
    platform: targetPlatform
  });
}

module.exports = {
  buildPredictorPrompt,
  buildPrompt
};
