import { useState, useEffect, useCallback } from "react";
import { X, Mic, MicOff, Volume2, VolumeX, Phone } from "lucide-react";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/useSpeech";
import { stopSpeaking, isSpeaking as checkIsSpeaking } from "@/lib/speech";

interface CallModeProps {
  onClose: () => void;
  onSendMessage: (message: string) => Promise<void>;
  lastResponse: string | null;
  isProcessing: boolean;
}

const CallMode = ({ onClose, onSendMessage, lastResponse, isProcessing }: CallModeProps) => {
  const { isListening, transcript, startListening, stopListening, clearTranscript, isSupported: micSupported } = useSpeechRecognition();
  const { isSpeaking, speak, stop, isSupported: speakerSupported } = useSpeechSynthesis();
  const [status, setStatus] = useState<"idle" | "listening" | "processing" | "speaking">("idle");
  const [autoSpeak, setAutoSpeak] = useState(true);

  // Handle transcript completion
  useEffect(() => {
    if (transcript && !isListening) {
      setStatus("processing");
      onSendMessage(transcript);
      clearTranscript();
    }
  }, [transcript, isListening, onSendMessage, clearTranscript]);

  // Handle new response - CRITICAL: Cancel existing speech first
  useEffect(() => {
    if (lastResponse && autoSpeak && !isProcessing && status === "processing") {
      // Cancel any existing speech to prevent audio stacking
      console.log('🔊 New response - cancelling any existing speech');
      stopSpeaking();
      
      setStatus("speaking");
      speak(lastResponse).then(() => {
        setStatus("idle");
      });
    } else if (!isProcessing && status === "processing") {
      setStatus("idle");
    }
  }, [lastResponse, autoSpeak, isProcessing, speak, status]);

  // Update status based on speech state
  useEffect(() => {
    if (isSpeaking) {
      setStatus("speaking");
    }
  }, [isSpeaking]);

  const handleMicToggle = useCallback(async () => {
    if (isListening) {
      stopListening();
    } else {
      // Stop any speaking before starting to listen
      if (isSpeaking || checkIsSpeaking()) {
        console.log('🔊 Stopping speech before mic activation');
        stop();
        stopSpeaking();
      }
      setStatus("listening");
      await startListening();
    }
  }, [isListening, isSpeaking, stop, startListening, stopListening]);

  // FIXED: Top-left audio toggle - properly syncs with speech state
  const handleAutoSpeakToggle = useCallback(() => {
    // If currently speaking and we're disabling auto-speak, stop immediately
    if (autoSpeak && (isSpeaking || checkIsSpeaking())) {
      console.log('🔊 Auto-speak disabled - killing all audio');
      stop();
      stopSpeaking();
      window.speechSynthesis.cancel(); // Direct call for immediate effect
      setStatus("idle");
    }
    setAutoSpeak(!autoSpeak);
  }, [autoSpeak, isSpeaking, stop]);

  const handleStopSpeaking = () => {
    console.log('🔊 Manual stop requested');
    stop();
    stopSpeaking();
    window.speechSynthesis.cancel(); // Direct call for immediate effect
    setStatus("idle");
  };

  const getStatusText = () => {
    switch (status) {
      case "listening":
        return "LISTENING...";
      case "processing":
        return "PROCESSING...";
      case "speaking":
        return "TRANSMITTING...";
      default:
        return "TAP TO SPEAK";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "listening":
        return "text-destructive";
      case "processing":
        return "text-secondary";
      case "speaking":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center animate-fade-in-up">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-muted/30 hover:bg-muted/50 transition-colors"
        aria-label="Exit call mode"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Auto-speak toggle - FIXED: Now properly stops all audio */}
      <button
        onClick={handleAutoSpeakToggle}
        className={`absolute top-6 left-6 p-3 rounded-full transition-colors ${
          autoSpeak ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground"
        }`}
        aria-label={autoSpeak ? "Disable auto-speak (stops current audio)" : "Enable auto-speak"}
      >
        {autoSpeak ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
      </button>

      {/* Status indicator */}
      <div className="mb-8 text-center">
        <h2 className="font-display text-2xl font-bold text-primary neon-text mb-2">
          ROGUE MENTOR
        </h2>
        <p className={`font-mono text-sm uppercase tracking-widest ${getStatusColor()}`}>
          {getStatusText()}
        </p>
      </div>

      {/* Main mic button */}
      <button
        onClick={handleMicToggle}
        disabled={!micSupported}
        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
          isListening
            ? "bg-destructive/30 border-4 border-destructive neon-border-magenta scale-110"
            : status === "speaking"
            ? "bg-primary/20 border-4 border-primary animate-pulse"
            : "bg-muted/30 border-4 border-border hover:bg-muted/50 hover:border-primary/50"
        }`}
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        {isListening ? (
          <MicOff className="w-12 h-12 text-destructive" />
        ) : status === "speaking" ? (
          <Volume2 className="w-12 h-12 text-primary" />
        ) : (
          <Mic className="w-12 h-12 text-foreground" />
        )}
      </button>

      {/* Stop speaking button */}
      {isSpeaking && (
        <button
          onClick={handleStopSpeaking}
          className="mt-8 px-6 py-3 rounded-full bg-destructive/20 text-destructive border border-destructive/50 hover:bg-destructive/30 transition-colors font-mono text-sm uppercase tracking-wider"
        >
          Stop Transmission
        </button>
      )}

      {/* Transcript display */}
      {transcript && (
        <div className="mt-8 max-w-md px-6 py-4 rounded-xl bg-card/80 border border-border/50">
          <p className="font-mono text-sm text-foreground text-center">
            "{transcript}"
          </p>
        </div>
      )}

      {/* Footer hint */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <div className="inline-flex items-center gap-2 text-muted-foreground/50 font-mono text-xs">
          <Phone className="w-4 h-4" />
          <span>Hands-free voice dialogue mode</span>
        </div>
      </div>
    </div>
  );
};

export default CallMode;
