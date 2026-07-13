const functions = require("firebase-functions");
const { generateWithGemini } = require("../shared/geminiClient");
const { buildAdDoctorPrompt } = require("./promptBuilder");

exports.adDoctor = functions.https.onCall(async (data, context) => {
  const { adText, targetAudience, platform } = data;

  if (!adText) {
    throw new functions.https.HttpsError("invalid-argument", "الإعلان مطلوب.");
  }

  const prompt = buildAdDoctorPrompt({
    adText,
    targetAudience: targetAudience || "عام",
    platform: platform || "TikTok"
  });

  const result = await generateWithGemini({
    prompt,
    temperature: 0.7,
    responseSchema: {
      type: "object",
      properties: {
        hook: { type: "object", properties: { score: { type: "integer" }, diagnosis: { type: "string" }, prescription: { type: "string" } } },
        valueClarity: { type: "object", properties: { score: { type: "integer" }, diagnosis: { type: "string" }, prescription: { type: "string" } } },
        emotionalPull: { type: "object", properties: { score: { type: "integer" }, diagnosis: { type: "string" }, prescription: { type: "string" } } },
        platformFit: { type: "object", properties: { score: { type: "integer" }, diagnosis: { type: "string" }, prescription: { type: "string" } } },
        cta: { type: "object", properties: { score: { type: "integer" }, diagnosis: { type: "string" }, prescription: { type: "string" } } },
        totalScore: { type: "integer" },
        finalVerdict: { type: "string" },
        topPriorityFix: { type: "string" }
      }
    }
  });

  return { success: true, ...result };
});
