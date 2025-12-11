import React from 'react'

const GameStatus = ({ winner, isDraw, gameMode }) => {
  if (winner) {
    return (
      <div className="text-center mb-6 animate-bounce-in">
        <div className="text-5xl mb-4 animate-bounce">🎉</div>
        <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 
                       bg-clip-text text-transparent text-3xl sm:text-4xl font-bold mb-2 animate-gradient">
          WINNER!
        </div>
        <div className="text-xl sm:text-2xl font-bold text-white">
          Player <span className={`${winner === 'X' ? 'text-blue-400' : 'text-pink-400'} text-3xl`}>{winner}</span> Wins!
        </div>
        <div className="mt-4 flex justify-center space-x-2">
          <span className="text-2xl animate-bounce" style={{animationDelay: '0.1s'}}>🌟</span>
          <span className="text-2xl animate-bounce" style={{animationDelay: '0.2s'}}>✨</span>
          <span className="text-2xl animate-bounce" style={{animationDelay: '0.3s'}}>🎊</span>
          <span className="text-2xl animate-bounce" style={{animationDelay: '0.4s'}}>✨</span>
          <span className="text-2xl animate-bounce" style={{animationDelay: '0.5s'}}>🌟</span>
        </div>
      </div>
    )
  }
  
  if (isDraw) {
    return (
      <div className="text-center mb-6 animate-bounce-in">
        <div className="text-4xl mb-2 animate-pulse">🤝</div>
        <div className="text-2xl font-bold text-white mb-2">It's a Draw!</div>
        <div className="text-white/80">Great game! Try again!</div>
      </div>
    )
  }

  return null
}

export default GameStatus