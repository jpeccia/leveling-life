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
 * MiniCalendar Component
 * 
 * @param {Function} onExpand - Callback to expand the calendar view.
 * @param {Quest[]} quests - List of quests with date, type, and completion status.
 */
export function MiniCalendar({ onExpand, quests }: MiniCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const previousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const goToToday = () => setCurrentDate(new Date());

  const getDayQuests = (day: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    return quests.filter(quest => new Date(quest.dueDate).toDateString() === targetDate);
  };

  const getQuestTypeConfig = (type: string) => {
    switch (type) {
      case 'DAILY': return { icon: Sword, color: 'bg-blue-400', label: 'Daily Quest' };
      case 'WEEKLY': return { icon: Shield, color: 'bg-purple-400', label: 'Weekly Mission' };
      case 'MONTHLY': return { icon: Wand2, color: 'bg-amber-400', label: 'Epic Quest' };
      default: return { icon: Scroll, color: 'bg-gray-400', label: 'Quest' };
    }
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
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/30 border border-indigo-100/20" />);
    }

    // Cells for each day of the month
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
              No quests
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
          <h2 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Quest Timeline
          </h2>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Sword className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-600">Daily</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-600">Weekly</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wand2 className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-600">Monthly</span>
          </div>
        </div>
        <button
          onClick={onExpand}
          className="p-2 hover:bg-indigo-50 rounded-lg transition-colors group"
          title="Expand calendar"
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

      <div className="grid grid-cols-7 bg-gradient-to-r from-indigo-50 to-purple-50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {renderCalendar()}
      </div>

      <div className="p-4 text-center">
        <button onClick={goToToday} className="text-sm text-indigo-600 hover:underline">
          Go to Today
        </button>
      </div>
    </div>
  );
}
