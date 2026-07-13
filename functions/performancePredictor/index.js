const functions = require("firebase-functions");
const { generateWithGemini } = require("../shared/geminiClient");
const { buildPredictorPrompt } = require("./promptBuilder");

exports.performancePredictor = functions.https.onCall(async (data, context) => {
  const { product, adText, targetAudience, platform } = data;

  if (!adText) {
    throw new functions.https.HttpsError("invalid-argument", "الإعلان مطلوب.");
  }

  const prompt = buildPredictorPrompt({
    product: product || "منتج",
    adText,
    targetAudience: targetAudience || "عام",
    platform: platform || "TikTok"
  });

  const result = await generateWithGemini({
    prompt,
    temperature: 0.5,
    responseSchema: {
      type: "object",
      properties: {
        reach: { type: "object", properties: { estimatedReach: { type: "string" }, viralPotential: { type: "integer" }, reasonForViralScore: { type: "string" } } },
        engagement: { type: "object", properties: { estimatedEngagementRate: { type: "string" }, likesEstimate: { type: "string" }, sharesEstimate: { type: "string" }, commentsEstimate: { type: "string" }, savesEstimate: { type: "string" } } },
        sales: { type: "object", properties: { estimatedCTR: { type: "string" }, estimatedConversionRate: { type: "string" }, estimatedSalesValue: { type: "string" } } },
        strongestElement: { type: "string" },
        weakestElement: { type: "string" },
        overallScore: { type: "integer" },
        successProbability: { type: "string" },
        recommendation: { type: "string" }
      }
    }
  });

  return { success: true, ...result };
});
