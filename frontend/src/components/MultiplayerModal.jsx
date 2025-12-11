import { X, Copy, Share2, Users, CheckCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

function MultiplayerModal({ isOpen, onClose, gameId, isWaiting, opponentName, playerName }) {
  if (!isOpen) return null;

  const gameLink = gameId ? `${window.location.origin}?game=${gameId}` : '';

  const copyToClipboard = () => {
    if (gameLink) {
      navigator.clipboard.writeText(gameLink);
      toast.success('Link copied to clipboard!', {
        icon: '📋',
        duration: 2000,
      });
    }
  };

  const shareGame = async () => {
    if (navigator.share && gameLink) {
      try {
        await navigator.share({
          title: 'Join my Tic-Tac-Toe game!',
          text: `Play Tic-Tac-Toe with me!`,
          url: gameLink,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          toast.error('Could not share link', {
            icon: '❌',
            duration: 2000,
          });
        }
      }
    } else {
      toast.error('Share not supported on this device', {
        icon: '❌',
        duration: 2000,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/10 relative animate-[slideUp_0.3s_ease-out]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <X size={24} />
        </button>

        {/* Status Indicator */}
        <div className="flex justify-center mb-6">
          <div className={`p-4 rounded-2xl border transition-all duration-300 ${
            isWaiting 
              ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/30 animate-pulse' 
              : 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/30'
          }`}>
            {isWaiting ? (
              <Loader size={40} className="text-purple-300 animate-spin" />
            ) : (
              <Users size={40} className="text-green-300" />
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
          {isWaiting ? 'Waiting for Opponent...' : 'Game Ready!'}
        </h2>
        
        {/* Waiting subtitle */}
        {isWaiting && (
          <p className="text-gray-400 text-center mb-6 text-sm animate-pulse">
            Looking for a worthy opponent...
          </p>
        )}

        {/* Player Info */}
        <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-3 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">You:</span>
            <span className="text-white font-semibold flex items-center gap-2">
              {playerName}
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-400/30">X</span>
            </span>
          </div>
          {opponentName ? (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Opponent:</span>
              <span className="text-white font-semibold flex items-center gap-2">
                {opponentName}
                <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 text-xs rounded-full border border-pink-400/30">O</span>
                <CheckCircle size={16} className="text-green-400" />
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Opponent:</span>
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-gray-500 italic text-sm">Waiting...</span>
              </div>
            </div>
          )}
        </div>

        {/* Game Link */}
        {gameId && (
          <div className="space-y-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-gray-400 text-xs mb-2 text-center">Game Link</p>
              <p className="text-white font-mono text-sm font-medium text-center tracking-wide break-all px-2">
                {gameLink}
              </p>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 text-white font-medium hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Copy size={18} />
                <span className="text-sm">Copy Link</span>
              </button>
              <button
                onClick={shareGame}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all duration-200 text-white font-medium shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Share2 size={18} />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        )}

        {/* Status Message */}
        <div className={`text-center p-3 rounded-xl ${
          isWaiting 
            ? 'bg-purple-500/10 border border-purple-400/20' 
            : 'bg-green-500/10 border border-green-400/20'
        }`}>
          <p className={`text-sm ${isWaiting ? 'text-purple-300' : 'text-green-300'}`}>
            {isWaiting 
              ? '📤 Share the link with a friend to start playing!' 
              : '✅ Both players connected. Game will start automatically!'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MultiplayerModal;
