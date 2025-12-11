import React, { useState, useEffect } from 'react'
import './App.css'
import GameBoard from './components/GameBoard'
import ModeSelector, { GAME_MODES } from './components/ModeSelector'
import ScoreBoard from './components/ScoreBoard'
import MultiplayerModal from './components/MultiplayerModal'
import NameInputModal from './components/NameInputModal'
import useGameLogic from './hooks/useGameLogic'
import { Toaster, toast } from 'react-hot-toast'
import socketService from './services/socket'

function App() {
  // Game mode and multiplayer state
  const [gameMode, setGameMode] = useState(GAME_MODES.LOCAL)
  const [gameId, setGameId] = useState(null)
  const [isHost, setIsHost] = useState(false)
  const [showMultiplayerModal, setShowMultiplayerModal] = useState(false)
  const [showNameInput, setShowNameInput] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [opponentName, setOpponentName] = useState('')
  const [isWaitingForOpponent, setIsWaitingForOpponent] = useState(true)

  // Multiplayer specific state
  const [mpBoard, setMpBoard] = useState(Array(9).fill(null))
  const [mpCurrentPlayer, setMpCurrentPlayer] = useState('X')
  const [mpScores, setMpScores] = useState({ X: 0, O: 0 })
  const [mpGameActive, setMpGameActive] = useState(false)
  const [mpWinner, setMpWinner] = useState(null)
  const [mpWinningLine, setMpWinningLine] = useState(null)
  const [mpIsDraw, setMpIsDraw] = useState(false)
  const [playerSymbol, setPlayerSymbol] = useState(null)

  // Game logic from custom hook
  const {
    board,
    currentPlayer,
    scores,
    gameActive,
    winner,
    winningLine,
    isDraw,
    handleCellClick,
    resetGame,
    resetScores,
    resetAllScores
  } = useGameLogic(gameMode)

  // Socket listeners
  useEffect(() => {
    socketService.onGameCreated((data) => {
      setGameId(data.gameId)
      setIsHost(true)
      setPlayerSymbol(data.playerSymbol)
      setPlayerName(data.playerName)
      setIsWaitingForOpponent(true)
      setShowMultiplayerModal(true)
      
      // Reset MP state
      setMpScores({ X: 0, O: 0 })
      setMpBoard(Array(9).fill(null))
      setMpWinner(null)
      setMpWinningLine(null)
      setMpIsDraw(false)
      setMpCurrentPlayer('X')
      
      window.history.pushState({}, '', `${window.location.pathname}?game=${data.gameId}`)
    })

    socketService.onGameJoined((data) => {
      setGameId(data.gameId)
      setIsHost(false)
      setPlayerSymbol(data.playerSymbol)
      setPlayerName(data.playerName)
      setOpponentName(data.opponentName)
      setIsWaitingForOpponent(false)
      setMpGameActive(true)
      setShowMultiplayerModal(false)
      
      // Reset MP state
      setMpScores({ X: 0, O: 0 })
      setMpBoard(Array(9).fill(null))
      setMpWinner(null)
      setMpWinningLine(null)
      setMpIsDraw(false)
      setMpCurrentPlayer('X')
      
      toast.success('Joined game successfully!')
    })

    socketService.onOpponentJoined((data) => {
      setOpponentName(data.opponentName)
      setIsWaitingForOpponent(false)
      setMpGameActive(true)
      setShowMultiplayerModal(false)
      toast.success(`${data.opponentName} joined! Game starting...`)
    })

    socketService.onMoveMade((data) => {
      setMpBoard(data.board)
      if (data.winner) {
        setMpWinner(data.winner)
        setMpWinningLine(data.winningLine)
        setMpScores(data.scores)
        setMpGameActive(false)
        toast.success(`${data.winnerName} wins!`)
      } else if (data.isDraw) {
        setMpIsDraw(true)
        setMpGameActive(false)
        toast('It\'s a draw!')
      } else {
        setMpCurrentPlayer(data.nextTurn)
      }
    })

    socketService.onGameReset(() => {
      setMpBoard(Array(9).fill(null))
      setMpWinner(null)
      setMpWinningLine(null)
      setMpIsDraw(false)
      setMpCurrentPlayer('X')
      setMpGameActive(true)
      toast('Game reset!')
    })

    socketService.onScoresReset(() => {
      setMpScores({ X: 0, O: 0 })
      toast('Scores reset!')
    })

    socketService.onOpponentDisconnected(() => {
      toast.error('Opponent disconnected. Redirecting to home...', { duration: 2000 })
      
      setTimeout(() => {
        setGameMode(GAME_MODES.LOCAL)
        setGameId(null)
        setIsHost(false)
        setShowMultiplayerModal(false)
        setShowNameInput(false)
        setPlayerName('')
        setOpponentName('')
        setPlayerSymbol(null)
        
        // Reset MP state
        setMpScores({ X: 0, O: 0 })
        setMpBoard(Array(9).fill(null))
        setMpWinner(null)
        setMpWinningLine(null)
        setMpIsDraw(false)
        setMpCurrentPlayer('X')
        setMpGameActive(false)
        
        setIsWaitingForOpponent(true)
        window.history.pushState({}, '', window.location.pathname)
        socketService.disconnect()
      }, 2000)
    })

    return () => {
      socketService.removeAllListeners()
    }
  }, [gameMode])

  // Handle mode change
  const handleModeChange = (mode) => {
    setGameMode(mode)
    resetGame()
    
    if (mode === GAME_MODES.MULTIPLAYER) {
      // Show name input modal first
      setShowNameInput(true)
    } else {
      setGameId(null)
      setIsHost(false)
      setShowMultiplayerModal(false)
      setShowNameInput(false)
      setPlayerName('')
      setOpponentName('')
      setPlayerSymbol(null)
      
      // Reset MP state
      setMpScores({ X: 0, O: 0 })
      setMpBoard(Array(9).fill(null))
      setMpWinner(null)
      setMpWinningLine(null)
      setMpIsDraw(false)
      setMpCurrentPlayer('X')
      setMpGameActive(false)
      
      setIsWaitingForOpponent(true)
      window.history.pushState({}, '', window.location.pathname)
      socketService.disconnect()
    }
  }

  // Handle name submission
  const handleNameSubmit = (name) => {
    setPlayerName(name)
    setShowNameInput(false)
    
    // Generate game ID for multiplayer
    const urlParams = new URLSearchParams(window.location.search)
    const existingGameId = urlParams.get('game')
    
    if (existingGameId) {
      socketService.joinGame(existingGameId, name)
    } else {
      socketService.createGame(name)
    }
  }

  // Handle multiplayer modal close
  const handleMultiplayerModalClose = () => {
    setShowMultiplayerModal(false)
    
    // If opponent hasn't joined, redirect to local mode
    if (isWaitingForOpponent) {
      setGameMode(GAME_MODES.LOCAL)
      setGameId(null)
      setIsHost(false)
      setPlayerName('')
      setOpponentName('')
      setIsWaitingForOpponent(true)
      window.history.pushState({}, '', window.location.pathname)
      toast('Switched to Local Mode', {
        icon: '🏠',
        duration: 2000,
      })
    }
  }

  // Handle name input modal close
  const handleNameInputClose = () => {
    setShowNameInput(false)
    setGameMode(GAME_MODES.LOCAL)
    window.history.pushState({}, '', window.location.pathname)
  }

  // Handle winner notifications
  useEffect(() => {
    if (gameMode !== GAME_MODES.MULTIPLAYER) {
      if (winner) {
        let message = gameMode == "local" ? `🎉 Player ${winner} wins!` : winner == "X" ? `You won 🎉`: "AI won!"
        toast.success(message, {
          duration: 3000,
          style: {
            background: 'rgba(16, 185, 129, 0.9)',
            color: '#ffffff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          },
        })
      } else if (isDraw) {
        toast('🤝 It\'s a draw!', {
          duration: 2500,
          style: {
            background: 'rgba(107, 114, 128, 0.9)',
            color: '#ffffff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(107, 114, 128, 0.2)',
          },
        })
      }
    }
  }, [winner, isDraw, gameMode])

  // Check for multiplayer game ID on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const gameIdFromUrl = urlParams.get('game')
    if (gameIdFromUrl) {
      setGameMode(GAME_MODES.MULTIPLAYER)
      setShowNameInput(true)
    }
  }, [])

  const handleMpCellClick = (index) => {
    if (!mpGameActive || mpBoard[index] || mpCurrentPlayer !== playerSymbol) return
    socketService.makeMove(gameId, index)
  }

  const handleMpReset = () => {
    if (!isHost) {
      toast.error("Only the host can reset the game!")
      return
    }
    socketService.resetGame(gameId)
  }

  const handleMpResetScores = () => {
    if (!isHost) {
      toast.error("Only the host can reset scores!")
      return
    }
    socketService.resetScores(gameId)
  }

  const activeBoard = gameMode === GAME_MODES.MULTIPLAYER ? mpBoard : board
  const activeCurrentPlayer = gameMode === GAME_MODES.MULTIPLAYER ? mpCurrentPlayer : currentPlayer
  const activeScores = gameMode === GAME_MODES.MULTIPLAYER ? mpScores : scores
  const activeGameActive = gameMode === GAME_MODES.MULTIPLAYER ? mpGameActive : gameActive
  const activeWinner = gameMode === GAME_MODES.MULTIPLAYER ? mpWinner : winner
  const activeWinningLine = gameMode === GAME_MODES.MULTIPLAYER ? mpWinningLine : winningLine
  const activeHandleCellClick = gameMode === GAME_MODES.MULTIPLAYER ? handleMpCellClick : handleCellClick
  const activeResetGame = gameMode === GAME_MODES.MULTIPLAYER ? handleMpReset : resetGame

  // Determine Left and Right players for ScoreBoard
  let leftPlayer = { name: "Player 1", symbol: "X", score: activeScores.X }
  let rightPlayer = { name: "Player 2", symbol: "O", score: activeScores.O }

  if (gameMode === GAME_MODES.AI) {
    leftPlayer = { name: "You", symbol: "X", score: activeScores.X }
    rightPlayer = { name: "AI", symbol: "O", score: activeScores.O }
  } else if (gameMode === GAME_MODES.MULTIPLAYER) {
    if (playerSymbol === 'X') {
      // I am X (Host) -> Left is Me (X), Right is Opponent (O)
      leftPlayer = { name: playerName || 'You', symbol: 'X', score: activeScores.X }
      rightPlayer = { name: opponentName || 'Opponent', symbol: 'O', score: activeScores.O }
    } else {
      // I am O (Joiner) -> Left is Me (O), Right is Opponent (X)
      leftPlayer = { name: playerName || 'You', symbol: 'O', score: activeScores.O }
      rightPlayer = { name: opponentName || 'Opponent', symbol: 'X', score: activeScores.X }
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      {/* Toast Container */}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(120, 119, 198, 0.3)',
          },
        }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center  md:mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            Tic Tac Toe
          </h1>
          <p className="text-gray-300">Choose your game mode and start playing!</p>
        </div>

        {/* Game Container */}
        <div className=" backdrop-blur-md rounded-2xl p-6 shadow-2xl">
        {/* <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl"> */}
          {/* Mode Selector */}
          <ModeSelector currentMode={gameMode} onModeChange={handleModeChange} />

          {/* Score Board */}
          <ScoreBoard 
            leftPlayer={leftPlayer}
            rightPlayer={rightPlayer}
            currentPlayer={activeCurrentPlayer}
          />

          {/* Game Board */}
          <div className="flex justify-center mb-6">
            <GameBoard 
              board={activeBoard} 
              onCellClick={activeHandleCellClick} 
              winningLine={activeWinningLine}
              isGameActive={activeGameActive}
              winner={activeWinner}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={activeResetGame}
              disabled={gameMode === GAME_MODES.MULTIPLAYER && !isHost}
              className={`bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-6 
                       rounded-lg border border-white/30 backdrop-blur-sm transition-all duration-200 
                       hover:scale-105 active:scale-95 cursor-pointer ${gameMode === GAME_MODES.MULTIPLAYER && !isHost ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:bg-white/20' : ''}`}
            >
              Play Again
            </button>
            <button
              onClick={gameMode === GAME_MODES.MULTIPLAYER ? handleMpResetScores : resetScores}
              disabled={gameMode === GAME_MODES.MULTIPLAYER && !isHost}
              className={`bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 
                      rounded-lg border border-white/20 backdrop-blur-sm transition-all duration-200 
                      hover:scale-105 active:scale-95 cursor-pointer ${gameMode === GAME_MODES.MULTIPLAYER && !isHost ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:bg-white/10' : ''}`}
            >
              Reset Scores
            </button>
            
            
          </div>
        </div>

        {/* Game Mode Info */}
        <div className="text-center md:mt-13 md:text-xl text-gray-400 text-sm">
          {gameMode === GAME_MODES.LOCAL && "Local Mode - Pass device to your friend"}
          {gameMode === GAME_MODES.AI && "AI Mode - Play with computer!"}
          {gameMode === GAME_MODES.MULTIPLAYER && "Multiplayer mode - Share the link to play with friends!"}
        </div>
      </div>

      {/* Name Input Modal */}
      <NameInputModal
        isOpen={showNameInput}
        onClose={handleNameInputClose}
        onSubmit={handleNameSubmit}
      />

      {/* Multiplayer Modal */}
      {showMultiplayerModal && gameId && (
        <MultiplayerModal
          isOpen={showMultiplayerModal}
          gameId={gameId}
          isHost={isHost}
          isWaiting={isWaitingForOpponent}
          playerName={playerName}
          opponentName={opponentName}
          onClose={handleMultiplayerModalClose}
        />
      )}
    </div>
  )
}

export default App
