import React from 'react'

const ScoreBoard = ({ leftPlayer, rightPlayer, currentPlayer }) => {
  return (
    <div className="flex items-center justify-center gap-6 mb-6">
      {/* Left Player (Me/Player 1) */}
      <div className="text-center">
        <div className={`text-2xl font-bold mb-1 transition-colors ${
          currentPlayer === leftPlayer.symbol ? (leftPlayer.symbol === 'X' ? 'text-blue-400' : 'text-pink-400') : 'text-white/50'
        }`}>
          {leftPlayer.symbol}
        </div>
        <div className="text-white text-lg font-semibold">{leftPlayer.score}</div>
        <div className="text-white/60 text-xs">{leftPlayer.name}</div>
      </div>
      
      {/* Current Turn Indicator */}
      <div className="text-center">
        <div className="text-white/60 text-xs mb-2">Turn</div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 ${
          currentPlayer === 'X' ? 'bg-blue-400 shadow-lg shadow-blue-400/50' : 'bg-pink-400 shadow-lg shadow-pink-400/50'
        }`}>
          {currentPlayer}
        </div>
      </div>
      
      {/* Right Player (Opponent/Player 2) */}
      <div className="text-center">
        <div className={`text-2xl font-bold mb-1 transition-colors ${
          currentPlayer === rightPlayer.symbol ? (rightPlayer.symbol === 'X' ? 'text-blue-400' : 'text-pink-400') : 'text-white/50'
        }`}>
          {rightPlayer.symbol}
        </div>
        <div className="text-white text-lg font-semibold">{rightPlayer.score}</div>
        <div className="text-white/60 text-xs">{rightPlayer.name}</div>
      </div>
    </div>
  )
}

export default ScoreBoard