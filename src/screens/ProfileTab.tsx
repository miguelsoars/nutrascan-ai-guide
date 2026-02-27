import { useRef, useState } from "react";
import { UserCircle, Camera, RotateCcw, LogOut, Edit3, Check, Sparkles, TrendingDown, TrendingUp, Zap, BarChart3, Crosshair } from "lucide-react";
import type { ProfileData, ProfileForm, Targets } from "@/types/nutrascan";

interface ProfileTabProps {
  profile: ProfileData | null;
  profileForm: ProfileForm;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRedoAssessment: () => void;
  onLogout: () => void;
  onUpdateTargets: (targets: Targets) => void;
  onRedoStrategy: () => void;
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
    if (bf <= 12) return { name: "Ectomorfo", desc: "Corpo magro com metabolismo acelerado." };
    if (bf <= 20) return { name: "Mesomorfo", desc: "Corpo atlético com facilidade para ganhar massa." };
    return { name: "Endomorfo", desc: "Tendência a acumular gordura. Controle calórico recomendado." };
  }
  if (bf <= 20) return { name: "Ectomorfa", desc: "Corpo magro com metabolismo acelerado." };
  if (bf <= 28) return { name: "Mesomorfa", desc: "Corpo atlético com facilidade para ganhar massa." };
  return { name: "Endomorfa", desc: "Tendência a acumular gordura. Controle calórico recomendado." };
};

const getStrategy = (goal: string, bf: number, gender: string) => {
  const biotype = getBiotype(bf, gender);
  const goalLower = goal.toLowerCase();
  if (goalLower.includes("emagrecer")) {
    return {
      type: "Déficit Calórico" as const,
      icon: <TrendingDown size={18} className="text-[hsl(var(--macro-protein))]" />,
      description: `Como ${biotype.name.toLowerCase()}, sua estratégia ideal é um déficit calórico moderado (-400 a -500 kcal). Priorize proteínas para preservar massa muscular.`,
      tips: ["Refeições ricas em proteína e fibra", "Deficit moderado de 400–500 kcal", "3–5 treinos por semana"],
    };
  }
  if (goalLower.includes("hipertrofia")) {
    return {
      type: "Superávit Calórico" as const,
      icon: <TrendingUp size={18} className="text-success" />,
      description: `Como ${biotype.name.toLowerCase()}, um superávit controlado (+300 a +400 kcal) é ideal. Foque em proteínas e carboidratos complexos.`,
      tips: ["Superávit de 300–400 kcal", "2g+ proteína por kg", "Carboidratos pré-treino"],
    };
  }
  return {
    type: "Manutenção" as const,
    icon: <Zap size={18} className="text-primary" />,
    description: `Como ${biotype.name.toLowerCase()}, mantenha a ingestão próxima ao TDEE com distribuição equilibrada de macronutrientes.`,
    tips: ["Calorias próximas ao TDEE", "Macros equilibrados", "Consistência é a chave"],
  };
};

