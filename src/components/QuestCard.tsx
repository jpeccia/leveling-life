import { Check, Edit, Trash2 } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  completed: boolean;
}

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: string) => void;
  onEdit: (quest: Quest) => void;
  onDelete: (id: string) => void;
}

export function QuestCard({ quest, onComplete, onEdit, onDelete }: QuestCardProps) {
  const typeColors = {
    DAILY: 'bg-blue-100 text-blue-800',
    WEEKLY: 'bg-purple-100 text-purple-800',
    MONTHLY: 'bg-green-100 text-green-800',
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${quest.completed ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">{quest.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${typeColors[quest.type]}`}>
            {quest.type.toLowerCase()}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onComplete(quest.id)}
            className={`p-1 rounded hover:bg-gray-100 ${
              quest.completed ? 'text-green-500' : 'text-gray-400'
            }`}
          >
            <Check className="h-5 w-5" />
          </button>
          <button
            onClick={() => onEdit(quest)}
            className="p-1 rounded hover:bg-gray-100 text-gray-400"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(quest.id)}
            className="p-1 rounded hover:bg-gray-100 text-gray-400"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600">{quest.description}</p>
    </div>
  );
}