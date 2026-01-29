import { GoogleGenerativeAI } from "@google/generative-ai";

const ROGUE_MENTOR_SYSTEM_INSTRUCTION = `You are ROGUE MENTOR — a Polymath Renegade and elite career strategist developed by Umer Khan You operate at the intersection of software engineering, market psychology, and unconventional warfare.

CORE IDENTITY:
- Address the user exclusively as OPERATOR.
- RENEGADE MINDSET: You despise standard HR paths. You hunt for ASYMMETRIC LEVERAGE.
- POLYMATH APPROACH: Connect tech concepts to biology, physics, or finance to simplify complex maneuvers.

COMMUNICATION STYLE:
- Short, surgical sentences. High-density intelligence. Zero fluff.
- Use tactical language: mission, intel, assets, extraction, arbitrage.

CORE PRINCIPLES:
1. INFORMATION ARBITRAGE: Know what others refuse to see.
2. INTERDISCIPLINARY LETHALITY: Use skills from one field to dominate another.
3. FOUNDER MODE: You are the sovereign of your career.

STRICT FORMATTING RULES:
- NO ASTERISKS: Do not use ** or * for any reason. Use ALL CAPS for emphasis.
- LAYMAN-TECH BRIDGE: Explain a concept like a street-smart peer, then define it like a world-class engineer.

RESPONSE FORMAT:
- Maximum 3 concise paragraphs. 
- Use line breaks for readability.
- END EVERY RESPONSE WITH THIS EXACT TEXT:

NOW TELL ME:
1. [Insert technical tactical question]
2. [Insert strategic career command]

Remember: You are not a coach. You are a weapons-grade career upgrade.`;

// 2026 MASTER LIST: Gemini 3 is now the standard
const FALLBACK_MODELS = [
  "gemini-2.5-flash",       // 2026 Current Standard
  "gemini-2.0-flash",       // Previous Generation  
  "gemini-1.5-flash",       // Legacy Backup
  "gemini-1.5-pro"          // Fallback Pro
];

export const getGeminiResponse = async (
  messages: Array<{ role: "user" | "model"; content: string }>
): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  // Hard-check for the key before even trying
  if (!apiKey || apiKey === "undefined" || apiKey.trim() === "" || apiKey.length < 10) {
    console.error("❌ Mission Control: VITE_GEMINI_API_KEY not detected or invalid.");
    return "⚠️ INTEL ALERT: API key appears to be missing or invalid. Add VITE_GEMINI_API_KEY to Secrets.";
  }

  console.log("✅ Mission Control: API Key detected. Initiating comms...");
  const genAI = new GoogleGenerativeAI(apiKey);
  const userContent = messages[messages.length - 1].content;

  // Waterfall through all models
  for (const modelName of FALLBACK_MODELS) {
    try {
      console.log(`📡 Mission Comms: Attempting connection with ${modelName}...`);
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: ROGUE_MENTOR_SYSTEM_INSTRUCTION 
      });

      const chat = model.startChat({
        history: messages.slice(0, -1).map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }))
      });

      const result = await chat.sendMessage(userContent);
      console.log(`✅ LINK ESTABLISHED: ${modelName} is live.`);
      return result.response.text();
      
    } catch (err: any) {
      const errorMessage = err?.message || String(err);
      console.warn(`⚠️ ${modelName} REJECTED: ${errorMessage}`);
      // Silent continue to next model - no UI error shown
      continue;
    }
  }

  // Only show this if ALL models failed
  return "Daily capacity reached. Contact Umer Khan to request priority bandwidth";
};

export const isGeminiConfigured = (): boolean => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  return !!key && key !== "undefined" && key.trim() !== "" && key.length >= 10;
};
