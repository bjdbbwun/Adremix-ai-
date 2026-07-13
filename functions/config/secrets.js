/**
 * Config and secrets management for Cloud Functions
 */
module.exports = {
  getGeminiApiKey: () => {
    // Retrieve from environment variables or Firebase Config/SecretsManager
    return process.env.GEMINI_API_KEY || "";
  }
};