const ProfileTab = ({ profile, profileForm, onAvatarChange, onRedoAssessment, onLogout, onUpdateTargets, onRedoStrategy }: ProfileTabProps) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [editTargets, setEditTargets] = useState<Targets>({ calories: 0, protein: 0, carbs: 0, fat: 0 });

  if (!profile) return <div className="text-center py-20 fade-in"><p className="text-muted-foreground">Carregando...</p></div>;

  const bf = profile?.inputs?.estimatedBF || 20;
  const gender = profileForm.gender || "M";
  const biotype = getBiotype(bf, gender);
  const strategy = getStrategy(profileForm.goal, bf, gender);

  const canRedoStrategy = !profile.strategyRedoDate || (Date.now() - profile.strategyRedoDate > 30 * 24 * 60 * 60 * 1000);
  const daysUntilRedo = profile.strategyRedoDate
    ? Math.max(0, Math.ceil((profile.strategyRedoDate + 30 * 24 * 60 * 60 * 1000 - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0;

  const startEditing = () => { setEditTargets({ ...profile.targets }); setIsEditingGoals(true); };
  const saveGoals = () => { onUpdateTargets(editTargets); setIsEditingGoals(false); };

  return (
    <div className="fade-in space-y-4">
      {/* Profile Header */}
      <div className="bg-card rounded-2xl p-6 text-center border border-border shadow-sm flex flex-col items-center">
        <div className="relative group cursor-pointer inline-block" onClick={() => avatarInputRef.current?.click()}>
          <div className="w-20 h-20 rounded-full bg-secondary border-[3px] border-card shadow-sm overflow-hidden flex items-center justify-center">
            {profileForm.avatar ? (
              <img src={profileForm.avatar} className="w-full h-full object-cover" alt="Avatar" />
            ) : (
              <UserCircle size={40} className="text-muted-foreground/40" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full border-2 border-card shadow-sm">
            <Camera size={12} />
          </button>
          <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={onAvatarChange} />
        </div>
        <h2 className="text-[20px] font-bold mt-3 tracking-tight text-foreground">{profileForm.name || "Seu perfil"}</h2>
        <p className="text-muted-foreground text-[13px] mt-1">{getAge(profileForm.birthDate)} anos • {profileForm.gender === "M" ? "Masculino" : "Feminino"}</p>
      </div>

      {/* Assessment Report + Biotype */}
      <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
        <h3 className="text-[15px] font-bold flex items-center gap-2 mb-4">
          <BarChart3 className="text-primary" size={18} /> Relatório de avaliação
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-secondary p-3.5 rounded-xl flex flex-col items-center border border-border">
            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">Gordura (BF)</span>
            <span className="text-[20px] font-bold text-primary">{bf}%</span>
          </div>
          <div className="bg-secondary p-3.5 rounded-xl flex flex-col items-center border border-border">
            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">Gasto (TMB)</span>
            <span className="text-[20px] font-bold text-foreground">{profile?.inputs?.tdee || "--"}</span>
          </div>
        </div>
        <div className="bg-accent/60 rounded-xl p-3.5 border border-primary/10 mb-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={14} className="text-primary" />
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Biotipo</span>
          </div>
          <h4 className="text-[16px] font-bold text-foreground">{biotype.name}</h4>
          <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">{biotype.desc}</p>
        </div>
        <button onClick={onRedoAssessment} className="w-full bg-secondary text-muted-foreground font-semibold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all text-[13px]">
          <RotateCcw size={14} /> Refazer avaliação
        </button>
      </div>

      {/* Editable Daily Goals */}
      <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-bold flex items-center gap-2">
            <Crosshair className="text-primary" size={18} /> Metas diárias
          </h3>
          {!isEditingGoals ? (
            <button onClick={startEditing} className="p-1.5 text-primary bg-accent rounded-lg active:scale-90 transition-transform">
              <Edit3 size={14} />
            </button>
          ) : (
            <button onClick={saveGoals} className="p-1.5 text-success bg-success/10 rounded-lg active:scale-90 transition-transform">
              <Check size={14} />
            </button>
          )}
        </div>
        {isEditingGoals ? (
          <div className="grid grid-cols-2 gap-2">
            {([
              { label: "Calorias", key: "calories" as const, unit: "kcal" },
              { label: "Proteína", key: "protein" as const, unit: "g" },
              { label: "Carboidratos", key: "carbs" as const, unit: "g" },
              { label: "Gordura", key: "fat" as const, unit: "g" },
            ]).map((m) => (
              <div key={m.key} className="bg-secondary p-3 rounded-xl border border-border">
                <label className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest block mb-1">{m.label}</label>
                <div className="flex items-baseline gap-1">
                  <input type="number" value={editTargets[m.key]} onChange={(e) => setEditTargets({ ...editTargets, [m.key]: Number(e.target.value) })} className="w-full bg-transparent font-bold text-[18px] outline-none text-foreground" />
                  <span className="text-[11px] text-muted-foreground font-semibold">{m.unit}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {([
              { label: "Calorias", value: profile.targets.calories, unit: "kcal" },
              { label: "Proteína", value: profile.targets.protein, unit: "g" },
              { label: "Carboidratos", value: profile.targets.carbs, unit: "g" },
              { label: "Gordura", value: profile.targets.fat, unit: "g" },
            ]).map((m) => (
              <div key={m.label} className="bg-secondary p-3 rounded-xl flex flex-col items-center border border-border">
                <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">{m.label}</span>
                <span className="text-[18px] font-bold text-foreground">{m.value}<span className="text-[11px] text-muted-foreground ml-0.5">{m.unit}</span></span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NutraIA Strategy — same card style */}
      <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          {strategy.icon}
          <h3 className="text-[15px] font-bold text-foreground">Estratégia NutraIA</h3>
        </div>
        <span className="inline-block bg-secondary px-2.5 py-1 rounded-lg text-[11px] font-bold text-foreground mb-3 border border-border">
          {strategy.type}
        </span>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">{strategy.description}</p>
        <div className="space-y-1.5 mb-4">
          {strategy.tips.map((tip, i) => (
            <div key={i} className="flex items-center gap-2 text-[12px] font-medium text-foreground">
              <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
              {tip}
            </div>
          ))}
        </div>
        {canRedoStrategy ? (
          <button onClick={onRedoStrategy} className="w-full bg-secondary text-muted-foreground font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all text-[12px]">
            <RotateCcw size={13} /> Recalcular estratégia
          </button>
        ) : (
          <p className="text-[11px] text-muted-foreground text-center">
            Disponível para recalcular em {daysUntilRedo} dias
          </p>
        )}
      </div>

      {/* Logout */}
      <button onClick={onLogout} className="w-full bg-card text-destructive font-semibold py-3.5 rounded-2xl border border-destructive/10 flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform text-[14px]">
        <LogOut size={16} /> Sair da conta
      </button>
    </div>
  );
};

export default ProfileTab;
