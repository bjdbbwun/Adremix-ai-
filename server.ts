import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import http from "http";
import { spawn } from "child_process";
import fs from "fs";

dotenv.config();

function startPythonBackend() {
  console.log("Starting Python FastAPI backend...");
  const sitePackagesPath = path.join(process.cwd(), "adremix-engine", "site-packages");
  const env = {
    ...process.env,
    PYTHONPATH: sitePackagesPath
  };
  
  const apiPath = path.join(process.cwd(), "adremix-engine", "main_api.py");
  const logStream = fs.createWriteStream(path.join(process.cwd(), "python.log"), { flags: "a" });
  
  const startProcess = (command: string, args: string[]) => {
    const pyProcess = spawn(command, args, {
      env,
      stdio: "pipe"
    });
    
    pyProcess.stdout.pipe(logStream);
    pyProcess.stderr.pipe(logStream);
    
    pyProcess.on("error", (err) => {
      console.error(`Failed to start Python backend via ${command}:`, err);
      logStream.write(`Failed to start Python backend via ${command}: ${err.message}\n`);
      
      // Try fallback if python3 fails
      if (command === "python3") {
        console.log("Attempting fallback to 'python' command...");
        startProcess("python", ["-u", apiPath]);
      }
    });
    
    return pyProcess;
  };
  
  startProcess("python3", ["-u", apiPath]);
}

