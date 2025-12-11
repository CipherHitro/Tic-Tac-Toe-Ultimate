import { useState, useEffect, useCallback } from 'react'
import { getAIMoveWithDelay, isAITurn } from '../utils/aiLogic'

const useGameLogic = (gameMode = 'local') => {
  // Game state
  const [board, setBoard] = useState(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState('X')
  
  // Separate scores for each game mode
  const [localScores, setLocalScores] = useState({ X: 0, O: 0 })
  const [aiScores, setAiScores] = useState({ X: 0, O: 0 })
  const [multiplayerScores, setMultiplayerScores] = useState({ X: 0, O: 0 })
  
  const [gameActive, setGameActive] = useState(true)
  const [winner, setWinner] = useState(null)
  const [winningLine, setWinningLine] = useState(null)
  const [isDraw, setIsDraw] = useState(false)
  
  // FIFO tracking for endless mode
  const [moveHistory, setMoveHistory] = useState([]) // Array of {index, player, timestamp}
  const [removalTimer, setRemovalTimer] = useState(null)

  // Helper function to get current scores based on game mode
  const getCurrentScores = () => {
    switch (gameMode) {
      case 'local':
        return localScores
      case 'ai':
        return aiScores
      case 'multiplayer':
        return multiplayerScores
      default:
        return localScores
    }
  }

  // Helper function to update scores based on game mode
  const updateCurrentScores = (winner) => {
    switch (gameMode) {
      case 'local':
        setLocalScores(prev => ({ ...prev, [winner]: prev[winner] + 1 }))
        break
      case 'ai':
        setAiScores(prev => ({ ...prev, [winner]: prev[winner] + 1 }))
        break
      case 'multiplayer':
        setMultiplayerScores(prev => ({ ...prev, [winner]: prev[winner] + 1 }))
        break
    }
  }

  // Win patterns
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ]

  // Check for winner
  const checkWinner = (currentBoard) => {
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: pattern }
      }
    }
    return null
  }

  // FIFO removal logic - more controlled with safety checks
  const removeOldestMove = useCallback(() => {
    setMoveHistory(prevHistory => {
      // Safety checks
      if (prevHistory.length === 0) return prevHistory
      if (winner) return prevHistory // Don't remove if game is over
      
      const oldestMove = prevHistory[0]
      
      // Update board by removing the oldest move
      setBoard(prevBoard => {
        // Double-check that the position actually has a piece before removing
        if (prevBoard[oldestMove.index] === null) return prevBoard
        
        const newBoard = [...prevBoard]
        newBoard[oldestMove.index] = null
        console.log(`⚡ FIFO: Removed ${oldestMove.player} from position ${oldestMove.index} (1s interval)`)
        return newBoard
      })
      
      // Remove the oldest move from history
      return prevHistory.slice(1)
    })
  }, [winner])

  // Start removal timer when board has enough moves
  const startRemovalTimer = useCallback(() => {
    if (removalTimer) return // Timer already running
    
    const timer = setInterval(() => {
      removeOldestMove()
    }, 1000) // Remove oldest move every 1.5 seconds for balanced gameplay
    
    setRemovalTimer(timer)
  }, [removeOldestMove, removalTimer])

  // Stop removal timer
  const stopRemovalTimer = useCallback(() => {
    if (removalTimer) {
      clearInterval(removalTimer)
      setRemovalTimer(null)
    }
  }, [removalTimer])

  // Check if we should start/stop removal
  useEffect(() => {
    const filledCells = board.filter(cell => cell !== null).length
    
    // Start removal when 6+ boxes are filled, have moves in history, and no winner
    if (filledCells >= 6 && moveHistory.length > 0 && !winner && gameActive) {
      startRemovalTimer()
    } else {
      stopRemovalTimer()
    }
  }, [board, moveHistory.length, winner, gameActive, startRemovalTimer, stopRemovalTimer])

  // Handle cell click with FIFO tracking
  const handleCellClick = (index) => {
    if (!gameActive || board[index] || winner) return
    
    // In AI mode, only allow human (X) to click
    if (gameMode === 'ai' && currentPlayer === 'O') return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    // Add move to history for FIFO tracking
    const newMove = {
      index,
      player: currentPlayer,
      timestamp: Date.now()
    }
    setMoveHistory(prev => [...prev, newMove])

    const result = checkWinner(newBoard)
    if (result) {
      setWinner(result.winner)
      setWinningLine(result.line)
      setGameActive(false)
      updateCurrentScores(result.winner)
      stopRemovalTimer()
    } else {
      // No draw condition - game continues until someone wins!
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
    }
  }

  // Make AI move with FIFO tracking
  const makeAIMove = useCallback(async () => {
    if (!gameActive || winner) return
    
    try {
      const aiMove = await getAIMoveWithDelay(board, 'O', 'X', 400, moveHistory) // Faster AI with FIFO awareness
      
      if (aiMove !== null && !board[aiMove]) {
        const newBoard = [...board]
        newBoard[aiMove] = 'O'
        setBoard(newBoard)

        // Add AI move to history for FIFO tracking
        const newMove = {
          index: aiMove,
          player: 'O',
          timestamp: Date.now()
        }
        setMoveHistory(prev => [...prev, newMove])

        const result = checkWinner(newBoard)
        if (result) {
          setWinner(result.winner)
          setWinningLine(result.line)
          setGameActive(false)
          updateCurrentScores(result.winner)
          stopRemovalTimer()
        } else {
          // No draw condition - game continues until someone wins!
          setCurrentPlayer('X')
        }
      }
    } catch (error) {
      console.error('AI move error:', error)
    }
  }, [board, gameActive, winner, stopRemovalTimer])

  // AI turn effect
  useEffect(() => {
    if (isAITurn(gameMode, currentPlayer, 'O') && gameActive && !winner && !isDraw) {
      makeAIMove()
    }
  }, [gameMode, currentPlayer, gameActive, winner, isDraw, makeAIMove])

  // Reset game (board only)
  const resetGame = () => {
    stopRemovalTimer()
    setBoard(Array(9).fill(null))
    setCurrentPlayer('X')
    setGameActive(true)
    setWinner(null)
    setWinningLine(null)
    setIsDraw(false)
    setMoveHistory([])
  }

  // Reset current mode scores and game
  const resetScores = () => {
    switch (gameMode) {
      case 'local':
        setLocalScores({ X: 0, O: 0 })
        break
      case 'ai':
        setAiScores({ X: 0, O: 0 })
        break
      case 'multiplayer':
        setMultiplayerScores({ X: 0, O: 0 })
        break
    }
    resetGame()
  }

  // Reset all scores for all modes
  const resetAllScores = () => {
    setLocalScores({ X: 0, O: 0 })
    setAiScores({ X: 0, O: 0 })
    setMultiplayerScores({ X: 0, O: 0 })
    resetGame()
  }

  return {
    board,
    currentPlayer,
    scores: getCurrentScores(),
    gameActive,
    winner,
    winningLine,
    isDraw,
    handleCellClick,
    resetGame,
    resetScores,
    resetAllScores
  }
}

export default useGameLogic