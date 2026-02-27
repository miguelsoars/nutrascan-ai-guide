import { useState } from "react";
import { Heart, Loader2, ShieldCheck, Target, Lock, CalendarDays } from "lucide-react";
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

  // Count unique days with meals
  const uniqueDays = new Set(diaryEntries.map((e) => e.date));
  const daysWithMeals = uniqueDays.size;
  const daysRemaining = Math.max(0, 7 - daysWithMeals);
  const isLocked = daysRemaining > 0;

  const generateInsights = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setInsights([
        {
          title: "Boa ingestão proteica",
          description: "Suas refeições recentes mostram uma boa proporção de proteínas, favorecendo a manutenção muscular.",
          type: "success",
        },
        {
          title: "Atenção aos carboidratos",
          description: "O consumo de carboidratos está um pouco acima da meta. Considere substituir por opções integrais.",
          type: "warning",
        },
        {
          title: "Hidratação adequada",
          description: "Baseado nos alimentos registrados, sua hidratação parece estar dentro do ideal.",
          type: "success",
        },
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="fade-in space-y-6">
      <div className="bg-card rounded-3xl p-10 text-center border border-border shadow-sm flex flex-col items-center">
        <Heart size={48} className="text-primary mb-6" />
        <h2 className="text-[24px] font-bold mb-2 tracking-tight text-foreground leading-tight">NutraIA</h2>
        <p className="text-muted-foreground text-[16px] mb-8 leading-relaxed">
          Nossa Inteligência Artificial busca padrões em suas refeições para otimizar seus resultados.
        </p>

        {isLocked ? (
          <div className="w-full space-y-4">
            <div className="bg-secondary rounded-2xl p-6 border border-border flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <Lock size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-[17px] font-bold text-foreground mb-1">Relatório bloqueado</h3>
              <p className="text-muted-foreground text-[14px] leading-relaxed mb-4">
                A NutraIA precisa de pelo menos <span className="font-bold text-foreground">7 dias</span> de refeições registradas para entender seu comportamento alimentar.
              </p>
              <div className="flex items-center gap-2 bg-accent text-primary px-4 py-2.5 rounded-xl font-bold text-[14px]">
                <CalendarDays size={18} />
                {daysRemaining === 1
                  ? "Falta 1 dia para liberar"
                  : `Faltam ${daysRemaining} dias para liberar`}
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-700 rounded-full"
                style={{ width: `${(daysWithMeals / 7) * 100}%` }}
              />
            </div>
            <p className="text-muted-foreground text-[12px] font-semibold">
              {daysWithMeals}/7 dias registrados
            </p>
          </div>
        ) : (
          <>
            {!insights && !isGenerating && (
              <button
                onClick={generateInsights}
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all text-[15px]"
              >
                Gerar relatório
              </button>
            )}
            {isGenerating && (
              <div className="py-4 text-primary">
                <Loader2 className="animate-spin mx-auto" size={32} />
              </div>
            )}
          </>
        )}
      </div>

      {insights && !isLocked && (
        <div className="space-y-4 text-left">
          <h3 className="font-bold text-muted-foreground text-[12px] uppercase tracking-widest px-2">
            Relatório gerado
          </h3>
          {insights.map((ins, i) => (
            <div
              key={i}
              className={`p-6 rounded-[22px] border shadow-sm ${
                ins.type === "success"
                  ? "bg-success/10 border-success/20"
                  : "bg-warning/10 border-warning/20"
              }`}
            >
              <h4 className="font-bold text-[18px] flex items-center gap-2 mb-2 leading-tight text-foreground">
                {ins.type === "success" ? (
                  <ShieldCheck size={20} className="text-success" />
                ) : (
                  <Target size={20} className="text-warning" />
                )}
                {ins.title}
              </h4>
              <p className="text-[16px] leading-relaxed text-muted-foreground">{ins.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NutraIATab;
