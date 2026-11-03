import React from 'react';
import { Camera, Sparkles, Heart } from 'lucide-react';

interface PhotoPolaroidProps {
  photoUrl?: string;
  name: string;
}

export function PhotoPolaroid({ photoUrl, name }: PhotoPolaroidProps) {
  if (!photoUrl) return null;

  return (
    <div className="w-full max-w-md mx-auto my-10 flex flex-col items-center">
      <div className="relative group perspective-1000">
        {/* Decorative Washi Tape on top */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-rose-200/90 shadow-xs rotate-1 rounded-xs border-t border-b border-white/60 z-20 pointer-events-none" />

        {/* Polaroid Card Frame */}
        <div className="bg-white p-4 pb-7 rounded-sm shadow-xl shadow-slate-300/60 border border-slate-200/60 -rotate-2 group-hover:rotate-0 group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300 ease-out cursor-pointer">
          {/* Photo inner container */}
          <div className="relative w-[280px] sm:w-[320px] h-[280px] sm:h-[320px] bg-slate-100 overflow-hidden rounded-xs border border-slate-100">
            <img
              src={photoUrl}
              alt={`${name}'s birthday photo`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Subtle photographic vignette/sheen */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Polaroid Caption */}
          <div className="mt-4 px-2 text-center">
            <p className="font-handwriting text-2xl sm:text-3xl text-slate-800 font-bold tracking-wide">
              {name} • Best Memories ✨
            </p>
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mt-0.5 font-sans">
              <Camera className="w-3 h-3 text-rose-400" />
              <span>Captured with love</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
