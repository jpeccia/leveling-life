import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Scroll, Shield, Sword, Wand2 } from 'lucide-react';
import api from '../lib/axios';
import clsx from 'clsx';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  createdAt: string;
  dueDate: string;  // Atualizado para 'dueDate'
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
      const dueDate = new Date(quest.dueDate);
      // Garantir que o dueDate tenha apenas a data, sem considerar a hora
      const formattedDueDate = dueDate.toISOString().split('T')[0];  // Formato YYYY-MM-DD
  
      // Cria a data para o dia atual (currentDate) e formata também
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const formattedTargetDate = targetDate.toISOString().split('T')[0];  // Formato YYYY-MM-DD
  
      // Compara as duas datas formatadas, sem considerar horas ou minutos
      return formattedDueDate === formattedTargetDate;
    });
  };
  
  

  const getQuestTypeConfig = (type: string) => {
    switch (type) {
      case 'DAILY': return { icon: Sword, color: 'bg-blue-400', label: 'Daily Quest' };
      case 'WEEKLY': return { icon: Shield, color: 'bg-purple-400', label: 'Weekly Mission' };
      case 'MONTHLY': return { icon: Wand2, color: 'bg-amber-400', label: 'Epic Quest' };
      default: return { icon: Scroll, color: 'bg-gray-400', label: 'Quest' };
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

    // Adicionando células vazias para os dias antes do primeiro dia do mês
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-32 bg-gray-50/30 border border-gray-100" />
      );
    }

    // Adicionando células para cada dia do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const dayQuests = getDayQuests(day);
      const isToday = new Date().getDate() === day &&
                     new Date().getMonth() === currentDate.getMonth() &&
                     new Date().getFullYear() === currentDate.getFullYear();
      const hasQuests = dayQuests.length > 0;


      days.push(
        <div
          key={day}
          className={`relative h-32 p-1 border border-gray-100 transition-colors ${isToday ? 'bg-indigo-50/50' : 'bg-white hover:bg-gray-50/50'}`}
        >
          <div className={`absolute top-1 left-1 w-6 h-6 flex items-center justify-center rounded-full text-sm font-medium ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="mt-8 space-y-1 max-h-[5.5rem] overflow-y-auto scrollbar-thin">
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
                      <Icon className={`w-5 h-5 ${config.color} text-white`} />
                      <span className="line-clamp-1">{quest.title}</span>
                    </div>
                  </div>
                );
              })}
          </div>
          {!hasQuests && (
            <div className="mt-1 text-xs text-gray-500 text-center italic">
              No quests
            </div>
          )}
        </div>
      );
    }

    return (
  <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
    <div className="flex flex-row items-center justify-between p-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
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
              <button onClick={previousMonth} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex justify-end mt-4 space-x-3">
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
        </div>

        <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center py-2 text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">{days}</div>
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
