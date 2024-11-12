// src/components/dashboard/Profile.tsx
import React from 'react';
import Button from '../common/Button';

const Profile: React.FC = () => {
  // Dados fictícios para as quests do usuário
  const userQuests = [
    { id: 1, title: 'Primeira Quest', completed: false },
    { id: 2, title: 'Segunda Quest', completed: true },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Meu Perfil</h2>
      <ul className="space-y-2">
        {userQuests.map((quest) => (
          <li key={quest.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
            <span>{quest.title}</span>
            <div className="space-x-2">
              <Button text="Editar" onClick={() => { /* Função para editar */ }} />
              <Button text="Remover" onClick={() => { /* Função para remover */ }} className="bg-red-500" />
              <Button text={quest.completed ? "Concluída" : "Marcar como Concluída"} onClick={() => { /* Função para completar */ }} className="bg-green-500" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
