import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Maximize2, Sword, Shield, Wand2, Scroll } from 'lucide-react';
import clsx from 'clsx';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  createdAt: string;
  dueDate: string;
  completed: boolean;
}

interface MiniCalendarProps {
  onExpand: () => void;
  quests: Quest[];
}

/**
 * Componente MiniCalendar
 * 
 * @param {Function} onExpand - Função de callback para expandir a visualização do calendário.
 * @param {Quest[]} quests - Lista de missões com data, tipo e status de conclusão.
 */
export function MiniCalendar({ onExpand, quests }: MiniCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Retorna o número de dias no mês atual
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  // Retorna o primeiro dia da semana do mês atual
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  // Navega para o mês anterior
  const previousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

  // Navega para o próximo mês
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  // Retorna à data de hoje
  const goToToday = () => setCurrentDate(new Date());

  /**
   * Filtra as missões que correspondem a um dia específico.
   * 
   * @param {number} day - O dia do mês para filtrar as missões.
   * @returns {Quest[]} - Lista de missões que correspondem à data fornecida.
   */
  const getDayQuests = (day: number) => {
    return quests.filter(quest => {
      const dueDate = new Date(quest.dueDate);
      // Garantir que a data de vencimento considere apenas a data, sem hora
      const formattedDueDate = dueDate.toISOString().split('T')[0];

      // Cria a data para o dia atual e formata também
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const formattedTargetDate = targetDate.toISOString().split('T')[0];

      // Compara as duas datas formatadas, sem considerar horas
      return formattedDueDate === formattedTargetDate;
    });
  };

  /**
   * Configura o tipo de missão com ícone, cor e rótulo.
   * 
   * @param {string} type - O tipo de missão.
   * @returns {Object} - Configuração da missão com ícone, cor e rótulo.
   */
  const getQuestTypeConfig = (type: string) => {
    switch (type) {
      case 'DAILY': return { icon: Sword, color: 'bg-blue-400', label: 'Missão Diária' };
      case 'WEEKLY': return { icon: Shield, color: 'bg-purple-400', label: 'Missão Semanal' };
      case 'MONTHLY': return { icon: Wand2, color: 'bg-amber-400', label: 'Missão Épica' };
      default: return { icon: Scroll, color: 'bg-gray-400', label: 'Missão' };
    }
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  /**
   * Renderiza o calendário com dias e missões.
   * 
   * @returns {JSX.Element[]} - Elementos JSX para renderizar os dias do calendário.
   */
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Células vazias antes do primeiro dia do mês
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/30 border border-indigo-100/20" />);
    }

    // Células para cada dia do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const dayQuests = getDayQuests(day);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
      const hasQuests = dayQuests.length > 0;

      days.push(
        <div
          key={day}
          className={clsx(
            "h-32 p-3 border border-indigo-100/20 transition-colors relative flex flex-col justify-between",
            isToday ? 'bg-indigo-50' : 'bg-white hover:bg-gray-50/50',
            hasQuests ? 'animate-subtleElectrifying' : 'opacity-75'
          )}
        >
          <div className={clsx(
            "absolute top-1 left-1 w-6 h-6 flex items-center justify-center rounded-full text-sm font-medium",
            isToday 
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md' 
              : 'text-gray-700'
          )}>
            {day}
          </div>
          {hasQuests && (
            <div className="flex flex-col mt-6 space-y-1 overflow-hidden">
              {dayQuests.map((quest) => {
                const config = getQuestTypeConfig(quest.type);
                const Icon = config.icon;
                return (
                  <div
                    key={quest.id}
                    className={clsx(
                      "px-2 py-1 text-xs rounded-md border shadow-sm truncate",
                      quest.completed ? 'opacity-50' : '',
                      `bg-gradient-to-r from-white to-${config.color}/10`,
                      `border-${config.color}/20`,
                      'hover:scale-105 transform transition-transform'
                    )}
                    title={`${quest.title} (${config.label})`}
                  >
                    <div className="flex items-center space-x-1">
                      <Icon className={`w-3 h-3 ${config.color} text-white`} />
                      <span className="line-clamp-1">{quest.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {!hasQuests && (
            <div className="mt-8 text-xs text-gray-500 text-center italic">
              Sem missões
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
      <div className="flex flex-row items-center justify-between p-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md animate-float">
            <CalendarIcon className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Sword className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-600">Diária</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-600">Semanal</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wand2 className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-600">Mensal</span>
          </div>
        </div>
        <button
          onClick={onExpand}
          className="p-2 hover:bg-indigo-50 rounded-lg transition-colors group"
          title="Expandir calendário"
        >
          <Maximize2 className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transform group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="flex">
        <button onClick={previousMonth} className="p-2 hover:bg-indigo-50 rounded-lg transition-colors">
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
        <div className="flex-grow text-center text-sm font-medium">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button onClick={nextMonth} className="p-2 hover:bg-indigo-50 rounded-lg transition-colors">
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 p-3">
        {renderCalendar()}
      </div>

      <button onClick={goToToday} className="block mx-auto my-4 p-2 text-sm bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors">
        Ir para Hoje
      </button>
    </div>
  );
}
