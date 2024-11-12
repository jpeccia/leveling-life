import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="w-1/4 h-full p-4 bg-gray-900 text-white">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <ul className="space-y-2">
        <li><Link to="/dashboard">Perfil</Link></li>
        <li><Link to="/quests">Criação de Quests</Link></li>
        <li><Link to="/calendar">Calendário</Link></li>
        <li><Link to="/ranking">Ranking</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
