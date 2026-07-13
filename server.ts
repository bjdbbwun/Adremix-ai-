import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Lazy-loaded Gemini client getter to prevent crashing on startup if key is missing
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required but missing. Please configure it in your Settings.");
    }
    geminiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return geminiClient;
}

// Generate Ad Copy Endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const { productName, productDescription, platform, tone, language } = req.body;

    if (!productName || !productDescription) {
      return res.status(400).json({ error: "Product name and description are required" });
    }

    const ai = getGeminiClient();

    const targetLang = language === "ar" ? "Arabic" : "English";

    // Detailed prompt tailored for ad generation with precise constraints
    const systemInstruction = `You are an elite, high-converting social media copywriter and conversion rate optimization (CRO) expert. 
Your objective is to draft viral attention-grabbing ad copy for the product provided by the user.

CRITICAL INSTRUCTIONS:
1. All generated text (hooks, script, and caption) MUST be written in fluent, native, engaging, and modern ${targetLang}.
2. Use appropriate formatting, spacing, and emojis relevant to the selected platform (${platform}) and tone (${tone}).
3. Make sure the hooks are punchy, direct, and capture attention in under 3 seconds.
4. The video script must follow a clear structure: Hook (opener), Body (benefits/problem-solving), and CTA (Call to Action/Buy now).
5. The caption must be ready-to-use with a mix of high-converting words, structured emojis, and relevant social media marketing hashtags.
6. Absolutely do not include any markdown bolding (* or **) or other formatting markers inside the JSON strings themselves, keep them clean and ready-to-copy.`;

    const userPrompt = `Generate a high-converting ad campaign for:
Product Name: "${productName}"
Product Description: "${productDescription}"
Target Platform: ${platform}
Ad Tone/Vibe: ${tone}

Ensure the output matches the required JSON schema structure exactly.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hooks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of exactly 3 different attention hooks/opening lines optimized for the platform and tone."
            },
            script: {
              type: Type.OBJECT,
              properties: {
                hook: { type: Type.STRING, description: "Opening 3 seconds attention-grabbing script sentence." },
                body: { type: Type.STRING, description: "The core video script explaining benefits, solving problems, and presenting the offer." },
                cta: { type: Type.STRING, description: "The final strong Call to Action script line directing viewers where to buy." }
              },
              required: ["hook", "body", "cta"]
            },
            caption: {
              type: Type.STRING,
              description: "A highly engaging social media caption/description with structured bullet points, emojis, and relevant hashtags."
            }
          },
          required: ["hooks", "script", "caption"]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No response text returned from Gemini API");
    }

    const parsedOutput = JSON.parse(textOutput);
    return res.json({ output: parsedOutput });

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return res.status(500).json({ 
      error: error.message || "An error occurred during ad generation. Please try again." 
    });
  }
});

// Serve frontend build in production
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// Fallback to index.html for React SPA router
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) {
        // Fallback if build hasn't run yet or we are in development
        res.status(200).send("Vite Development Server handles frontend. API is active on port 3001.");
      }
    });
  } else {
    res.status(404).json({ error: "API Route Not Found" });
  }
});

// Configure Port
const isProd = process.env.NODE_ENV === "production";
const PORT = isProd ? 3000 : 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} (isProd: ${isProd})`);
});
