import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Clock, AlertCircle, Sparkles } from 'lucide-react';
import api from '../lib/axios';
import { toast } from 'sonner';
import Calendar from 'react-calendar'; // Importando o componente do calendário
import 'react-calendar/dist/Calendar.css'; // Importando o estilo do calendário

type QuestType = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export default function QuestCreation() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'DAILY' as QuestType,
    dueDate: new Date(), // Data de vencimento inicial
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.title || !formData.description || !formData.dueDate) {
      setError('Please fill in all fields');
      toast.error('Please fill in all fields');
      return;
    }
  
    setLoading(true);
    try {
      let dueDate = formData.dueDate;
      if (typeof dueDate === 'string') {
        dueDate = new Date(dueDate);
        dueDate.setHours(0, 0, 0, 0); // Garantir que a hora seja zero para evitar problemas de fuso horário
      }
      
      const formattedDueDate = dueDate.toISOString();
  
      await api.post('/quests/', { ...formData, dueDate: formattedDueDate });
      toast.success('Quest created successfully!');
      navigate('/');
    } catch (err) {
      setError('Failed to create quest');
      toast.error('Failed to create quest');
    } finally {
      setLoading(false);
    }
  };

  const questTypes: { value: QuestType; label: string }[] = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
  ];

  const handleQuestTypeChange = (type: QuestType) => {
    setFormData({ ...formData, type });
  };

  // Função para atualizar a data ao selecionar no calendário
  const handleDateChange = (date: Date) => {
    setFormData({ ...formData, dueDate: date });
  };

  // Função para definir a data máxima no calendário
  const getMaxDate = () => {
    const today = new Date();
    if (formData.type === 'WEEKLY') {
      // Para "SEMANAL", limite de 7 dias
      today.setDate(today.getDate() + 7);
    } else if (formData.type === 'MONTHLY') {
      // Para "MENSAL", limite de 2 meses
      today.setMonth(today.getMonth() + 2);
    }
    return today;
  };

  const getMinDate = () => {
    const today = new Date();
    if (formData.type === 'DAILY') {
      // Para "DIÁRIO", o calendário não mostra nada
      return today;
    }
    return today;
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Clock className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Create New Quest</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-900/50 text-red-200 p-4 rounded-lg backdrop-blur-sm border border-red-500/20 flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}

            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter quest title"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Describe your quest"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quest Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                {questTypes.map((type) => (
                  <label key={type.value} className="cursor-pointer">
                    <input
                      type="radio"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={() => handleQuestTypeChange(type.value)}
                      className="hidden"
                    />
                    <div
                      className={`p-4 rounded-lg border-2 transition-colors ${formData.type === type.value
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="text-center">
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {type.value === 'DAILY'
                            ? 'Resets every day'
                            : type.value === 'WEEKLY'
                            ? 'Resets weekly'
                            : 'Resets monthly'}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
              </label>
              {/* Condicional para exibir o calendário conforme o tipo de quest */}
              {formData.type !== 'DAILY' && (
                <Calendar
                  onChange={handleDateChange}
                  value={formData.dueDate}
                  minDate={getMinDate()}
                  maxDate={getMaxDate()}
                  className="border p-2 rounded-lg w-full"
                />
              )}
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Quest'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
