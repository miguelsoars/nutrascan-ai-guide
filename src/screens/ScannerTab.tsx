import { useRef, useState } from "react";
import { ScanLine, Loader2, Zap } from "lucide-react";
import type { AnalysisResult } from "@/types/nutrascan";

interface ScannerTabProps {
  onSaveToDiary: (results: AnalysisResult) => void;
}

const ScannerTab = ({ onSaveToDiary }: ScannerTabProps) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [foodDescription, setFoodDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [originalResults, setOriginalResults] = useState<AnalysisResult | null>(null);

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
    // Simulated analysis since no API key
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        items: [
          { name: "Arroz branco", weight: 150, calories: 195, protein: 4, carbs: 43, fat: 0.4 },
          { name: "Feijão carioca", weight: 100, calories: 76, protein: 5, carbs: 14, fat: 0.5 },
          { name: "Frango grelhado", weight: 120, calories: 198, protein: 36, carbs: 0, fat: 4.3 },
        ],
        totals: { calories: 469, protein: 45, carbs: 57, fat: 5.2 },
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
        ...item,
        weight: nw,
        calories: Math.round(item.calories * ratio),
        protein: Number((item.protein * ratio).toFixed(1)),
        carbs: Number((item.carbs * ratio).toFixed(1)),
        fat: Number((item.fat * ratio).toFixed(1)),
      };
      const nt = newItems.reduce(
        (acc, curr) => ({
          calories: acc.calories + curr.calories,
          protein: acc.protein + curr.protein,
          carbs: acc.carbs + curr.carbs,
          fat: acc.fat + curr.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
      return { items: newItems, totals: nt };
    });
  };

  const handleSave = () => {
    if (results) {
      onSaveToDiary(results);
      setImagePreview(null);
      setResults(null);
      setFoodDescription("");
    }
  };

  return (
    <div className="fade-in space-y-6">
      {!imagePreview ? (
        <div className="bg-card rounded-3xl shadow-sm p-10 text-center border border-border">
          <div className="w-20 h-20 bg-accent rounded-[22px] flex items-center justify-center mx-auto mb-6 text-primary">
            <ScanLine size={40} />
          </div>
          <h2 className="text-[24px] font-bold mb-2 text-foreground leading-tight">NutraScan™</h2>
          <p className="text-muted-foreground text-[17px] mb-8 leading-relaxed">
            Tire uma foto para analisarmos sua refeição.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-[15px]"
            >
              Câmera
            </button>
            <input
              type="file"
              capture="environment"
              accept="image/*"
              className="hidden"
              ref={cameraInputRef}
              onChange={handleImageUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-secondary text-secondary-foreground font-bold py-4 rounded-2xl active:scale-95 transition-all text-[15px]"
            >
              Galeria
            </button>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
          </div>
        </div>
      ) : (
        <div className="space-y-6 pb-10">
          <div className="relative rounded-3xl overflow-hidden bg-foreground aspect-square shadow-xl border border-card">
            <img
              src={imagePreview}
              className={`w-full h-full object-cover ${isAnalyzing ? "opacity-50" : "opacity-100"}`}
              alt="Refeição"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground bg-foreground/40 ios-blur">
                <Loader2 className="animate-spin mb-3" size={40} />
                <span className="font-bold text-[15px] mt-2">Analisando</span>
              </div>
            )}
          </div>

          {!results && !isAnalyzing && (
            <div className="bg-card p-6 rounded-[20px] shadow-sm border border-border">
              <textarea
                placeholder="Descreva seu prato. Exemplo: Uma omelete de frango com arroz e feijão (Opcional)"
                value={foodDescription}
                onChange={(e) => setFoodDescription(e.target.value)}
                className="w-full bg-secondary px-5 py-4 rounded-xl outline-none mb-5 border border-border min-h-[100px] resize-none focus:bg-card transition-colors font-medium text-foreground"
              />
              <button
                onClick={analyzeImage}
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-[17px]"
              >
                Analisar refeição
              </button>
            </div>
          )}

          {results && (
            <div className="fade-in space-y-6">
              {/* Totals */}
              <div className="bg-card rounded-[20px] p-6 shadow-sm border border-border text-center">
                <h3 className="font-bold text-[17px] mb-4 text-muted-foreground">Análise da sua refeição</h3>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-macro-calories/10 p-3 rounded-xl flex flex-col items-center justify-center">
                    <span className="block font-bold text-macro-calories text-[20px] leading-tight">{Math.round(results.totals.calories)}</span>
                    <span className="text-[9px] font-bold text-macro-calories/70 uppercase">kcal</span>
                  </div>
                  <div className="bg-macro-protein/10 p-3 rounded-xl flex flex-col items-center justify-center">
                    <span className="block font-bold text-macro-protein text-[20px] leading-tight">{results.totals.protein.toFixed(1)}g</span>
                    <span className="text-[9px] font-bold text-macro-protein/70 uppercase">prot</span>
                  </div>
                  <div className="bg-macro-carbs/10 p-3 rounded-xl flex flex-col items-center justify-center">
                    <span className="block font-bold text-macro-carbs text-[20px] leading-tight">{results.totals.carbs.toFixed(1)}g</span>
                    <span className="text-[9px] font-bold text-macro-carbs/70 uppercase">carb</span>
                  </div>
                  <div className="bg-macro-fat/10 p-3 rounded-xl flex flex-col items-center justify-center">
                    <span className="block font-bold text-macro-fat text-[20px] leading-tight">{results.totals.fat.toFixed(1)}g</span>
                    <span className="text-[9px] font-bold text-macro-fat/70 uppercase">gord</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <h3 className="font-bold px-2 text-muted-foreground text-[13px] uppercase tracking-widest">
                  Itens identificados
                </h3>
                {results.items.map((it, i) => (
                  <div key={i} className="bg-card p-5 rounded-2xl flex justify-between items-center shadow-sm border border-border">
                    <span className="font-bold text-foreground text-[16px] leading-tight">{it.name}</span>
                    <div className="flex items-center gap-1.5 bg-secondary px-4 py-2 rounded-full border border-border/50">
                      <input
                        type="number"
                        value={it.weight}
                        onChange={(e) => handleWeightChange(i, e.target.value)}
                        className="w-12 bg-transparent text-right font-bold text-[15px] outline-none text-foreground"
                      />
                      <span className="text-muted-foreground font-bold text-[11px]">g</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Impact placeholder */}
              <div className="bg-accent p-6 rounded-[20px] border border-primary/20">
                <h3 className="font-bold text-primary mb-2 flex items-center gap-2 text-[17px] leading-tight">
                  <Zap size={18} /> Análise de impacto
                </h3>
                <p className="text-[15px] leading-relaxed text-accent-foreground/80 font-medium">
                  Essa refeição representa {Math.round((results.totals.calories / 2000) * 100)}% de uma meta diária de 2000 kcal, com boa distribuição de macros.
                </p>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl text-[17px] active:scale-95 transition-all shadow-lg"
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