async function startServer() {
  // Start Python API backend in the background
  startPythonBackend();

  const app = express();
  const PORT = 3000;

  // Proxy to FastAPI Python server on port 8001 (defined BEFORE body parser to preserve stream)
  const pythonApiEndpoints = [
    "/run-campaign",
    "/diagnose",
    "/predict",
    "/analyze-gap",
    "/history",
    "/docs",
    "/openapi.json",
    "/redoc"
  ];

  pythonApiEndpoints.forEach((endpoint) => {
    app.all(endpoint, (req, res) => {
      const options = {
        hostname: "127.0.0.1",
        port: 8001,
        path: req.originalUrl,
        method: req.method,
        headers: {
          ...req.headers,
          host: "127.0.0.1:8001",
        },
      };

      const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      });

      proxyReq.on("error", (err) => {
        console.error(`Proxy error for ${endpoint}:`, err);
        res.status(502).json({ error: "Bad Gateway: Python API is not responding. Ensure main_api.py is running." });
      });

      req.pipe(proxyReq, { end: true });
    });
  });

  app.use(express.json());

  // Initialize Gemini client safely using process.env.GEMINI_API_KEY
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  }) : null;

  // Core generation route using the recommended gemini-3.5-flash model and structured JSON responseSchema
  app.post("/api/transform", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: "Gemini API key is missing. Please configure GEMINI_API_KEY in Settings > Secrets."
        });
      }

      const { productName, productDescription, targetAudience, campaignGoal, platforms, toneStyle, abTestMode } = req.body;

      if (!productName || !productDescription) {
        return res.status(400).json({ error: "Product Name and Description are required." });
      }

      const activePlatforms = platforms && platforms.length > 0 ? platforms : ["tiktok", "instagram"];

      let prompt = "";
      let responseSchema: any = {};

      if (abTestMode) {
        prompt = `You are an elite growth marketer, copywriter, and direct-response advertising strategist.
Analyze the following product information and generate two distinct, high-converting, native, platform-optimized ad variations (Variation A and Variation B) for A/B testing on the selected platforms.

PRODUCT DETAILS:
- Product Name: ${productName}
- Product Description: ${productDescription}
- Target Audience Focus: ${targetAudience || "General target demographics for this product category"}
- Primary Campaign Goal: ${campaignGoal || "Conversions, high click-through rates, and sales"}
- Tone & Creative Style: ${toneStyle || "Energetic, engaging, problem-solution narrative"}

A/B TESTING DIRECTIVES:
- Variation A must focus on a direct, value-first response angle.
- Variation B must focus on a highly engaging UGC, storytelling or pattern-interrupt angle (completely distinct from Variation A).
- For each platform (TikTok, Instagram, Facebook, YouTube), you must create both Variation A (returned under 'platforms') and Variation B (returned under 'platformsB').
- Both variations must have completely different scroll-stopper hooks and script flows.

Configure specific, platform-native optimizations:
- TikTok: Hook must stop scrolling within 1.5s. Focus on UGC format, text-on-screen, trend audio references, and lightning-fast cuts.
- Instagram: Aesthetic focus, relatable human lifestyle story, emotional tension-to-relief curve, clear value props for Reels.
- Facebook: Visual problem-solution overlay, clear social proof tags, explicit pain points, longer detailed direct captions.
- YouTube: Structured 15s/30s story beats. Strong pattern interrupt hook, visual product demo body, clear audio CTA and end-screen text.

Deliver the result strictly adhering to the JSON schema specified, with 'isABTest' set to true, and an extensive comparison highlighting the critical differences in hook strategy and script flow between the two variations. Ensure the comparison provides actionable insights for performance prediction.`;

        responseSchema = {
          type: Type.OBJECT,
          properties: {
            isABTest: { type: Type.BOOLEAN, description: "Must be true" },
            platforms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platformName: { type: Type.STRING, description: "Platforms like TikTok, Instagram, Facebook, YouTube" },
                  hooks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING, description: "Script hook or overlay statement for Variation A" },
                        type: { type: Type.STRING, description: "Hook classification: e.g., Visual Pattern Interrupt, Curiosity Gap, Pain Point Callout" },
                        conversionRating: { type: Type.INTEGER, description: "Estimated conversion potential percentage score from 1-100" }
                      },
                      required: ["text", "type", "conversionRating"]
                    },
                    description: "Exactly 3 platform-native high-performing hooks for Variation A"
                  },
                  videoScript: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING, description: "Variation A ad script title" },
                      duration: { type: Type.INTEGER, description: "Target script length in seconds" },
                      scenes: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.INTEGER, description: "Scene sequence number starting from 1" },
                            section: { type: Type.STRING, description: "Hook, Body, or Call to Action" },
                            visual: { type: Type.STRING, description: "Detailed visual instructions, actions, gestures, and typography overlays" },
                            audio: { type: Type.STRING, description: "Spoken voiceover copy, sound effects, and musical cues" },
                            textOverlay: { type: Type.STRING, description: "Text that must appear on screen" }
                          },
                          required: ["id", "section", "visual", "audio", "textOverlay"]
                        }
                      }
                    },
                    required: ["title", "duration", "scenes"]
                  },
                  socialPost: {
                    type: Type.OBJECT,
                    properties: {
                      caption: { type: Type.STRING, description: "Primary post copy, structured with clear spacings and emoji markers" },
                      hashtags: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Platform-optimized tag array"
                      }
                    },
                    required: ["caption", "hashtags"]
                  },
                  targetingTips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Targeting interests, custom behaviors, demographics, and placement recommendations"
                  }
                },
                required: ["platformName", "hooks", "videoScript", "socialPost", "targetingTips"]
              }
            },
            platformsB: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platformName: { type: Type.STRING, description: "Platforms like TikTok, Instagram, Facebook, YouTube" },
                  hooks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING, description: "Script hook or overlay statement for Variation B" },
                        type: { type: Type.STRING, description: "Hook classification: e.g., Visual Pattern Interrupt, Curiosity Gap, Pain Point Callout" },
                        conversionRating: { type: Type.INTEGER, description: "Estimated conversion potential percentage score from 1-100" }
                      },
                      required: ["text", "type", "conversionRating"]
                    },
                    description: "Exactly 3 platform-native high-performing hooks for Variation B"
                  },
                  videoScript: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING, description: "Variation B ad script title" },
                      duration: { type: Type.INTEGER, description: "Target script length in seconds" },
                      scenes: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.INTEGER, description: "Scene sequence number starting from 1" },
                            section: { type: Type.STRING, description: "Hook, Body, or Call to Action" },
                            visual: { type: Type.STRING, description: "Detailed visual instructions, actions, gestures, and typography overlays" },
                            audio: { type: Type.STRING, description: "Spoken voiceover copy, sound effects, and musical cues" },
                            textOverlay: { type: Type.STRING, description: "Text that must appear on screen" }
                          },
                          required: ["id", "section", "visual", "audio", "textOverlay"]
                        }
                      }
                    },
                    required: ["title", "duration", "scenes"]
                  },
                  socialPost: {
                    type: Type.OBJECT,
                    properties: {
                      caption: { type: Type.STRING, description: "Primary post copy, structured with clear spacings and emoji markers" },
                      hashtags: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Platform-optimized tag array"
                      }
                    },
                    required: ["caption", "hashtags"]
                  },
                  targetingTips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Targeting interests, custom behaviors, demographics, and placement recommendations"
                  }
                },
                required: ["platformName", "hooks", "videoScript", "socialPost", "targetingTips"]
              }
            },
            abComparison: {
              type: Type.OBJECT,
              properties: {
                hookStrategyComparison: { type: Type.STRING, description: "Explain the differences in hook strategies between Variation A and Variation B." },
                scriptFlowComparison: { type: Type.STRING, description: "Explain the differences in script flows, highlighting why each fits its respective angle." },
                winningHypothesis: { type: Type.STRING, description: "Formulate a clear hypothesis on which variation is likely to win and why under what conditions." }
              },
              required: ["hookStrategyComparison", "scriptFlowComparison", "winningHypothesis"]
            }
          },
          required: ["isABTest", "platforms", "platformsB", "abComparison"]
        };
      } else {
        prompt = `You are an elite growth marketer, copywriter, and direct-response advertising strategist.
Analyze the following product information and generate high-converting, native, platform-optimized ad concepts, hooks, video scripts, and social captions.

PRODUCT DETAILS:
- Product Name: ${productName}
- Product Description: ${productDescription}
- Target Audience Focus: ${targetAudience || "General target demographics for this product category"}
- Primary Campaign Goal: ${campaignGoal || "Conversions, high click-through rates, and sales"}
- Tone & Creative Style: ${toneStyle || "Energetic, engaging, problem-solution narrative"}

Configure specific, platform-native optimizations:
- TikTok: Hook must stop scrolling within 1.5s. Focus on UGC format, text-on-screen, trend audio references, and lightning-fast cuts.
- Instagram: Aesthetic focus, relatable human lifestyle story, emotional tension-to-relief curve, clear value props for Reels.
- Facebook: Visual problem-solution overlay, clear social proof tags, explicit pain points, longer detailed direct captions.
- YouTube: Structured 15s/30s story beats. Strong pattern interrupt hook, visual product demo body, clear audio CTA and end-screen text.

Deliver the result strictly adhering to the JSON schema specified. Each platform must have unique hooks, a tailored multi-scene video script, social caption copy, and specific targeting recommendations tailored to maximize conversion potential.`;

        responseSchema = {
          type: Type.OBJECT,
          properties: {
            platforms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platformName: { type: Type.STRING, description: "Platforms like TikTok, Instagram, Facebook, YouTube" },
                  hooks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING, description: "Script hook or overlay statement" },
                        type: { type: Type.STRING, description: "Hook classification: e.g., Visual Pattern Interrupt, Curiosity Gap, Pain Point Callout" },
                        conversionRating: { type: Type.INTEGER, description: "Estimated conversion potential percentage score from 1-100" }
                      },
                      required: ["text", "type", "conversionRating"]
                    },
                    description: "Exactly 3 platform-native high-performing hooks"
                  },
                  videoScript: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING, description: "High-converting ad script title" },
                      duration: { type: Type.INTEGER, description: "Target script length in seconds" },
                      scenes: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.INTEGER, description: "Scene sequence number starting from 1" },
                            section: { type: Type.STRING, description: "Hook, Body, or Call to Action" },
                            visual: { type: Type.STRING, description: "Detailed visual instructions, actions, gestures, and typography overlays" },
                            audio: { type: Type.STRING, description: "Spoken voiceover copy, sound effects, and musical cues" },
                            textOverlay: { type: Type.STRING, description: "Text that must appear on screen" }
                          },
                          required: ["id", "section", "visual", "audio", "textOverlay"]
                        }
                      }
                    },
                    required: ["title", "duration", "scenes"]
                  },
                  socialPost: {
                    type: Type.OBJECT,
                    properties: {
                      caption: { type: Type.STRING, description: "Primary post copy, structured with clear spacings and emoji markers" },
                      hashtags: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Platform-optimized tag array"
                      }
                    },
                    required: ["caption", "hashtags"]
                  },
                  targetingTips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Targeting interests, custom behaviors, demographics, and placement recommendations"
                  }
                },
                required: ["platformName", "hooks", "videoScript", "socialPost", "targetingTips"]
              }
            }
          },
          required: ["platforms"]
        };
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema
        }
      });

      const responseText = response.text;
      if (!responseText) {
        return res.status(500).json({ error: "The AI did not generate a response. Please check input parameters." });
      }

      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);
    } catch (error) {
      console.error("Express transformation error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Internal system error occurred during AI ad creation."
      });
    }
  });

  // Serve Vite in dev, compiled static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
