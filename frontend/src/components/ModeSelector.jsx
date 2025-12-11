import React from 'react'

const GAME_MODES = {
  LOCAL: 'local',
  AI: 'ai', 
  MULTIPLAYER: 'multiplayer'
}

const ModeSelector = ({ currentMode, onModeChange }) => {
  const modes = [
    { key: GAME_MODES.LOCAL, label: 'Local' },
    { key: GAME_MODES.AI, label: 'vs AI' },
    { key: GAME_MODES.MULTIPLAYER, label: 'Online' }
  ]

  return (
    <div className="flex justify-center mb-4 md:mb-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
        {modes.map((mode) => (
          <button
            key={mode.key}
            onClick={() => onModeChange(mode.key)}
            className={`
              px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 cursor-pointer
              ${currentMode === mode.key 
                ? 'bg-white text-gray-900 shadow-lg' 
                : 'text-white hover:bg-white/10'
              }
            `}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export { GAME_MODES }
export default ModeSelector