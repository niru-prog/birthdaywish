import React, { useState, useEffect } from 'react';
import { WishNote, ThemeColor } from '../types';
import { loadWishesFromStorage, saveWishesToStorage } from '../utils/storage';
import { fireConfetti } from '../utils/confetti';
import { THEMES } from '../utils/themes';
import { Pin, Send, Trash2, Heart, MessageSquareHeart } from 'lucide-react';

interface WishesWallProps {
  friendName: string;
  themeColor: ThemeColor;
}

type NoteColor = WishNote['color'];

const NOTE_STYLES: Record<NoteColor, { bg: string; border: string; text: string; pin: string }> = {
  yellow: {
    bg: 'bg-amber-100',
    border: 'border-amber-200',
    text: 'text-amber-950',
    pin: '#f59e0b',
  },
  pink: {
    bg: 'bg-rose-100',
    border: 'border-rose-200',
    text: 'text-rose-950',
    pin: '#f43f5e',
  },
  purple: {
    bg: 'bg-purple-100',
    border: 'border-purple-200',
    text: 'text-purple-950',
    pin: '#a855f7',
  },
  green: {
    bg: 'bg-emerald-100',
    border: 'border-emerald-200',
    text: 'text-emerald-950',
    pin: '#10b981',
  },
  blue: {
    bg: 'bg-sky-100',
    border: 'border-sky-200',
    text: 'text-sky-950',
    pin: '#3b82f6',
  },
};

export function WishesWall({ friendName, themeColor }: WishesWallProps) {
  const theme = THEMES[themeColor] || THEMES.pink;

  const [wishes, setWishes] = useState<WishNote[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState<NoteColor>('yellow');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loaded = loadWishesFromStorage();
    setWishes(loaded);
  }, []);

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    setIsSubmitting(true);

    const randomRotation = Number((Math.random() * 6 - 3).toFixed(1)); // -3 to 3 deg
    const newNote: WishNote = {
      id: `wish-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      author: author.trim(),
      content: content.trim(),
      color: selectedColor,
      rotation: randomRotation,
      createdAt: 'Just now',
    };

    const updated = [newNote, ...wishes];
    setWishes(updated);
    saveWishesToStorage(updated);

    // Celebration burst
    fireConfetti({ particleCount: 40, spread: 60 });

    // Reset form
    setContent('');
    setIsSubmitting(false);
  };

  const handleDeleteWish = (id: string) => {
    const updated = wishes.filter((w) => w.id !== id);
    setWishes(updated);
    saveWishesToStorage(updated);
  };

  const availableColors: NoteColor[] = ['yellow', 'pink', 'purple', 'green', 'blue'];

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-2">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-2">
          <MessageSquareHeart className="w-3.5 h-3.5" />
          <span>Community Guestbook</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Wishes & Love Wall 💌
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Leave a sweet note for {friendName}! It will be pinned on the wall.
        </p>
      </div>

      {/* Write a Wish Form Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200/80 mb-10 max-w-xl mx-auto">
        <form onSubmit={handleAddWish} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Leo, Grandma, Maya"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Note Color
              </label>
              <div className="flex items-center gap-2 pt-1.5">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      selectedColor === color
                        ? 'border-slate-800 scale-110 shadow-sm'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{
                      backgroundColor:
                        color === 'yellow'
                          ? '#fef08a'
                          : color === 'pink'
                          ? '#fbcfe8'
                          : color === 'purple'
                          ? '#e9d5ff'
                          : color === 'green'
                          ? '#a7f3d0'
                          : '#bae6fd',
                    }}
                    title={`${color} note`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Your Birthday Wish
            </label>
            <textarea
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Write your warmest wish for ${friendName}...`}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-slate-50 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Pin Note to Wall</span>
          </button>
        </form>
      </div>

      {/* The Sticky Notes Board */}
      <div className="p-4 sm:p-8 rounded-3xl bg-amber-50/70 border border-amber-200/60 shadow-inner min-h-[300px]">
        {wishes.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Pin className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No wishes pinned yet. Be the first to leave one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {wishes.map((wish) => {
              const style = NOTE_STYLES[wish.color] || NOTE_STYLES.yellow;
              return (
                <div
                  key={wish.id}
                  className={`relative p-5 rounded-sm shadow-md transition-all duration-200 hover:scale-105 hover:shadow-xl hover:z-20 group border ${style.bg} ${style.border} ${style.text}`}
                  style={{
                    transform: `rotate(${wish.rotation}deg)`,
                  }}
                >
                  {/* Push Pin SVG */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none drop-shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="7" fill={style.pin} />
                      <circle cx="8" cy="8" r="2.5" fill="#ffffff" opacity="0.6" />
                      <line x1="10" y1="17" x2="10" y2="20" stroke="#64748b" strokeWidth="2" />
                    </svg>
                  </div>

                  {/* Wish Text */}
                  <p className="font-handwriting text-xl sm:text-2xl leading-snug mt-1 pt-1 break-words">
                    "{wish.content}"
                  </p>

                  {/* Footer with Author and Delete Button */}
                  <div className="mt-4 pt-2 border-t border-black/10 flex items-center justify-between text-xs font-medium opacity-80">
                    <span className="font-bold truncate max-w-[150px]">
                      — {wish.author}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] opacity-60">{wish.createdAt}</span>
                      <button
                        onClick={() => handleDeleteWish(wish.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 rounded transition"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
