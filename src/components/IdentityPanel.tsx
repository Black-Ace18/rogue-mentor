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
      <div className="relative w-full max-w-md h-full glass-panel border-l border-border/30 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30 bg-black/20">
          <div>
            <h2 className="text-xl font-display font-bold text-accent neon-text-magenta tracking-tighter">
              IDENTITY PROTOCOLS
            </h2>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
              Developed by Umer Khan
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted/30 transition-all active:scale-95"
            aria-label="Close panel"
          >
            <X className="w-5 h-5 text-muted-foreground hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* About Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Shield className="w-5 h-5" />
              <h3 className="font-display font-bold uppercase text-sm tracking-tight">Intelligence Briefing</h3>
            </div>
            <p className="text-sm font-mono text-muted-foreground leading-relaxed">
              Rogue Mentor is an advanced career intelligence engine architected by Umer Khan. It utilizes a proprietary, highly-conditioned API framework designed to dismantle standard corporate indoctrination and equip professionals with asymmetric tactical leverage.
            </p>
          </section>

          {/* Privacy Policy */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-secondary">
              <Eye className="w-5 h-5" />
              <h3 className="font-display font-bold uppercase text-sm tracking-tight">Operational Privacy</h3>
            </div>
            <div className="text-sm font-mono text-muted-foreground leading-relaxed space-y-4">
              <p>
                <strong className="text-foreground border-b border-secondary/30">Protocol Data:</strong> All mission logs are localized within your browser storage. Intel is processed through our dedicated secure gateway; no personal data is retained or stored on external servers.
              </p>
              <p>
                <strong className="text-foreground border-b border-secondary/30">Voice Processing:</strong> Audio input is decoded in real-time via the Web Speech interface. No biometric or voice data is captured or transmitted beyond the immediate session.
              </p>
            </div>
          </section>

          {/* Terms */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-accent">
              <Scale className="w-5 h-5" />
              <h3 className="font-display font-bold uppercase text-sm tracking-tight">Rules of Engagement</h3>
            </div>
            <div className="text-sm font-mono text-muted-foreground leading-relaxed space-y-4">
              <p>
                <strong className="text-foreground border-b border-accent/30">Field Responsibility:</strong> Rogue Mentor provides raw, unconventional intelligence. These strategies are high-velocity by design. All operational decisions remain the responsibility of the Operator.
              </p>
              <p>
                <strong className="text-foreground border-b border-accent/30">Professional Disclaimer:</strong> Tactical briefings do not constitute legal or financial counsel. Consult specialized operatives for specific field-legalities.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/30 bg-black/40 text-center">
          <p className="text-xs font-mono text-muted-foreground font-bold tracking-tight">
            © 2026 | DESIGNED & ENGINEERED BY UMER KHAN
          </p>
          <div className="flex justify-center gap-4 mt-2 text-[10px] font-mono text-muted-foreground/40">
            <span className="px-2 py-0.5 border border-white/5 rounded">MOD: ALPHA-V1</span>
            <span className="px-2 py-0.5 border border-white/5 rounded">OWNER: UK-SDA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityPanel;
