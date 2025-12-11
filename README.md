# 🎮 Tic-Tac-Toe Ultimate

A modern, feature-rich Tic-Tac-Toe game built with **React**, **Socket.IO**, and **Tailwind CSS**. Play locally, challenge an AI, or compete with friends online in real-time multiplayer mode!

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Play_Now-success?style=for-the-badge)](https://tic-tac-toe-ultimate-five.vercel.app/)
![Tic-Tac-Toe](https://img.shields.io/badge/Game-Tic--Tac--Toe-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?style=for-the-badge&logo=socket.io)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.13-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 🌟 Unique Feature: The Game That Never Draws!

Unlike traditional Tic-Tac-Toe that often ends in a stalemate, this game implements a revolutionary **FIFO (First In, First Out)** system:

- 🎯 **Maximum 3 Pieces Per Player**: Each player can only have 3 pieces on the board at once
- ♻️ **Auto-Remove Oldest Move**: When you place your 4th piece, your oldest move is automatically removed
- ⚡ **Endless Strategic Gameplay**: Creates a dynamic, never-ending game where draws are virtually impossible!
- 🧠 **Enhanced Strategy**: Forces players to think ahead and plan their moves carefully

This unique mechanic transforms the classic game into an exciting, continuous battle of wits!

---

## ✨ Features

### 🎯 Three Game Modes
- **🏠 Local Mode**: Pass and play with a friend on the same device
- **🤖 AI Mode**: Challenge an intelligent AI opponent with strategic gameplay
- **🌐 Multiplayer Mode**: Play with friends online in real-time with WebSocket communication

### 🎨 Modern UI/UX
- **Stunning Gradient Design**: Beautiful dark theme with purple/pink gradients
- **Smooth Animations**: Slide-in modals, hover effects, and winning line animations
- **Responsive Layout**: Perfect on mobile, tablet, and desktop devices
- **Toast Notifications**: Real-time feedback for game events

### 🚀 Advanced Gameplay
- **Real-time Sync**: Instant board updates across all connected players
- **Win Detection**: Automatic winner detection with highlighted winning lines
- **Score Tracking**: Persistent scoring system for continuous play

### 🎭 Multiplayer Features
- **Easy Room Creation**: Generate shareable game links instantly
- **Waiting Room**: Beautiful modal showing game status while waiting for opponent
- **Copy/Share Link**: One-click link sharing to invite friends
- **Player Names**: Personalized experience with custom player names
- **Host Controls**: Only the host can reset the game and scores
- **Disconnect Handling**: Automatic cleanup and graceful redirect on player disconnect
- **Perspective-Based UI**: Each player sees themselves on the left side of the scoreboard

---

## 🛠️ Tech Stack

### Frontend
- **React** (v19.1.1) - UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** (v4.1.13) - Utility-first styling
- **Socket.IO Client** (v4.8.1) - Real-time communication
- **React Hot Toast** - Beautiful notifications
- **Lucide React** - Modern icon library

### Backend
- **Node.js** - Runtime environment
- **Express** (v5.2.1) - Web framework
- **Socket.IO** (v4.8.1) - WebSocket server
- **CORS** - Cross-origin resource sharing

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Clone the Repository
```bash
git clone https://github.com/yourusername/tic-tac-toe.git
cd tic-tac-toe
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (optional, default port is 5001)
echo "PORT=5001" > .env
echo "CLIENT_URL=http://localhost:5173" >> .env

# Start the backend server
npm run dev
```

The backend server will start at `http://localhost:5001`

### Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_SERVER_URL=http://localhost:5001" > .env
echo "VITE_CLIENT_URL=http://localhost:5173" >> .env

# Start the frontend development server
npm run dev
```

The frontend will start at `http://localhost:5173`

---

## 🎮 How to Play

### Local Mode
1. Click on **"Local"** mode
2. Players take turns clicking on the grid
3. First to get 3 in a row wins!

### AI Mode
1. Click on **"AI"** mode
2. You play as **X** (always go first)
3. The AI plays as **O** with strategic moves
4. Try to outsmart the computer!

### Multiplayer Mode
1. Click on **"Multiplayer"** mode
2. Enter your name
3. **As Host:**
   - Share the generated link with your friend
   - Wait for them to join
   - You play as **X** and have host controls
4. **As Guest:**
   - Open the shared link
   - Enter your name
   - You play as **O**
5. Play in real-time with live board updates!

### Game Controls
- **Play Again**: Reset the board for a new round (Host only in multiplayer)
- **Reset Scores**: Clear the score counter (Host only in multiplayer)

---

## 🌟 Unique Features

### FIFO Endless Mode
This game implements a unique **FIFO (First In, First Out)** system:
- Each player can have a maximum of **3 pieces** on the board
- When you place your **4th piece**, your **oldest piece** is automatically removed
- This creates an endless, strategic gameplay where draws are nearly impossible!

### Smart Multiplayer Sync
- Both players see the board update instantly
- Perspective-based UI: You always appear on the left side
- Winner announcements show actual player names, not just "X" or "O"
- Automatic room cleanup on disconnect

---

## 📁 Project Structure

```
tic-tac-toe/
├── backend/
│   ├── index.js           # Socket.IO server & game logic
│   ├── package.json
│   └── .env              # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── GameBoard.jsx
    │   │   ├── ScoreBoard.jsx
    │   │   ├── ModeSelector.jsx
    │   │   ├── NameInputModal.jsx
    │   │   └── MultiplayerModal.jsx
    │   ├── hooks/
    │   │   └── useGameLogic.js    # Core game logic
    │   ├── services/
    │   │   └── socket.js          # Socket service
    │   ├── utils/
    │   │   └── aiLogic.js         # AI opponent logic
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── .env                       # Environment variables
```

---

## 🔧 Environment Variables

### Backend (`.env`)
```env
PORT=5001
CLIENT_URL=http://localhost:5173
```

### Frontend (`.env`)
```env
VITE_SERVER_URL=http://localhost:5001
VITE_CLIENT_URL=http://localhost:5173
```

---



## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Made with ❤️ by Debug.Rohit

---

## 🙏 Acknowledgments

- Icons by [Lucide React](https://lucide.dev/)
- Inspired by the classic Tic-Tac-Toe game
- Built with modern web technologies

---

**Enjoy the game! 🎉**
