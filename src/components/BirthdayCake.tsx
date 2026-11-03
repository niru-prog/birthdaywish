import React, { useState, useEffect } from 'react';
import { playBlowSound, playCelebrationChime } from '../utils/audio';
import { fireCelebrationCannons, fireStars } from '../utils/confetti';
import { THEMES } from '../utils/themes';
import { ThemeColor } from '../types';
import { Flame, Sparkles, Wind, RotateCcw, Heart } from 'lucide-react';

interface BirthdayCakeProps {
  age: number;
  name: string;
  themeColor: ThemeColor;
}

export function BirthdayCake({ age, name, themeColor }: BirthdayCakeProps) {
  const theme = THEMES[themeColor] || THEMES.pink;

  // Max 20 candles rendered
  const candleCount = Math.min(Math.max(1, age), 20);

  // Array of candle lit states: true = lit, false = extinguished
  const [candles, setCandles] = useState<boolean[]>(() =>
    Array(candleCount).fill(true)
  );
  const [isWishMode, setIsWishMode] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [smokeStates, setSmokeStates] = useState<boolean[]>(() =>
    Array(candleCount).fill(false)
  );

  // Reset candles if candleCount changes
  useEffect(() => {
    setCandles(Array(candleCount).fill(true));
    setSmokeStates(Array(candleCount).fill(false));
    setShowCelebration(false);
  }, [candleCount]);

  const activeCandlesCount = candles.filter(Boolean).length;
  const allBlownOut = activeCandlesCount === 0;

  // Extinguish single candle
  const blowCandle = (index: number) => {
    if (!candles[index]) return;

    playBlowSound();

    // Trigger smoke puff
    setSmokeStates((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });

    setTimeout(() => {
      setSmokeStates((prev) => {
        const copy = [...prev];
        copy[index] = false;
        return copy;
      });
    }, 1200);

    const updated = [...candles];
    updated[index] = false;
    setCandles(updated);

    // Check if this was the last candle
    if (updated.filter(Boolean).length === 0) {
      setTimeout(() => {
        playCelebrationChime();
        fireCelebrationCannons();
        fireStars();
        setShowCelebration(true);
      }, 300);
    }
  };

  // Blow all candles at once
  const blowAllCandles = () => {
    playBlowSound();
    setSmokeStates(Array(candleCount).fill(true));
    setTimeout(() => {
      setSmokeStates(Array(candleCount).fill(false));
    }, 1200);

    setCandles(Array(candleCount).fill(false));

    setTimeout(() => {
      playCelebrationChime();
      fireCelebrationCannons();
      fireStars();
      setShowCelebration(true);
    }, 350);
  };

  // Relight all candles
  const relightCandles = () => {
    setCandles(Array(candleCount).fill(true));
    setShowCelebration(false);
    setIsWishMode(false);
    fireStars();
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Interactive Controls & Instructions */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2">
          <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span>Interactive Cake • {candleCount} {candleCount === 1 ? 'Candle' : 'Candles'}</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Blow Out Your Candles! 🎂
        </h3>

        {!isWishMode && !allBlownOut && (
          <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
            Click "Make a Wish" to start your birthday wish ritual.
          </p>
        )}

        {isWishMode && !allBlownOut && (
          <p className="text-sm font-medium text-rose-600 mt-1 animate-pulse">
            ✨ Make a secret wish in your heart, then tap each candle to blow it out! ({activeCandlesCount} left)
          </p>
        )}

        {allBlownOut && (
          <p className="text-sm font-semibold text-emerald-600 mt-1 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            All candles blown! Your wish is on its way to the stars!
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8 z-10">
        {!isWishMode && !allBlownOut && (
          <button
            onClick={() => setIsWishMode(true)}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-sm shadow-md shadow-amber-200 hover:shadow-lg transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Make a Wish</span>
          </button>
        )}

        {isWishMode && !allBlownOut && (
          <button
            onClick={blowAllCandles}
            className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <Wind className="w-3.5 h-3.5 text-sky-500" />
            <span>Blow All at Once</span>
          </button>
        )}

        {allBlownOut && (
          <button
            onClick={relightCandles}
            className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Light Candles Again</span>
          </button>
        )}
      </div>

      {/* Illustrated Cake Stage */}
      <div className="relative w-full max-w-[380px] sm:max-w-[440px] flex flex-col items-center select-none pt-12 pb-4">
        {/* Row of Candles at the Top of Cake */}
        <div className="absolute top-2 w-[80%] flex justify-center items-end gap-1.5 sm:gap-2 z-20">
          {candles.map((isLit, idx) => (
            <div
              key={idx}
              onClick={() => blowCandle(idx)}
              className="relative flex flex-col items-center cursor-pointer group"
              style={{
                marginTop: `${(Math.sin((idx / (candleCount - 1 || 1)) * Math.PI) * -6)}px`,
              }}
            >
              {/* Flame or Extinguished Smoke */}
              <div className="h-8 flex items-end justify-center relative">
                {isLit ? (
                  <div className="animate-flame group-hover:scale-125 transition-transform origin-bottom">
                    {/* SVG Candle Flame */}
                    <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
                      <path
                        d="M7 0C7 0 14 8 14 15C14 18.866 10.866 22 7 22C3.13401 22 0 18.866 0 15C0 8 7 0 7 0Z"
                        fill="#F59E0B"
                      />
                      <path
                        d="M7 5C7 5 11 11 11 16C11 18.2091 9.20914 20 7 20C4.79086 20 3 18.2091 3 16C3 11 7 5 7 5Z"
                        fill="#FDE047"
                      />
                      <circle cx="7" cy="16" r="2.5" fill="#FFFFFF" opacity="0.8" />
                    </svg>
                  </div>
                ) : smokeStates[idx] ? (
                  <div className="animate-smoke text-slate-400">
                    <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                      <path
                        d="M8 22 C 4 18, 12 14, 8 10 C 5 7, 10 3, 7 0"
                        stroke="#94a3b8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                  </div>
                ) : (
                  /* Extinguished wick */
                  <div className="w-0.5 h-3 bg-slate-700 rounded-t-sm" />
                )}
              </div>

              {/* Candle Stick */}
              <div
                className="w-2.5 sm:w-3 h-12 rounded-t-sm shadow-sm relative overflow-hidden"
                style={{
                  background:
                    idx % 3 === 0
                      ? 'repeating-linear-gradient(45deg, #f43f5e, #f43f5e 4px, #ffffff 4px, #ffffff 8px)'
                      : idx % 3 === 1
                      ? 'repeating-linear-gradient(45deg, #3b82f6, #3b82f6 4px, #ffffff 4px, #ffffff 8px)'
                      : 'repeating-linear-gradient(45deg, #10b981, #10b981 4px, #ffffff 4px, #ffffff 8px)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* SVG Illustrated Cake */}
        <div className="w-full relative z-10 filter drop-shadow-xl">
          <svg
            viewBox="0 0 400 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            {/* Pedestal Cake Stand */}
            <ellipse cx="200" cy="225" rx="160" ry="12" fill="#CBD5E1" opacity="0.7" />
            <path
              d="M165 210 L150 230 L250 230 L235 210 Z"
              fill="#E2E8F0"
              stroke="#94A3B8"
              strokeWidth="1.5"
            />
            <ellipse cx="200" cy="210" rx="170" ry="15" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
            <ellipse cx="200" cy="210" rx="165" ry="12" fill="#FFFFFF" />

            {/* Bottom Tier (Main Cake Sponge) */}
            <path
              d="M60 145 C 60 145, 60 195, 60 195 C 60 206, 122 215, 200 215 C 278 215, 340 206, 340 195 C 340 195, 340 145, 340 145 Z"
              fill="#FDE68A"
              stroke="#D97706"
              strokeWidth="2"
            />
            {/* Sponge cream filling layer stripe */}
            <path
              d="M60 170 C 120 182, 280 182, 340 170 C 340 178, 280 190, 200 190 C 120 190, 60 178, 60 170 Z"
              fill="#FFFFFF"
              opacity="0.9"
            />

            {/* Bottom Tier Icing Drippings */}
            <path
              d="M60 145 C 60 145, 80 162, 100 150 C 120 138, 140 168, 160 152 C 180 136, 200 166, 220 150 C 240 134, 260 164, 280 148 C 300 132, 320 160, 340 145 C 340 134, 278 125, 200 125 C 122 125, 60 134, 60 145 Z"
              fill={theme.cakeFrosting}
              stroke="#FFFFFF"
              strokeWidth="1"
            />
            <ellipse cx="200" cy="140" rx="140" ry="16" fill={theme.cakeFrostingSecondary} />

            {/* Decorative frosting rosettes along bottom rim */}
            {[80, 115, 150, 185, 220, 255, 290, 320].map((cx, i) => (
              <circle
                key={`frost-${i}`}
                cx={cx}
                cy={192 + Math.sin(i * 0.8) * 4}
                r="7"
                fill="#FFFFFF"
                stroke="#FBCFE8"
                strokeWidth="1.5"
              />
            ))}

            {/* Top Tier (Smaller Tier) */}
            <path
              d="M100 80 C 100 80, 100 130, 100 130 C 100 140, 145 148, 200 148 C 255 148, 300 140, 300 130 C 300 130, 300 80, 300 80 Z"
              fill="#FEF08A"
              stroke="#D97706"
              strokeWidth="2"
            />
            {/* Top Tier cream stripe */}
            <path
              d="M100 105 C 140 114, 260 114, 300 105 C 300 112, 260 120, 200 120 C 140 120, 100 112, 100 105 Z"
              fill="#FFFFFF"
              opacity="0.9"
            />

            {/* Top Tier Glossy Icing with Drips */}
            <path
              d="M100 80 C 100 80, 120 98, 140 85 C 160 72, 180 102, 200 88 C 220 74, 240 100, 260 85 C 280 70, 290 92, 300 80 C 300 70, 255 62, 200 62 C 145 62, 100 70, 100 80 Z"
              fill={theme.cakeFrosting}
              stroke="#FFFFFF"
              strokeWidth="1"
            />
            <ellipse cx="200" cy="74" rx="100" ry="12" fill={theme.cakeFrostingSecondary} />

            {/* Sprinkles on Top Tier */}
            {[
              { x: 130, y: 72, color: '#EF4444', r: 35 },
              { x: 155, y: 76, color: '#3B82F6', r: -20 },
              { x: 180, y: 70, color: '#10B981', r: 40 },
              { x: 215, y: 75, color: '#F59E0B', r: -45 },
              { x: 245, y: 71, color: '#EC4899', r: 15 },
              { x: 270, y: 74, color: '#8B5CF6', r: -30 },
              { x: 195, y: 78, color: '#06B6D4', r: 25 },
            ].map((sp, i) => (
              <rect
                key={`sp-${i}`}
                x={sp.x}
                y={sp.y}
                width="6"
                height="2.5"
                rx="1"
                fill={sp.color}
                transform={`rotate(${sp.r} ${sp.x} ${sp.y})`}
              />
            ))}

            {/* Cherries / Berries on Top Rim */}
            {[120, 160, 200, 240, 280].map((cx, i) => (
              <g key={`berry-${i}`}>
                <circle cx={cx} cy={70} r="6" fill="#E11D48" />
                <circle cx={cx - 1.5} cy={68} r="1.5" fill="#FFFFFF" opacity="0.7" />
                <path
                  d={`M${cx} 64 C ${cx + 2} 58, ${cx + 6} 56, ${cx + 8} 54`}
                  stroke="#15803D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Milestone Badge for age > 20 */}
        {age > 20 && (
          <div className="absolute top-2 right-2 sm:right-6 z-30 px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-bold text-xs shadow-md border border-white">
            ★ {age}th Birthday! ★
          </div>
        )}
      </div>

      {/* Celebration Modal / Banner when all candles are blown */}
      {showCelebration && (
        <div className="mt-4 w-full p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-2xl text-center animate-bounce-short relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-white/20 blur-xl pointer-events-none" />
          <div className="w-12 h-12 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
            <Heart className="w-6 h-6 fill-white text-white" />
          </div>
          <h4 className="text-2xl sm:text-3xl font-extrabold font-display">
            Your Wish is Granted, {name}! ✨
          </h4>
          <p className="mt-2 text-sm sm:text-base text-white/95 max-w-md mx-auto font-medium">
            All the candles have been blown out! May this coming year shower you with unforgettable happiness, boundless success, and cherished moments!
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                fireCelebrationCannons();
                fireStars();
              }}
              className="px-4 py-2 rounded-xl bg-white text-rose-600 hover:bg-rose-50 font-bold text-xs shadow transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>More Confetti!</span>
            </button>
            <button
              onClick={relightCandles}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs border border-white/40 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Blow Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
