import React, { useState, useEffect, useCallback } from 'react';
import { playPopSound } from '../utils/audio';
import { getRandomBalloonWish } from '../utils/funWishes';
import { THEMES } from '../utils/themes';
import { ThemeColor } from '../types';
import { X, Sparkles, Heart } from 'lucide-react';

interface BalloonItem {
  id: string;
  left: number; // percentage (5% to 90%)
  speed: number; // animation duration in seconds (12s to 24s)
  size: number; // width in px (50px to 80px)
  color: string;
  delay: number; // delay in seconds
  swayType: number; // 0, 1, or 2
}

interface FloatingBalloonsProps {
  themeColor: ThemeColor;
  friendName: string;
}

export function FloatingBalloons({ themeColor, friendName }: FloatingBalloonsProps) {
  const theme = THEMES[themeColor] || THEMES.pink;
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [activeWish, setActiveWish] = useState<{ id: string; text: string } | null>(null);
  const [poppedPositions, setPoppedPositions] = useState<{ x: number; y: number; id: string }[]>([]);

  // Spawn initial set of balloons
  const spawnBalloons = useCallback((count = 8) => {
    const colors = theme.balloonColors;
    const newBalloons: BalloonItem[] = [];

    for (let i = 0; i < count; i++) {
      newBalloons.push({
        id: `balloon-${Date.now()}-${i}-${Math.random()}`,
        left: Math.floor(Math.random() * 85) + 6,
        speed: Math.floor(Math.random() * 10) + 14,
        size: Math.floor(Math.random() * 25) + 55,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 6,
        swayType: Math.floor(Math.random() * 3),
      });
    }

    setBalloons((prev) => [...prev.slice(-12), ...newBalloons]);
  }, [theme.balloonColors]);

  useEffect(() => {
    spawnBalloons(8);

    // Periodically release a gentle new balloon
    const interval = setInterval(() => {
      spawnBalloons(2);
    }, 14000);

    return () => clearInterval(interval);
  }, [spawnBalloons]);

  // Handle balloon popping
  const handlePopBalloon = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const popX = rect.left + rect.width / 2;
    const popY = rect.top + rect.height / 2;

    playPopSound();

    // Particle flash
    const popId = `pop-${Date.now()}`;
    setPoppedPositions((prev) => [...prev, { x: popX, y: popY, id: popId }]);
    setTimeout(() => {
      setPoppedPositions((prev) => prev.filter((p) => p.id !== popId));
    }, 700);

    // Remove popped balloon
    setBalloons((prev) => prev.filter((b) => b.id !== id));

    // Show exciting random wish
    const wish = getRandomBalloonWish();
    setActiveWish({ id: `wish-${Date.now()}`, text: wish });
  };

  return (
    <>
      {/* Container for floating balloons - covers viewport, allows clicks through */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
        {balloons.map((balloon) => (
          <div
            key={balloon.id}
            onClick={(e) => handlePopBalloon(balloon.id, e)}
            className="absolute pointer-events-auto cursor-pointer group transition-transform hover:scale-110 active:scale-95"
            style={{
              left: `${balloon.left}%`,
              bottom: '-120px',
              animation: `float-balloon ${balloon.speed}s linear infinite`,
              animationDelay: `${balloon.delay}s`,
            }}
          >
            {/* Balloon illustration */}
            <div className="relative flex flex-col items-center">
              {/* Pop me hover hint */}
              <div className="absolute -top-6 whitespace-nowrap px-2 py-0.5 rounded-full bg-slate-900/80 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold">
                Pop me! 🎈
              </div>

              {/* Balloon Body */}
              <svg
                width={balloon.size}
                height={balloon.size * 1.25}
                viewBox="0 0 70 85"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-md"
              >
                {/* Main oval */}
                <ellipse
                  cx="35"
                  cy="38"
                  rx="32"
                  ry="38"
                  fill={balloon.color}
                />
                {/* Subtle 3D gradient highlight */}
                <ellipse
                  cx="24"
                  cy="24"
                  rx="10"
                  ry="18"
                  fill="white"
                  fillOpacity="0.35"
                  transform="rotate(-25 24 24)"
                />
                {/* Secondary light spot */}
                <circle cx="48" cy="48" r="4" fill="white" fillOpacity="0.2" />
                {/* Balloon bottom knot */}
                <polygon
                  points="35,76 31,82 39,82"
                  fill={balloon.color}
                />
              </svg>

              {/* Balloon String */}
              <svg
                width="20"
                height="50"
                viewBox="0 0 20 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-60 -mt-0.5"
              >
                <path
                  d="M10 0 C 15 15, 5 30, 10 50"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        ))}

        {/* Popped particle sparkles */}
        {poppedPositions.map((pos) => (
          <div
            key={pos.id}
            className="fixed pointer-events-none z-50 animate-ping"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="w-12 h-12 rounded-full bg-amber-300/80 blur-xs" />
          </div>
        ))}
      </div>

      {/* Floating Balloon Wish Modal / Notification */}
      {activeWish && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[92%] px-4 animate-bounce-short">
          <div className="p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-rose-200/80 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wide">
                <span>Balloon Wish Popped!</span>
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
              </div>
              <p className="text-sm font-semibold text-slate-800 mt-0.5 font-display">
                "{activeWish.text}"
              </p>
              <p className="text-[11px] text-slate-400 mt-1">To: {friendName} • Keep popping for more!</p>
            </div>
            <button
              onClick={() => setActiveWish(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
              aria-label="Close wish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
