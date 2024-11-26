import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { QuestCard } from '../components/QuestCard';
import { useNavigate } from 'react-router-dom';
import { FriendsList } from '../components/FriendsList';
import api from '../lib/axios';
import { MiniCalendar } from '../components/MiniCalendar';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { Dialog } from '@headlessui/react';  // Importando o Dialog para os modais
import { Spinner } from '../components/Spinner'; // Spinner para mostrar durante o carregamento

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
  const navigate = useNavigate();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchUser } = useAuthStore();

  // Modal states
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Modal de edição
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [editQuestData, setEditQuestData] = useState<Quest | null>(null); // Dados para edição

  useEffect(() => {
    loadQuests();
    loadProfile();
    fetchUser();
  }, []);

  const loadQuests = async () => {
    try {
      const response = await api.get('/quests/');
      setQuests(response.data);
    } catch (error) {
      console.error('Failed to load quests:', error);
      toast.error('Failed to load quests. Please try again later.');
    }
  };

  const loadProfile = async () => {
    try {
      const response = await api.get('/user/');
      setProfileData(response.data);
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile. Please try again later.');
      setError('Failed to load profile. Please try again later.');
    }
  };

  const handleCompleteQuest = async () => {
    if (!selectedQuest) return;
    setLoading(true);
    try {
      await api.put(`/quests/${selectedQuest.id}/complete`);
      await fetchUser();  // Recarrega os dados do usuário após completar a quest
      toast.success('Quest completed successfully!');
      setShowCompleteModal(false);
      loadQuests();
    } catch (error) {
      console.error('Failed to complete quest:', error);
      toast.error('Failed to complete quest. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuest = async () => {
    if (!selectedQuest) return;
    setLoading(true);
    try {
      await api.delete(`/quests/${selectedQuest.id}`);
      setQuests((prevQuests) => prevQuests.filter((quest) => quest.id !== selectedQuest.id));
      toast.success('Quest deleted successfully!');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete quest:', error);
      toast.error('Failed to delete quest. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuest = (quest: Quest) => {
    setEditQuestData(quest);  // Carrega os dados da quest no estado de edição
    setShowEditModal(true);    // Abre o modal de edição
  };

  const handleSaveChanges = async () => {
    if (!editQuestData) return;
    setLoading(true);
  
    // Mapeamento de XP com base no tipo da quest
    const xpByType = {
      DAILY: 100,   // XP para quests diárias
      WEEKLY: 1000,  // XP para quests semanais
      MONTHLY: 4500 // XP para quests mensais
    };
  
    // Atualizando o XP com base no tipo selecionado
    const updatedQuestData = {
      ...editQuestData,
      xp: xpByType[editQuestData.type] // Atribuindo o XP conforme o tipo
    };
  
    try {
      // Enviando a requisição PUT com os dados atualizados, incluindo o XP
      const response = await api.put(`/quests/${updatedQuestData.id}`, updatedQuestData);
  
      // Atualizando o estado das quests na interface com a resposta da API
      setQuests((prevQuests) =>
        prevQuests.map((quest) =>
          quest.id === updatedQuestData.id ? response.data : quest
        )
      );
  
      toast.success('Quest updated successfully!');
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update quest:', error);
      toast.error('Failed to update quest. Please try again later.');
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
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-4 gap-6">
        {/* Main Content - Quests */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Your Quests</h1>
            <button
              onClick={() => navigate('/quests/create')}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>New Quest</span>
            </button>
          </div>

          {Object.entries(groupedQuests).map(([type, quests]) => (
            <div key={type} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 capitalize">
                  {type} Quests
                </h2>
              </div>
              <div className="p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {quests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onComplete={() => {
                        setSelectedQuest(quest);
                        setShowCompleteModal(true);
                      }}
                      onEdit={() => handleEditQuest(quest)}  // Abre o modal de edição
                      onDelete={() => {
                        setSelectedQuest(quest);
                        setShowDeleteModal(true);
                      }}
                    />
                  ))}
                  {quests.length === 0 && (
                    <div className="col-span-2 py-8">
                      <p className="text-center text-gray-500">
                        No {type} quests available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar - Calendar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 h-full">
            <MiniCalendar onExpand={() => navigate('/calendar')} quests={quests} />
          </div>
        </div>
      </div>
      <FriendsList />

      {/* Modal de confirmação para completar a quest */}
      <Dialog open={showCompleteModal} onClose={() => setShowCompleteModal(false)}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Complete Quest</h3>
            <p>Are you sure you want to complete this quest?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteQuest}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                {loading ? <Spinner /> : 'Complete Quest'}
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Modal de confirmação para deletar a quest */}
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Delete Quest</h3>
            <p>Are you sure you want to delete this quest?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteQuest}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                {loading ? <Spinner /> : 'Delete Quest'}
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Modal de edição da quest */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
            <h3 className="text-lg font-semibold">Edit Quest</h3>
            <div className="mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={editQuestData?.title || ''}
                  onChange={(e) => setEditQuestData((prev) => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editQuestData?.description || ''}
                  onChange={(e) => setEditQuestData((prev) => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={editQuestData?.type || 'DAILY'}
                  onChange={(e) => setEditQuestData((prev) => ({ ...prev, type: e.target.value as 'DAILY' | 'WEEKLY' | 'MONTHLY' }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  {loading ? <Spinner /> : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </Layout>
  );
}
