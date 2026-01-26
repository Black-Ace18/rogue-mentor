export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: number;
}

export interface AppState {
  messages: ChatMessage[];
  xp: number;
  missionsCompleted: number;
  totalMissions: number;
}

const STORAGE_KEY = "rogue_mentor_state";

const DEFAULT_STATE: AppState = {
  messages: [],
  xp: 0,
  missionsCompleted: 0,
  totalMissions: 10,
};

export const loadState = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load state:", error);
  }
  return DEFAULT_STATE;
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save state:", error);
  }
};

export const clearState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear state:", error);
  }
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const addXP = (currentXP: number, amount: number = 10): number => {
  return Math.min(currentXP + amount, 100);
};
