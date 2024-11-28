import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  FileText,
  Plus,
  Trash2,
  Search,
} from 'lucide-react';
import api from '../lib/axios';
import { toast } from 'sonner';


interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Configuração do editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Placeholder.configure({
        placeholder: 'Comece a escrever sua nota...',
      }),
    ],
    content: selectedNote?.content || '',
    onUpdate: ({ editor }) => {
      if (selectedNote) {
        const updatedNote = {
          ...selectedNote,
          content: editor.getHTML(),
          updatedAt: new Date(),
        };
        if (updatedNote.content !== selectedNote.content) {
          updateNote(updatedNote);
        }
      }
    },
  });

  // Função para buscar as notas
  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await api.get('/notes');
        setNotes(response.data);
      } catch (error) {
        console.error('Erro ao buscar notas', error);
      }
    }
    fetchNotes();
  }, []);

  // Criar uma nova nota
  const createNote = async () => {
    const token = localStorage.getItem('token'); // Supondo que o token esteja no localStorage
    const newNote: Omit<Note, 'id' | 'updatedAt'> = {
      title: 'Nota sem título',
      content: '',
    };

    try {
      const response = await api.post('/notes', newNote, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes([response.data, ...notes]);
      setSelectedNote(response.data);
      editor?.commands.setContent('');
    } catch (error) {
      console.error('Erro ao criar a nota', error);
      if (error.response?.status === 403) {
        toast.error('Você não tem permissão para criar notas.');
      } else {
        toast.error('Ocorreu um erro ao criar a nota.');
      }
    }
  };

  // Atualizar uma nota existente
  const updateNote = async (updatedNote: Note) => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.put(`/notes/${updatedNote.id}`, updatedNote, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(notes.map((note) => (note.id === updatedNote.id ? response.data : note)));
      setSelectedNote(response.data);
    } catch (error) {
      console.error('Erro ao atualizar a nota', error);
      toast.error('Erro ao atualizar a nota.');
    }
  };

  // Deletar uma nota
  const deleteNote = async (noteId: string) => {
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(notes.filter((note) => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
        editor?.commands.setContent('');
      }
    } catch (error) {
      console.error('Erro ao deletar a nota', error);
      toast.error('Erro ao deletar a nota.');
    }
  };

  // Filtrar notas pela pesquisa
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: any) => {
    const validDate = new Date(date);
    if (isNaN(validDate.getTime())) {
      return 'Data inválida';
    }
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(validDate);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 divide-x divide-gray-100 h-[calc(100vh-12rem)]">
            {/* Barra lateral */}
            <div className="col-span-3 flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    <h2 className="font-semibold text-gray-900">Notas</h2>
                  </div>
                  <button
                    onClick={createNote}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar notas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => {
                      setSelectedNote(note);
                      editor?.commands.setContent(note.content);
                    }}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                      selectedNote?.id === note.id
                        ? 'bg-indigo-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {note.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(note.updatedAt)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editor */}
            <div className="col-span-9 flex flex-col">
              {selectedNote ? (
                <>
                  <div className="p-4 border-b border-gray-100">
                    <input
                      type="text"
                      value={selectedNote.title}
                      onChange={(e) =>
                        updateNote({
                          ...selectedNote,
                          title: e.target.value,
                          updatedAt: new Date(),
                        })
                      }
                      className="w-full px-3 py-2 text-lg font-medium border-0 focus:ring-0 focus:outline-none"
                      placeholder="Título da nota"
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        className={`p-1.5 rounded ${
                          editor?.isActive('bold')
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <Bold className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        className={`p-1.5 rounded ${
                          editor?.isActive('italic')
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <Italic className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          editor?.chain().focus().toggleBulletList().run()
                        }
                        className={`p-1.5 rounded ${
                          editor?.isActive('bulletList')
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          editor?.chain().focus().toggleOrderedList().run()
                        }
                        className={`p-1.5 rounded ${
                          editor?.isActive('orderedList')
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <ListOrdered className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          editor?.chain().focus().toggleBlockquote().run()
                        }
                        className={`p-1.5 rounded ${
                          editor?.isActive('blockquote')
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <Quote className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => editor?.chain().focus().undo().run()}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Undo className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => editor?.chain().focus().redo().run()}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Redo className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <EditorContent editor={editor} />
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center flex-1 text-gray-500">
                  Selecione ou crie uma nota para começar a editar.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
