import { useState } from "react";
import { Heart, Loader2, ShieldCheck, AlertTriangle, Lock, CalendarDays } from "lucide-react";
import type { DiaryEntry } from "@/types/nutrascan";

interface NutraInsight {
  title: string;
  description: string;
  type: "success" | "warning";
}

interface NutraIATabProps {
  diaryEntries: DiaryEntry[];
}

const NutraIATab = ({ diaryEntries }: NutraIATabProps) => {
  const [insights, setInsights] = useState<NutraInsight[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const uniqueDays = new Set(diaryEntries.map((e) => e.date));
  const daysWithMeals = uniqueDays.size;
  const daysRemaining = Math.max(0, 7 - daysWithMeals);
  const isLocked = daysRemaining > 0;

  const generateInsights = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setInsights([
        { title: "Boa ingestão proteica", description: "Suas refeições mostram boa proporção de proteínas, favorecendo manutenção muscular.", type: "success" },
        { title: "Atenção aos carboidratos", description: "Consumo um pouco acima da meta. Considere opções integrais.", type: "warning" },
        { title: "Hidratação adequada", description: "Baseado nos alimentos, sua hidratação parece adequada.", type: "success" },
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="fade-in space-y-4">
      <div className="bg-card rounded-2xl p-8 text-center border border-border shadow-sm flex flex-col items-center">
        <Heart size={40} className="text-primary mb-4" />
        <h2 className="text-[20px] font-bold mb-1.5 text-foreground">NutraIA</h2>
        <p className="text-muted-foreground text-[14px] mb-6 leading-relaxed">
          Inteligência Artificial que analisa padrões em suas refeições.
        </p>

        {isLocked ? (
          <div className="w-full space-y-3">
            <div className="bg-secondary rounded-xl p-5 border border-border flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Lock size={20} className="text-muted-foreground" />
              </div>
              <h3 className="text-[15px] font-bold text-foreground mb-1">Relatório bloqueado</h3>
              <p className="text-muted-foreground text-[13px] leading-relaxed mb-3">
                Precisamos de <span className="font-bold text-foreground">7 dias</span> de refeições para entender seu comportamento alimentar.
              </p>
              <div className="flex items-center gap-1.5 bg-accent text-primary px-3 py-2 rounded-lg font-semibold text-[13px]">
                <CalendarDays size={16} />
                {daysRemaining === 1 ? "Falta 1 dia" : `Faltam ${daysRemaining} dias`}
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-primary transition-all duration-700 rounded-full" style={{ width: `${(daysWithMeals / 7) * 100}%` }} />
            </div>
            <p className="text-muted-foreground text-[11px] font-semibold">{daysWithMeals}/7 dias</p>
          </div>
        ) : (
          <>
            {!insights && !isGenerating && (
              <button onClick={generateInsights} className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl shadow-sm active:scale-95 transition-all text-[14px]">
                Gerar relatório
              </button>
            )}
            {isGenerating && (
              <div className="py-4 text-primary"><Loader2 className="animate-spin mx-auto" size={28} /></div>
            )}
          </>
        )}
      </div>

      {insights && !isLocked && (
        <div className="space-y-3 text-left">
          <h3 className="font-semibold text-muted-foreground text-[11px] uppercase tracking-widest px-1">Relatório</h3>
          {insights.map((ins, i) => (
            <div key={i} className={`p-5 rounded-2xl border shadow-sm ${ins.type === "success" ? "bg-success/5 border-success/15" : "bg-warning/5 border-warning/15"}`}>
              <h4 className="font-bold text-[15px] flex items-center gap-2 mb-1.5 text-foreground">
                {ins.type === "success" ? <ShieldCheck size={17} className="text-success" /> : <AlertTriangle size={17} className="text-warning" />}
                {ins.title}
              </h4>
              <p className="text-[13px] leading-relaxed text-muted-foreground">{ins.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NutraIATab;
