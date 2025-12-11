import React, { useState } from 'react';
import { User, X } from 'lucide-react';

function NameInputModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
        
      onSubmit(name.trim());
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

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30">
            <User size={40} className="text-purple-300" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
          Enter Your Name
        </h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          We'll use this to identify you in the game
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name..."
              autoFocus
              maxLength={20}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
              name.trim()
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </form>

        <p className="text-gray-500 text-xs text-center mt-4">
          Press Enter to continue
        </p>
      </div>
    </div>
  );
}

export default NameInputModal;
