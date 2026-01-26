import { X, Trash2 } from "lucide-react";
import { ChatMessage as ChatMessageType } from "@/lib/storage";
import ChatMessage from "./ChatMessage";
import { Progress } from "@/components/ui/progress";

interface ArchivePanelProps {
  messages: ChatMessageType[];
  xp: number;
  missionsCompleted: number;
  totalMissions: number;
  onClearHistory: () => void;
  onClose: () => void;
}

const ArchivePanel = ({
  messages,
  xp,
  missionsCompleted,
  totalMissions,
  onClearHistory,
  onClose,
}: ArchivePanelProps) => {
  return (
    <div className="fixed inset-0 z-40 flex justify-end animate-slide-in-right">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md h-full glass-panel border-l border-border/30 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <div>
            <h2 className="text-lg font-display font-bold text-primary neon-text">
              MISSION ARCHIVE
            </h2>
            <p className="text-xs text-muted-foreground font-mono">
              {messages.length} transmissions logged
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted/30 transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* XP Progress */}
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-muted-foreground uppercase">
              Mission XP
            </span>
            <span className="text-xs font-mono text-primary">
              {missionsCompleted}/{totalMissions} COMPLETE
            </span>
          </div>
          <Progress value={xp} className="h-2 bg-muted/30" />
          <div className="flex justify-between mt-1">
            <span className="text-xs font-mono text-muted-foreground">
              {xp}%
            </span>
            <span className="text-xs font-mono text-primary">
              LEVEL {Math.floor(xp / 20) + 1}
            </span>
          </div>
        </div>

        {/* Chat history */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground font-mono text-sm">
                No transmissions yet.
              </p>
              <p className="text-muted-foreground/60 font-mono text-xs mt-2">
                Initiate contact with Rogue Mentor.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ))
          )}
        </div>

        {/* Footer with clear button */}
        {messages.length > 0 && (
          <div className="p-4 border-t border-border/30">
            <button
              onClick={onClearHistory}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 transition-colors font-mono text-sm"
            >
              <Trash2 className="w-4 h-4" />
              PURGE ARCHIVE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivePanel;
