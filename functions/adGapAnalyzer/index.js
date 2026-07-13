const functions = require("firebase-functions");
const { generateWithGemini } = require("../shared/geminiClient");
const { buildGapAnalyzerPrompt } = require("./promptBuilder");

exports.adGapAnalyzer = functions.https.onCall(async (data, context) => {
  const { productName, productDescription, category, targetAudience } = data;

  if (!productName) {
    throw new functions.https.HttpsError("invalid-argument", "اسم المنتج مطلوب.");
  }

  const prompt = buildGapAnalyzerPrompt({
    productName,
    productDescription: productDescription || "",
    category: category || "عامة",
    targetAudience: targetAudience || "عام"
  });

  const result = await generateWithGemini({
    prompt,
    temperature: 1.0,
    responseSchema: {
      type: "object",
      properties: {
        typicalAnglesUsed: { type: "array", items: { type: "string" } },
        angleFatigueLevel: { type: "integer" },
        unusedAngles: { type: "array", items: { type: "object", properties: { angle: { type: "string" }, whyUnused: { type: "string" } } } },
        contrarianAngle: { type: "object", properties: { angle: { type: "string" }, riskLevel: { type: "string" }, potentialReward: { type: "string" } } },
        topRecommendation: { type: "string" },
        reason: { type: "string" }
      }
    }
  });

  return { success: true, ...result };
});
