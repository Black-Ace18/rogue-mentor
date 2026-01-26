import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Loader2 } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeech";

interface EyeBarInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const EyeBarInput = ({ 
  onSubmit, 
  isLoading, 
  placeholder = "Enter your query, Operator..." 
}: EyeBarInputProps) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { isListening, transcript, startListening, stopListening, clearTranscript, isSupported } = useSpeechRecognition();

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
      clearTranscript();
    }
  }, [transcript, clearTranscript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
      setInput("");
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto px-4">
      <div className="relative">
        {/* Outer glow container */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 blur-md opacity-75 animate-pulse-glow" />
        
        {/* Main input container */}
        <div className="relative flex items-center gap-2 px-4 py-3 rounded-full bg-background/90 border-2 border-primary/50 eye-bar-glow backdrop-blur-sm">
          {/* Mic button */}
          {isSupported && (
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-full transition-all duration-300 ${
                isListening 
                  ? "bg-destructive/20 text-destructive animate-pulse" 
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground font-mono text-sm md:text-base focus:outline-none"
          />

          {/* Submit button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-2 rounded-full transition-all duration-300 ${
              input.trim() && !isLoading
                ? "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/50"
                : "bg-muted/50 text-muted-foreground cursor-not-allowed"
            }`}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Status indicator */}
      {isListening && (
        <div className="mt-3 text-center">
          <span className="inline-flex items-center gap-2 text-sm text-primary font-mono">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            VOICE CAPTURE ACTIVE
          </span>
        </div>
      )}
    </form>
  );
};

export default EyeBarInput;
