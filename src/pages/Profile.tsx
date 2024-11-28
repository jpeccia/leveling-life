import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { ExperienceBar } from '../components/ExperienceBar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuthStore } from '../store/authStore';
import {
  Edit2,
  Key,
  Shield,
  Star,
  Sparkles,
  Trophy,
  Scroll,
  Award,
  Camera,
} from 'lucide-react';
import api from '../lib/axios';
import { toast } from 'sonner';
import WeatherActivity from '../components/WeatherActivity';

type EditMode = 'profile' | 'password' | null;

export type User = {
  name: string;
  username: string;
  title: string;
  email: string;
  level: number;
  profilePicture: string;
  xp: number;
};

export default function Profile() {
  const { user, setUser, fetchUser } = useAuthStore((state) => ({
    user: state.user,
    setUser: state.setUser,
    fetchUser: state.fetchUser,
  }));

  const [editMode, setEditMode] = useState<EditMode>(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    newEmail: '',
    currentPassword: '',
    profilePicture: user?.profilePicture || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [tempProfilePicture, setTempProfilePicture] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUser();
    }
  }, [setUser]);

  const calculateXpForNextLevel = (level: number) => level * 800;

  const nextLevelXp = calculateXpForNextLevel(user?.level || 1);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempProfilePicture(e.target.value);
  };

  const isImageUrl = (url: string) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSavePhoto = async () => {
    if (!tempProfilePicture) return;

    if (!isValidUrl(tempProfilePicture) || !isImageUrl(tempProfilePicture)) {
      toast.error('URL invalida.');
      return;
    }

    if (tempProfilePicture.endsWith('.gif') && user?.level < 50) {
      toast.error('GIFs só são permitidos a partir do nivel 50.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(
        '/user/update',
        { profilePicture: tempProfilePicture },
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );

      setProfileData((prev) => ({ ...prev, profilePicture: response.data.profilePicture }));
      await fetchUser();
      toast.success('Foto de perfil atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('Falha ao atualizar a foto de perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!profileData.name.trim()) {
      toast.error('Nome não pode ser vázio.');
      return;
    }

    try {
      const response = await api.post(
        '/user/update',
        {
          name: profileData.name,
          newEmail: profileData.newEmail.trim(),
          currentPassword: profileData.currentPassword,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );

      if (response.status === 200) {
        await fetchUser();
        setEditMode(null);
        toast.success('Perfil atualizado com sucesso!');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Falha ao atualizar o perfil.');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    if (!passwordData.currentPassword) {
      toast.error('A senha atual é obrigatória.');
      return;
    }

    try {
      await api.post('/user/check-password', { currentPassword: passwordData.currentPassword });
      await api.post('/user/update', passwordData);
      setEditMode(null);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Senha atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Falha ao atualizar a senha.');
    }
  };
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Character Info */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl shadow-xl p-8 border border-indigo-100">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-75 group-hover:opacity-100 blur-lg transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  <img
                    src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name}`}
                    alt={user?.name}
                    className="relative w-60 h-60 rounded-full border-4 border-white shadow-2xl transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => setModalOpen(true)}
                    className="absolute bottom-2 left-2 bg-gray-800 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {user?.name}
                  </h1>
                  <p className="text-gray-600 mt-1">@{user?.username}</p>

                  <div className="mt-4 flex flex-col gap-3">
                    <div className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white shadow-md">
                      <div className="flex items-center justify-center space-x-2">
                        <Shield className="h-5 w-5" />
                        <span className="font-semibold">Level {user?.level}</span>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl text-white shadow-md">
                      <div className="flex items-center justify-center space-x-2">
                        <Scroll className="h-5 w-5" />
                        <span className="font-semibold">{user?.title}</span>
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
                    {user?.xp}/{nextLevelXp} XP
                    </span>
                  </div>
                  <ExperienceBar current={user?.xp || 0} max={nextLevelXp} />
                </div>
              </div>
            </div>
          </div>

      {/* Middle Column - Stats & Forms */}
      <div className="lg:col-span-2">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-indigo-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              Recomendações do Dia
            </h2>
            {/* Recomendações de atividades baseadas no clima */}
            <WeatherActivity />

          </div>


              {/* Profile Settings */}
              {editMode === null ? (
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-indigo-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email
                      </label>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                    <div className="flex space-x-4">
                      <Button
                        onClick={() => setEditMode('profile')}
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span>Editar perfil</span>
                      </Button>
                      <Button 
                      onClick={() => setEditMode('password')} 
                      className="flex items-center justify-center space-x-2">
                    <Key className="h-4 w-4" />
                    <span>Mudar senha</span>
                  </Button>

                    </div>
                  </div>
                </div>
              ) : editMode === 'profile' ? (
                <form onSubmit={handleUpdateProfile} className="bg-white rounded-2xl shadow-xl p-8 border border-indigo-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>
                  {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6">
                      {error}
                    </div>
                  )}
                  <div className="space-y-4">
                    <Input
                      label="Nome"
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                    />
                      <Input
                      label="Email"
                      type="email"
                      value={profileData.email}
                      readOnly
                    />
                    <Input
                      label="Novo Email"
                      type="email"
                      value={profileData.newEmail}
                      onChange={(e) =>
                        setProfileData({ ...profileData, newEmail: e.target.value })
                      }
                    />
                    <Input
                      label="Senha"
                      type="password"
                      value={profileData.currentPassword}
                      onChange={(e) =>
                        setProfileData({ ...profileData, currentPassword: e.target.value })
                      }
                    />
                    <div className="flex space-x-4">
                      <Button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                        Salvar alterações
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setEditMode(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleUpdatePassword} className="bg-white rounded-2xl shadow-xl p-8 border border-indigo-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
                  {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6">
                      {error}
                    </div>
                  )}
                  <div className="space-y-4">
                    <Input
                      label="Senha atual"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="Nova senha"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="Confirmar nova senha"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      required
                    />
                    <div className="flex space-x-4">
                      <Button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                        Atualizar senha
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setEditMode(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de foto de perfil */}
{modalOpen && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full transform transition-all scale-95 hover:scale-100">
      <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">Atualizar Foto de Perfil</h2>
      
      {/* Input para URL da foto */}
      <div className="mb-6">
        <Input
          type="text"
          value={tempProfilePicture || ''}
          onChange={handlePhotoChange}
          placeholder="Digite a URL da imagem"
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          label={''}
        />
      </div>
      
      {/* Preview da imagem */}
      {tempProfilePicture && (
        <div className="mb-4 flex justify-center">
          <img
            src={tempProfilePicture}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-full border-4 border-blue-500"
          />
        </div>
      )}
      
      {/* Validação de URL */}
      {tempProfilePicture && !isValidUrl(tempProfilePicture) && (
        <p className="text-red-500 text-sm text-center mb-4">A URL fornecida não é uma imagem válida.</p>
      )}
      
      {/* Carregamento */}
      {loading && (
        <div className="flex justify-center mb-4">
          <div className="spinner-border animate-spin border-4 border-t-4 border-blue-600 rounded-full w-8 h-8"></div>
        </div>
      )}

      {/* Botões */}
      <div className="flex justify-center space-x-6 mt-6">
        {/* Botão de salvar */}
        <Button 
          onClick={handleSavePhoto} 
          disabled={loading || !isValidUrl(tempProfilePicture)} 
          className="bg-blue-600 text-white hover:bg-blue-700 transition-all px-6 py-2 rounded-md font-semibold shadow-lg transform active:scale-95"
        >
          <i className="fas fa-save mr-2"></i> Salvar
        </Button>
        
        {/* Botão de cancelar */}
        <Button 
          onClick={() => setModalOpen(false)} 
          className="bg-gray-300 text-gray-700 hover:bg-gray-400 transition-all px-6 py-2 rounded-md font-semibold shadow-lg transform active:scale-95"
        >
          <i className="fas fa-times mr-2"></i> Cancelar
        </Button>
      </div>
    </div>
  </div>
)}

    </Layout>
  );
}