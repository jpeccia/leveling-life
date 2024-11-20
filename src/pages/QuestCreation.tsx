import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Clock, AlertCircle } from 'lucide-react';
import api from '../lib/axios';
import { toast } from 'sonner';

type QuestType = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export default function QuestCreation() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'DAILY' as QuestType,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError('Please fill in all fields');
      toast.error('Please fill in all fields'); // Notificação de erro
      return;
    }
    setLoading(true);
    try {
      await api.post('/quests/', formData);
      toast.success('Quest created successfully!'); // Notificação de sucesso
      navigate('/');
    } catch (err) {
      setError('Failed to create quest');
      toast.error('Failed to create quest'); // Notificação de erro
    } finally {
      setLoading(false);
    }
  };

  const questTypes: { value: QuestType; label: string }[] = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Clock className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Create New Quest</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg flex items-center space-x-2" aria-live="assertive">
                <AlertCircle className="h-5 w-5" />
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
                      onChange={() => setFormData({ ...formData, type: type.value })}
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
