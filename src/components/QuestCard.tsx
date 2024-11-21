import { Check, Edit2, Trash2, Calendar } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  completed: boolean;
  expiresAt: string;
}

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: string) => void;
  onEdit: (quest: Quest) => void;
  onDelete: (id: string) => void;
}

export function QuestCard({ quest, onComplete, onEdit, onDelete }: QuestCardProps) {
  const typeColors = {
    DAILY: 'bg-blue-100 text-blue-800 border-blue-200',
    WEEKLY: 'bg-purple-100 text-purple-800 border-purple-200',
    MONTHLY: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  const formatExpirationDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={`bg-white border border-gray-100 rounded-lg shadow-sm transition-all ${
      quest.completed ? 'opacity-75' : 'hover:shadow-md'
    }`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{quest.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${typeColors[quest.type]}`}>
              {quest.type.toLowerCase()}
            </span>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => onComplete(quest.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                quest.completed
                  ? 'bg-green-100 text-green-600'
                  : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
              }`}
              title={quest.completed ? 'Completed' : 'Mark as complete'}
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => onEdit(quest)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              title="Edit quest"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(quest.id)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              title="Delete quest"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{quest.description}</p>
        
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>Expires: {formatExpirationDate(quest.expiresAt)}</span>
        </div>
      </div>
    </div>
  );
}