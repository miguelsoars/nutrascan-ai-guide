import { useState, useMemo } from "react";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { DiaryEntry, MealTotals, Targets } from "@/types/nutrascan";
import { mealTypeLabels, mealTypeEmojis } from "@/types/nutrascan";

interface DiaryTabProps {
  entries: DiaryEntry[];
  dailyTotals: MealTotals;
  targets: Targets;
  onRemove: (id: number) => void;
}

const DiaryTab = ({ entries, dailyTotals, targets, onRemove }: DiaryTabProps) => {
  const getProgress = (curr: number, max: number) => Math.min((curr / (max || 1)) * 100, 100);

  const firstDay = useMemo(() => {
    if (entries.length === 0) return new Date();
    const earliest = Math.min(...entries.map((e) => e.timestamp));
    return new Date(earliest);
  }, [entries]);

  const [weekOffset, setWeekOffset] = useState(0);
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString("pt-BR"));

  const calendarDays = useMemo(() => {
    const startOfFirstWeek = new Date(firstDay);
    startOfFirstWeek.setHours(0, 0, 0, 0);
    startOfFirstWeek.setDate(startOfFirstWeek.getDate() + weekOffset * 7);
    const days: { date: Date; label: string; dayName: string; dateStr: string; hasMeals: boolean; isToday: boolean; isFuture: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfFirstWeek);
      d.setDate(d.getDate() + i);
      const dateStr = d.toLocaleDateString("pt-BR");
      days.push({
        date: d, label: d.getDate().toString().padStart(2, "0"),
        dayName: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
        dateStr, hasMeals: entries.some((e) => e.date === dateStr),
        isToday: d.getTime() === today.getTime(), isFuture: d.getTime() > today.getTime(),
      });
    }
    return days;
  }, [firstDay, weekOffset, entries, today]);

  const filteredEntries = useMemo(() => entries.filter((e) => e.date === selectedDate), [entries, selectedDate]);
  const filteredTotals = useMemo(
    () => filteredEntries.reduce((acc, curr) => ({
      calories: acc.calories + (curr.totals?.calories || 0), protein: acc.protein + (curr.totals?.protein || 0),
      carbs: acc.carbs + (curr.totals?.carbs || 0), fat: acc.fat + (curr.totals?.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 }),
    [filteredEntries]
  );
  const isSelectedToday = selectedDate === new Date().toLocaleDateString("pt-BR");
  const displayTotals = isSelectedToday ? dailyTotals : filteredTotals;

  return (
    <div className="fade-in space-y-4 text-left">
      {/* Calendar Strip */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setWeekOffset((w) => w - 1)} className="p-1.5 rounded-lg text-muted-foreground active:scale-90 transition-transform">
            <ChevronLeft size={18} />
          </button>
          <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
            {calendarDays[0]?.date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
          </span>
          <button onClick={() => setWeekOffset((w) => w + 1)} className="p-1.5 rounded-lg text-muted-foreground active:scale-90 transition-transform">
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => (
            <button
              key={day.dateStr}
              disabled={day.isFuture}
              onClick={() => !day.isFuture && setSelectedDate(day.dateStr)}
              className={`flex flex-col items-center py-2 rounded-xl transition-all text-center ${
                day.dateStr === selectedDate
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : day.isToday ? "bg-accent text-primary"
                  : day.isFuture ? "text-muted-foreground/30"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <span className="text-[9px] font-semibold uppercase tracking-wider leading-none mb-1 opacity-70">{day.dayName}</span>
              <span className="text-[15px] font-bold leading-none">{day.label}</span>
              {day.hasMeals && (
                <div className={`w-1 h-1 rounded-full mt-1 ${day.dateStr === selectedDate ? "bg-primary-foreground" : "bg-primary"}`} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Summary */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
        <div className="flex justify-between mb-2">
          <h2 className="text-[15px] font-bold">Resumo do dia</h2>
          <span className="text-primary font-semibold text-[13px]">
            {Math.round(displayTotals.calories)} / {targets.calories} kcal
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div className="bg-primary h-full transition-all duration-1000 rounded-full" style={{ width: `${getProgress(displayTotals.calories, targets.calories)}%` }} />
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-2">
        {filteredEntries.map((e) => (
          <div key={e.id} className="bg-card p-4 rounded-2xl flex items-center justify-between border border-border shadow-sm">
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                {e.mealType && <span className="text-[13px]">{mealTypeEmojis[e.mealType]}</span>}
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  {e.mealType ? mealTypeLabels[e.mealType] : "Refeição"}
                </span>
              </div>
              <h4 className="font-semibold text-[14px] text-foreground line-clamp-1">
                {e.items.map((i) => i.name).join(", ")}
              </h4>
              <div className="text-[12px] text-muted-foreground mt-0.5">
                {e.time} • <span className="text-primary font-semibold">{Math.round(e.totals.calories)} kcal</span>
              </div>
            </div>
            <button onClick={() => onRemove(e.id)} className="p-2 text-destructive bg-destructive/10 rounded-lg active:scale-90 transition-transform ml-2">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-14 text-muted-foreground/40 font-semibold uppercase tracking-widest text-[11px]">
          Nenhuma refeição neste dia
        </div>
      )}
    </div>
  );
};

export default DiaryTab;
