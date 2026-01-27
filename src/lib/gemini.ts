import { GoogleGenerativeAI, GoogleGenerativeAIError } from "@google/generative-ai";

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

// Waterfall fallback models - try in order until one works
const FALLBACK_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash-001",
  "gemini-pro"
];

let genAI: GoogleGenerativeAI | null = null;
let apiKeyMissing = false;

export const initializeGemini = (): GoogleGenerativeAI | null => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
    console.warn("⚠️ Mission Control: VITE_GEMINI_API_KEY not detected in environment.");
    apiKeyMissing = true;
    return null;
  }
  
  console.log("✅ Mission Control: API Key detected. Initializing secure comms...");
  apiKeyMissing = false;
  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

export const isApiKeyMissing = (): boolean => apiKeyMissing;

export const getGeminiResponse = async (
  messages: Array<{ role: "user" | "model"; content: string }>
): Promise<string> => {
  // Initialize if not already done
  if (!genAI) {
    initializeGemini();
  }
  
  // Check if API key is missing
  if (!genAI || apiKeyMissing) {
    return "⚠️ COMMS OFFLINE: Gemini API key not configured. Add VITE_GEMINI_API_KEY to your environment to establish connection with Rogue Mentor.";
  }

  const history = messages.slice(0, -1).map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));
  
  const lastMessage = messages[messages.length - 1];
  let lastError: Error | null = null;

  // Waterfall fallback: try each model until one succeeds
  for (let i = 0; i < FALLBACK_MODELS.length; i++) {
    const modelName = FALLBACK_MODELS[i];
    
    try {
      console.log(`🎯 Mission Comms: Attempting connection with ${modelName}...`);
      
      // Try with v1beta API version first for latest features
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: ROGUE_MENTOR_SYSTEM_INSTRUCTION,
      });

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage.content);
      const response = result.response;
      
      console.log(`✅ Mission Comms: Successfully connected via ${modelName}`);
      return response.text();
      
    } catch (error) {
      lastError = error as Error;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      console.warn(`⚠️ Model ${modelName} failed: ${errorMessage}`);
      
      // Check if it's a 404 or 400 error (model not found/invalid)
      const is404or400 = errorMessage.includes("404") || 
                         errorMessage.includes("400") || 
                         errorMessage.includes("not found") ||
                         errorMessage.includes("invalid") ||
                         errorMessage.includes("does not exist");
      
      if (is404or400 && i < FALLBACK_MODELS.length - 1) {
        console.log(`🔄 Mission Control: Model failed, switching to backup (${FALLBACK_MODELS[i + 1]})...`);
        continue; // Try next model
      }
      
      // If it's not a model-related error or we've tried all models, break
      if (!is404or400) {
        console.error("❌ Mission Comms: Non-recoverable error:", errorMessage);
        break;
      }
    }
  }

  // All models failed
  console.error("❌ Mission Comms: All fallback models exhausted. Last error:", lastError);
  
  // Provide helpful error message based on error type
  const errorStr = lastError?.message || "";
  
  if (errorStr.includes("API_KEY") || errorStr.includes("key")) {
    return "⚠️ INTEL ALERT: API key appears to be invalid or expired. Verify your VITE_GEMINI_API_KEY in Secrets.";
  }
  
  if (errorStr.includes("quota") || errorStr.includes("rate")) {
    return "⚠️ TRANSMISSION THROTTLED: API quota exceeded. Stand by for reconnection, Operator.";
  }
  
  if (errorStr.includes("network") || errorStr.includes("fetch")) {
    return "⚠️ SIGNAL LOST: Network error detected. Check your connection and retry, Operator.";
  }
  
  return "⚠️ SIGNAL LOST: Connection to Rogue Mentor interrupted after exhausting all backup channels. Stand by for manual reconnection...";
};

export const isGeminiConfigured = (): boolean => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  return !!key && key !== "undefined" && key.trim() !== "";
};
