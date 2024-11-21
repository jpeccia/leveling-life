import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../lib/axios';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  createdAt: string;
  expiresAt: string;
  completed: boolean;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    loadQuests();
  }, [currentDate]);

  const loadQuests = async () => {
    try {
      const response = await api.get('/quests/', {
        params: {
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1,
        },
      });
      setQuests(response.data);
    } catch (error) {
      console.error('Failed to load quests:', error);
    }
  };

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
    return quests.filter(quest => {
      const expirationDate = new Date(quest.expiresAt);
      return expirationDate.getDate() === day &&
             expirationDate.getMonth() === currentDate.getMonth() &&
             expirationDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const getQuestTypeStyles = (type: string) => {
    switch (type) {
      case 'DAILY':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'WEEKLY':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'MONTHLY':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          className="h-32 bg-gray-50/30 border border-gray-100"
        />
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayQuests = getDayQuests(day);
      const isToday = new Date().getDate() === day &&
                     new Date().getMonth() === currentDate.getMonth() &&
                     new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <div
          key={day}
          className={`relative h-32 p-1 border border-gray-100 transition-colors ${
            isToday 
              ? 'bg-indigo-50/50' 
              : 'bg-white hover:bg-gray-50/50'
          }`}
        >
          <div className={`
            absolute top-1 left-1 w-6 h-6 flex items-center justify-center
            rounded-full text-sm font-medium
            ${isToday 
              ? 'bg-indigo-600 text-white' 
              : 'text-gray-700'
            }
          `}>
            {day}
          </div>
          <div className="mt-8 space-y-1 max-h-[5.5rem] overflow-y-auto scrollbar-thin">
            {dayQuests.map((quest) => (
              <div
                key={quest.id}
                className={`
                  px-2 py-1 text-xs rounded-md border
                  ${getQuestTypeStyles(quest.type)}
                  ${quest.completed ? 'opacity-50' : ''}
                  truncate
                `}
                title={`${quest.title} (${quest.type.toLowerCase()})`}
              >
                {quest.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h1>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex justify-end mt-4 space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Daily</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-600">Weekly</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-gray-600">Monthly</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div 
              key={day} 
              className="text-center py-2 text-sm font-medium text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        {renderCalendar()}
      </div>
    </Layout>
  );
}