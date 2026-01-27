import { useState, useCallback, useRef, useEffect } from "react";
import { 
  createSpeechRecognition, 
  speakText, 
  stopSpeaking,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  requestMicrophonePermission,
  type SpeechRecognitionInstance
} from "@/lib/speech";

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [permissionGranted, setPermissionGranted] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Check for support on mount
  useEffect(() => {
    if (isSpeechRecognitionSupported()) {
      console.log('🎤 Speech recognition available on this device');
    }
  }, []);

  const startListening = useCallback(async () => {
    if (!isSpeechRecognitionSupported()) {
      console.warn("Speech recognition not supported");
      return;
    }

    // CRITICAL: Request microphone permission FIRST (fixes Opera GX)
    if (!permissionGranted) {
      console.log('🎤 First time - requesting explicit mic permission...');
      const granted = await requestMicrophonePermission();
      if (!granted) {
        console.error('❌ Cannot start listening - mic permission denied');
        return;
      }
      setPermissionGranted(true);
    }

    const recognition = createSpeechRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log('🎤 Listening started');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      console.log('🎤 Transcript received:', result);
      setTranscript(result);
    };

    recognition.onend = () => {
      console.log('🎤 Listening ended');
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.start();
  }, [permissionGranted]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    isSupported: isSpeechRecognitionSupported(),
  };
};

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(async (text: string) => {
    if (!isSpeechSynthesisSupported()) {
      console.warn("Speech synthesis not supported");
      return;
    }

    setIsSpeaking(true);
    try {
      await speakText(text);
    } catch (error) {
      console.error("Speech synthesis error:", error);
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  const stop = useCallback(() => {
    stopSpeaking();
    setIsSpeaking(false);
  }, []);

  // Load voices on mount
  useEffect(() => {
    if (isSpeechSynthesisSupported()) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  return {
    isSpeaking,
    speak,
    stop,
    isSupported: isSpeechSynthesisSupported(),
  };
};
