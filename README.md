# Leveling Life

## Descrição

O **Leveling Life** é uma aplicação desenvolvida para gamificar o desenvolvimento pessoal, proporcionando aos usuários um sistema de quests, níveis, notas, edição de planilhas, ranking e interação social com amigos. Inspirada em RPGs e conceitos de gamificação, a aplicação visa tornar o dia a dia mais motivador e divertido.

## Tecnologias Utilizadas

- **Front-end**: React, TypeScript
- **Bibliotecas Utilizadas**: Lucide-react, Axios, ExcelJS, tiptap, sonner, toast...
- **Gerenciamento de Estado**: Zustand para gerenciar o estado de autenticação
- **UI/UX**: Tailwind CSS para a estilização

## Instalação

### Requisitos

- Node.js >= v16.x.x
- npm ou yarn

### Passos para Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/jpeccia/leveling-life.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd leveling-life
   ```

3. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias, como URL do back-end, credenciais do banco de dados, etc.

5. Execute o projeto:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

## Como Usar

### Acesso ao Sistema

1. **Cadastro e Login**: Acesse a aplicação pela página de login, onde você pode se registrar ou fazer login com suas credenciais.
2. **Edição de Perfil**: Na página de perfil, você pode editar informações como nome e email.
3. **Alteração de Senha**: É possível alterar sua senha na seção de configurações.
4. **Criação de quests, anotações e edição de planilhas**: Itens para melhorar sua produtividade.

### Funcionalidades Principais

- **Edição de perfil**: Atualize seu nome e email.
- **Alteração de senha**: Altere a senha atual para maior segurança.
- **Alteração de foto de perfil**: Altere a foto de perfil via link url.
- **Barra de experiência**: Veja seu progresso de experiência até o próximo nível.
- **Visualização de Quests**: Exibe uma lista de quests organizadas por tipo (diárias, semanais e mensais).
- **Criação de Quests**: Permite criar novas quests para a conta do usuário.
- **Edição de Quests**: Possui um modal de edição que permite modificar os detalhes de uma quest existente.
- **Conclusão de Quests**: Permite marcar uma quest como concluída.
- **Exclusão de Quests**: Oferece a possibilidade de remover quests.
- **Calendário Integrado**: Uma visão de calendário que exibe a programação das quests.
- **Notas**: Criação de anotações para o usuário.
- **Planilhas**: Importação e exportação de planilhas junto com edição.
- **Interface Responsiva**: Adaptada para diferentes dispositivos com um design moderno.

## Estrutura de Pastas

```
leveling-life/
│
├── public/                # Arquivos públicos como imagens e ícones
├── src/                   # Código fonte do projeto
│   ├── components/        # Componentes reutilizáveis
│   ├── pages/             # Páginas principais do projeto
│   ├── lib/               # Arquivos de configuração e helpers
│   ├── store/             # Gerenciamento de estado global
│   └── App.tsx            # Componente principal
│
├── .env                   # Variáveis de ambiente
├── package.json           # Configuração do projeto e dependências
└── README.md              # Documentação do projeto
```

## Contribuição

1. Faça um fork do repositório.
2. Crie uma branch com sua nova funcionalidade (`git checkout -b feature/novo-recurso`).
3. Faça commit das suas alterações (`git commit -m 'Add new feature'`).
4. Faça o push para a branch (`git push origin feature/novo-recurso`).
5. Crie um Pull Request.

## Licença

Este projeto é licenciado sob a [MIT License](LICENSE).

---

## Autor    

- **João Otávio Peccia** - [GitHub](https://github.com/jpeccia)

---