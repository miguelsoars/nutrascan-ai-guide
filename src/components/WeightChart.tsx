interface WeightEntry {
  weight: number;
  date: string;
  timestamp: number;
}

interface WeightChartProps {
  history: WeightEntry[];
}

const WeightChart = ({ history }: WeightChartProps) => {
  if (!history || history.length === 0) {
    return <div className="text-sm text-muted-foreground mt-2 font-medium">Nenhum registro.</div>;
  }

  const chartData = history.slice(-7);

  if (chartData.length === 1) {
    return (
      <div className="text-sm text-muted-foreground mt-2 font-medium">
        Peso inicial: <strong className="text-foreground">{chartData[0].weight}kg</strong>.
      </div>
    );
  }

  const minW = Math.min(...chartData.map((d) => d.weight)) - 0.5;
  const maxW = Math.max(...chartData.map((d) => d.weight)) + 0.5;
  const range = maxW - minW || 1;
  const points = chartData.map(
    (d, i) =>
      `${(i / (chartData.length - 1)) * 100},${100 - ((d.weight - minW) / range) * 100}`
  );
  const pathData = `M ${points[0]} ` + points.slice(1).map((p) => `L ${p}`).join(" ");

  return (
    <div className="mt-5">
      <div className="relative w-full h-24">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${pathData} L 100,100 L 0,100 Z`} fill="url(#weightGradient)" />
          <path d={pathData} fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <circle key={i} cx={p.split(",")[0]} cy={p.split(",")[1]} r="3.5" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2.5" />
          ))}
        </svg>
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground mt-3 font-semibold tracking-wider uppercase">
        <span>{chartData[0].date}</span>
        <span>{chartData[chartData.length - 1].date}</span>
      </div>
    </div>
  );
};

export default WeightChart;
