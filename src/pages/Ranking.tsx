import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Trophy, Medal, User } from 'lucide-react';
import { ExperienceBar } from '../components/ExperienceBar';
import api from '../lib/axios';

interface RankedUser {
  id: string;
  username: string;
  name: string;
  level: number;
  xp: number;
  title: string;
  avatar?: string;
}

const calculateXpForNextLevel = (level: number) => {
    return level * 800; // Exemplo: cada nível requer 800 XP a mais
  };

export default function Ranking() {
  const [users, setUsers] = useState<RankedUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<RankedUser | null>(null);

  useEffect(() => {
    loadRanking();
  }, []);

  const nextLevelXp = calculateXpForNextLevel(selectedUser?.level || 1)

  const loadRanking = async () => {
    try {
      const response = await api.get('/user/ranking');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load ranking:', error);
    }
  };;
  
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
            <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Ranking List */}
            <div className="space-y-4">
              {users.map((user, index) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedUser?.id === user.id
                      ? 'bg-indigo-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-shrink-0 w-8 text-center">
                    {index < 3 ? (
                      <Medal className={`h-6 w-6 ${getMedalColor(index)}`} />
                    ) : (
                      <span className="text-gray-500">{index + 1}</span>
                    )}
                  </div>
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-indigo-600 font-semibold">
                        Level {user.level}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{user.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* User Details */}
            {selectedUser ? (
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={
                      selectedUser.avatar ||
                      `https://ui-avatars.com/api/?name=${selectedUser.name}`
                    }
                    alt={selectedUser.name}
                    className="w-24 h-24 rounded-full mb-4"
                  />
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedUser.name}
                  </h2>
                  <p className="text-gray-500 mb-2">@{selectedUser.title}</p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mb-4">
                    {selectedUser.username}
                  </div>
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Level</span>
                      <span className="font-medium">{selectedUser.level}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-medium">
                      {selectedUser.xp}/{nextLevelXp} XP
                      </span>
                    </div>
                    <ExperienceBar current={selectedUser.xp || 0} max={nextLevelXp} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center justify-center text-gray-500">
                <User className="h-12 w-12 mb-2" />
                <p>Select a user to view their details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}