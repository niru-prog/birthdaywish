import React, { useState, useEffect } from 'react';
import { THEMES } from '../utils/themes';
import { ThemeColor } from '../types';
import { RotateCcw, Heart, Sparkles, Feather } from 'lucide-react';

interface PersonalMessageCardProps {
  message: string;
  senderName?: string;
  recipientName: string;
  themeColor: ThemeColor;
}

export function PersonalMessageCard({
  message,
  senderName,
  recipientName,
  themeColor,
}: PersonalMessageCardProps) {
  const theme = THEMES[themeColor] || THEMES.pink;

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const speed = message.length > 200 ? 18 : 28; // Adaptive typing speed
    const timer = setInterval(() => {
      index++;
      if (index <= message.length) {
        setDisplayedText(message.slice(0, index));
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [message]);

  const handleReplay = () => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const speed = message.length > 200 ? 18 : 28;
    const timer = setInterval(() => {
      index++;
      if (index <= message.length) {
        setDisplayedText(message.slice(0, index));
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);
  };

  const handleShowAll = () => {
    setDisplayedText(message);
    setIsTyping(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8 relative">
      {/* Decorative Washi Tape at Top */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-7 bg-amber-200/80 backdrop-blur-xs shadow-xs -rotate-1 rounded-sm border-t border-b border-white/50 z-20 pointer-events-none" />

      {/* Parchment / Letter Card */}
      <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-100/80 relative overflow-hidden">
        {/* Subtle lined paper texture background */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#000_1px,transparent_1px)] [background-size:100%_32px] pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-amber-100/60 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                A Letter For You
              </span>
              <p className="text-sm font-semibold text-slate-800">
                Dearest {recipientName},
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isTyping ? (
              <button
                onClick={handleShowAll}
                className="text-xs text-slate-400 hover:text-slate-600 transition underline underline-offset-2"
              >
                Skip animation
              </button>
            ) : (
              <button
                onClick={handleReplay}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay</span>
              </button>
            )}
          </div>
        </div>

        {/* Handwritten Message with Typewriter */}
        <div className="min-h-[140px] sm:min-h-[160px] flex flex-col justify-between">
          <div className="font-handwriting text-2xl sm:text-3xl text-slate-800 leading-relaxed sm:leading-loose tracking-wide">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-1.5 h-6 bg-rose-500 ml-1 animate-pulse align-middle" />
            )}
          </div>

          {/* Signature & Heart */}
          <div className="mt-8 pt-4 border-t border-amber-100/60 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-rose-500 font-medium">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>Written from the heart</span>
            </div>

            <div className="text-right">
              <p className="font-handwriting text-2xl sm:text-3xl font-bold text-slate-900">
                {senderName ? `— ${senderName}` : '— Forever your friend'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
