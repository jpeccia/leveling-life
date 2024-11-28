import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Trophy, Medal, User, Crown, Shield, Scroll, Sparkles } from 'lucide-react';
import { ExperienceBar } from '../components/ExperienceBar';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

interface RankedUser {
  id: string;
  username: string;
  name: string;
  level: number;
  xp: number;
  title: string;
  profilePicture: string;
}

const calculateXpForNextLevel = (level: number) => {
  return level * 800; // Exemplo: cada nível requer 800 XP a mais
};

export default function Ranking() {
  const [users, setUsers] = useState<RankedUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<RankedUser | null>(null);
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    loadRanking();
    fetchUser();
  }, []);
  
  const nextLevelXp = calculateXpForNextLevel(selectedUser?.level || 1);

  const loadRanking = async () => {
    try {
      const response = await api.get('/user/ranking');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load ranking:', error);
    }
  };

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return 'text-yellow-400';
      case 1:
        return 'text-gray-400';
      case 2:
        return 'text-amber-600';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center space-x-4 mb-8">
            <Trophy className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Ranking</h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Ranking List */}
            <div className="space-y-4">
            {users.map((user, index) => (
              <div
                key={user.id} // Adicionando a key única
                onClick={() => setSelectedUser(user)}
                className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  selectedUser?.id === user.id
                    ? 'bg-indigo-50'
                    : 'hover:bg-indigo-50'
                } ${index < 10 ? 'border border-gray-300' : ''} ${
                  index < 10 ? 'animate-subtleElectrifying' : ''
                }`}
              >
                <div className="flex-shrink-0 w-8 text-center">
                  {index === 0 ? (
                    <Crown className="h-8 w-8 text-yellow-500" /> // Coroa para o top 1
                  ) : index < 3 ? (
                    <Medal className={`h-8 w-8 ${getMedalColor(index)} shadow-lg`} />
                  ) : (
                    <span className="text-gray-500 font-medium text-lg">{index + 1}</span>
                  )}
                </div>
                <img
                  src={
                    user?.profilePicture
                      ? user.profilePicture
                      : `https://ui-avatars.com/api/?name=${user?.name}`
                  }
                  alt={user.name}
                  className="w-12 h-12 rounded-full shadow-lg object-cover transform transition-transform duration-300 hover:scale-110 border-2 border-white"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-sm text-indigo-600 font-semibold">Level {user.level}</p>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{user.title}</p>
                </div>
              </div>
            ))}
            </div>

            {/* User Details */}
            {selectedUser ? (
           <div className="lg:col-span-1">
           <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl shadow-xl p-8 border border-indigo-100">
             <div className="flex flex-col items-center">
               <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-75 group-hover:opacity-100 blur-lg transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                 <img
                   src={selectedUser?.profilePicture || `https://ui-avatars.com/api/?name=${selectedUser?.name}`}
                   alt={selectedUser?.name}
                   className="relative w-48 h-48 rounded-full border-4 border-white shadow-2xl transform transition-transform duration-500 group-hover:scale-105"
                 />
               </div>

               <div className="mt-6 text-center">
                 <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                   {selectedUser?.name}
                 </h1>
                 <p className="text-gray-600 mt-1">@{selectedUser?.username}</p>

                 <div className="mt-4 flex flex-col gap-3">
                   <div className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white shadow-md">
                     <div className="flex items-center justify-center space-x-2">
                       <Shield className="h-5 w-5" />
                       <span className="font-semibold">Level {selectedUser?.level}</span>
                     </div>
                   </div>
                   <div className="px-4 py-2 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl text-white shadow-md">
                     <div className="flex items-center justify-center space-x-2">
                       <Scroll className="h-5 w-5" />
                       <span className="font-semibold">{selectedUser?.title}</span>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="w-full mt-8">
                 <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center space-x-2">
                     <Sparkles className="h-5 w-5 text-indigo-600" />
                     <span className="text-sm font-medium text-gray-600">Experience</span>
                   </div>
                   <span className="text-sm text-indigo-600 font-semibold">
                   {selectedUser?.xp}/{nextLevelXp} XP
                   </span>
                 </div>
                 <ExperienceBar current={selectedUser?.xp || 0} max={nextLevelXp} />
               </div>
               <button
                onClick={async () => {
                  try {
                    // Recupera o usuário logado do store
                    const user = useAuthStore.getState().user; // Acessa o usuário diretamente do store (useAuthStore.getState().user)
                    
                    if (!user) {
                      console.error('User not found in store.');
                      toast.error('Usuário não encontrado.');
                      return;
                    }

                    // Verifica se o usuário logado é o mesmo que o selecionado
                    if (user.username === selectedUser.username) {
                      toast.error('Você não pode enviar pedido de amizade pra você mesmo.');
                      return;
                    }

                    // Se não for o mesmo usuário, envia o pedido de amizade
                    await api.post(`/friends/add/${selectedUser.username}`);
                    toast.success('Pedido de amizade enviado com sucesso!');
                  } catch (error) {
                    console.error('Failed to send friend request:', error);
                    toast.error('Falha ao enviar pedido de amizade.');
                  }
                }}
                className="mt-4 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
              >
                <User className="h-5 w-5" />
                <span>Mandar pedido de amizade</span>
              </button>
             </div>
            </div>
          </div>
        ) : (
              <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center justify-center text-gray-500">
                <User className="h-12 w-12 mb-2" />
                <p>Selecione um usuário para ver o seu perfil</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
