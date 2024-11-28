import { useState, useEffect } from 'react';
import { Users, Bell } from 'lucide-react';
import { FriendsList } from './FriendsList';
import api from '../lib/axios';

export function SocialButtons() {
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const fetchRequestCount = async () => {
      try {
        const response = await api.get('/friends/pending-friend-requests/count');
        setRequestCount(response.data.count);
      } catch (error) {
        console.error('Failed to fetch request count:', error);
      }
    };

    fetchRequestCount();
    const interval = setInterval(fetchRequestCount, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 right-0 mr-2 sm:mr-6 mb-2 sm:mb-6 z-40">
      <div className="flex space-x-3">
        {/* Notifications Button */}
        <button
          onClick={() => {
            setShowNotifications(true);
            setShowFriendsList(false);
          }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
          <div className="relative p-3 bg-black/50 rounded-full backdrop-blur-sm border border-white/20 text-white hover:text-pink-300 transition-colors">
            <Bell className="h-6 w-6" />
            {requestCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border border-white/20">
                {requestCount}
              </span>
            )}
          </div>
        </button>

        {/* Friends List Button */}
        <button
          onClick={() => {
            setShowFriendsList(true);
            setShowNotifications(false);
          }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
          <div className="relative p-3 bg-black/50 rounded-full backdrop-blur-sm border border-white/20 text-white hover:text-indigo-300 transition-colors">
            <Users className="h-6 w-6" />
          </div>
        </button>
      </div>

      {/* Friends List Component */}
      {showFriendsList && (
        <FriendsList
          onClose={() => setShowFriendsList(false)}
          showRequests={false}
        />
      )}

      {/* Notifications Component */}
      {showNotifications && (
        <FriendsList
          onClose={() => setShowNotifications(false)}
          showRequests={true}
        />
      )}
    </div>
  );
}