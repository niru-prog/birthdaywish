import React, { useState } from 'react';
import { BirthdaySurpriseData } from '../types';
import { THEMES } from '../utils/themes';
import { playEnvelopeOpenSound } from '../utils/audio';
import { fireCelebrationCannons } from '../utils/confetti';
import { Mail, Sparkles, Heart } from 'lucide-react';

interface OpeningEnvelopeProps {
  data: BirthdaySurpriseData;
  onOpen: () => void;
}

export function OpeningEnvelope({ data, onOpen }: OpeningEnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false);
  const theme = THEMES[data.theme] || THEMES.pink;

  const handleOpenEnvelope = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Audio cue and confetti cannons!
    playEnvelopeOpenSound();
    fireCelebrationCannons();

    // After animation finishes, transition to main birthday surprise view
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-gradient-to-br ${theme.bgGradient} overflow-hidden select-none`}>
      {/* Background ambient light sparkles */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-40 animate-pulse pointer-events-none" style={{ backgroundColor: theme.accentHex }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-30 animate-pulse pointer-events-none" style={{ backgroundColor: theme.secondaryHex }} />

      <div className="text-center mb-8 z-10">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3 border border-white/60">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>A Special Delivery Just For You</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-display">
          Tap the envelope to open!
        </h2>
        <p className="text-sm text-slate-500 mt-1">Made with love for {data.name}</p>
      </div>

      {/* The 3D Interactive Envelope */}
      <div
        onClick={handleOpenEnvelope}
        className={`relative w-[320px] sm:w-[400px] h-[220px] sm:h-[260px] cursor-pointer group perspective-1000 transition-transform duration-300 ${
          isOpening ? 'scale-105' : 'hover:scale-102 hover:-translate-y-1'
        }`}
      >
        {/* Glow behind envelope */}
        <div
          className="absolute inset-0 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"
          style={{ backgroundColor: theme.accentHex }}
        />

        {/* Envelope back base */}
        <div
          className="absolute inset-0 rounded-2xl shadow-2xl border border-white/40 overflow-hidden"
          style={{ backgroundColor: theme.envelopeColor }}
        >
          {/* Inner liner pattern / color */}
          <div
            className="absolute inset-2 rounded-xl opacity-90"
            style={{ backgroundColor: theme.envelopeInner }}
          >
            {/* Cute festive liner pattern */}
            <div className="w-full h-full opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />
          </div>
        </div>

        {/* The Letter Card inside sliding up when opening */}
        <div
          className={`absolute left-4 right-4 h-[190px] sm:h-[220px] bg-white rounded-xl shadow-lg border border-slate-100 p-5 flex flex-col items-center justify-center text-center transition-all duration-1000 ease-out z-20 ${
            isOpening ? '-translate-y-28 sm:-translate-y-36 opacity-100 shadow-2xl' : 'translate-y-3 opacity-95'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-2">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Special Wish</span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display mt-0.5">
            Happy Birthday, {data.name}!
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic font-handwriting text-lg leading-tight">
            "{data.message}"
          </p>
        </div>

        {/* Left & Right and Bottom folding envelope triangles (front face) */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          {/* Left fold */}
          <div
            className="absolute left-0 bottom-0 top-0 w-0 h-0 border-solid"
            style={{
              borderTop: '130px solid transparent',
              borderBottom: '130px solid transparent',
              borderLeft: `160px solid ${theme.envelopeColor}`,
              filter: 'drop-shadow(2px 0 3px rgba(0,0,0,0.06))',
            }}
          />

          {/* Right fold */}
          <div
            className="absolute right-0 bottom-0 top-0 w-0 h-0 border-solid"
            style={{
              borderTop: '130px solid transparent',
              borderBottom: '130px solid transparent',
              borderRight: `160px solid ${theme.envelopeColor}`,
              filter: 'drop-shadow(-2px 0 3px rgba(0,0,0,0.06))',
            }}
          />

          {/* Bottom fold */}
          <div
            className="absolute bottom-0 left-0 right-0 h-0 border-solid"
            style={{
              borderLeft: '160px solid transparent',
              borderRight: '160px solid transparent',
              borderBottom: `135px solid ${theme.envelopeFlap}`,
              filter: 'drop-shadow(0 -3px 4px rgba(0,0,0,0.08))',
            }}
          />
        </div>

        {/* Top triangular flap with 3D folding animation */}
        <div
          className={`absolute top-0 left-0 right-0 h-0 border-solid z-40 origin-top transition-transform duration-700 ease-in-out transform-style-3d ${
            isOpening ? '-rotate-x-180' : 'rotate-x-0'
          }`}
          style={{
            borderLeft: '160px solid transparent',
            borderRight: '160px solid transparent',
            borderTop: `135px solid ${theme.envelopeFlap}`,
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.12))',
          }}
        />

        {/* Wax seal / Bow button in center */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
            isOpening ? 'opacity-0 scale-75' : 'opacity-100 scale-100 group-hover:scale-110'
          }`}
        >
          <div
            className="w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-xl border-2 border-white/60 text-white font-bold cursor-pointer"
            style={{ backgroundColor: theme.waxSealColor }}
          >
            <Mail className="w-5 h-5 mb-0.5 animate-bounce" style={{ animationDuration: '2s' }} />
            <span className="text-[10px] tracking-tight uppercase font-extrabold">OPEN</span>
          </div>
        </div>
      </div>

      {/* Helper cue */}
      <div className="mt-10 z-10 flex items-center gap-2 text-slate-500 text-sm animate-pulse">
        <span>Click the seal to reveal your surprise</span>
      </div>
    </div>
  );
}
