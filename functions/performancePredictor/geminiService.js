const { generateWithGemini } = require("../shared/geminiClient");
const { buildPrompt } = require("./promptBuilder");

async function predictPerformance(data) {
  const prompt = buildPrompt(data);

  return generateWithGemini({
    prompt,
    modelName: "gemini-1.5-flash",
    responseSchema: {
      type: "OBJECT",
      properties: {
        impressions: {
          type: "OBJECT",
          properties: {
            estimatedReach: { type: "STRING" },
            viralPotential: { type: "INTEGER" },
            reasonForViralScore: { type: "STRING" }
          },
          required: ["estimatedReach", "viralPotential", "reasonForViralScore"]
        },
        engagement: {
          type: "OBJECT",
          properties: {
            estimatedEngagementRate: { type: "STRING" },
            likesEstimate: { type: "STRING" },
            sharesEstimate: { type: "STRING" },
            commentsEstimate: { type: "STRING" },
            savesEstimate: { type: "STRING" }
          },
          required: [
            "estimatedEngagementRate",
            "likesEstimate",
            "sharesEstimate",
            "commentsEstimate",
            "savesEstimate"
          ]
        },
        conversion: {
          type: "OBJECT",
          properties: {
            estimatedCTR: { type: "STRING" },
            estimatedConversionRate: { type: "STRING" },
            estimatedSalesValue: { type: "STRING" }
          },
          required: ["estimatedCTR", "estimatedConversionRate", "estimatedSalesValue"]
        },
        analysis: {
          type: "OBJECT",
          properties: {
            strongestElement: { type: "STRING" },
            weakestElement: { type: "STRING" }
          },
          required: ["strongestElement", "weakestElement"]
        },
        finalSummary: {
          type: "OBJECT",
          properties: {
            overallScore: { type: "INTEGER" },
            successProbability: { type: "STRING" },
            recommendation: { type: "STRING" }
          },
          required: ["overallScore", "successProbability", "recommendation"]
        }
      },
      required: ["impressions", "engagement", "conversion", "analysis", "finalSummary"]
    }
  });
}

module.exports = {
  predictPerformance
};
