import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { ExperienceBar } from '../components/ExperienceBar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuthStore } from '../store/authStore';
import { Edit2, Key } from 'lucide-react';
import api from '../lib/axios';

type EditMode = 'profile' | 'password' | null;

export default function Profile() {
  const { user, setUser } = useAuthStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  // Efeito para carregar os dados do usuário ao montar o componente
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Atualiza o estado com os dados armazenados
    }
  }, [setUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/user/update', {
        name: formData.name,
        email: formData.email,
      });

      // Verifique se os dados de resposta estão corretos
      if (response.data) {
        setUser(response.data); // Atualiza o estado com os dados retornados pela API
      }

      setEditMode(null);
      setError('');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await api.post('/user/update', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setEditMode(null);
      setError('');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError('Failed to update password');
    }
  };
  

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img
                src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name}`}
                alt={user?.name}
                className="w-32 h-32 rounded-full shadow-lg"
              />
            </div>
            <div className="mt-4 text-center">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-500">@{user?.username}</p>
              <div className="mt-2 flex items-center justify-center space-x-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                  Level {user?.level}
                </span>
                <span className="text-gray-500">{user?.title}</span>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Experience</span>
                <span className="text-sm text-gray-500">
                  {user?.xp}/100 XP
                </span>
              </div>
              <ExperienceBar current={user?.xp || 0} max={100} />
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
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
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
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, currentPassword: e.target.value })
                  }
                  required
                />

                <Input
                  label="New Password"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  required
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  required
                />

                <div className="flex space-x-4">
                  <Button type="submit">Update Password</Button>
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
    </Layout>
  );
}