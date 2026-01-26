import { useState, useCallback } from "react";
import { Phone } from "lucide-react";
import rogueBackground from "@/assets/rogue-background.jpg";
import EyeBarInput from "@/components/EyeBarInput";
import BottomNav from "@/components/BottomNav";
import ArchivePanel from "@/components/ArchivePanel";
import IntelPanel from "@/components/IntelPanel";
import IdentityPanel from "@/components/IdentityPanel";
import CallMode from "@/components/CallMode";
import ChatMessage from "@/components/ChatMessage";
import { useChat } from "@/hooks/useChat";

type NavTab = "archive" | "intel" | "identity";

const Index = () => {
  const [activeTab, setActiveTab] = useState<NavTab | null>(null);
  const [isCallMode, setIsCallMode] = useState(false);
  const { messages, xp, missionsCompleted, totalMissions, isLoading, sendMessage, clearHistory } = useChat();

  const handleSendMessage = useCallback(async (message: string) => {
    await sendMessage(message);
  }, [sendMessage]);

  const handleSelectPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const lastResponse = messages.length > 0 && messages[messages.length - 1].role === "model"
    ? messages[messages.length - 1].content
    : null;

  // Get recent messages for display (last 3)
  const recentMessages = messages.slice(-6);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${rogueBackground})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-background/70" />
        
        {/* Scanline effect */}
        <div className="absolute inset-0 scanline pointer-events-none" />
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
      </div>

      {/* Main content */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <header className="flex-shrink-0 pt-6 pb-4 px-4 text-center">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary neon-text tracking-wider">
            ROGUE MENTOR
          </h1>
          <p className="font-mono text-xs text-muted-foreground mt-1 uppercase tracking-widest">
            Elite Career Intelligence
          </p>
        </header>

        {/* Chat area - scrollable */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="animate-float">
                <div className="w-20 h-20 rounded-full border-2 border-primary/50 flex items-center justify-center mb-6 neon-border">
                  <span className="text-2xl font-display font-bold text-primary">RM</span>
                </div>
              </div>
              <p className="font-mono text-sm text-muted-foreground max-w-sm">
                Awaiting transmission, Operator. Enter your query through the neural interface below.
              </p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4 py-4">
              {recentMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                />
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center">
                    <span className="text-xs font-bold font-mono text-primary">RM</span>
                  </div>
                  <div className="px-4 py-3 rounded-xl bg-card/80 border border-border/50">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Eye-bar input - positioned at the "eye level" */}
        <div className="flex-shrink-0 py-6 mb-20">
          <EyeBarInput onSubmit={handleSendMessage} isLoading={isLoading} />
          
          {/* Call mode button */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsCallMode(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary border border-secondary/30 hover:bg-secondary/30 transition-colors font-mono text-xs uppercase tracking-wider"
            >
              <Phone className="w-4 h-4" />
              Voice Mode
            </button>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Panels */}
      {activeTab === "archive" && (
        <ArchivePanel
          messages={messages}
          xp={xp}
          missionsCompleted={missionsCompleted}
          totalMissions={totalMissions}
          onClearHistory={clearHistory}
          onClose={() => setActiveTab(null)}
        />
      )}

      {activeTab === "intel" && (
        <IntelPanel
          onSelectPrompt={handleSelectPrompt}
          onClose={() => setActiveTab(null)}
        />
      )}

      {activeTab === "identity" && (
        <IdentityPanel onClose={() => setActiveTab(null)} />
      )}

      {/* Call mode overlay */}
      {isCallMode && (
        <CallMode
          onClose={() => setIsCallMode(false)}
          onSendMessage={handleSendMessage}
          lastResponse={lastResponse}
          isProcessing={isLoading}
        />
      )}
    </div>
  );
};

export default Index;
