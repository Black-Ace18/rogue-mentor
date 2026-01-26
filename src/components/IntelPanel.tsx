import { X, ChevronRight } from "lucide-react";

interface IntelPanelProps {
  onSelectPrompt: (prompt: string) => void;
  onClose: () => void;
}

const SAMPLE_PROMPTS = [
  "Draft a 3-month plan for asymmetric leverage in Web3",
  "How do I bypass HR and DM founders directly?",
  "What's the fastest path from zero to $10K/month freelancing?",
  "How do I build a personal monopoly in my niche?",
  "Give me a cold email template that actually gets responses",
  "How do I negotiate a 50% raise without threatening to quit?",
  "What skills should I stack for maximum optionality?",
  "How do I position myself as an expert in 90 days?",
  "What's the anti-resume strategy for getting hired?",
  "How do I turn my side project into an acquisition target?",
  "Give me a networking strategy that doesn't feel sleazy",
  "How do I get meetings with people way above my level?",
  "What's the playbook for pivoting industries at 30+?",
  "How do I build in public without revealing my competitive edge?",
  "What are the highest-leverage activities for career growth?",
];

const IntelPanel = ({ onSelectPrompt, onClose }: IntelPanelProps) => {
  const handleSelect = (prompt: string) => {
    onSelectPrompt(prompt);
    onClose();
  };

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
            <h2 className="text-lg font-display font-bold text-secondary neon-text-magenta">
              FIELD MANUAL
            </h2>
            <p className="text-xs text-muted-foreground font-mono">
              High-leverage tactical queries
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

        {/* Prompt list */}
        <div className="flex-1 overflow-y-auto">
          {SAMPLE_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSelect(prompt)}
              className="w-full flex items-center gap-3 p-4 border-b border-border/20 hover:bg-muted/20 transition-colors text-left group"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded bg-secondary/20 text-secondary text-xs font-mono flex items-center justify-center">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-sm font-mono text-foreground/90 group-hover:text-foreground">
                {prompt}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground font-mono text-center">
            Select a query to deploy
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntelPanel;
