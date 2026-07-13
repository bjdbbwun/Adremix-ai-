const { generateWithGemini } = require("../shared/geminiClient");
const { buildPrompt } = require("./promptBuilder");

async function analyzeGap(data) {
  const prompt = buildPrompt(data);

  return generateWithGemini({
    prompt,
    modelName: "gemini-1.5-flash",
    responseSchema: {
      type: "OBJECT",
      properties: {
        battlefield: {
          type: "OBJECT",
          properties: {
            typicalAnglesUsed: {
              type: "ARRAY",
              items: { type: "STRING" }
            },
            angleFatigueLevel: { type: "INTEGER" }
          },
          required: ["typicalAnglesUsed", "angleFatigueLevel"]
        },
        unchartedTerritory: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              angle: { type: "STRING" },
              whyUnused: { type: "STRING" }
            },
            required: ["angle", "whyUnused"]
          }
        },
        contrarianAngle: {
          type: "OBJECT",
          properties: {
            angle: { type: "STRING" },
            riskLevel: { type: "STRING" },
            potentialReward: { type: "STRING" }
          },
          required: ["angle", "riskLevel", "potentialReward"]
        },
        strategySummary: {
          type: "OBJECT",
          properties: {
            topRecommendation: { type: "STRING" },
            reason: { type: "STRING" }
          },
          required: ["topRecommendation", "reason"]
        }
      },
      required: ["battlefield", "unchartedTerritory", "contrarianAngle", "strategySummary"]
    }
  });
}

module.exports = {
  analyzeGap
};
