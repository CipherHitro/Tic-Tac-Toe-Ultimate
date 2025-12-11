const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5001;
const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity in dev, or restrict to process.env.CLIENT_URL
    methods: ["GET", "POST"]
  }
});

// Store active games
const games = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create a new game
  socket.on('create-game', (playerName) => {
    const gameId = Math.random().toString(36).substring(2, 8);
    const game = {
      id: gameId,
      players: [
        { id: socket.id, name: playerName, symbol: 'X' }
      ],
      board: Array(9).fill(null),
      currentPlayer: 'X',
      scores: { X: 0, O: 0 },
      moves: [] // For FIFO logic if needed
    };

    games.set(gameId, game);
    socket.join(gameId);

    socket.emit('game-created', {
      gameId,
      isHost: true,
      playerSymbol: 'X',
      playerName
    });
    
    console.log(`Game created: ${gameId} by ${playerName}`);
  });

  // Join an existing game
  socket.on('join-game', ({ gameId, playerName }) => {
    const game = games.get(gameId);

    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    if (game.players.length >= 2) {
      socket.emit('error', { message: 'Game is full' });
      return;
    }

    const newPlayer = { id: socket.id, name: playerName, symbol: 'O' };
    game.players.push(newPlayer);
    socket.join(gameId);

    // Notify the joining player
    socket.emit('game-joined', {
      gameId,
      isHost: false,
      playerSymbol: 'O',
      playerName,
      opponentName: game.players[0].name
    });

    // Notify the host
    io.to(game.players[0].id).emit('opponent-joined', {
      opponentName: playerName
    });

    console.log(`Player ${playerName} joined game ${gameId}`);
  });

  // Handle moves
  socket.on('make-move', ({ gameId, index }) => {
    const game = games.get(gameId);
    if (!game) return;

    // Update board
    const player = game.players.find(p => p.id === socket.id);
    if (!player) return;

    if (game.board[index] === null && game.currentPlayer === player.symbol) {
      
      // FIFO Logic: If player has 3 moves, remove the oldest one
      const playerMoves = game.moves.filter(m => m.symbol === player.symbol);
      if (playerMoves.length >= 3) {
        const oldestMove = playerMoves[0];
        game.board[oldestMove.index] = null;
        // Remove from moves array
        const moveIndex = game.moves.indexOf(oldestMove);
        if (moveIndex > -1) {
          game.moves.splice(moveIndex, 1);
        }
      }

      game.board[index] = player.symbol;
      game.moves.push({ index, symbol: player.symbol });
      
      // Check for win
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
      ];

      let winner = null;
      let winningLine = null;

      for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (game.board[a] && game.board[a] === game.board[b] && game.board[a] === game.board[c]) {
          winner = game.board[a];
          winningLine = pattern;
          break;
        }
      }

      if (winner) {
        game.scores[winner]++;
        const winnerPlayer = game.players.find(p => p.symbol === winner);
        io.to(gameId).emit('move-made', {
          index,
          symbol: player.symbol,
          nextTurn: null, // Game over
          board: game.board,
          winner,
          winnerName: winnerPlayer ? winnerPlayer.name : 'Unknown',
          winningLine,
          scores: game.scores
        });
      } else if (game.board.every(cell => cell !== null)) {
        // Draw
        io.to(gameId).emit('move-made', {
          index,
          symbol: player.symbol,
          nextTurn: null,
          board: game.board,
          isDraw: true
        });
      } else {
        // Switch turn
        game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
        io.to(gameId).emit('move-made', {
          index,
          symbol: player.symbol,
          nextTurn: game.currentPlayer,
          board: game.board
        });
      }
    }
  });

  // Handle FIFO removal (if implemented on frontend, backend should sync)
  socket.on('remove-oldest', ({ gameId }) => {
    const game = games.get(gameId);
    if (!game) return;
    
    // Logic to remove oldest move if needed, or just broadcast
    // For now, we assume frontend drives this or we just broadcast
    io.to(gameId).emit('oldest-removed');
  });

  // Handle game reset
  socket.on('reset-game', ({ gameId }) => {
    const game = games.get(gameId);
    if (game) {
      // Only host can reset
      if (game.players[0].id !== socket.id) return;

      game.board = Array(9).fill(null);
      game.moves = [];
      game.currentPlayer = 'X';
      io.to(gameId).emit('game-reset');
    }
  });

  // Handle scores reset
  socket.on('reset-scores', ({ gameId }) => {
    const game = games.get(gameId);
    if (game) {
      // Only host can reset
      if (game.players[0].id !== socket.id) return;

      game.scores = { X: 0, O: 0 };
      io.to(gameId).emit('scores-reset');
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Find games where this user is a player
    for (const [gameId, game] of games.entries()) {
      const playerIndex = game.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        // Notify other player
        socket.to(gameId).emit('opponent-disconnected');
        games.delete(gameId); // Clean up game
        break;
      }
    }
  });
});

server.listen(port, () => {
  console.log('Server is running at http://localhost:' + port);
});
