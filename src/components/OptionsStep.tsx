interface OptionsStepProps {
  title: string;
  options: string[];
  field: string;
  currentValue: string;
  onSelect: (field: string, value: string) => void;
}

const OptionsStep = ({ title, options, field, currentValue, onSelect }: OptionsStepProps) => {
  return (
    <div className="fade-in w-full text-left">
      <h2 className="text-[22px] font-bold text-foreground mb-6 tracking-tight leading-tight">
        {title}
      </h2>
      <div className="space-y-3">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(field, opt)}
            className={`w-full text-left px-5 py-4 rounded-2xl border transition-all text-[17px] font-medium shadow-sm ${
              currentValue === opt
                ? "bg-accent border-primary text-primary"
                : "bg-card border-border text-foreground active:bg-secondary"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OptionsStep;
