interface ExperienceBarProps {
  current: number;
  max: number;
}

export function ExperienceBar({ current, max }: ExperienceBarProps) {
  const percentage = (current / max) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}