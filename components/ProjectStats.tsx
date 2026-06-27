type StatItem = {
  value: string;
  label: string;
};

type ProjectStatsProps = {
  stats: StatItem[];
};

export function ProjectStats({ stats }: ProjectStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-default border border-border/80 bg-surface/60 px-4 py-4 backdrop-blur-md"
        >
          <p className="font-heading text-lg font-medium tracking-tight md:text-xl">
            {stat.value}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
