import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Calendar,
  Trophy,
  Info,
  LogOut,
  PlusSquare,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { ExperienceBar } from './ExperienceBar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: PlusSquare, label: 'Create Quest', path: '/quests/create' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: Trophy, label: 'Ranking', path: '/ranking' },
    { icon: Info, label: 'About', path: '/about' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name}
              alt={user?.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-gray-500">Level {user?.level}</p>
            </div>
          </div>
          <div className="mt-2">
            <ExperienceBar current={user?.experience || 0} max={100} />
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 w-full px-4 py-2"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}