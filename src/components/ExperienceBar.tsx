interface ExperienceBarProps {
  current: number;
  max: number;
  className?: string;
}

export function ExperienceBar({ current, max, className = '' }: ExperienceBarProps) {
  const percentage = (current / max) * 100;

  return (
    <div className={`relative w-full ${className}`}>
      <div className="h-2 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        >
        </div>
      </div>
    </div>
  );
}