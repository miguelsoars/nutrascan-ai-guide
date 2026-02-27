import { Home, ScanLine, Heart, BookOpen, UserCircle } from "lucide-react";

type TabId = "home" | "scanner" | "nutra_ia" | "diary" | "profile";

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Início", icon: Home },
  { id: "scanner", label: "Scanner", icon: ScanLine },
  { id: "nutra_ia", label: "NutraIA", icon: Heart },
  { id: "diary", label: "Diário", icon: BookOpen },
  { id: "profile", label: "Perfil", icon: UserCircle },
];

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/90 ios-blur border-t border-border pb-safe z-30 pt-1.5 shadow-lg">
      <div className="max-w-xl mx-auto flex justify-between px-2 pb-2 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center p-2 w-full transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="mb-1" />
              <span className="text-[10px] font-semibold tracking-widest uppercase">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
