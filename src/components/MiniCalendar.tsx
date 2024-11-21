import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Maximize2 } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  expiresAt: string;
  completed: boolean;
}

interface MiniCalendarProps {
  onExpand: () => void;
  quests: Quest[];
}

export function MiniCalendar({ onExpand, quests }: MiniCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getDayQuests = (day: number) => {
    if (!quests || !Array.isArray(quests)) {
      return []; // Retorna um array vazio se quests não for um array válido
    }
  
    return quests.filter(quest => {
      const expirationDate = new Date(quest.expiresAt);
      return expirationDate.getDate() === day &&
             expirationDate.getMonth() === currentDate.getMonth() &&
             expirationDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-8 bg-gray-50/30" />
      );
    }

    // Cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayQuests = getDayQuests(day);
      const isToday = new Date().getDate() === day &&
                     new Date().getMonth() === currentDate.getMonth() &&
                     new Date().getFullYear() === currentDate.getFullYear();
      const hasQuests = dayQuests.length > 0;

      days.push(
        <div
          key={day}
          className={`h-8 relative flex items-center justify-center text-sm
            ${isToday ? 'bg-indigo-50' : ''}
            ${hasQuests ? 'font-medium' : ''}
          `}
        >
          <span className={`
            flex items-center justify-center w-6 h-6 rounded-full
            ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700'}
            ${hasQuests && !isToday ? 'text-indigo-600' : ''}
          `}>
            {day}
          </span>
          {hasQuests && (
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400" />
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="h-5 w-5 text-indigo-600" />
            <h2 className="font-semibold text-gray-900">Calendar</h2>
          </div>
          <button
            onClick={onExpand}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Expand calendar"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={previousMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-7 bg-gray-50">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div
              key={day}
              className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {renderCalendar()}
        </div>
      </div>
    </div>
  );
}