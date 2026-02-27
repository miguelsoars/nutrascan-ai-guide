import { Sparkles, Heart, Utensils, Leaf, Droplets } from "lucide-react";
import type { MealTotals, Targets, ProfileData, DiaryEntry } from "@/types/nutrascan";

interface HomeTabProps {
  name: string;
  dailyTotals: MealTotals;
  targets: Targets;
  todaysEntries: DiaryEntry[];
  profile: ProfileData | null;
  profileWeight: string;
  onGoToNutraIA: () => void;
}

const getRecommendations = (dailyTotals: MealTotals, targets: Targets, goal: string) => {
  const remaining = {
    calories: Math.max(0, targets.calories - dailyTotals.calories),
    protein: Math.max(0, targets.protein - dailyTotals.protein),
    carbs: Math.max(0, targets.carbs - dailyTotals.carbs),
    fat: Math.max(0, targets.fat - dailyTotals.fat),
  };
  const recs: { icon: React.ReactNode; title: string; description: string }[] = [];
  if (remaining.protein > 30) {
    recs.push({ icon: <Utensils size={15} className="text-[hsl(var(--macro-protein))]" />, title: "Aumente a proteína", description: `Faltam ${Math.round(remaining.protein)}g. Inclua frango grelhado, ovos ou whey.` });
  }
  if (remaining.calories > 400 && remaining.carbs > 40) {
    recs.push({ icon: <Leaf size={15} className="text-success" />, title: "Refeição equilibrada", description: goal.toLowerCase().includes("emagrecer") ? "Opte por salada com proteína magra e legumes." : "Arroz integral ou batata-doce são boas fontes de energia." });
  }
  if (remaining.fat > 15) {
    recs.push({ icon: <Droplets size={15} className="text-[hsl(var(--macro-fat))]" />, title: "Gorduras saudáveis", description: `Faltam ${Math.round(remaining.fat)}g. Abacate, castanhas ou azeite.` });
  }
  if (recs.length === 0) {
    recs.push({ icon: <Sparkles size={15} className="text-primary" />, title: "Meta quase atingida!", description: "Você está no caminho certo. Continue assim." });
  }
  return recs.slice(0, 3);
};

const HomeTab = ({ name, dailyTotals, targets, todaysEntries, profile, onGoToNutraIA }: HomeTabProps) => {
  const getProgress = (curr: number, max: number) => Math.min((curr / (max || 1)) * 100, 100);
  const goal = profile?.inputs?.goal || "";
  const recommendations = getRecommendations(dailyTotals, targets, goal);

  return (
    <div className="fade-in space-y-4 text-left">
      <h1 className="text-[24px] font-bold tracking-tight text-foreground">
        Olá, <span className="text-primary">{name?.split(" ")[0] || "Bem-vindo"}</span>!
      </h1>

      {/* Calorie Card */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
        <div className="flex justify-between mb-3 items-center">
          <h2 className="text-[15px] font-bold">Meta de hoje</h2>
          <span className="text-[12px] text-muted-foreground font-semibold">{todaysEntries.length} refeições</span>
        </div>
        <div className="flex items-end mb-3">
          <span className="text-[36px] font-bold text-primary tracking-tighter leading-none">{Math.round(dailyTotals.calories)}</span>
          <span className="text-[14px] text-muted-foreground font-semibold ml-2 mb-1">/ {targets.calories} kcal</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2.5 mb-5 overflow-hidden">
          <div className="h-full bg-primary transition-all duration-1000 rounded-full" style={{ width: `${getProgress(dailyTotals.calories, targets.calories)}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Prot", value: Math.round(dailyTotals.protein) + "g" },
            { label: "Carb", value: Math.round(dailyTotals.carbs) + "g" },
            { label: "Gord", value: Math.round(dailyTotals.fat) + "g" },
          ].map((m) => (
            <div key={m.label} className="bg-secondary/60 rounded-xl py-2">
              <span className="block text-[10px] text-muted-foreground mb-0.5 font-semibold uppercase tracking-wider">{m.label}</span>
              <span className="text-[16px] font-bold">{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* NutraIA Recommendations */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
        <h2 className="text-[15px] font-bold flex items-center gap-2 mb-3">
          <Sparkles className="text-primary" size={18} /> Recomendação NutraIA
        </h2>
        <div className="space-y-2">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex gap-3 items-start bg-secondary/50 rounded-xl p-3.5">
              <div className="w-7 h-7 rounded-lg bg-card flex items-center justify-center shrink-0 border border-border shadow-sm mt-0.5">
                {rec.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[14px] font-bold text-foreground leading-tight">{rec.title}</h4>
                <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NutraIA CTA */}
      <div
        className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-primary-foreground relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer shadow-md"
        onClick={onGoToNutraIA}
      >
        <div className="relative z-10 text-left">
          <h2 className="text-[16px] font-bold flex items-center gap-2">
            <Heart className="text-primary-foreground/60" size={20} /> NutraIA
          </h2>
          <p className="text-[13px] opacity-90 mt-1 mb-3 leading-relaxed pr-6">
            Análise inteligente dos seus padrões alimentares.
          </p>
          <button className="bg-primary-foreground text-primary font-semibold px-5 py-2 rounded-lg text-[12px] shadow-sm">
            Ver relatório
          </button>
        </div>
        <Sparkles size={80} className="absolute -bottom-4 -right-4 opacity-10" />
      </div>
    </div>
  );
};

export default HomeTab;
