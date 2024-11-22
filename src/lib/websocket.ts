import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export class WebSocketService {
  private client: Client;

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws', // URL do WebSocket no backend
      connectHeaders: {
        // Adicione cabeçalhos de autenticação se necessário
      },
      debug: (str) => {
        console.log(str); // Exibe logs para debug
      },
      onConnect: (frame) => {
        console.log('Conectado ao WebSocket', frame);
      },
      onDisconnect: (frame) => {
        console.log('Desconectado do WebSocket', frame);
      },
      onStompError: (frame) => {
        console.error('Erro no STOMP', frame);
      },
      reconnectDelay: 5000, // Tentativas de reconexão
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'), // Caminho do WebSocket
    });
  }

  connect() {
    this.client.activate();
  }

  disconnect() {
    this.client.deactivate();
  }

  sendMessage(destination: string, message: any) {
    this.client.publish({
      destination,
      body: JSON.stringify(message),
    });
  }

  subscribeToMessages(destination: string, callback: (message: string) => void) {
    this.client.subscribe(destination, (message) => {
      if (message.body) {
        callback(message.body);
      }
    });
  }
}
