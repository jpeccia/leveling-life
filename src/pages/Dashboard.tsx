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

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async () => {
    try {
      const response = await api.get('/quests/');
      setQuests(response.data);
    } catch (error) {
      console.error('Failed to load quests:', error);
    }
  };

  const handleCompleteQuest = async (id: string) => {
    try {
      await api.put(`/quests/${id}/complete`);
      loadQuests();
    } catch (error) {
      console.error('Failed to complete quest:', error);
    }
  };

  const handleEditQuest = (quest: Quest) => {
    // Navigate to edit page or open modal
    console.log('Edit quest:', quest);
  };

  const handleDeleteQuest = async (id: string) => {
    try {
      await api.delete(`/quests/${id}`);
      loadQuests();
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Quests</h1>
        
        <div className="grid gap-6">
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
      </div>
      <FriendsList />
    </Layout>
  );
}