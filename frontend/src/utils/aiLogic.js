// AI Logic for FIFO Tic-Tac-Toe
const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
]

const checkWinningMove = (board, player, position) => {
  const testBoard = [...board]
  testBoard[position] = player
  
  return WIN_PATTERNS.some(pattern => {
    const [a, b, c] = pattern
    return testBoard[a] && testBoard[a] === testBoard[b] && testBoard[a] === testBoard[c]
  })
}

const getEmptyPositions = (board) => {
  return board.map((cell, index) => cell === null ? index : null)
             .filter(position => position !== null)
}

const findWinningMove = (board, player) => {
  const emptyPositions = getEmptyPositions(board)
  
  for (let position of emptyPositions) {
    if (checkWinningMove(board, player, position)) {
      return position
    }
  }
  return null
}

// Check if human has dangerous diagonal corner setup
const checkDiagonalThreat = (board, humanPlayer = 'X') => {
  // Main diagonal [0, 4, 8]
  const mainDiag = [0, 4, 8]
  const mainDiagHuman = mainDiag.filter(pos => board[pos] === humanPlayer)
  
  // Anti-diagonal [2, 4, 6] 
  const antiDiag = [2, 4, 6]
  const antiDiagHuman = antiDiag.filter(pos => board[pos] === humanPlayer)
  
  // Check if human has 2 corners on main diagonal (0,8 or 0,4,8 pattern)
  if ((board[0] === humanPlayer && board[8] === humanPlayer) ||
      (mainDiagHuman.length === 2 && mainDiagHuman.includes(0) && mainDiagHuman.includes(8))) {
    return { threat: true, type: 'main-diagonal', avoidCorners: [0, 8] }
  }
  
  // Check if human has 2 corners on anti-diagonal (2,6 or 2,4,6 pattern)
  if ((board[2] === humanPlayer && board[6] === humanPlayer) ||
      (antiDiagHuman.length === 2 && antiDiagHuman.includes(2) && antiDiagHuman.includes(6))) {
    return { threat: true, type: 'anti-diagonal', avoidCorners: [2, 6] }
  }
  
  return { threat: false }
}

// Check if move creates fork opportunity for human
const createsForkForHuman = (board, position, humanPlayer = 'X') => {
  const testBoard = [...board]
  testBoard[position] = 'O' // AI makes this move
  
  // Count how many ways human can win after this AI move
  const emptyAfterAI = getEmptyPositions(testBoard)
  let humanWinningMoves = 0
  
  for (let pos of emptyAfterAI) {
    if (checkWinningMove(testBoard, humanPlayer, pos)) {
      humanWinningMoves++
    }
  }
  
  // If human has 2+ ways to win, it's a fork
  return humanWinningMoves >= 2
}

const getStrategicMove = (board, humanPlayer = 'X') => {
  const emptyPositions = getEmptyPositions(board)
  
  // Check for diagonal threats first
  const diagThreat = checkDiagonalThreat(board, humanPlayer)
  
  if (diagThreat.threat) {
    // Avoid moves that create forks for human
    const safePositions = emptyPositions.filter(pos => 
      !createsForkForHuman(board, pos, humanPlayer)
    )
    
    if (safePositions.length > 0) {
      // Prefer center if safe
      if (safePositions.includes(4)) return 4
      
      // Prefer edges over dangerous corners
      const edges = [1, 3, 5, 7].filter(pos => safePositions.includes(pos))
      if (edges.length > 0) {
        return edges[Math.floor(Math.random() * edges.length)]
      }
      
      // Any safe position
      return safePositions[Math.floor(Math.random() * safePositions.length)]
    }
  }
  
  // Normal strategic play if no diagonal threat
  if (board[4] === null) return 4
  
  const corners = [0, 2, 6, 8].filter(pos => board[pos] === null)
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)]
  }
  
  return emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
}

export const calculateAIMove = (board, aiPlayer = 'O', humanPlayer = 'X', moveHistory = []) => {
  const emptyPositions = getEmptyPositions(board)
  
  if (emptyPositions.length === 0) return null
  
  // Priority 1: Try to win immediately
  const winningMove = findWinningMove(board, aiPlayer)
  if (winningMove !== null) return winningMove
  
  // Priority 2: Block opponent from winning
  const blockingMove = findWinningMove(board, humanPlayer)
  if (blockingMove !== null) return blockingMove
  
  // Priority 3: Enhanced strategic move (fork-aware)
  const strategicMove = getStrategicMove(board, humanPlayer)
  if (strategicMove !== null) return strategicMove
  
  // Priority 4: Fallback to any available position
  return emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
}

export const getAIMoveWithDelay = (board, aiPlayer = 'O', humanPlayer = 'X', delay = 400, moveHistory = []) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const move = calculateAIMove(board, aiPlayer, humanPlayer, moveHistory)
      resolve(move)
    }, delay)
  })
}

export const isAITurn = (gameMode, currentPlayer, aiPlayer = 'O') => {
  return gameMode === 'ai' && currentPlayer === aiPlayer
}

export default {
  calculateAIMove,
  getAIMoveWithDelay,
  isAITurn
}
