import React from 'react'

const MultiplayerInfo = ({ gameId, isHost }) => {
  const shareUrl = `${window.location.origin}${window.location.pathname}?game=${gameId}`
  
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    // Create a nice toast notification
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce-in'
    toast.textContent = '🔗 Link copied to clipboard!'
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.remove()
    }, 3000)
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 text-center border border-white/20">
      <div className="text-white font-bold mb-2">
        {isHost ? '🎮 Share this link with your friend:' : '🔗 Connected to game:'}
      </div>
      <div className="bg-black/20 rounded-lg p-3 mb-3 text-sm text-white/80 break-all font-mono border border-white/10">
        {shareUrl}
      </div>
      <button 
        onClick={copyLink}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                 text-white px-6 py-2 rounded-lg transition-all duration-300 
                 transform hover:scale-105 active:scale-95 shadow-lg font-bold"
      >
        📋 Copy Link
      </button>
      <div className="text-white/60 text-xs mt-2">
        {isHost ? 'Waiting for your friend to join...' : 'Ready to play!'}
      </div>
    </div>
  )
}

export default MultiplayerInfo