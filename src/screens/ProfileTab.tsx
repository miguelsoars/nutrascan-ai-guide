import { useRef } from "react";
import { UserCircle, Camera, Target, RotateCcw, LogOut } from "lucide-react";
import type { ProfileData, ProfileForm } from "@/types/nutrascan";

interface ProfileTabProps {
  profile: ProfileData | null;
  profileForm: ProfileForm;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRedoAssessment: () => void;
  onLogout: () => void;
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

const ProfileTab = ({ profile, profileForm, onAvatarChange, onRedoAssessment, onLogout }: ProfileTabProps) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  if (!profile) {
    return (
      <div className="text-center py-20 fade-in flex flex-col items-center">
        <p className="text-muted-foreground mt-4 font-medium">Carregando dados do perfil...</p>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-6">
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
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={avatarInputRef}
            onChange={onAvatarChange}
          />
        </div>
        <h2 className="text-[24px] font-bold mt-4 tracking-tight leading-none text-foreground">
          {profileForm.name || "Seu perfil"}
        </h2>
        <p className="text-muted-foreground text-[15px] mt-2 font-medium">
          {getAge(profileForm.birthDate)} anos • {profileForm.gender === "M" ? "Masculino" : "Feminino"}
        </p>
      </div>

      {/* Assessment Report */}
      <div className="bg-card rounded-[22px] p-6 border border-border shadow-sm text-left">
        <h3 className="text-[17px] font-bold flex items-center gap-2 mb-5 leading-tight">
          <Target className="text-primary" size={20} /> Relatório de avaliação
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-secondary p-4 rounded-2xl flex flex-col items-center justify-center border border-border">
            <span className="block text-[11px] text-muted-foreground font-bold uppercase tracking-widest mb-1.5 leading-none">
              Gordura (BF)
            </span>
            <span className="text-[22px] font-bold text-primary leading-none">
              {profile?.inputs?.estimatedBF || "--"}%
            </span>
          </div>
          <div className="bg-secondary p-4 rounded-2xl flex flex-col items-center justify-center border border-border">
            <span className="block text-[11px] text-muted-foreground font-bold uppercase tracking-widest mb-1.5 leading-none">
              Gasto (TMB)
            </span>
            <span className="text-[22px] font-bold text-foreground leading-none">
              {profile?.inputs?.tdee || "--"}
            </span>
          </div>
        </div>
        <button
          onClick={onRedoAssessment}
          className="w-full bg-secondary text-muted-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all text-[15px]"
        >
          <RotateCcw size={18} /> Refazer avaliação
        </button>
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
