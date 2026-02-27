import { useRef, useState } from "react";
import { ScanLine, Loader2, Zap, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { AnalysisResult, MealType, Targets } from "@/types/nutrascan";
import { mealTypeLabels, mealTypeEmojis } from "@/types/nutrascan";

interface ScannerTabProps {
  onSaveToDiary: (results: AnalysisResult) => void;
  targets: Targets;
  dailyTotals: { calories: number; protein: number; carbs: number; fat: number };
  goal: string;
}

const ScannerTab = ({ onSaveToDiary, targets, dailyTotals, goal }: ScannerTabProps) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [foodDescription, setFoodDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [originalResults, setOriginalResults] = useState<AnalysisResult | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType>("lunch");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
      setResults(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        items: [
          { name: "Arroz branco", weight: 150, calories: 195, protein: 4, carbs: 43, fat: 0.4 },
          { name: "Feijão carioca", weight: 100, calories: 76, protein: 5, carbs: 14, fat: 0.5 },
          { name: "Frango grelhado", weight: 120, calories: 198, protein: 36, carbs: 0, fat: 4.3 },
        ],
        totals: { calories: 469, protein: 45, carbs: 57, fat: 5.2 },
        mealType: selectedMealType,
      };
      setResults(mockResult);
      setOriginalResults(mockResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleWeightChange = (index: number, val: string) => {
    const nw = parseFloat(val);
    if (isNaN(nw) || !originalResults) return;
    setResults((prev) => {
      if (!prev) return prev;
      const item = originalResults.items[index];
      const ratio = nw / (item.weight || 1);
      const newItems = [...prev.items];
      newItems[index] = {
        ...item, weight: nw,
        calories: Math.round(item.calories * ratio),
        protein: Number((item.protein * ratio).toFixed(1)),
        carbs: Number((item.carbs * ratio).toFixed(1)),
        fat: Number((item.fat * ratio).toFixed(1)),
      };
      const nt = newItems.reduce(
        (acc, curr) => ({ calories: acc.calories + curr.calories, protein: acc.protein + curr.protein, carbs: acc.carbs + curr.carbs, fat: acc.fat + curr.fat }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
      return { ...prev, items: newItems, totals: nt };
    });
  };

  const handleSave = () => {
    if (results) {
      onSaveToDiary({ ...results, mealType: selectedMealType });
      setImagePreview(null);
      setResults(null);
      setFoodDescription("");
    }
  };

  const getImpactAnalysis = () => {
    if (!results) return [];
    const afterCalories = dailyTotals.calories + results.totals.calories;
    const afterProtein = dailyTotals.protein + results.totals.protein;
    const afterCarbs = dailyTotals.carbs + results.totals.carbs;
    const afterFat = dailyTotals.fat + results.totals.fat;
    const calPct = Math.round((afterCalories / targets.calories) * 100);
    const protPct = Math.round((afterProtein / targets.protein) * 100);
    const isWeightLoss = goal.toLowerCase().includes("emagrecer");
    const isHypertrophy = goal.toLowerCase().includes("hipertrofia");

    const insights: { icon: React.ReactNode; text: string; type: "good" | "warn" | "info" }[] = [];

    if (calPct > 100) {
      insights.push({
        icon: <AlertTriangle size={15} />,
        text: `Com esta refeição, você atingirá ${calPct}% da meta calórica diária. ${isWeightLoss ? "Isso pode comprometer seu déficit calórico." : "Considere ajustar as próximas refeições."}`,
        type: "warn",
      });
    } else if (calPct > 80) {
      insights.push({
        icon: <TrendingUp size={15} />,
        text: `Você estará em ${calPct}% da meta. ${isWeightLoss ? "Restará pouco espaço para mais refeições — opte por alimentos leves." : "Bom ritmo, mantenha o equilíbrio."}`,
        type: "info",
      });
    } else {
      insights.push({
        icon: <CheckCircle2 size={15} />,
        text: `Esta refeição te leva a ${calPct}% da meta. Você ainda tem bom espaço para as próximas refeições do dia.`,
        type: "good",
      });
    }

    if (protPct < 50 && results.totals.protein < 15) {
      insights.push({
        icon: <TrendingDown size={15} />,
        text: `Proteína baixa nesta refeição (${results.totals.protein.toFixed(0)}g). ${isHypertrophy ? "Para hipertrofia, priorize fontes de proteína em cada refeição." : "Adicionar uma fonte proteica melhora a saciedade."}`,
        type: "warn",
      });
    } else if (results.totals.protein > 25) {
      insights.push({
        icon: <CheckCircle2 size={15} />,
        text: `Boa quantidade de proteína (${results.totals.protein.toFixed(0)}g). ${isHypertrophy ? "Excelente para síntese muscular." : "Contribui para saciedade e manutenção muscular."}`,
        type: "good",
      });
    }

    if (afterFat > targets.fat && results.totals.fat > 15) {
      insights.push({
        icon: <AlertTriangle size={15} />,
        text: `Gordura acima da meta diária. Nas próximas refeições, prefira preparações grelhadas ou cozidas.`,
        type: "warn",
      });
    }

    return insights;
  };

  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

  return (
    <div className="fade-in space-y-5">
      {!imagePreview ? (
        <div className="bg-card rounded-2xl shadow-sm p-8 text-center border border-border">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-5 text-primary">
            <ScanLine size={32} />
          </div>
          <h2 className="text-[22px] font-bold mb-1.5 text-foreground">NutraScan™</h2>
          <p className="text-muted-foreground text-[15px] mb-6 leading-relaxed">
            Tire uma foto para analisarmos sua refeição.
          </p>

          {/* Meal Type Selector */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {mealTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedMealType(type)}
                className={`flex flex-col items-center py-3 rounded-xl transition-all text-center ${
                  selectedMealType === type
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                <span className="text-[16px] mb-1">{mealTypeEmojis[type]}</span>
                <span className="text-[10px] font-bold uppercase tracking-wide leading-none">
                  {type === "breakfast" ? "Café" : type === "lunch" ? "Almoço" : type === "dinner" ? "Janta" : "Lanche"}
                </span>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl shadow-sm active:scale-95 transition-all text-[15px]"
            >
              Câmera
            </button>
            <input type="file" capture="environment" accept="image/*" className="hidden" ref={cameraInputRef} onChange={handleImageUpload} />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-secondary text-secondary-foreground font-semibold py-3.5 rounded-xl active:scale-95 transition-all text-[15px]"
            >
              Galeria
            </button>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
          </div>
        </div>
      ) : (
        <div className="space-y-5 pb-10">
          <div className="relative rounded-2xl overflow-hidden bg-foreground aspect-square shadow-lg">
            <img src={imagePreview} className={`w-full h-full object-cover ${isAnalyzing ? "opacity-50" : ""}`} alt="Refeição" />
            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground bg-foreground/40 ios-blur">
                <Loader2 className="animate-spin mb-3" size={36} />
                <span className="font-semibold text-[14px] mt-1">Analisando</span>
              </div>
            )}
          </div>

          {/* Meal type selector on preview too */}
          {!results && !isAnalyzing && (
            <div className="bg-card p-5 rounded-2xl shadow-sm border border-border space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {mealTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedMealType(type)}
                    className={`flex flex-col items-center py-2.5 rounded-xl transition-all ${
                      selectedMealType === type
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <span className="text-[14px] mb-0.5">{mealTypeEmojis[type]}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wide">
                      {type === "breakfast" ? "Café" : type === "lunch" ? "Almoço" : type === "dinner" ? "Janta" : "Lanche"}
                    </span>
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Descreva seu prato (opcional)"
                value={foodDescription}
                onChange={(e) => setFoodDescription(e.target.value)}
                className="w-full bg-secondary px-4 py-3 rounded-xl outline-none border border-border min-h-[80px] resize-none focus:bg-card transition-colors text-foreground text-[15px]"
              />
              <button
                onClick={analyzeImage}
                className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl shadow-sm active:scale-95 transition-all text-[15px]"
              >
                Analisar refeição
              </button>
            </div>
          )}

          {results && (
            <div className="fade-in space-y-4">
              {/* Meal type badge */}
              <div className="flex items-center gap-2 px-1">
                <span className="text-[16px]">{mealTypeEmojis[selectedMealType]}</span>
                <span className="text-[14px] font-bold text-foreground">{mealTypeLabels[selectedMealType]}</span>
              </div>

              {/* Totals */}
              <div className="bg-card rounded-2xl p-5 shadow-sm border border-border text-center">
                <h3 className="font-semibold text-[14px] mb-3 text-muted-foreground">Análise da refeição</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { val: Math.round(results.totals.calories), label: "kcal", color: "macro-calories" },
                    { val: results.totals.protein.toFixed(1) + "g", label: "prot", color: "macro-protein" },
                    { val: results.totals.carbs.toFixed(1) + "g", label: "carb", color: "macro-carbs" },
                    { val: results.totals.fat.toFixed(1) + "g", label: "gord", color: "macro-fat" },
                  ].map((m) => (
                    <div key={m.label} className={`bg-${m.color}/10 p-3 rounded-xl`}>
                      <span className={`block font-bold text-${m.color} text-[18px] leading-tight`}>{m.val}</span>
                      <span className={`text-[9px] font-bold text-${m.color}/70 uppercase`}>{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <h3 className="font-semibold px-1 text-muted-foreground text-[12px] uppercase tracking-widest">
                  Itens identificados
                </h3>
                {results.items.map((it, i) => (
                  <div key={i} className="bg-card p-4 rounded-xl flex justify-between items-center shadow-sm border border-border">
                    <span className="font-semibold text-foreground text-[15px]">{it.name}</span>
                    <div className="flex items-center gap-1 bg-secondary px-3 py-1.5 rounded-lg border border-border/50">
                      <input
                        type="number"
                        value={it.weight}
                        onChange={(e) => handleWeightChange(i, e.target.value)}
                        className="w-11 bg-transparent text-right font-bold text-[14px] outline-none text-foreground"
                      />
                      <span className="text-muted-foreground font-bold text-[11px]">g</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detailed Impact Analysis */}
              <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
                <h3 className="font-bold text-[15px] mb-3 flex items-center gap-2 text-foreground">
                  <Zap size={16} className="text-primary" /> Análise de impacto
                </h3>
                <div className="space-y-3">
                  {getImpactAnalysis().map((insight, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        insight.type === "good" ? "bg-success/10 text-success" :
                        insight.type === "warn" ? "bg-warning/10 text-warning" :
                        "bg-accent text-primary"
                      }`}>
                        {insight.icon}
                      </div>
                      <p className="text-[13px] text-muted-foreground leading-relaxed flex-1">{insight.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl text-[15px] active:scale-95 transition-all shadow-sm"
              >
                Salvar no diário
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScannerTab;
