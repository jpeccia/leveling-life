// src/pages/Dashboard.tsx
import React from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Profile from '../components/dashboard/Profile';
import ProgressBar from '../components/dashboard/ProgressBar';

const Dashboard: React.FC = () => {
  const userProgress = 70; // Exemplo de progresso do usuário (70%)

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Conteúdo Principal */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Área de Conteúdo */}
        <div className="flex-1 p-8 bg-gray-100">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          {/* Seção do Perfil do Usuário */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Meu Perfil</h2>
            <Profile />

            {/* Barra de Progresso do Usuário */}
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Progresso de Experiência</h3>
              <ProgressBar progress={userProgress} />
            </div>
          </section>

          {/* Outras Seções (Criação de Quests, Calendário, Ranking) */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Outras Seções</h2>
            <p className="text-gray-700">
              Explore mais recursos nas opções da barra lateral: criação de quests, calendário e ranking.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
