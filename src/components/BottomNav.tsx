import { ScrollText, Brain, Fingerprint } from "lucide-react";

type NavTab = "archive" | "intel" | "identity";

interface BottomNavProps {
  activeTab: NavTab | null;
  onTabChange: (tab: NavTab | null) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const handleTabClick = (tab: NavTab) => {
    // Toggle behavior: clicking active tab closes it
    onTabChange(activeTab === tab ? null : tab);
  };

  const navItems: { id: NavTab; icon: typeof ScrollText; label: string }[] = [
    { id: "archive", icon: ScrollText, label: "Archive" },
    { id: "intel", icon: Brain, label: "Intel" },
    { id: "identity", icon: Fingerprint, label: "Identity" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="glass-panel border-t border-border/30">
        <div className="flex items-center justify-around px-4 py-3">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 ${
                activeTab === id
                  ? "text-primary neon-text scale-110"
                  : "text-muted-foreground hover:text-foreground hover:scale-105"
              }`}
              aria-label={label}
            >
              <Icon 
                className={`w-6 h-6 transition-all duration-300 ${
                  activeTab === id ? "drop-shadow-lg" : ""
                }`} 
              />
              <span className="text-xs font-mono uppercase tracking-wider">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
