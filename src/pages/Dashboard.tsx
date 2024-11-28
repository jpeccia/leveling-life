import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { QuestCard } from '../components/QuestCard';
import { useNavigate } from 'react-router-dom';
import { FriendsList } from '../components/FriendsList';
import api from '../lib/axios';
import { MiniCalendar } from '../components/MiniCalendar';
import { FileSpreadsheet, FileText, PlusCircle, Shield, Sparkles, Sword, Wand2 } from 'lucide-react';
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
  expiresAt: ``,
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
      console.error('Falha na atualização da Missão:', error);
      toast.error('Falha na atualização da Missão. Por favor, tente novamente.');
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
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Quest Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quest Categories */}
            <div className="space-y-6">
              {Object.entries(groupedQuests).map(([type, quests]) => (
                <div
                  key={type}
                  className={`bg-white rounded-2xl shadow-xl p-6 border border-indigo-100`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 ${
                          type === "daily"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600"
                            : type === "weekly"
                            ? "bg-gradient-to-br from-purple-500 to-purple-600"
                            : "bg-gradient-to-br from-amber-500 to-amber-600"
                        } rounded-lg shadow-md`}
                      >
                        {type === "daily" && <Sword className="h-5 w-5 text-white" />}
                        {type === "weekly" && <Shield className="h-5 w-5 text-white" />}
                        {type === "monthly" && <Wand2 className="h-5 w-5 text-white" />}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 capitalize">
                        Missão {type}
                      </h2>
                    </div>
                    <button
                      onClick={() => navigate("/quests/create")}
                      className={`p-2 hover:bg-${
                        type === "daily"
                          ? "blue-50"
                          : type === "weekly"
                          ? "purple-50"
                          : "amber-50"
                      } rounded-lg transition-colors group`}
                    >
                      <PlusCircle
                        className={`h-5 w-5 ${
                          type === "daily"
                            ? "text-blue-500 group-hover:text-blue-600"
                            : type === "weekly"
                            ? "text-purple-500 group-hover:text-purple-600"
                            : "text-amber-500 group-hover:text-amber-600"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="grid gap-4">
                    {quests.map((quest) => (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        onComplete={() => {
                          setSelectedQuest(quest);
                          setShowCompleteModal(true);
                        }}
                        onEdit={() => handleEditQuest(quest)}
                        onDelete={() => {
                          setSelectedQuest(quest);
                          setShowDeleteModal(true);
                        }}
                      />
                    ))}
                    {quests.length === 0 && (
                      <div className="text-center py-8">
                        <Sparkles
                          className={`h-12 w-12 ${
                            type === "daily"
                              ? "text-blue-200"
                              : type === "weekly"
                              ? "text-purple-200"
                              : "text-amber-200"
                          } mx-auto mb-4`}
                        />
                        <p className="text-gray-500">No {type} quests available</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          
  
          {/* Right Sidebar */}
          <div className="space-y-6">
                        {/* Quick Access */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Atalho</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/spreadsheet')}
                  className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:shadow-md transition-shadow group"
                >
                  <FileSpreadsheet className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                  <span className="text-sm text-gray-600 group-hover:text-indigo-600">Inventário</span>
                </button>
                <button
                  onClick={() => navigate('/notes')}
                  className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:shadow-md transition-shadow group"
                >
                  <FileText className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                  <span className="text-sm text-gray-600 group-hover:text-indigo-600">Notas</span>
                </button>
              </div>
            </div>
            {/* Mini Calendar */}
            <MiniCalendar onExpand={() => navigate('/calendar')} quests={quests} />
          </div>
          
        </div>
  
        {/* Friends List */}
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
      </div>
    </Layout>
  );
}