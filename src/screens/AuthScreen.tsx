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
      <div className="w-full max-w-sm bg-card rounded-3xl shadow-sm border border-border p-8">
        <div className="flex flex-col items-center mb-8">
          <AppIcon size="md" />
          <h1 className="text-[26px] font-bold mt-4 tracking-tight leading-none text-foreground">
            NutraScan™
          </h1>
          <p className="text-muted-foreground text-[15px] mt-2">
            {isLoginMode ? "Bem-vindo de volta" : "Crie sua conta inteligente"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center bg-input rounded-xl px-5 py-4 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <span className="text-muted-foreground font-bold mr-1">@</span>
            <input
              type="text"
              required
              placeholder="usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
              className="w-full bg-transparent outline-none text-foreground"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-input border-none rounded-xl py-4 px-5 outline-none text-foreground focus:ring-2 focus:ring-primary/10 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground p-2"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <div className="text-destructive text-[13px] font-medium ml-1 text-left">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-[17px]"
          >
            {isLoginMode ? "Entrar" : "Registrar"}
          </button>
        </form>

        <button
          onClick={() => setIsLoginMode(!isLoginMode)}
          className="w-full text-primary text-[15px] font-semibold mt-6 underline decoration-primary/20"
        >
          {isLoginMode ? "Não tem conta? Cadastre-se" : "Já tem uma conta? Entrar"}
        </button>
      </div>
    </div>
  );
};

export default AuthScreen;
