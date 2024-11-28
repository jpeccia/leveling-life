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
      title: 'Quest System',
      description: 'Create and manage daily, weekly, and monthly quests to track your progress and achievements.',
    },
    {
      title: 'Experience Points',
      description: 'Earn XP by completing quests and level up to unlock new titles and achievements.',
    },
    {
      title: 'Social Features',
      description: 'Connect with friends, compare progress, and compete on the global leaderboard.',
    },
    {
      title: 'Calendar Integration',
      description: 'Visualize your quest schedule and plan your achievements with our intuitive calendar.',
    },
    {
      title: 'Notes System',
      description: 'Keep track of important thoughts, reminders, and ideas with an integrated note-taking system.',
    },
    {
      title: 'Spreadsheet Integration',
      description: 'Organize your tasks and quests in a spreadsheet-like format, allowing for better management and tracking.',
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About Leveling Life
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A gamified productivity app that turns your daily tasks into epic quests,
              helping you level up in real life while having fun.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title} // Uso de uma chave única e descritiva
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Creator Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <img
                  src="https://avatars.githubusercontent.com/u/116593320?v=4"
                  alt="João Peccia"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h2 className="text-2xl font-bold text-gray-900">João Peccia</h2>
                <p className="text-gray-600">Back End Developer</p>
              </div>

              <div className="max-w-2xl mx-auto text-center">
                <p className="text-gray-600 mb-6">
                  Passionate about creating tools that make people's lives better
                  and more enjoyable. Leveling Life was born from the idea of combining
                  productivity with gaming elements to create a unique and engaging
                  experience.
                </p>

                {/* Redes sociais com links seguros */}
                <div className="flex justify-center space-x-4">
                  {socialLinks.map((link) => {
                    const Icon = link.icon; // Desestruturação do ícone
                    return (
                      <a
                        key={link.href} // Uso de chave única para cada link
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

          {/* Footer */}
          <div className="text-center py-8">
            <p className="flex items-center justify-center text-gray-600">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> by João Peccia
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
