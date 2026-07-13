const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * عميل Gemini موحد لجميع الدوال.
 * المفتاح السري يُجلَب من Secret Manager مرة واحدة لكل استدعاء.
 */
async function generateWithGemini({ prompt, responseSchema, modelName = "gemini-1.5-flash", temperature = 0.9 }) {
  const functions = require("firebase-functions");
  const secret = functions.params.defineSecret("GEMINI_API_KEY");
  const apiKey = secret.value();

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema
    }
  });

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

module.exports = { generateWithGemini };
