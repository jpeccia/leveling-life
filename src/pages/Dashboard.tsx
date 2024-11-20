import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { QuestCard } from '../components/QuestCard';
import { FriendsList } from '../components/FriendsList';
import api from '../lib/axios';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  completed: boolean;
}

export default function Dashboard() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async () => {
    setLoading(true);
    try {
      const response = await api.get('/quests/');
      setQuests(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to load quests:', error);
      setError('Failed to load quests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteQuest = async (id: string) => {
    try {
      await api.put(`/quests/${id}/complete`);
      setQuests((prevQuests) =>
        prevQuests.map((quest) =>
          quest.id === id ? { ...quest, completed: true } : quest
        )
      );
    } catch (error) {
      console.error('Failed to complete quest:', error);
    }
  };

  const handleEditQuest = (quest: Quest) => {
    console.log('Edit quest:', quest);
  };

  const handleDeleteQuest = async (id: string) => {
    try {
      await api.delete(`/quests/${id}`);
      setQuests((prevQuests) => prevQuests.filter((quest) => quest.id !== id));
    } catch (error) {
      console.error('Failed to delete quest:', error);
    }
  };

  const groupedQuests = {
    daily: quests.filter((q) => q.type === 'DAILY'),
    weekly: quests.filter((q) => q.type === 'WEEKLY'),
    monthly: quests.filter((q) => q.type === 'MONTHLY'),
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6" aria-live="polite">
          Your Quests
        </h1>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid gap-6">
            {error && <div className="text-red-500">{error}</div>}
            {Object.entries(groupedQuests).map(([type, quests]) => (
              <div key={type}>
                <h2 className="text-lg font-semibold text-gray-700 mb-3 capitalize">
                  {type} Quests
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {quests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onComplete={handleCompleteQuest}
                      onEdit={handleEditQuest}
                      onDelete={handleDeleteQuest}
                    />
                  ))}
                  {quests.length === 0 && (
                    <p className="text-gray-500 text-sm">
                      No {type} quests available
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <FriendsList />
    </Layout>
  );
}
