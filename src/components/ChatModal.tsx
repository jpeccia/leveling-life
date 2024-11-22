import React, { useState, useEffect } from 'react';
import { WebSocketService } from '../lib/websocket'; // Caminho para o arquivo websocket.ts

interface ChatMessage {
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
}

interface ChatProps {
  user: string; // Usuário logado
  recipient: string; // Destinatário do chat
}

const ChatComponent: React.FC<ChatProps> = ({ user, recipient }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [webSocketService] = useState(new WebSocketService());

  useEffect(() => {
    // Conecta-se ao WebSocket quando o componente for montado
    webSocketService.connect();

    // Inscreve-se para receber mensagens
    webSocketService.subscribeToMessages(`/user/${user}/queue/reply`, (message: string) => {
      const newMessage = JSON.parse(message);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Recupera o histórico de mensagens quando o componente for montado
    fetch(`/api/chat/history/${user}/${recipient}`)
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error('Erro ao carregar histórico:', error));

    return () => {
      // Desconecta quando o componente for desmontado
      webSocketService.disconnect();
    };
  }, [user, recipient, webSocketService]);

  const handleSendMessage = () => {
    if (messageContent.trim()) {
      const newMessage = {
        sender: user,
        recipient,
        content: messageContent,
        timestamp: new Date().toISOString(),
      };

      // Envia a mensagem via WebSocket
      webSocketService.sendMessage('/app/send-message', newMessage);

      // Atualiza a lista de mensagens (de forma otimista, se necessário)
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageContent(''); // Limpa o campo de mensagem
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={message.sender === user ? 'my-message' : 'other-message'}>
            <p>{message.content}</p>
            <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>

      <div className="input">
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatComponent;
