import { useRef, useState } from "react";
import { UserCircle, Camera, Target, RotateCcw, LogOut, Edit3, Check, Sparkles, Zap, TrendingDown, TrendingUp } from "lucide-react";
import type { ProfileData, ProfileForm, Targets } from "@/types/nutrascan";

interface ProfileTabProps {
  profile: ProfileData | null;
  profileForm: ProfileForm;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRedoAssessment: () => void;
  onLogout: () => void;
  onUpdateTargets: (targets: Targets) => void;
}

const getAge = (birthDateStr: string) => {
  if (!birthDateStr) return 0;
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

const getBiotype = (bf: number, gender: string) => {
  if (gender === "M") {
    if (bf <= 12) return { name: "Ectomorfo", desc: "Corpo magro com baixo percentual de gordura. Metabolismo acelerado." };
    if (bf <= 20) return { name: "Mesomorfo", desc: "Corpo atlético e equilibrado. Facilidade para ganhar massa muscular." };
    return { name: "Endomorfo", desc: "Tendência a acumular gordura. Beneficia-se de controle calórico rigoroso." };
  }
  if (bf <= 20) return { name: "Ectomorfa", desc: "Corpo magro com baixo percentual de gordura. Metabolismo acelerado." };
  if (bf <= 28) return { name: "Mesomorfa", desc: "Corpo atlético e equilibrado. Facilidade para ganhar massa muscular." };
  return { name: "Endomorfa", desc: "Tendência a acumular gordura. Beneficia-se de controle calórico rigoroso." };
};

const getStrategy = (goal: string, bf: number, gender: string) => {
  const biotype = getBiotype(bf, gender);
  const goalLower = goal.toLowerCase();

  if (goalLower.includes("emagrecer") || goalLower === "emagrecer") {
    return {
      type: "Déficit Calórico" as const,
      icon: <TrendingDown size={20} className="text-[hsl(var(--macro-protein))]" />,
      color: "bg-[hsl(var(--macro-protein))]/10 border-[hsl(var(--macro-protein))]/20",
      description: `Como ${biotype.name.toLowerCase()}, sua estratégia ideal é um déficit calórico moderado (-400 a -500 kcal). Priorize proteínas para preservar massa muscular e inclua treinos de resistência.`,
      tips: ["Refeições ricas em proteína e fibra", "Deficit moderado de 400–500 kcal", "3–5 treinos por semana"],
    };
  }

  if (goalLower.includes("hipertrofia") || goalLower === "hipertrofia") {
    return {
      type: "Superávit Calórico" as const,
      icon: <TrendingUp size={20} className="text-success" />,
      color: "bg-success/10 border-success/20",
      description: `Como ${biotype.name.toLowerCase()}, um superávit calórico controlado (+300 a +400 kcal) é ideal. Foque em proteínas de alta qualidade e carboidratos complexos para alimentar o crescimento muscular.`,
      tips: ["Superávit controlado de 300–400 kcal", "2g+ de proteína por kg corporal", "Carboidratos complexos pré-treino"],
    };
  }

  return {
    type: "Manutenção" as const,
    icon: <Zap size={20} className="text-primary" />,
    color: "bg-accent border-primary/20",
    description: `Como ${biotype.name.toLowerCase()}, mantenha a ingestão calórica próxima ao seu TDEE. Distribua bem os macronutrientes para manter composição corporal e energia.`,
    tips: ["Calorias próximas ao TDEE", "Distribuição equilibrada de macros", "Consistência é a chave"],
  };
};

const ProfileTab = ({ profile, profileForm, onAvatarChange, onRedoAssessment, onLogout, onUpdateTargets }: ProfileTabProps) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [editTargets, setEditTargets] = useState<Targets>({
    calories: 0, protein: 0, carbs: 0, fat: 0,
  });

  if (!profile) {
    return (
      <div className="text-center py-20 fade-in flex flex-col items-center">
        <p className="text-muted-foreground mt-4 font-medium">Carregando dados do perfil...</p>
      </div>
    );
  }

  const bf = profile?.inputs?.estimatedBF || 20;
  const gender = profileForm.gender || "M";
  const biotype = getBiotype(bf, gender);
  const strategy = getStrategy(profileForm.goal, bf, gender);

  const startEditing = () => {
    setEditTargets({ ...profile.targets });
    setIsEditingGoals(true);
  };

  const saveGoals = () => {
    onUpdateTargets(editTargets);
    setIsEditingGoals(false);
  };

  return (
    <div className="fade-in space-y-5">
      {/* Profile Header */}
      <div className="bg-card rounded-3xl p-8 text-center border border-border shadow-sm relative overflow-hidden flex flex-col items-center">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary to-primary/60 opacity-10" />
        <div
          className="relative group cursor-pointer inline-block mt-4"
          onClick={() => avatarInputRef.current?.click()}
        >
          <div className="w-24 h-24 rounded-full bg-card border-4 border-card shadow-md overflow-hidden flex items-center justify-center">
            {profileForm.avatar ? (
              <img src={profileForm.avatar} className="w-full h-full object-cover" alt="Avatar" />
            ) : (
              <UserCircle size={48} className="text-border" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2.5 rounded-full border-2 border-card shadow-sm transition-transform active:scale-90 flex items-center justify-center">
            <Camera size={14} />
          </button>
          <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={onAvatarChange} />
        </div>
        <h2 className="text-[24px] font-bold mt-4 tracking-tight leading-none text-foreground">
          {profileForm.name || "Seu perfil"}
        </h2>
        <p className="text-muted-foreground text-[15px] mt-2 font-medium">
          {getAge(profileForm.birthDate)} anos • {profileForm.gender === "M" ? "Masculino" : "Feminino"}
        </p>
      </div>

      {/* Assessment Report + Biotype */}
      <div className="bg-card rounded-[22px] p-6 border border-border shadow-sm text-left">
        <h3 className="text-[17px] font-bold flex items-center gap-2 mb-5 leading-tight">
          <Target className="text-primary" size={20} /> Relatório de avaliação
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-secondary p-4 rounded-2xl flex flex-col items-center justify-center border border-border">
            <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1.5 leading-none">Gordura (BF)</span>
            <span className="text-[22px] font-bold text-primary leading-none">{bf}%</span>
          </div>
          <div className="bg-secondary p-4 rounded-2xl flex flex-col items-center justify-center border border-border">
            <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1.5 leading-none">Gasto (TMB)</span>
            <span className="text-[22px] font-bold text-foreground leading-none">{profile?.inputs?.tdee || "--"}</span>
          </div>
        </div>

        {/* Biotype */}
        <div className="bg-accent rounded-2xl p-4 border border-primary/10 mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={16} className="text-primary" />
            <span className="text-[13px] font-bold text-primary uppercase tracking-wider">Biotipo</span>
          </div>
          <h4 className="text-[18px] font-bold text-foreground leading-tight">{biotype.name}</h4>
          <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">{biotype.desc}</p>
        </div>

        <button
          onClick={onRedoAssessment}
          className="w-full bg-secondary text-muted-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all text-[14px]"
        >
          <RotateCcw size={16} /> Refazer avaliação
        </button>
      </div>

      {/* Editable Daily Goals */}
      <div className="bg-card rounded-[22px] p-6 border border-border shadow-sm text-left">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[17px] font-bold flex items-center gap-2 leading-tight">
            <Target className="text-primary" size={20} /> Metas diárias
          </h3>
          {!isEditingGoals ? (
            <button onClick={startEditing} className="p-2 text-primary bg-accent rounded-xl active:scale-90 transition-transform">
              <Edit3 size={16} />
            </button>
          ) : (
            <button onClick={saveGoals} className="p-2 text-success bg-success/10 rounded-xl active:scale-90 transition-transform">
              <Check size={16} />
            </button>
          )}
        </div>

        {isEditingGoals ? (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Calorias", key: "calories" as const, unit: "kcal" },
              { label: "Proteína", key: "protein" as const, unit: "g" },
              { label: "Carboidratos", key: "carbs" as const, unit: "g" },
              { label: "Gordura", key: "fat" as const, unit: "g" },
            ].map((m) => (
              <div key={m.key} className="bg-secondary p-3.5 rounded-2xl border border-border">
                <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block mb-1">{m.label}</label>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    value={editTargets[m.key]}
                    onChange={(e) => setEditTargets({ ...editTargets, [m.key]: Number(e.target.value) })}
                    className="w-full bg-transparent font-bold text-[20px] outline-none text-foreground"
                  />
                  <span className="text-[12px] text-muted-foreground font-bold">{m.unit}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Calorias", value: profile.targets.calories, unit: "kcal" },
              { label: "Proteína", value: profile.targets.protein, unit: "g" },
              { label: "Carboidratos", value: profile.targets.carbs, unit: "g" },
              { label: "Gordura", value: profile.targets.fat, unit: "g" },
            ].map((m) => (
              <div key={m.label} className="bg-secondary p-3.5 rounded-2xl flex flex-col items-center justify-center border border-border">
                <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1 leading-none">{m.label}</span>
                <span className="text-[20px] font-bold text-foreground leading-none">
                  {m.value}<span className="text-[12px] text-muted-foreground ml-0.5">{m.unit}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NutraIA Strategy */}
      <div className={`rounded-[22px] p-6 border shadow-sm text-left ${strategy.color}`}>
        <div className="flex items-center gap-2 mb-3">
          {strategy.icon}
          <h3 className="text-[17px] font-bold leading-tight text-foreground">Estratégia NutraIA</h3>
        </div>
        <div className="inline-block bg-card/80 px-3 py-1 rounded-full text-[12px] font-bold text-foreground mb-3 border border-border">
          {strategy.type}
        </div>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">{strategy.description}</p>
        <div className="space-y-2">
          {strategy.tips.map((tip, i) => (
            <div key={i} className="flex items-center gap-2 text-[13px] font-medium text-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              {tip}
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full bg-card text-destructive font-bold py-4 rounded-2xl border border-destructive/10 flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform text-[15px]"
      >
        <LogOut size={18} /> Sair da conta
      </button>
    </div>
  );
};

export default ProfileTab;
