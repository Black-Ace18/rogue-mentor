// Web Speech API utilities for voice input and text-to-speech

// SpeechRecognition type (browser provides this but TypeScript doesn't know)
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface WindowWithSpeech extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

// Check if speech recognition is available
export const isSpeechRecognitionSupported = (): boolean => {
  const win = window as WindowWithSpeech;
  return 'webkitSpeechRecognition' in win || 'SpeechRecognition' in win;
};

// Check if speech synthesis is available
export const isSpeechSynthesisSupported = (): boolean => {
  return 'speechSynthesis' in window;
};

// Create speech recognition instance
export const createSpeechRecognition = (): SpeechRecognitionInstance | null => {
  if (!isSpeechRecognitionSupported()) return null;
  
  const win = window as WindowWithSpeech;
  const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
  if (!SpeechRecognitionClass) return null;
  
  const recognition = new SpeechRecognitionClass();
  
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  
  return recognition;
};

// Speak text using speech synthesis
export const speakText = (
  text: string, 
  options?: { 
    rate?: number; 
    pitch?: number; 
    voice?: SpeechSynthesisVoice;
  }
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!isSpeechSynthesisSupported()) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a deep male voice
    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(v => 
      v.name.toLowerCase().includes('male') || 
      v.name.toLowerCase().includes('daniel') ||
      v.name.toLowerCase().includes('james') ||
      v.name.toLowerCase().includes('david')
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    
    if (options?.voice) {
      utterance.voice = options.voice;
    } else if (maleVoice) {
      utterance.voice = maleVoice;
    }
    
    utterance.rate = options?.rate ?? 0.9;
    utterance.pitch = options?.pitch ?? 0.8;
    
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(event);
    
    window.speechSynthesis.speak(utterance);
  });
};

// Stop any ongoing speech
export const stopSpeaking = (): void => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};

// Get available voices
export const getVoices = (): SpeechSynthesisVoice[] => {
  if (!isSpeechSynthesisSupported()) return [];
  return window.speechSynthesis.getVoices();
};

// Export the custom type for use in hooks
export type { SpeechRecognitionInstance };
