import React from 'react'

const GameBoard = ({ board, onCellClick, winningLine, isGameActive, winner }) => {
  return (
    <div className="grid grid-cols-3 gap-2 w-fit mx-auto">
      {board.map((cell, index) => (
        <button
          key={index}
          onClick={() => isGameActive && onCellClick(index)}
          disabled={!isGameActive || cell}
          className={`
            w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex items-center justify-center 
            text-3xl sm:text-4xl font-bold game-cell
            border-2 backdrop-blur-sm
            ${winningLine && winningLine.includes(index) 
              ? 'border-purple-400 bg-purple-400/20 shadow-lg shadow-purple-400/50' 
              : 'border-white/30 bg-white/10 hover:bg-white/20'
            }
            ${cell === 'X' ? 'text-blue-400' : cell === 'O' ? 'text-pink-400' : 'text-white/50'}
            ${!cell && isGameActive ? 'hover:scale-105 cursor-pointer' : ''}
            active:scale-95
          `}
        >
          <span className={`
            ${!isGameActive && winner && cell === winner 
              ? (cell === 'X' ? 'x-dancing' : 'o-dancing')
              : cell === 'X' ? 'x-animate' : cell === 'O' ? 'o-animate' : ''
            }
            ${cell ? 'opacity-100' : 'opacity-0'}
          `}>
            {cell}
          </span>
        </button>
      ))}
    </div>
  )
}

export default GameBoard