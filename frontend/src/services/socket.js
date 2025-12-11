import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL

class SocketService {
  constructor() {
    this.socket = null;
    this.gameId = null;
    this.isHost = false;
    this.playerSymbol = null;
    this.playerName = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SERVER_URL, {
        transports: ['websocket', 'polling']
      });
      
      this.socket.on('connect', () => {
        console.log('✅ Connected to server');
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Disconnected from server');
      });

      this.socket.on('error', (data) => {
        console.error('❌ Socket error:', data.message);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.gameId = null;
      this.isHost = false;
      this.playerSymbol = null;
      this.playerName = null;
    }
  }

  // Create a new game
  createGame(playerName) {
    this.connect();
    this.socket.emit('create-game', playerName);
  }

  // Join an existing game
  joinGame(gameId, playerName) {
    this.connect();
    this.socket.emit('join-game', { gameId, playerName });
  }

  // Make a move
  makeMove(gameId, index) {
    if (this.socket) {
      this.socket.emit('make-move', { gameId, index });
    }
  }

  // Remove oldest move (FIFO)
  removeOldest(gameId) {
    if (this.socket) {
      this.socket.emit('remove-oldest', { gameId });
    }
  }

  // Declare winner
  declareWinner(gameId, winner, winningLine) {
    if (this.socket) {
      this.socket.emit('game-winner', { gameId, winner, winningLine });
    }
  }

  // Declare draw
  declareDraw(gameId) {
    if (this.socket) {
      this.socket.emit('game-draw', { gameId });
    }
  }

  // Reset game (any player)
  resetGame(gameId) {
    if (this.socket) {
      this.socket.emit('reset-game', { gameId });
    }
  }

  // Reset scores (any player)
  resetScores(gameId) {
    if (this.socket) {
      this.socket.emit('reset-scores', { gameId });
    }
  }

  // Event listeners
  onGameCreated(callback) {
    this.connect();
    this.socket.on('game-created', (data) => {
      this.gameId = data.gameId;
      this.isHost = data.isHost;
      this.playerSymbol = data.playerSymbol;
      this.playerName = data.playerName;
      callback(data);
    });
  }

  onGameJoined(callback) {
    this.connect();
    this.socket.on('game-joined', (data) => {
      this.gameId = data.gameId;
      this.isHost = data.isHost;
      this.playerSymbol = data.playerSymbol;
      this.playerName = data.playerName;
      callback(data);
    });
  }

  onOpponentJoined(callback) {
    this.connect();
    this.socket.on('opponent-joined', callback);
  }

  onMoveMade(callback) {
    this.connect();
    this.socket.on('move-made', callback);
  }

  onOldestRemoved(callback) {
    this.connect();
    this.socket.on('oldest-removed', callback);
  }

  onWinnerDeclared(callback) {
    this.connect();
    this.socket.on('winner-declared', callback);
  }

  onDrawDeclared(callback) {
    this.connect();
    this.socket.on('draw-declared', callback);
  }

  onGameReset(callback) {
    this.connect();
    this.socket.on('game-reset', callback);
  }

  onScoresReset(callback) {
    this.connect();
    this.socket.on('scores-reset', callback);
  }

  onOpponentDisconnected(callback) {
    this.connect();
    this.socket.on('opponent-disconnected', callback);
  }

  onError(callback) {
    this.connect();
    this.socket.on('error', callback);
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export default new SocketService();
