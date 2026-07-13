const { generateWithGemini } = require("../shared/geminiClient");
const { buildPrompt } = require("./promptBuilder");

async function analyzeAd(data) {
  const prompt = buildPrompt(data);

  return generateWithGemini({
    prompt,
    modelName: "gemini-1.5-flash",
    responseSchema: {
      type: "OBJECT",
      properties: {
        hookAnalysis: {
          type: "OBJECT",
          properties: {
            score: { type: "INTEGER" },
            diagnosis: { type: "STRING" },
            prescription: { type: "STRING" }
          },
          required: ["score", "diagnosis", "prescription"]
        },
        valueProposition: {
          type: "OBJECT",
          properties: {
            score: { type: "INTEGER" },
            diagnosis: { type: "STRING" },
            prescription: { type: "STRING" }
          },
          required: ["score", "diagnosis", "prescription"]
        },
        emotionalPull: {
          type: "OBJECT",
          properties: {
            score: { type: "INTEGER" },
            diagnosis: { type: "STRING" },
            prescription: { type: "STRING" }
          },
          required: ["score", "diagnosis", "prescription"]
        },
        platformFit: {
          type: "OBJECT",
          properties: {
            score: { type: "INTEGER" },
            diagnosis: { type: "STRING" },
            prescription: { type: "STRING" }
          },
          required: ["score", "diagnosis", "prescription"]
        },
        ctaPower: {
          type: "OBJECT",
          properties: {
            score: { type: "INTEGER" },
            diagnosis: { type: "STRING" },
            prescription: { type: "STRING" }
          },
          required: ["score", "diagnosis", "prescription"]
        },
        finalVerdict: {
          type: "OBJECT",
          properties: {
            totalScore: { type: "INTEGER" },
            verdict: { type: "STRING" },
            topPriorityFix: { type: "STRING" }
          },
          required: ["totalScore", "verdict", "topPriorityFix"]
        }
      },
      required: [
        "hookAnalysis",
        "valueProposition",
        "emotionalPull",
        "platformFit",
        "ctaPower",
        "finalVerdict"
      ]
    }
  });
}

module.exports = {
  analyzeAd
};
