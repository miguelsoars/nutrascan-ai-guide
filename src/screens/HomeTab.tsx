import { TrendingUp, Sparkles, Heart } from "lucide-react";
import WeightChart from "@/components/WeightChart";
import type { MealTotals, Targets, ProfileData, DiaryEntry } from "@/types/nutrascan";

interface HomeTabProps {
  name: string;
  dailyTotals: MealTotals;
  targets: Targets;
  todaysEntries: DiaryEntry[];
  profile: ProfileData | null;
  profileWeight: string;
  onUpdateWeight: () => void;
  onGoToNutraIA: () => void;
}

const HomeTab = ({
  name,
  dailyTotals,
  targets,
  todaysEntries,
  profile,
  profileWeight,
  onUpdateWeight,
  onGoToNutraIA,
}: HomeTabProps) => {
  const getProgress = (curr: number, max: number) => Math.min((curr / (max || 1)) * 100, 100);

  return (
    <div className="fade-in space-y-6 text-left">
      <h1 className="text-[28px] font-bold tracking-tight text-foreground">
        Olá, <span className="text-primary">{name?.split(" ")[0] || "Bem-vindo"}</span>!
      </h1>

      {/* Calorie Card */}
      <div className="bg-card rounded-3xl shadow-sm border border-border p-6">
        <div className="flex justify-between mb-4 items-center">
          <h2 className="text-[17px] font-bold leading-tight">Meta de hoje</h2>
          <span className="text-[13px] text-muted-foreground font-semibold">
            {todaysEntries.length} refeições
          </span>
        </div>
        <div className="flex items-end mb-4 leading-none">
          <span className="text-[40px] font-bold text-primary tracking-tighter">
            {Math.round(dailyTotals.calories)}
          </span>
          <span className="text-[16px] text-muted-foreground font-bold ml-2 mb-1">
            / {targets.calories} kcal
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-3 mb-6 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-1000 rounded-full"
            style={{ width: `${getProgress(dailyTotals.calories, targets.calories)}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-2 divide-x divide-border text-center">
          <div>
            <span className="block text-[12px] text-muted-foreground mb-1 font-bold uppercase tracking-wider">
              Prot
            </span>
            <span className="text-[17px] font-bold">{Math.round(dailyTotals.protein)}g</span>
          </div>
          <div>
            <span className="block text-[12px] text-muted-foreground mb-1 font-bold uppercase tracking-wider">
              Carb
            </span>
            <span className="text-[17px] font-bold">{Math.round(dailyTotals.carbs)}g</span>
          </div>
          <div>
            <span className="block text-[12px] text-muted-foreground mb-1 font-bold uppercase tracking-wider">
              Gord
            </span>
            <span className="text-[17px] font-bold">{Math.round(dailyTotals.fat)}g</span>
          </div>
        </div>
      </div>

      {/* Weight Card */}
      <div className="bg-card rounded-3xl shadow-sm border border-border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[17px] font-bold flex items-center gap-2 leading-tight">
            <TrendingUp className="text-primary" size={20} /> Peso atual
          </h2>
          <button
            onClick={onUpdateWeight}
            className="bg-accent text-primary text-[13px] font-bold px-4 py-2 rounded-full active:scale-95 transition-all"
          >
            Atualizar
          </button>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[32px] font-bold tracking-tighter">
            {profile?.weightHistory?.slice(-1)[0]?.weight || profileWeight || 0}
          </span>
          <span className="text-[15px] font-bold text-muted-foreground">kg</span>
        </div>
        <WeightChart history={profile?.weightHistory || []} />
      </div>

      {/* NutraIA CTA */}
      <div
        className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 text-primary-foreground relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer shadow-lg"
        onClick={onGoToNutraIA}
      >
        <div className="relative z-10 text-left flex flex-col items-start">
          <h2 className="text-[18px] font-bold flex items-center gap-2">
            <Heart className="text-primary-foreground/60" size={22} /> NutraIA
          </h2>
          <p className="text-[14px] opacity-90 mt-1 mb-4 leading-relaxed pr-6">
            Análise inteligente dos seus padrões alimentares automáticos identificados.
          </p>
          <button className="bg-primary-foreground text-primary font-bold px-6 py-2 rounded-full text-[13px] shadow-lg">
            Ver relatório
          </button>
        </div>
        <Sparkles size={100} className="absolute -bottom-6 -right-6 opacity-10" />
      </div>
    </div>
  );
};

export default HomeTab;
