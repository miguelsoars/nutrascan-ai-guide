import { useState } from "react";
import { Sparkles, ChevronLeft, Target } from "lucide-react";
import OptionsStep from "@/components/OptionsStep";
import type { ProfileForm } from "@/types/nutrascan";

interface OnboardingScreenProps {
  profileForm: ProfileForm;
  setProfileForm: React.Dispatch<React.SetStateAction<ProfileForm>>;
  onFinish: () => void;
}

const OnboardingScreen = ({ profileForm, setProfileForm, onFinish }: OnboardingScreenProps) => {
  const [step, setStep] = useState(0);
  const bodyOpts = ["Bem definido", "Leve contorno", "Normal", "Pequena camada de gordura", "Gordura bastante evidente"];

  const stepTitles: Record<number, string> = {
    2: "Qual seu objetivo?",
    3: "Atividade física",
    4: "Como está seu abdômen?",
    5: "Cintura / Pneuzinhos",
    6: "Braços e peitoral",
    7: "Pernas",
    8: "Rosto e pescoço",
  };

  const stepFields: Record<number, string> = {
    2: "goal",
    3: "activity",
    4: "abdomen",
    5: "loveHandles",
    6: "upperBody",
    7: "lowerBody",
    8: "faceNeck",
  };

  const stepOptions: Record<number, string[]> = {
    2: ["Emagrecer", "Manter", "Hipertrofia"],
    3: ["Sedentário", "Leve", "Moderado", "Intenso"],
    4: bodyOpts,
    5: bodyOpts,
    6: bodyOpts,
    7: bodyOpts,
    8: bodyOpts,
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${step === 0 ? "bg-primary" : "bg-background"}`}>
      {step > 0 && step < 9 && (
        <div className="px-5 pt-12 pb-4 flex items-center justify-between border-b border-border bg-card/80 ios-blur">
          <button onClick={() => setStep(step - 1)} className="p-2 -ml-2 text-primary">
            <ChevronLeft size={28} />
          </button>
          <div className="flex gap-1.5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i < step ? "w-5 bg-primary" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>
          <div className="w-7" />
        </div>
      )}

      <div className="flex-1 px-6 py-10 flex flex-col justify-center max-w-md mx-auto w-full">
        {step === 0 && (
          <div className="fade-in text-center">
            <div className="w-20 h-20 bg-primary-foreground/20 rounded-[20px] flex items-center justify-center mx-auto mb-6 ios-blur">
              <Sparkles size={40} className="text-primary-foreground" />
            </div>
            <h1 className="text-[28px] font-bold mb-3 tracking-tight leading-tight text-primary-foreground">
              Antes, vamos fazer uma rápida avaliação
            </h1>
            <p className="text-[17px] opacity-90 leading-relaxed mb-10 text-primary-foreground">
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

        {step === 1 && (
          <div className="fade-in space-y-5 text-left">
            <h2 className="text-[24px] font-bold mb-6 tracking-tight leading-tight text-foreground">
              Sobre você
            </h2>
            <input
              type="text"
              placeholder="Como gostaria de ser chamado(a)?"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full bg-card border border-border rounded-2xl p-4 text-[17px] outline-none shadow-sm focus:ring-2 focus:ring-primary/10 text-foreground"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={profileForm.birthDate}
                onChange={(e) => setProfileForm({ ...profileForm, birthDate: e.target.value })}
                className="w-full bg-card border border-border rounded-2xl p-4 outline-none shadow-sm text-foreground"
              />
              <select
                value={profileForm.gender}
                onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                className="bg-card border border-border rounded-2xl p-4 outline-none shadow-sm text-foreground"
              >
                <option value="M">Homem</option>
                <option value="F">Mulher</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Altura (cm)"
                value={profileForm.height}
                onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value })}
                className="bg-card border border-border rounded-2xl p-4 outline-none shadow-sm text-foreground"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Peso (kg)"
                value={profileForm.weight}
                onChange={(e) => setProfileForm({ ...profileForm, weight: e.target.value })}
                className="bg-card border border-border rounded-2xl p-4 outline-none shadow-sm text-foreground"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!profileForm.name || !profileForm.birthDate}
              className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl mt-4 active:scale-95 transition-all disabled:opacity-50 text-[17px]"
            >
              Continuar
            </button>
          </div>
        )}

        {step >= 2 && step <= 8 && (
          <OptionsStep
            title={stepTitles[step]}
            options={stepOptions[step]}
            field={stepFields[step]}
            currentValue={(profileForm as unknown as Record<string, string>)[stepFields[step]] || ""}
            onSelect={(f, v) => {
              setProfileForm((prev) => ({ ...prev, [f]: v }));
              setTimeout(() => setStep(step + 1), 300);
            }}
          />
        )}

        {step === 9 && (
          <div className="fade-in text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-6 text-primary shadow-sm">
              <Target size={40} />
            </div>
            <h2 className="text-[26px] font-bold mb-3 tracking-tight text-foreground leading-none">
              Pronto, já temos o que precisávamos
            </h2>
            <p className="text-muted-foreground text-[17px] mb-10 leading-relaxed mt-2">
              Analisamos seus dados e geramos um plano para te ajudar a alcançar seus objetivos
            </p>
            <button
              onClick={onFinish}
              className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl text-[17px] active:scale-95 shadow-md"
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
