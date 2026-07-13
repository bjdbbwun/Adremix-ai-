/**
 * Ad Gap Analyzer Prompt Builder
 */

function buildGapAnalyzerPrompt({ productName, productDescription, category, targetAudience }) {
  return `
أنت محلل استخباراتي إعلاني في Adremix AI. اكتشف "الفراغ الاستراتيجي" في سوق ${category}.

🎯 المنتج: ${productName}
📝 وصفه: ${productDescription}
🏷️ الفئة: ${category}
👥 الجمهور: ${targetAudience}

📋 مراحل التحليل:
1. typicalAnglesUsed: 5 زوايا شائعة ومكررة، مع angleFatigueLevel من 10.
2. unusedAngles: 5 زوايا جديدة كلياً، مع whyUnused لكل منها.
3. contrarianAngle: زاوية جريئة عكس السوق، مع riskLevel و potentialReward.
4. topRecommendation: الزاوية رقم 1 للاستخدام حالاً، مع reason.
`;
}

function buildPrompt({ productName, productData, productDescription, category, targetAudience }) {
  return buildGapAnalyzerPrompt({
    productName,
    productDescription: productDescription || productData,
    category,
    targetAudience
  });
}

module.exports = {
  buildGapAnalyzerPrompt,
  buildPrompt
};
