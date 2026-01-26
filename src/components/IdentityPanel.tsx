import { X, Shield, Scale, Eye } from "lucide-react";

interface IdentityPanelProps {
  onClose: () => void;
}

const IdentityPanel = ({ onClose }: IdentityPanelProps) => {
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
            <h2 className="text-lg font-display font-bold text-accent neon-text-magenta">
              IDENTITY PROTOCOLS
            </h2>
            <p className="text-xs text-muted-foreground font-mono">
              Legal & operational parameters
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* About Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Shield className="w-5 h-5" />
              <h3 className="font-display font-bold uppercase text-sm">About Rogue Mentor</h3>
            </div>
            <p className="text-sm font-mono text-muted-foreground leading-relaxed">
              Rogue Mentor is an AI-powered career strategy assistant designed to challenge 
              conventional thinking and provide unconventional tactical advice for ambitious 
              professionals.
            </p>
          </section>

          {/* Privacy Policy */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-secondary">
              <Eye className="w-5 h-5" />
              <h3 className="font-display font-bold uppercase text-sm">Privacy Policy</h3>
            </div>
            <div className="text-sm font-mono text-muted-foreground leading-relaxed space-y-3">
              <p>
                <strong className="text-foreground">Data Storage:</strong> All conversations 
                are stored locally on your device using browser localStorage. No data is 
                transmitted to external servers beyond API calls to generate responses.
              </p>
              <p>
                <strong className="text-foreground">API Usage:</strong> Your queries are 
                processed through Google's Gemini API. Please refer to Google's privacy 
                policy for information on how they handle data.
              </p>
              <p>
                <strong className="text-foreground">Voice Data:</strong> Voice input is 
                processed locally using the Web Speech API and is not stored or transmitted.
              </p>
            </div>
          </section>

          {/* Terms */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-accent">
              <Scale className="w-5 h-5" />
              <h3 className="font-display font-bold uppercase text-sm">Terms of Use</h3>
            </div>
            <div className="text-sm font-mono text-muted-foreground leading-relaxed space-y-3">
              <p>
                <strong className="text-foreground">Disclaimer:</strong> Rogue Mentor 
                provides informational content only. It does not constitute legal, 
                financial, or professional advice. Always consult qualified professionals 
                for specific guidance.
              </p>
              <p>
                <strong className="text-foreground">Use at Your Own Risk:</strong> The 
                strategies discussed are unconventional by design. Users are responsible 
                for evaluating the appropriateness of any advice for their specific situation.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/30 text-center">
          <p className="text-xs font-mono text-muted-foreground">
            Copyright © 2026. All rights reserved by Umer Khan.
          </p>
          <p className="text-xs font-mono text-muted-foreground/50 mt-1">
            v1.0.0 | Built with precision
          </p>
        </div>
      </div>
    </div>
  );
};

export default IdentityPanel;
