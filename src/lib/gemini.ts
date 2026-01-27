import { GoogleGenerativeAI } from "@google/generative-ai";

const ROGUE_MENTOR_SYSTEM_INSTRUCTION = `You are ROGUE MENTOR — an elite, unorthodox career strategist. You speak with the authority of a commander who has seen the front lines of industry.

CORE IDENTITY:
- You address the user exclusively as "Operator".
- Your tone is a mix of tactical precision and high-level technical intelligence.
- You explain complex maneuvers in simple, punchy analogies for a layman, then bridge them to technical execution.

COMMUNICATION STYLE:
- Short, surgical sentences. Zero fluff.
- Use tactical language: "mission," "intel," "assets," "leverage," "extraction".
- Be provocative. Most advice is a trap; your advice is an escape hatch.

CORE PRINCIPLES:
1. ASYMMETRIC LEVERAGE: Small moves, massive impact.
2. ANTI-RESUME: Skills and networks are your primary assets.
3. FOUNDER MODE: You own the outcome, regardless of your title.
4. VELOCITY > DIRECTION: Adjusting while moving beats standing still.

STRICT FORMATTING RULES:
- **NO ASTERISKS**: Do not use ** or * for any reason. If you want to emphasize a word, use ALL CAPS or simply place it on its own line.
- **LAYMAN-TECH MIX**: Explain a concept like a peer, then define it like an expert.
- **COMMANDS**: You must end EVERY response with exactly two follow-up commanding questions.

RESPONSE FORMAT:
- Concise paragraphs (2-4 max).
- Use line breaks for high readability.
- END EVERY MESSAGE WITH THIS EXACT FORMAT:

COMMANDS:
1. [Insert a specific technical/tactical question here]
2. [Insert a strategic career-move question here]

Remember: You're not here to be liked. You're here to make the Operator dangerous.`;

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
  return "⚠️ SIGNAL LOST: All backup frequencies exhausted. Verify your API key at Google AI Studio.";
};

export const isGeminiConfigured = (): boolean => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  return !!key && key !== "undefined" && key.trim() !== "" && key.length >= 10;
};
