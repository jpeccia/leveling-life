import { useState } from 'react';
import { UserPlus, Users, Bell } from 'lucide-react';
import api from '../lib/axios';

interface Friend {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  level: number;
}

interface FriendRequest {
  id: string;
  sender: {
    username: string;
    name: string;
    avatar?: string;
  };
}

export function FriendsList() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [newFriendUsername, setNewFriendUsername] = useState('');
  const [showRequests, setShowRequests] = useState(false);

  const loadFriends = async () => {
    try {
      const response = await api.get('/friends/');
      setFriends(response.data);
    } catch (error) {
      console.error('Failed to load friends:', error);
    }
  };

  const loadRequests = async () => {
    try {
      const response = await api.get('/friends/pending-friend-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to load requests:', error);
    }
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/friends/add/${newFriendUsername}`);
      setNewFriendUsername('');
      loadFriends();
    } catch (error) {
      console.error('Failed to add friend:', error);
    }
  };

  const handleRespondRequest = async (requestId: string, accept: boolean) => {
    try {
      await api.post(`/friends/respond/${requestId}`, { accept });
      loadRequests();
      if (accept) loadFriends();
    } catch (error) {
      console.error('Failed to respond to request:', error);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 mr-4 mb-4">
      <div className="flex flex-col items-end">
        {isExpanded && (
          <div className="mb-2 bg-white rounded-lg shadow-lg p-4 w-80">
            {showRequests ? (
              <div>
                <h3 className="font-semibold mb-2">Friend Requests</h3>
                <div className="space-y-2">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={
                            request.sender.avatar ||
                            `https://ui-avatars.com/api/?name=${request.sender.name}`
                          }
                          alt={request.sender.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span>{request.sender.name}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRespondRequest(request.id, true)}
                          className="text-green-600 hover:text-green-700"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => handleRespondRequest(request.id, false)}
                          className="text-red-600 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold mb-2">Friends</h3>
                <form onSubmit={handleAddFriend} className="mb-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newFriendUsername}
                      onChange={(e) => setNewFriendUsername(e.target.value)}
                      placeholder="Username"
                      className="flex-1 px-2 py-1 border rounded"
                    />
                    <button
                      type="submit"
                      className="p-1 rounded bg-indigo-600 text-white"
                    >
                      <UserPlus className="h-5 w-5" />
                    </button>
                  </div>
                </form>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={
                            friend.avatar ||
                            `https://ui-avatars.com/api/?name=${friend.name}`
                          }
                          alt={friend.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div>{friend.name}</div>
                          <div className="text-xs text-gray-500">
                            Level {friend.level}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (!isExpanded) {
                loadFriends();
                loadRequests();
              }
            }}
            className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50"
          >
            <Users className="h-6 w-6 text-indigo-600" />
          </button>
          {requests.length > 0 && (
            <button
              onClick={() => {
                setIsExpanded(true);
                setShowRequests(true);
              }}
              className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 relative"
            >
              <Bell className="h-6 w-6 text-indigo-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {requests.length}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}