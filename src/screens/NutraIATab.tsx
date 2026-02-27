import { useState } from "react";
import { Heart, Loader2, ShieldCheck, Target } from "lucide-react";

interface NutraInsight {
  title: string;
  description: string;
  type: "success" | "warning";
}

const NutraIATab = () => {
  const [insights, setInsights] = useState<NutraInsight[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
      </div>

      {insights && (
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
