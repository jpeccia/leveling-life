import { Layout } from '../components/Layout';
import { Github, Linkedin, Mail, Instagram, Heart } from 'lucide-react';

/**
 * Componente que exibe informações sobre o projeto "Leveling Life".
 */
export default function About() {
  // Lista de links para redes sociais com ícones, cores e URLs.
  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/jpeccia',
      color: 'hover:text-gray-900',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/joao-peccia/',
      color: 'hover:text-blue-600',
    },
    {
      icon: Mail,
      label: 'Email',
      href: 'mailto:joaootaviopeccia0@gmail.com',
      color: 'hover:text-red-500',
    },
    {
      icon: Instagram,
      label: 'Instagram',
      href: 'https://www.instagram.com/jpeccia_/',
      color: 'hover:text-green-600',
    },
  ];

  // Lista de recursos e funcionalidades do projeto.
  const features = [
    {
      title: 'Sistema de Quests',
      description: 'Crie e gerencie quests diárias, semanais e mensais para acompanhar seu progresso e conquistas.',
    },
    {
      title: 'Pontos de Experiência',
      description: 'Ganhe XP ao completar quests e suba de nível para desbloquear novos títulos e conquistas.',
    },
    {
      title: 'Funcionalidades Sociais',
      description: 'Conecte-se com amigos, compare progresso e compita no ranking global.',
    },
    {
      title: 'Integração com Calendário',
      description: 'Visualize seu cronograma de quests e planeje suas conquistas com nosso calendário intuitivo.',
    },
    {
      title: 'Sistema de Notas',
      description: 'Registre pensamentos importantes, lembretes e ideias com um sistema integrado de anotações.',
    },
    {
      title: 'Integração com Planilhas',
      description: 'Organize suas tarefas e quests em um formato de planilha, permitindo melhor gerenciamento e acompanhamento.',
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-12">
          {/* Seção Principal */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sobre o Leveling Life
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Um aplicativo de produtividade gamificado que transforma suas tarefas
              diárias em quests épicas, ajudando você a subir de nível na vida real
              enquanto se diverte.
            </p>
          </div>

          {/* Grid de Funcionalidades */}
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Seção do Criador */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <img
                  src="https://avatars.githubusercontent.com/u/116593320?v=4"
                  alt="João Peccia"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h2 className="text-2xl font-bold text-gray-900">João Peccia</h2>
                <p className="text-gray-600">Desenvolvedor Back-End</p>
              </div>

              <div className="max-w-2xl mx-auto text-center">
                <p className="text-gray-600 mb-6">
                  Apaixonado por criar ferramentas que tornam a vida das pessoas melhor
                  e mais agradável. O Leveling Life nasceu da ideia de combinar
                  produtividade com elementos de jogos para criar uma experiência única e envolvente.
                </p>

                {/* Redes sociais com links seguros */}
                <div className="flex justify-center space-x-4">
                  {socialLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-full transition-colors ${link.color}`}
                        title={link.label}
                      >
                        <Icon className="h-6 w-6" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="text-center py-8">
            <p className="flex items-center justify-center text-gray-600">
              Feito com <Heart className="h-4 w-4 mx-1 text-red-500" /> por João Peccia
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
