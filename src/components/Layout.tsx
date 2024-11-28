import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  User,
  Calendar,
  Trophy,
  Info,
  LogOut,
  PlusSquare,
  FileSpreadsheet,
  NotebookPenIcon,
  HomeIcon,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { ExperienceBar } from './ExperienceBar';
import { cn } from '../lib/utils';
import { SocialButtons } from './SocialButtons';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Componente principal do layout do aplicativo.
 * Inclui um menu lateral responsivo, barra de experiência e conteúdo principal.
 */
export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  /**
   * Lida com o logout do usuário e redireciona para a página de login.
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Configuração dos itens do menu lateral.
   */
  const menuItems = [
    { icon: HomeIcon, label: 'Home', path: '/' },
    { icon: User, label: 'Meu perfil', path: '/profile' },
    { icon: PlusSquare, label: 'Nova Missão', path: '/quests/create' },
    { icon: Calendar, label: 'Calendário', path: '/calendar' },
    { icon: FileSpreadsheet, label: 'Planilhas', path: '/spreadsheet' },
    { icon: Trophy, label: 'Ranking', path: '/ranking' },
    { icon: NotebookPenIcon, label: 'Notas', path: '/notes' },
    { icon: Info, label: 'Sobre', path: '/about' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
      <div className="flex min-h-screen">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-black/50 backdrop-blur-xl rounded-lg border border-white/20 text-white"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

          {/* Sidebar Overlay */}
          {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Menu lateral */}
        <aside
          className={cn(
            "fixed lg:relative inset-y-0 left-0 w-72 bg-gradient-to-b from-indigo-950/90 via-purple-950/90 to-indigo-950/90 backdrop-blur-xl border-r border-white/10 shadow-[5px_0_25px_-3px] shadow-purple-500/20 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="p-6 border-b border-white/10">
            {/* Informações do usuário */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-xl opacity-60 group-hover:opacity-100 blur-lg transition duration-1000 group-hover:duration-200 animate-pulse-glow"></div>
              <div className="relative flex items-center space-x-4 bg-black/20 p-3 rounded-lg backdrop-blur-sm">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-75 blur"></div>
                  <img
                    src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name}`}
                    alt={user?.name}
                    className="relative w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full p-1 border border-white shadow-md">
                    <span className="text-xs font-bold text-white">{user?.level}</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-indigo-200 font-medium">{user?.title || 'Novice Adventurer'}</p>
                  <div className="mt-2 w-36">
                    <ExperienceBar current={user?.xp || 0} max={user ? user.level * 800 : 100} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navegação */}
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "relative group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300",
                        isActive
                          ? "bg-gradient-to-r from-indigo-600/40 via-purple-600/40 to-cyan-600/40 text-white shadow-lg shadow-purple-500/20"
                          : "text-gray-300 hover:bg-white/5 hover:text-indigo-300 hover:shadow-md hover:shadow-purple-500/10"
                      )}
                      aria-label={item.label}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-lg blur-sm" />
                      )}
                      <Icon
                        className={cn(
                          "h-5 w-5 transition-transform duration-300",
                          isActive ? "text-indigo-300" : "text-gray-400 group-hover:text-indigo-300",
                          "group-hover:scale-110"
                        )}
                        aria-hidden="true"
                      />
                      <span className="relative">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Botão de logout */}
          <div className="p-4 border-t border-white/10 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 text-gray-300 hover:text-red-400 w-full px-4 py-3 rounded-lg transition-all duration-300 hover:bg-red-950/30 group"
              aria-label="Sair"
            >
              <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-x-1" />
              <span>Sair</span>
            </button>
          </div>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 overflow-auto bg-gray-50 rounded-r-lg transition-all duration-300 ease-in-out">
          <div className="p-8">{children}</div>
        </main>

        {/* Social Buttons */}
        <SocialButtons />
      </div>
  );
}
