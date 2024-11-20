import { Sword } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
      <Sword className="h-8 w-8" />
      <span>Leveling Life</span>
    </div>
  );
}