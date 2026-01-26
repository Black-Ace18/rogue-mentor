import { Volume2, VolumeX } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/useSpeech";

interface ChatMessageProps {
  role: "user" | "model";
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const { isSpeaking, speak, stop, isSupported } = useSpeechSynthesis();
  const isUser = role === "user";

  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(content);
    }
  };

  return (
    <div
      className={`flex gap-3 animate-fade-in-up ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
          isUser
            ? "bg-secondary/30 text-secondary border border-secondary/50"
            : "bg-primary/20 text-primary border border-primary/50 neon-border"
        }`}
      >
        {isUser ? "OP" : "RM"}
      </div>

      {/* Message bubble */}
      <div
        className={`relative max-w-[80%] rounded-xl px-4 py-3 ${
          isUser
            ? "bg-secondary/20 border border-secondary/30"
            : "bg-card/80 border border-border/50 glass-panel"
        }`}
      >
        {/* Speaker button for AI messages */}
        {!isUser && isSupported && (
          <button
            onClick={handleSpeak}
            className={`absolute -right-2 -top-2 p-1.5 rounded-full transition-all duration-300 ${
              isSpeaking
                ? "bg-primary text-primary-foreground animate-pulse"
                : "bg-card border border-border hover:bg-primary/20 hover:text-primary"
            }`}
            aria-label={isSpeaking ? "Stop speaking" : "Read aloud"}
          >
            {isSpeaking ? (
              <VolumeX className="w-3 h-3" />
            ) : (
              <Volume2 className="w-3 h-3" />
            )}
          </button>
        )}

        {/* Message content */}
        <p className="text-sm font-mono leading-relaxed whitespace-pre-wrap">
          {content}
        </p>

        {/* Timestamp could go here */}
      </div>
    </div>
  );
};

export default ChatMessage;
