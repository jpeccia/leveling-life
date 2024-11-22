import { useState, useEffect } from 'react';
import { UserPlus, Users, Bell, X } from 'lucide-react';
import api from '../lib/axios';

interface Friend {
  id: string;
  username: string;
  name: string;
  profilePicture?: string;
  level: number;
  title?: string;
}

interface FriendRequest {
  id: string;
  sender: {
    username: string;
    name: string;
    profilePicture?: string;
  };
}

const FriendRequestItem = ({
  request,
  onAccept,
  onReject,
}: {
  request: FriendRequest;
  onAccept: () => void;
  onReject: () => void;
}) => (
  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
    <div className="flex items-center space-x-2">
      <img
        src={request.sender.profilePicture || `https://ui-avatars.com/api/?name=${request.sender.name}`}
        alt={request.sender.name}
        className="w-8 h-8 rounded-full"
      />
      <span>{request.sender.name}</span>
    </div>
    <div className="flex space-x-2">
      <button onClick={onAccept} className="text-green-600 hover:text-green-700">
        ✓
      </button>
      <button onClick={onReject} className="text-red-600 hover:text-red-700">
        ✕
      </button>
    </div>
  </div>
);

const FriendListItem = ({ friend, onRemove }: { friend: Friend; onRemove: () => void }) => (
  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
    <div className="flex items-center space-x-2">
      <img
        src={friend.profilePicture || 'https://ui-avatars.com/api/?name=' + user?.name}
        alt={friend.name}
        className="w-8 h-8 rounded-full shadow-lg object-cover transform transition-transform duration-300 hover:scale-105 border-2 border-white" 
        />
      <div>
        <div>{friend.name}</div>
        {friend.title && (
          <div className="text-xs text-gray-500">{friend.title}</div>
        )}
        <div className="text-xs text-gray-500">Level {friend.level}</div>
      </div>
    </div>
    <button
      onClick={onRemove}
      className="text-red-600 hover:text-red-700"
      aria-label={`Remove ${friend.name} from friends`}
    >
      <X className="h-5 w-5" />
    </button>
  </div>
);

export function FriendsList() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [newFriendUsername, setNewFriendUsername] = useState('');
  const [showRequests, setShowRequests] = useState(false);
  const [noRequestsMessage, setNoRequestsMessage] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      loadFriendsAndRequests();
    }
  }, [isExpanded]);

  const loadFriendsAndRequests = async () => {
    try {
      const [friendsResponse, requestsResponse] = await Promise.all([
        api.get('/friends/'),
        api.get('/friends/pending-friend-requests'),
      ]);
      setFriends(friendsResponse.data);
      setRequests(requestsResponse.data);
      if (requestsResponse.data.length === 0) {
        setNoRequestsMessage(true);
      } else {
        setNoRequestsMessage(false);
      }
    } catch (error) {
      console.error('Failed to load friends and requests:', error);
    }
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/friends/add/${newFriendUsername}`);
      setNewFriendUsername('');
      loadFriendsAndRequests();
    } catch (error) {
      console.error('Failed to add friend:', error);
    }
  };

  const handleRespondRequest = async (requestId: string, accept: boolean) => {
    try {
      await api.post(`/friends/respond/${requestId}?accept=${accept}`);
      loadFriendsAndRequests();
    } catch (error) {
      console.error('Failed to respond to request:', error);
    }
  };

  const handleRemoveFriend = async (friend: Friend) => {
    try {
      await api.delete(`/friends/remove/${friend.username}`);
      loadFriendsAndRequests(); // Recarrega os amigos e solicitações após a remoção
    } catch (error) {
      console.error('Failed to remove friend:', error);
    }
  };

  const handleToggleFriends = () => {
    setIsExpanded((prev) => !prev);
    setShowRequests(false); // Garante que os pedidos de amizade sejam fechados ao expandir amigos
  };

  const handleToggleRequests = () => {
    setShowRequests((prev) => !prev);
    setIsExpanded(false); // Garante que a lista de amigos seja fechada ao mostrar solicitações
  };

  return (
    <div className="fixed bottom-0 right-0 mr-4 mb-4">
      <div className="flex flex-col items-end">
        {isExpanded && (
          <div className="mb-2 bg-white rounded-lg shadow-lg p-4 w-80">
            <div className="flex justify-between">
              <h3 className="font-semibold mb-2">Friends</h3>
              <button
                onClick={handleToggleFriends}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddFriend} className="mb-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newFriendUsername}
                  onChange={(e) => setNewFriendUsername(e.target.value)}
                  placeholder="Username"
                  className="flex-1 px-2 py-1 border rounded"
                />
                <button type="submit" className="p-1 rounded bg-indigo-600 text-white">
                  <UserPlus className="h-5 w-5" />
                </button>
              </div>
            </form>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {friends.map((friend) => (
                <FriendListItem
                  key={friend.id}
                  friend={friend}
                  onRemove={() => handleRemoveFriend(friend)}
                />
              ))}
            </div>
          </div>
        )}

        {showRequests && (
          <div className="mb-2 bg-white rounded-lg shadow-lg p-4 w-80">
            <div className="flex justify-between">
              <h3 className="font-semibold mb-2">Friend Requests</h3>
              <button
                onClick={handleToggleRequests}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {requests.length === 0 ? (
              <div className="text-gray-500">No friend requests</div>
            ) : (
              <div className="space-y-2">
                {requests.map((request) => (
                  <FriendRequestItem
                    key={request.id}
                    request={request}
                    onAccept={() => handleRespondRequest(request.id, true)}
                    onReject={() => handleRespondRequest(request.id, false)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={handleToggleFriends}
            className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50"
            aria-label={isExpanded && !showRequests ? 'Collapse Friends List' : 'Expand Friends List'}
          >
            <Users className="h-6 w-6 text-indigo-600" />
          </button>
          <button
            onClick={handleToggleRequests}
            className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 relative"
            aria-label="Show Friend Requests"
          >
            <Bell className="h-6 w-6 text-indigo-600" />
            {requests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {requests.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
