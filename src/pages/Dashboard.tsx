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

interface UserProfile {
  name: string;
  email: string;
  username: string;
  title: string;
  level: number;
  profilePicture: string;
  xp: number;
}

export default function Dashboard() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuests();
    loadProfile();
  }, []);

  // Função para carregar as quests
  const loadQuests = async () => {
    setLoading(true);
    try {
      const response = await api.get('/quests/');
      setQuests(response.data);  // Atualiza o estado com os dados recebidos
      setError(null);  // Reseta o erro se a requisição for bem-sucedida
    } catch (error) {
      console.error('Failed to load quests:', error);
      setError('Failed to load quests. Please try again later.');  // Mensagem de erro
    } finally {
      setLoading(false);
    }
  };

    // Função para carregar os dados do perfil
    const loadProfile = async () => {
      try {
        const response = await api.get('/user/');
        setProfileData(response.data);  // Atualiza o estado com os dados do perfil
      } catch (error) {
        console.error('Failed to load profile:', error);
        setError('Failed to load profile.');
      }
    };
  
    // Função para completar uma quest
    const handleCompleteQuest = async (id: string) => {
      setLoading(true);
      try {
        // Marque a quest como completada
        await api.put(`/quests/${id}/complete`); 
  
        // Atualiza o estado de quests local
        setQuests((prevQuests) =>
          prevQuests.map((quest) =>
            quest.id === id ? { ...quest, completed: true } : quest
          )
        );
  
        // **Atualize o estado do perfil diretamente após completar a quest**
        setProfileData((prevProfileData) => {
          if (prevProfileData) {
            const newXp = prevProfileData.xp + 50; // Aumente o XP conforme necessário
            const newLevel = Math.floor(newXp / 100); // Calcule o nível com base no XP (exemplo simples)
  
            return {
              ...prevProfileData,
              xp: newXp,
              level: newLevel,
            };
          }
          return prevProfileData;
        });
        
      } catch (error) {
        console.error('Failed to complete quest:', error);
        setError('Failed to complete quest. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  // Função para editar uma quest
  const handleEditQuest = (quest: Quest) => {
    console.log('Edit quest:', quest);  // Apenas um log por enquanto
  };

  // Função para deletar uma quest
  const handleDeleteQuest = async (id: string) => {
    setLoading(true);  // Coloca o estado de loading como true enquanto deleta a quest
    try {
      await api.delete(`/quests/${id}`);  // Chama o endpoint para deletar a quest
      setQuests((prevQuests) => prevQuests.filter((quest) => quest.id !== id));  // Remove a quest da lista
    } catch (error) {
      console.error('Failed to delete quest:', error);
      setError('Failed to delete quest. Please try again later.');  // Mensagem de erro
    } finally {
      setLoading(false);
    }
  };

  // Função para agrupar as quests por tipo
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
