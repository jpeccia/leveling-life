import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { ExperienceBar } from '../components/ExperienceBar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuthStore } from '../store/authStore';
import { Edit2, Key, Camera } from 'lucide-react';
import api from '../lib/axios';
import { toast } from 'sonner';

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
  const { user, setUser } = useAuthStore((state) => ({
    user: state.user,
    setUser: state.setUser,
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
  const [tempProfilePicture, setTempProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser); // Atualiza o estado global com os dados armazenados
    }
  }, [setUser]);

  const formattedProfilePicture = profileData.profilePicture?.replace(/\\/g, '/');

  const calculateXpForNextLevel = (level: number) => {
    return level * 800; // Exemplo: cada nível requer 800 XP a mais
  };

  const nextLevelXp = calculateXpForNextLevel(user?.level || 1);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTempProfilePicture(file);
    }
  };

  const handleSavePhoto = async () => {
    if (tempProfilePicture) {
      const formData = new FormData();
      formData.append('profilePicture', tempProfilePicture);
  
      try {
        const response = await api.post('/user/update', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.data) {
          const formattedProfilePicture = response.data.profilePicture.replace(/\\/g, '/'); // Corrige as barras invertidas
          
          // Atualiza o estado com o novo caminho da foto
          setProfileData((prev) => ({
            ...prev,
            profilePicture: formattedProfilePicture,
          }));
  
          // Atualiza o usuário no estado global com a foto corrigida
          setUser((prevUser) => ({
            ...prevUser,
            profilePicture: formattedProfilePicture,
          }));
  
          // Salva no localStorage para persistência
          localStorage.setItem('user', JSON.stringify(response.data));
  
          setTempProfilePicture(null);
          setModalOpen(false);
        }
      } catch (err) {
        setError('Failed to update profile picture');
      }
    }
  };
  

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      setError('Token de autenticação não encontrado.');
      return;
    }
  
    try {
      const response = await api.post(
        '/user/update',
        {
          name: profileData.name,
          newEmail: profileData.newEmail,
          currentPassword: profileData.currentPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        // Sincronize os dados do usuário após a atualização
        const { fetchUser } = useAuthStore.getState();
        await fetchUser();
  
        setEditMode(null); // Sai do modo de edição
        toast.success('Perfil atualizado com sucesso!');
      } else {
        setError(`Erro ao atualizar perfil: ${response.data.message || 'Desconhecido'}`);
      }
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      setError(err.response?.data?.message || 'Falha ao atualizar o perfil.');
    }
  };
  

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await api.post('/user/update', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setEditMode(null);
      setError('');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success("Password changed successfully!")
    } catch (err) {
      setError('Failed to update password');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <img
                src={formattedProfilePicture || `https://ui-avatars.com/api/?name=${user?.name}`}
                alt={user?.name}
                className="w-32 h-32 rounded-full shadow-lg"
              />
              <button
                onClick={() => setModalOpen(true)}
                className="absolute bottom-2 right-2 bg-gray-800 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 text-center">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-500">@{user?.username}</p>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                Level {user?.level}
              </span>
              <div className="mt-2 flex items-center justify-center space-x-2">
                <span className="text-gray-500">{user?.title}</span>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Experience</span>
                <span className="text-sm text-gray-500">
                  {user?.xp}/{nextLevelXp} XP
                </span>
              </div>
              <ExperienceBar current={user?.xp || 0} max={nextLevelXp} />
            </div>

            {editMode === null ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={() => setEditMode('profile')}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setEditMode('password')}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Key className="h-4 w-4" />
                    <span>Change Password</span>
                  </Button>
                </div>
              </div>
            ) : editMode === 'profile' ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Input
                  label="Name"
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                />

                <Input
                  label="New Email"
                  type="newEmail"
                  value={profileData.newEmail}
                  onChange={(e) =>
                    setProfileData({ ...profileData, newEmail: e.target.value })
                  }
                />

                <Input
                  label="Current Password"
                  type="password"
                  value={profileData.currentPassword}
                  onChange={(e) =>
                    setProfileData({ ...profileData, currentPassword: e.target.value })
                  }
                  required
                />

                <div className="flex space-x-4">
                  <Button type="submit">Save Changes</Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditMode(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Input
                  label="Current Password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  required
                />

                <Input
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  required
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  required
                />

                <div className="flex space-x-4">
                  <Button type="submit">Save Changes</Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditMode(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Modal de foto de perfil */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Change Profile Picture</h2>
            <input
              type="file"
              onChange={handlePhotoChange}
              accept="image/*"
              className="mb-4"
            />
            {tempProfilePicture && (
              <div className="mb-4">
                <img
                  src={URL.createObjectURL(tempProfilePicture)}
                  alt="Preview"
                  className="w-32 h-32 rounded-full"
                />
              </div>
            )}
            <div className="flex space-x-4">
              <Button onClick={handleSavePhoto}>Save</Button>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
