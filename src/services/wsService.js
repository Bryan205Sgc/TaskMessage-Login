import io from "socket.io-client";

class WebSocketService {
  constructor() {
    this.socket = null;
  }

  // Inicializar conexión con el servidor
  connect(url) {
    if (!this.socket) {
      this.socket = io(url);
      console.log("WebSocket conectado a:", url);
    } else {
      console.warn("WebSocket ya está conectado.");
    }
  }

  // Escuchar eventos
  on(event, callback) {
    if (!this.socket) {
      console.error("Socket no inicializado. Llama a connect() primero.");
      return;
    }
    this.socket.on(event, callback);
    console.log(`Escuchando evento: ${event}`);
  }

  // Emitir eventos
  emit(event, data) {
    if (!this.socket) {
      console.error("Socket no inicializado. Llama a connect() primero.");
      return;
    }
    this.socket.emit(event, data);
    console.log(`Evento emitido: ${event}, datos:`, data);
  }

  // Desconectar el WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("WebSocket desconectado.");
    } else {
      console.warn("WebSocket ya está desconectado.");
    }
  }

  // Eliminar listeners para un evento específico
  off(event) {
    if (!this.socket) {
      console.error("Socket no inicializado. Llama a connect() primero.");
      return;
    }
    this.socket.off(event);
    console.log(`Listener eliminado para el evento: ${event}`);
  }
}

// Crear una instancia única del servicio
const wsService = new WebSocketService();

export default wsService;
