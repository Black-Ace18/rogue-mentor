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
      // CRITICAL: Small delay after permission grant for Opera GX
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Stop any existing recognition first
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // Ignore abort errors
      }
    }

    const recognition = createSpeechRecognition({ continuous: true, interimResults: true });
    if (!recognition) {
      console.error('❌ Failed to create recognition instance');
      return;
    }

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log('🎤 Listening started successfully');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      // Get the latest result
      const resultIndex = event.resultIndex;
      const result = event.results[resultIndex];
      const transcriptText = result[0].transcript;
      
      console.log('🎤 Transcript received:', transcriptText, '| Final:', result.isFinal);
      
      // Only set transcript when we have a final result
      if (result.isFinal) {
        setTranscript(transcriptText);
        // Stop listening after getting final result
        try {
          recognition.stop();
        } catch (e) {
          // Ignore stop errors
        }
      }
    };

    recognition.onend = () => {
      console.log('🎤 Listening ended');
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      const errorType = event.error;
      console.error("🎤 Speech recognition error:", errorType);
      
      // Handle specific errors gracefully
      if (errorType === 'no-speech') {
        console.log('🎤 No speech detected, you can try again');
      } else if (errorType === 'aborted') {
        console.log('🎤 Recognition was aborted');
      } else if (errorType === 'not-allowed') {
        console.error('❌ Microphone access denied by user');
        setPermissionGranted(false);
      }
      
      setIsListening(false);
    };

    try {
      console.log('🎤 Starting recognition...');
      recognition.start();
    } catch (err) {
      console.error('❌ Failed to start recognition:', err);
      setIsListening(false);
    }
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
