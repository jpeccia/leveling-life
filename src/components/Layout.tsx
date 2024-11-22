import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Calendar,
  Trophy,
  Info,
  LogOut,
  PlusSquare,
  Menu,
  FileSpreadsheet,
  FileText,
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
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: PlusSquare, label: 'Create Quest', path: '/quests/create' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: FileSpreadsheet, label: 'Spreadsheet', path: '/spreadsheet' },
    { icon: Trophy, label: 'Ranking', path: '/ranking' },
    { icon: FileText, label: 'Notes', path: '/notes' },
    { icon: Info, label: 'About', path: '/about' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-r from-indigo-50 via-indigo-100 to-indigo-200">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarVisible ? 'w-64' : 'w-20'
        } bg-white shadow-xl flex flex-col rounded-lg transition-all duration-300 ease-in-out`}
      >
        <div className="p-6 border-b bg-indigo-600 text-white flex items-center justify-between">
          {/* Nome do App */}
          <h1
            className={`${
              sidebarVisible ? 'text-2xl' : 'text-lg'
            } font-semibold tracking-wide`}
          >
            Leveling Life
          </h1>
          {/* Botão para mostrar/esconder a barra lateral */}
          <button
            onClick={toggleSidebar}
            className={`${
              sidebarVisible ? 'hidden' : 'block'
            } text-white p-2 rounded-full hover:bg-indigo-700`}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 border-b flex flex-col items-center">
          {/* User Profile */}
          <div className={`${sidebarVisible ? 'flex' : 'hidden'} flex-col items-center`}>
            <img
              src={user?.profilePicture || 'https://ui-avatars.com/api/?name=' + user?.name}
              alt={user?.name}
              className="w-28 h-28 rounded-full shadow-lg object-cover transform transition-transform duration-300 hover:scale-105 border-4 border-white"
            />
            <p className="font-medium text-lg mt-2 text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-600 mb-4">{user?.title}</p>

            {/* Experience Bar */}
            <div className="w-full mb-4">
              <ExperienceBar current={user?.xp || 0} max={user ? user.level * 800 : 100} />
            </div>
            <p className="text-sm text-gray-600">Level {user?.level}</p>
          </div>
        </div>

        <nav className="flex-1 p-6">
          <ul
            className={`space-y-4 ${
              sidebarVisible ? 'flex flex-col' : 'flex flex-col items-center'
            }`}
          >
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-4 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'text-gray-600 hover:bg-indigo-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {sidebarVisible && <span className="font-medium">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-6 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-4 text-gray-600 hover:text-gray-900 w-full px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            {sidebarVisible && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 overflow-auto bg-gray-50 rounded-r-lg transition-all duration-300 ease-in-out ${
          sidebarVisible ? '' : 'ml-20'
        }`}
      >
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
