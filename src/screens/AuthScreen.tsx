import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import AppIcon from "@/components/AppIcon";

interface AuthScreenProps {
  onLogin: (username: string, password: string, isLogin: boolean) => string | null;
}

const AuthScreen = ({ onLogin }: AuthScreenProps) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = onLogin(username, password, isLoginMode);
    if (result) setError(result);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 fade-in">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-sm border border-border p-7">
        <div className="flex flex-col items-center mb-7">
          <AppIcon size="md" />
          <h1 className="text-[22px] font-bold mt-3 tracking-tight text-foreground">NutraScan™</h1>
          <p className="text-muted-foreground text-[14px] mt-1">
            {isLoginMode ? "Bem-vindo de volta" : "Crie sua conta"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center bg-input rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <span className="text-muted-foreground font-semibold mr-1">@</span>
            <input type="text" required placeholder="usuário" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
              className="w-full bg-transparent outline-none text-foreground"
            />
          </div>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} required placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-input border-none rounded-xl py-3.5 px-4 outline-none text-foreground focus:ring-2 focus:ring-primary/10 transition-all"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground p-1.5">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && <div className="text-destructive text-[12px] font-medium ml-1">{error}</div>}
          <button type="submit" className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl shadow-sm active:scale-95 transition-all text-[15px]">
            {isLoginMode ? "Entrar" : "Registrar"}
          </button>
        </form>
        <button onClick={() => setIsLoginMode(!isLoginMode)} className="w-full text-primary text-[14px] font-medium mt-5">
          {isLoginMode ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>
      </div>
    </div>
  );
};

export default AuthScreen;
