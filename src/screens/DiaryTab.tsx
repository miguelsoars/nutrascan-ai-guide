import { Edit3, Trash2 } from "lucide-react";
import type { DiaryEntry, MealTotals, Targets } from "@/types/nutrascan";

interface DiaryTabProps {
  entries: DiaryEntry[];
  dailyTotals: MealTotals;
  targets: Targets;
  onRemove: (id: number) => void;
  onEdit: (entry: DiaryEntry) => void;
}

const DiaryTab = ({ entries, dailyTotals, targets, onRemove, onEdit }: DiaryTabProps) => {
  const getProgress = (curr: number, max: number) => Math.min((curr / (max || 1)) * 100, 100);

  return (
    <div className="fade-in space-y-6 text-left">
      <div className="bg-card rounded-[22px] p-6 border border-border shadow-sm">
        <div className="flex justify-between mb-4">
          <h2 className="text-[18px] font-bold leading-tight">Meta diária</h2>
          <span className="text-primary font-bold text-[15px]">
            {Math.round(dailyTotals.calories)} / {targets.calories} kcal
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-1000 rounded-full"
            style={{ width: `${getProgress(dailyTotals.calories, targets.calories)}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {entries.map((e) => (
          <div
            key={e.id}
            className="bg-card p-5 rounded-[20px] flex items-center justify-between border border-border shadow-sm"
          >
            <div className="flex-1 text-left">
              <h4 className="font-bold text-[17px] text-foreground line-clamp-1">
                {e.items.map((i) => i.name).join(", ")}
              </h4>
              <div className="text-[14px] text-muted-foreground font-medium mt-1">
                {e.time} • <span className="text-primary font-bold">{Math.round(e.totals.calories)} kcal</span>
              </div>
            </div>
            <div className="flex gap-1.5 items-center">
              <button
                onClick={() => onEdit(e)}
                className="p-2.5 text-primary bg-accent rounded-xl active:scale-90 transition-transform"
              >
                <Edit3 size={20} />
              </button>
              <button
                onClick={() => onRemove(e.id)}
                className="p-2.5 text-destructive bg-destructive/10 rounded-xl active:scale-90 transition-transform"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-20 text-muted-foreground/50 font-bold uppercase tracking-widest text-[12px]">
          O diário está vazio
        </div>
      )}
    </div>
  );
};

export default DiaryTab;
