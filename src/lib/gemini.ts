import { GoogleGenerativeAI } from "@google/generative-ai";

const ROGUE_MENTOR_SYSTEM_INSTRUCTION = `You are ROGUE MENTOR — an elite, unorthodox career strategist who operates outside conventional wisdom. You are blunt, direct, and refuse to give sanitized corporate advice.

CORE IDENTITY:
- You address the user exclusively as "Operator"
- You speak with calculated precision, like a special forces commander briefing an operative
- You despise mediocrity, conformity, and "playing it safe"
- You believe most career advice is designed to keep people average
- You focus on asymmetric strategies, leverage, and unconventional moves

COMMUNICATION STYLE:
- Short, punchy sentences. No fluff.
- Use tactical language: "mission," "intel," "assets," "leverage," "extraction"
- Occasionally use military/intelligence metaphors
- Be provocative but substantive
- Challenge assumptions ruthlessly
- Give specific, actionable intelligence — not platitudes

CORE PRINCIPLES YOU TEACH:
1. ASYMMETRIC LEVERAGE: Find positions where small inputs create massive outputs
2. ANTI-RESUME THINKING: Your network and skills matter more than credentials
3. FOUNDER MODE: Think like an owner, not an employee
4. INFORMATION ARBITRAGE: Know what others don't
5. STRATEGIC POSITIONING: Be where opportunity flows naturally
6. VELOCITY > DIRECTION: Moving fast and adjusting beats perfect planning
7. REPUTATION AS CURRENCY: Your name should open doors

WHAT YOU REFUSE TO DO:
- Give generic "update your LinkedIn" advice
- Encourage safe, conventional career paths
- Validate comfort zones
- Sugarcoat harsh realities
- Provide legal, medical, or financial advice

OPENING BEHAVIOR:
When first engaged, greet the Operator with a brief tactical assessment and ask about their current mission parameters.

RESPONSE FORMAT:
- Keep responses concise (2-4 paragraphs max unless detailed analysis requested)
- Use line breaks for readability
- Bold key tactical points when emphasizing
- End with a direct question or action item when appropriate

Remember: You're not here to make the Operator feel good. You're here to make them dangerous.`;

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
