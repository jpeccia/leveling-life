import { Check, Edit2, Trash2, Calendar, Sword, Shield, Wand2 } from 'lucide-react';

// Interface para representar uma missão (quest)
interface Quest {
  id: string; // Identificador único da missão
  title: string; // Título da missão
  description: string; // Descrição da missão
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY'; // Tipo da missão (diária, semanal ou mensal)
  completed: boolean; // Status que indica se a missão foi concluída
  expiresAt: string; // Data de expiração da missão em formato ISO
}

// Interface de propriedades para o componente QuestCard
interface QuestCardProps {
  quest: Quest; // Objeto da missão a ser exibido
  onComplete: (id: string) => void; // Função para marcar a missão como concluída
  onEdit: (quest: Quest) => void; // Função para editar a missão
  onDelete: (id: string) => void; // Função para excluir a missão
}

// Componente que exibe um cartão de missão
export function QuestCard({ quest, onComplete, onEdit, onDelete }: QuestCardProps) {
  // Configuração para ícones, cores e rótulos com base no tipo da missão
  const typeConfig = {
    DAILY: {
      icon: Sword, // Ícone representando uma missão diária
      colors: 'bg-blue-100 text-blue-800 border-blue-200', // Cores associadas à missão diária
      label: 'Missão Diária', // Rótulo da missão diária
    },
    WEEKLY: {
      icon: Shield, // Ícone representando uma missão semanal
      colors: 'bg-purple-100 text-purple-800 border-purple-200', // Cores associadas à missão semanal
      label: 'Missão Semanal', // Rótulo da missão semanal
    },
    MONTHLY: {
      icon: Wand2, // Ícone representando uma missão mensal
      colors: 'bg-amber-100 text-amber-800 border-amber-200', // Cores associadas à missão mensal
      label: 'Missão Épica Mensal', // Rótulo da missão mensal
    },
  };

  // Configuração específica para o tipo da missão atual
  const config = typeConfig[quest.type];
  const Icon = config.icon; // Ícone a ser exibido para a missão

  // Função para formatar a data de expiração da missão
  const formatExpirationDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // JSX do componente QuestCard
  return (
    <div 
      className={`relative bg-white border border-gray-100 rounded-lg shadow-sm transition-all duration-300 
        ${quest.completed ? 'opacity-75' : 'hover:shadow-md hover:scale-105'} 
        overflow-hidden`}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-quest-pattern opacity-10"></div>
      <div className="relative p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${config.colors.split(' ')[0]} ${config.colors.split(' ')[1]}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{quest.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${config.colors}`}>
                {config.label}
              </span>
            </div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => onComplete(quest.id)}
              className={`p-1.5 rounded-lg transition-colors transform hover:scale-110 ${
                quest.completed
                  ? 'bg-green-100 text-green-600'
                  : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
              }`}
              title={quest.completed ? 'Concluída' : 'Marcar como concluída'}
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => onEdit(quest)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transform hover:scale-110"
              title="Editar missão"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(quest.id)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transform hover:scale-110"
              title="Excluir missão"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{quest.description}</p>
        
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>Expira em: {formatExpirationDate(quest.expiresAt)}</span>
        </div>
      </div>
    </div>
  );
}
