import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="text-xl font-bold">Jpeccia</div>
      <ul className="flex space-x-4">
        <li><Link to="/dashboard">Perfil</Link></li>
        <li><Link to="/quests">Quests</Link></li>
        <li><Link to="/calendar">Calendário</Link></li>
        <li><Link to="/ranking">Ranking</Link></li>
        <li><Link to="/logout">Sair</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
