import { useState, useEffect, useMemo, useCallback } from "react";
import AppIcon from "@/components/AppIcon";
import BottomNav from "@/components/BottomNav";
import AuthScreen from "@/screens/AuthScreen";
import OnboardingScreen from "@/screens/OnboardingScreen";
import HomeTab from "@/screens/HomeTab";
import ScannerTab from "@/screens/ScannerTab";
import DiaryTab from "@/screens/DiaryTab";
import NutraIATab from "@/screens/NutraIATab";
import ProfileTab from "@/screens/ProfileTab";
import type { User, ProfileForm, ProfileData, DiaryEntry, TabId, AnalysisResult } from "@/types/nutrascan";
import { ShieldCheck } from "lucide-react";

const defaultProfileForm: ProfileForm = {
  name: "", birthDate: "", height: "", weight: "", gender: "M",
  goal: "manter", activity: "sedentario", abdomen: "", loveHandles: "",
  upperBody: "", lowerBody: "", faceNeck: "",
};

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [profileForm, setProfileForm] = useState<ProfileForm>(defaultProfileForm);

  const todayStr = useMemo(() => new Date().toLocaleDateString("pt-BR"), []);
  const todaysEntries = useMemo(() => diaryEntries.filter((e) => e.date === todayStr), [diaryEntries, todayStr]);
  const dailyTotals = useMemo(
    () => todaysEntries.reduce((acc, curr) => ({
      calories: acc.calories + (curr.totals?.calories || 0), protein: acc.protein + (curr.totals?.protein || 0),
      carbs: acc.carbs + (curr.totals?.carbs || 0), fat: acc.fat + (curr.totals?.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 }),
    [todaysEntries]
  );
  const targets = useMemo(() => profile?.targets || { calories: 2000, protein: 150, carbs: 200, fat: 65 }, [profile]);

  const loadUserData = useCallback((userId: string) => {
    const savedProfile = localStorage.getItem(`profile_v20_${userId}`);
    if (savedProfile) {
      const data = JSON.parse(savedProfile);
      setProfile(data);
      setProfileForm((prev) => ({ ...prev, ...data.inputs }));
      setShowOnboarding(false);
      setActiveTab("home");
    } else {
      setShowOnboarding(true);
    }
    const savedDiary = localStorage.getItem(`diary_v20_${userId}`);
    if (savedDiary) setDiaryEntries(JSON.parse(savedDiary));
  }, []);

  useEffect(() => {
    const session = localStorage.getItem("nutrascan_session_v20");
    if (session) { const parsed = JSON.parse(session); setUser(parsed); loadUserData(parsed.id); }
    setIsLoadingAuth(false);
  }, [loadUserData]);

  const handleAuth = (username: string, password: string, isLogin: boolean): string | null => {
    const clean = username.trim().toLowerCase().replace(/\s/g, "");
    if (!clean) return "Informe um nome de usuário.";
    if (password.length < 6) return "Senha deve ter 6+ caracteres.";
    const userDbKey = `nutrascan_user_db_v20_${clean}`;
    const savedUserStr = localStorage.getItem(userDbKey);
    if (isLogin) {
      if (!savedUserStr) return "Usuário não encontrado.";
      const savedUser = JSON.parse(savedUserStr);
      if (savedUser.password !== password) return "Senha incorreta.";
      const sessionUser = { username: clean, id: clean };
      localStorage.setItem("nutrascan_session_v20", JSON.stringify(sessionUser));
      setUser(sessionUser); loadUserData(clean);
    } else {
      if (savedUserStr) return "Este nome de usuário já está sendo usado.";
      localStorage.setItem(userDbKey, JSON.stringify({ id: clean, username: clean, password }));
      localStorage.setItem("nutrascan_session_v20", JSON.stringify({ username: clean, id: clean }));
      setUser({ username: clean, id: clean }); setShowOnboarding(true);
    }
    return null;
  };

  const handleLogout = () => {
    localStorage.removeItem("nutrascan_session_v20");
    setUser(null); setProfile(null); setDiaryEntries([]);
    setShowOnboarding(false); setActiveTab("home");
  };

  const finishOnboarding = () => {
    if (!user) return;
    const isMale = profileForm.gender === "M";
    const sMap: Record<string, number> = {
      "Bem definido": -4, "Leve contorno": -1, "Normal": 1,
      "Pequena camada de gordura": 4, "Gordura bastante evidente": 7,
    };
    const score = (sMap[profileForm.abdomen] || 0) + (sMap[profileForm.upperBody] || 0) + (sMap[profileForm.lowerBody] || 0);
    const bf = Math.max(5, Math.min((isMale ? 14 : 22) + score, 45));
    const weightVal = parseFloat(profileForm.weight) || 70;
    const tdee = Math.round((370 + 21.6 * (weightVal * (1 - bf / 100))) * 1.35);
    const goalMap: Record<string, number> = { emagrecer: -500, hipertrofia: 400 };
    const goalKey = profileForm.goal.toLowerCase();
    const targetCals = tdee + (goalMap[goalKey] || 0);
    const newT = {
      calories: targetCals, protein: Math.round(weightVal * 2.2), fat: Math.round(weightVal * 0.9),
      carbs: Math.round((targetCals - weightVal * 2.2 * 4 - weightVal * 0.9 * 9) / 4),
    };
    const newP: ProfileData = {
      inputs: { ...profileForm, estimatedBF: bf, tdee },
      targets: newT,
      weightHistory: [{ weight: weightVal, date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }), timestamp: Date.now() }],
    };
    setProfile(newP);
    localStorage.setItem(`profile_v20_${user.id}`, JSON.stringify(newP));
    setShowOnboarding(false); setActiveTab("home");
  };

  const addToDiary = (results: AnalysisResult) => {
    if (!user) return;
    const newE: DiaryEntry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toLocaleDateString("pt-BR"),
      totals: results.totals, items: results.items, timestamp: Date.now(),
      mealType: results.mealType,
    };
    const updated = [newE, ...diaryEntries];
    setDiaryEntries(updated);
    localStorage.setItem(`diary_v20_${user.id}`, JSON.stringify(updated));
    setActiveTab("diary");
  };

  const removeEntry = (id: number) => {
    if (!user) return;
    const updated = diaryEntries.filter((e) => e.id !== id);
    setDiaryEntries(updated);
    localStorage.setItem(`diary_v20_${user.id}`, JSON.stringify(updated));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const avatar = event.target?.result as string;
      const upForm = { ...profileForm, avatar };
      setProfileForm(upForm);
      if (profile) {
        const upProfile = { ...profile, inputs: { ...profile.inputs, avatar } };
        setProfile(upProfile);
        localStorage.setItem(`profile_v20_${user.id}`, JSON.stringify(upProfile));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRedoStrategy = () => {
    if (!user || !profile) return;
    const updated = { ...profile, strategyRedoDate: Date.now() };
    setProfile(updated);
    localStorage.setItem(`profile_v20_${user.id}`, JSON.stringify(updated));
  };

  if (isLoadingAuth) return <div className="min-h-screen flex items-center justify-center bg-background"><AppIcon size="md" /></div>;
  if (!user) return <AuthScreen onLogin={handleAuth} />;
  if (showOnboarding) return <OnboardingScreen profileForm={profileForm} setProfileForm={setProfileForm} onFinish={finishOnboarding} />;

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10 pb-24">
      <header className="bg-card/80 ios-blur border-b border-border sticky top-0 z-20">
        <div className="max-w-xl mx-auto px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AppIcon size="sm" />
            <h1 className="text-[17px] font-bold tracking-tight text-foreground">NutraScan™</h1>
          </div>
          <div className="flex items-center gap-1 bg-accent text-primary px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider">
            <ShieldCheck size={12} /> Local
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-5 py-5">
        {activeTab === "home" && (
          <HomeTab name={profileForm.name} dailyTotals={dailyTotals} targets={targets} todaysEntries={todaysEntries} profile={profile} profileWeight={profileForm.weight} onGoToNutraIA={() => setActiveTab("nutra_ia")} />
        )}
        {activeTab === "scanner" && (
          <ScannerTab onSaveToDiary={addToDiary} targets={targets} dailyTotals={dailyTotals} goal={profileForm.goal} />
        )}
        {activeTab === "nutra_ia" && <NutraIATab diaryEntries={diaryEntries} />}
        {activeTab === "diary" && (
          <DiaryTab entries={diaryEntries} dailyTotals={dailyTotals} targets={targets} onRemove={removeEntry} />
        )}
        {activeTab === "profile" && (
          <ProfileTab profile={profile} profileForm={profileForm} onAvatarChange={handleAvatarChange}
            onRedoAssessment={() => setShowOnboarding(true)} onLogout={handleLogout}
            onUpdateTargets={(newTargets) => {
              if (!user || !profile) return;
              const updated = { ...profile, targets: newTargets };
              setProfile(updated); localStorage.setItem(`profile_v20_${user.id}`, JSON.stringify(updated));
            }}
            onRedoStrategy={handleRedoStrategy}
          />
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
