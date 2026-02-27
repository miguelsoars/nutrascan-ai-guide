import { useState, useMemo } from "react";
import { Edit3, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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

  // Find first day user started (earliest entry timestamp)
  const firstDay = useMemo(() => {
    if (entries.length === 0) return new Date();
    const earliest = Math.min(...entries.map((e) => e.timestamp));
    return new Date(earliest);
  }, [entries]);

  const [weekOffset, setWeekOffset] = useState(0);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toLocaleDateString("pt-BR")
  );

  // Generate 7 days starting from firstDay + weekOffset * 7
  const calendarDays = useMemo(() => {
    const startOfFirstWeek = new Date(firstDay);
    startOfFirstWeek.setHours(0, 0, 0, 0);
    startOfFirstWeek.setDate(startOfFirstWeek.getDate() + weekOffset * 7);

    const days: { date: Date; label: string; dayName: string; dateStr: string; hasMeals: boolean; isToday: boolean; isFuture: boolean }[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfFirstWeek);
      d.setDate(d.getDate() + i);
      const dateStr = d.toLocaleDateString("pt-BR");
      const isToday = d.getTime() === today.getTime();
      const isFuture = d.getTime() > today.getTime();
      const hasMeals = entries.some((e) => e.date === dateStr);

      days.push({
        date: d,
        label: d.getDate().toString().padStart(2, "0"),
        dayName: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
        dateStr,
        hasMeals,
        isToday,
        isFuture,
      });
    }
    return days;
  }, [firstDay, weekOffset, entries, today]);

  // Filter entries for selected date
  const filteredEntries = useMemo(
    () => entries.filter((e) => e.date === selectedDate),
    [entries, selectedDate]
  );

  const filteredTotals = useMemo(
    () =>
      filteredEntries.reduce(
        (acc, curr) => ({
          calories: acc.calories + (curr.totals?.calories || 0),
          protein: acc.protein + (curr.totals?.protein || 0),
          carbs: acc.carbs + (curr.totals?.carbs || 0),
          fat: acc.fat + (curr.totals?.fat || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [filteredEntries]
  );

  const isSelectedToday = selectedDate === new Date().toLocaleDateString("pt-BR");
  const displayTotals = isSelectedToday ? dailyTotals : filteredTotals;

  return (
    <div className="fade-in space-y-5 text-left">
      {/* Calendar Strip */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="p-1.5 rounded-xl text-muted-foreground active:scale-90 transition-transform hover:bg-secondary"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">
            {calendarDays[0]?.date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
          </span>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="p-1.5 rounded-xl text-muted-foreground active:scale-90 transition-transform hover:bg-secondary"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => (
            <button
              key={day.dateStr}
              disabled={day.isFuture}
              onClick={() => !day.isFuture && setSelectedDate(day.dateStr)}
              className={`flex flex-col items-center py-2.5 rounded-2xl transition-all text-center ${
                day.dateStr === selectedDate
                  ? "bg-primary text-primary-foreground shadow-md"
                  : day.isToday
                  ? "bg-accent text-primary"
                  : day.isFuture
                  ? "text-muted-foreground/30"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider leading-none mb-1.5 opacity-70">
                {day.dayName}
              </span>
              <span className="text-[16px] font-bold leading-none">{day.label}</span>
              {day.hasMeals && day.dateStr !== selectedDate && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
              )}
              {day.hasMeals && day.dateStr === selectedDate && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground mt-1.5" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Summary */}
      <div className="bg-card rounded-[22px] p-5 border border-border shadow-sm">
        <div className="flex justify-between mb-3">
          <h2 className="text-[16px] font-bold leading-tight">Resumo do dia</h2>
          <span className="text-primary font-bold text-[14px]">
            {Math.round(displayTotals.calories)} / {targets.calories} kcal
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-1000 rounded-full"
            style={{ width: `${getProgress(displayTotals.calories, targets.calories)}%` }}
          />
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {filteredEntries.map((e) => (
          <div
            key={e.id}
            className="bg-card p-5 rounded-[20px] flex items-center justify-between border border-border shadow-sm"
          >
            <div className="flex-1 text-left">
              <h4 className="font-bold text-[16px] text-foreground line-clamp-1">
                {e.items.map((i) => i.name).join(", ")}
              </h4>
              <div className="text-[13px] text-muted-foreground font-medium mt-1">
                {e.time} • <span className="text-primary font-bold">{Math.round(e.totals.calories)} kcal</span>
              </div>
            </div>
            <div className="flex gap-1.5 items-center">
              <button
                onClick={() => onEdit(e)}
                className="p-2.5 text-primary bg-accent rounded-xl active:scale-90 transition-transform"
              >
                <Edit3 size={18} />
              </button>
              <button
                onClick={() => onRemove(e.id)}
                className="p-2.5 text-destructive bg-destructive/10 rounded-xl active:scale-90 transition-transform"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-16 text-muted-foreground/50 font-bold uppercase tracking-widest text-[12px]">
          Nenhuma refeição neste dia
        </div>
      )}
    </div>
  );
};

export default DiaryTab;
