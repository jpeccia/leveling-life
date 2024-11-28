import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Clock, AlertCircle, Sparkles } from 'lucide-react';
import api from '../lib/axios';
import { toast } from 'sonner';
import Calendar from 'react-calendar'; // Importação do componente de calendário
import 'react-calendar/dist/Calendar.css'; // Estilo do calendário

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
      setError('Por favor, preencha todos os campos');
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      let dueDate = formData.dueDate;
      if (typeof dueDate === 'string') {
        dueDate = new Date(dueDate);
        dueDate.setHours(0, 0, 0, 0); // Garante que a hora seja zero para evitar problemas de fuso horário
      }

      const formattedDueDate = dueDate.toISOString();

      await api.post('/quests/', { ...formData, dueDate: formattedDueDate });
      toast.success('Missão criada com sucesso!');
      navigate('/');
    } catch (err) {
      setError('Falha ao criar missão');
      toast.error('Falha ao criar missão');
    } finally {
      setLoading(false);
    }
  };

  const questTypes: { value: QuestType; label: string }[] = [
    { value: 'DAILY', label: 'Diária' },
    { value: 'WEEKLY', label: 'Semanal' },
    { value: 'MONTHLY', label: 'Mensal' },
  ];

  const handleQuestTypeChange = (type: QuestType) => {
    setFormData({ ...formData, type });
  };

  const handleDateChange = (date: Date) => {
    setFormData({ ...formData, dueDate: date });
  };

  const getMaxDate = () => {
    const today = new Date();
    if (formData.type === 'WEEKLY') {
      today.setDate(today.getDate() + 7);
    } else if (formData.type === 'MONTHLY') {
      today.setMonth(today.getMonth() + 2);
    }
    return today;
  };

  const getMinDate = () => {
    return new Date(); // Define a data mínima como hoje
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Clock className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Criar Nova Missão</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-900/50 text-red-200 p-4 rounded-lg backdrop-blur-sm border border-red-500/20 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Título"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Digite o título da missão"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Descreva a missão"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Missão
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
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        formData.type === type.value
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {type.value === 'DAILY'
                            ? 'Renova diariamente'
                            : type.value === 'WEEKLY'
                            ? 'Renova semanalmente'
                            : 'Renova mensalmente'}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
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
                {loading ? 'Criando...' : 'Criar Missão'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
