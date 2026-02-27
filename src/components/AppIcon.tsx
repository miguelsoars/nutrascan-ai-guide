import { Heart, Scan } from "lucide-react";

interface AppIconProps {
  size?: "sm" | "md" | "lg";
}

const AppIcon = ({ size = "md" }: AppIconProps) => {
  const containerClass = size === "sm" 
    ? "w-8 h-8 rounded-[10px]" 
    : size === "md" 
    ? "w-16 h-16 rounded-[18px]" 
    : "w-24 h-24 rounded-[24px]";
  const heartSize = size === "sm" ? 16 : size === "md" ? 34 : 50;
  const scanSize = size === "sm" ? 22 : size === "md" ? 48 : 68;

  return (
    <div className={`${containerClass} bg-primary relative flex items-center justify-center shadow-sm overflow-hidden`}>
      <Scan size={scanSize} className="absolute text-primary-foreground/30" />
      <Heart size={heartSize} className="text-primary-foreground fill-primary-foreground" />
    </div>
  );
};

export default AppIcon;
