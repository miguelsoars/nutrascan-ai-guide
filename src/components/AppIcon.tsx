import { Heart, Scan } from "lucide-react";

interface AppIconProps {
  size?: "sm" | "md" | "lg";
}

const AppIcon = ({ size = "md" }: AppIconProps) => {
  const containerClass = size === "sm" 
    ? "w-8 h-8 rounded-lg" 
    : size === "md" 
    ? "w-16 h-16 rounded-2xl" 
    : "w-24 h-24 rounded-[20px]";
  const heartSize = size === "sm" ? 14 : size === "md" ? 28 : 42;
  const scanSize = size === "sm" ? 24 : size === "md" ? 52 : 76;

  return (
    <div className={`${containerClass} bg-primary relative flex items-center justify-center shadow-sm overflow-hidden`}>
      <Scan size={scanSize} className="absolute text-primary-foreground/25" strokeWidth={1.5} />
      <Heart size={heartSize} className="text-primary-foreground fill-primary-foreground relative z-10" />
    </div>
  );
};

export default AppIcon;
