import { useState } from "react";
import { Sparkles, ChevronLeft, Target, Check } from "lucide-react";
import type { ProfileForm } from "@/types/nutrascan";

interface OnboardingScreenProps {
  profileForm: ProfileForm;
  setProfileForm: React.Dispatch<React.SetStateAction<ProfileForm>>;
  onFinish: () => void;
}

const OnboardingScreen = ({ profileForm, setProfileForm, onFinish }: OnboardingScreenProps) => {
  const [step, setStep] = useState(0);
  const totalSteps = 9;

  const bodyOpts = [
    { label: "Bem definido", emoji: "💪" },
    { label: "Leve contorno", emoji: "🏃" },
    { label: "Normal", emoji: "👤" },
    { label: "Pequena camada de gordura", emoji: "🫄" },
    { label: "Gordura bastante evidente", emoji: "⚖️" },
  ];

  const goalOpts = [
    { label: "Emagrecer", emoji: "🔥", desc: "Perder gordura mantendo massa magra" },
    { label: "Manter", emoji: "⚖️", desc: "Manter peso e composição corporal" },
    { label: "Hipertrofia", emoji: "💪", desc: "Ganhar massa muscular" },
  ];

  const activityOpts = [
    { label: "Sedentário", emoji: "🛋️", desc: "Pouca ou nenhuma atividade" },
    { label: "Leve", emoji: "🚶", desc: "1–2 treinos por semana" },
    { label: "Moderado", emoji: "🏋️", desc: "3–4 treinos por semana" },
    { label: "Intenso", emoji: "⚡", desc: "5+ treinos por semana" },
  ];

  const stepConfig: Record<number, { title: string; subtitle?: string; field: string; options: { label: string; emoji: string; desc?: string }[] }> = {
    2: { title: "Qual seu objetivo?", subtitle: "Isso ajuda a NutraIA a calcular suas metas.", field: "goal", options: goalOpts },
    3: { title: "Nível de atividade", subtitle: "Frequência semanal de exercícios.", field: "activity", options: activityOpts },
    4: { title: "Como está seu abdômen?", subtitle: "Região abdominal frontal.", field: "abdomen", options: bodyOpts },
    5: { title: "Cintura e pneuzinhos", subtitle: "Região lateral da cintura.", field: "loveHandles", options: bodyOpts },
    6: { title: "Braços e peitoral", subtitle: "Parte superior do corpo.", field: "upperBody", options: bodyOpts },
    7: { title: "Pernas", subtitle: "Coxas e panturrilhas.", field: "lowerBody", options: bodyOpts },
    8: { title: "Rosto e pescoço", subtitle: "Definição facial.", field: "faceNeck", options: bodyOpts },
  };

  const handleSelect = (field: string, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
    setTimeout(() => setStep(step + 1), 250);
  };

  const currentConfig = stepConfig[step];
  const currentValue = currentConfig ? (profileForm as unknown as Record<string, string>)[currentConfig.field] || "" : "";

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${step === 0 ? "bg-primary" : "bg-background"}`}>
      {/* Progress Header */}
      {step > 0 && step < totalSteps && (
        <div className="px-5 pt-14 pb-4 flex items-center gap-4 bg-background">
          <button
            onClick={() => setStep(step - 1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-foreground active:scale-90 transition-transform"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex-1 flex gap-1">
            {Array.from({ length: totalSteps - 1 }).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full flex-1 transition-all duration-500 ${
                  i < step ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
          <span className="text-[13px] font-bold text-muted-foreground min-w-[32px] text-right">
            {step}/{totalSteps - 1}
          </span>
        </div>
      )}

      <div className="flex-1 px-6 flex flex-col justify-center max-w-md mx-auto w-full">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="fade-in text-center">
            <div className="w-20 h-20 bg-primary-foreground/15 rounded-[22px] flex items-center justify-center mx-auto mb-8">
              <Sparkles size={40} className="text-primary-foreground" />
            </div>
            <h1 className="text-[30px] font-extrabold mb-3 tracking-tight leading-tight text-primary-foreground">
              Vamos fazer uma rápida avaliação
            </h1>
            <p className="text-[17px] opacity-80 leading-relaxed mb-12 text-primary-foreground/90 max-w-[280px] mx-auto">
              É tão rápido que você nem vai perceber que já finalizamos.
            </p>
            <button
              onClick={() => setStep(1)}
              className="w-full bg-primary-foreground text-primary font-bold py-4 rounded-2xl text-[17px] active:scale-95 shadow-xl transition-all"
            >
              Começar
            </button>
          </div>
        )}

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="fade-in space-y-5 text-left">
            <div className="mb-2">
              <h2 className="text-[26px] font-extrabold tracking-tight leading-tight text-foreground">
                Sobre você
              </h2>
              <p className="text-muted-foreground text-[15px] mt-1.5">Informações básicas para personalizar.</p>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Como gostaria de ser chamado(a)?"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full bg-card border border-border rounded-2xl px-5 py-4 text-[17px] outline-none shadow-sm focus:border-primary/30 focus:ring-2 focus:ring-primary/10 text-foreground transition-all placeholder:text-muted-foreground/50"
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider absolute top-2.5 left-5 z-10">Nascimento</label>
                  <input
                    type="date"
                    value={profileForm.birthDate}
                    onChange={(e) => setProfileForm({ ...profileForm, birthDate: e.target.value })}
                    className="w-full bg-card border border-border rounded-2xl px-5 pt-8 pb-3 outline-none shadow-sm text-foreground focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div className="relative">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider absolute top-2.5 left-5 z-10">Sexo</label>
                  <select
                    value={profileForm.gender}
                    onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                    className="w-full bg-card border border-border rounded-2xl px-5 pt-8 pb-3 outline-none shadow-sm text-foreground focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all appearance-none"
                  >
                    <option value="M">Homem</option>
                    <option value="F">Mulher</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider absolute top-2.5 left-5 z-10">Altura</label>
                  <input
                    type="number"
                    placeholder="cm"
                    value={profileForm.height}
                    onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value })}
                    className="w-full bg-card border border-border rounded-2xl px-5 pt-8 pb-3 outline-none shadow-sm text-foreground focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div className="relative">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider absolute top-2.5 left-5 z-10">Peso</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="kg"
                    value={profileForm.weight}
                    onChange={(e) => setProfileForm({ ...profileForm, weight: e.target.value })}
                    className="w-full bg-card border border-border rounded-2xl px-5 pt-8 pb-3 outline-none shadow-sm text-foreground focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!profileForm.name || !profileForm.birthDate}
              className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl mt-2 active:scale-95 transition-all disabled:opacity-40 text-[17px] shadow-md"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Steps 2-8: Options */}
        {step >= 2 && step <= 8 && currentConfig && (
          <div className="fade-in text-left">
            <div className="mb-6">
              <h2 className="text-[26px] font-extrabold tracking-tight leading-tight text-foreground">
                {currentConfig.title}
              </h2>
              {currentConfig.subtitle && (
                <p className="text-muted-foreground text-[15px] mt-1.5">{currentConfig.subtitle}</p>
              )}
            </div>
            <div className="space-y-2.5">
              {currentConfig.options.map((opt) => {
                const isSelected = currentValue === opt.label;
                return (
                  <button
                    key={opt.label}
                    onClick={() => handleSelect(currentConfig.field, opt.label)}
                    className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                      isSelected
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-card border-border active:bg-secondary active:border-muted-foreground/20"
                    }`}
                  >
                    <span className="text-[22px]">{opt.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[16px] font-bold block leading-tight ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {opt.label}
                      </span>
                      {opt.desc && (
                        <span className="text-[13px] text-muted-foreground mt-0.5 block">{opt.desc}</span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Check size={14} className="text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 9: Done */}
        {step === 9 && (
          <div className="fade-in text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-8 text-primary shadow-md">
              <Target size={40} />
            </div>
            <h2 className="text-[28px] font-extrabold mb-3 tracking-tight text-foreground leading-tight">
              Tudo pronto!
            </h2>
            <p className="text-muted-foreground text-[17px] mb-12 leading-relaxed mt-2 max-w-[280px]">
              Analisamos seus dados e geramos um plano personalizado para você.
            </p>
            <button
              onClick={onFinish}
              className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl text-[17px] active:scale-95 shadow-lg"
            >
              Ver meu plano
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;
