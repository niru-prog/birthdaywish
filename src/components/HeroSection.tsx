import React, { useState } from 'react';
import { BirthdaySurpriseData } from '../types';
import { THEMES } from '../utils/themes';
import { fireConfetti, fireCelebrationCannons } from '../utils/confetti';
import {
  Volume2,
  VolumeX,
  Share2,
  Edit3,
  Sparkles,
  PartyPopper,
  Mail,
  Check,
} from 'lucide-react';

interface HeroSectionProps {
  data: BirthdaySurpriseData;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onEdit: () => void;
  onReopenEnvelope: () => void;
  onShare: () => void;
  shareCopied: boolean;
}

export function HeroSection({
  data,
  isPlayingMusic,
  onToggleMusic,
  onEdit,
  onReopenEnvelope,
  onShare,
  shareCopied,
}: HeroSectionProps) {
  const theme = THEMES[data.theme] || THEMES.pink;

  const handleHeroConfetti = () => {
    fireCelebrationCannons();
  };

  return (
    <div className="relative pt-6 pb-10 sm:pb-16 text-center select-none overflow-hidden">
      {/* Top Floating Action Bar */}
      <div className="max-w-4xl mx-auto px-4 mb-8 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Reopen Envelope & Music Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMusic}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
              isPlayingMusic
                ? 'bg-rose-500 text-white shadow-rose-200 animate-pulse'
                : 'bg-white/90 text-slate-700 hover:bg-white border border-slate-200'
            }`}
            title={isPlayingMusic ? 'Pause birthday tune' : 'Play soft birthday tune'}
          >
            {isPlayingMusic ? (
              <>
                <Volume2 className="w-4 h-4 text-white" />
                <span>Music Playing</span>
                {/* Mini animated equalizer */}
                <span className="flex items-end gap-0.5 h-3 ml-0.5">
                  <span className="w-0.5 h-2.5 bg-white animate-pulse" />
                  <span className="w-0.5 h-3.5 bg-white animate-bounce" />
                  <span className="w-0.5 h-1.5 bg-white animate-pulse" />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span>Play Tune 🎵</span>
              </>
            )}
          </button>

          <button
            onClick={onReopenEnvelope}
            className="px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm transition flex items-center gap-1.5"
            title="Open envelope again"
          >
            <Mail className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Envelope</span>
          </button>
        </div>

        {/* Right: Share Surprise & Edit Details */}
        <div className="flex items-center gap-2">
          <button
            onClick={onShare}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              shareCopied
                ? 'bg-emerald-600 text-white'
                : 'bg-white/90 hover:bg-white text-slate-700 border border-slate-200'
            }`}
            title="Copy shareable link"
          >
            {shareCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            onClick={onEdit}
            className="px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            title="Edit details"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit details</span>
          </button>
        </div>
      </div>

      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-slate-200/80 text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span>Today We Celebrate You</span>
        <Sparkles className="w-4 h-4 text-amber-500" />
      </div>

      {/* Main Animated Title */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-display tracking-tight text-slate-900 max-w-4xl mx-auto px-4 leading-[1.15]">
        Happy Birthday,{' '}
        <span
          className={`bg-gradient-to-r ${theme.heroGradientText} bg-clip-text text-transparent underline decoration-wavy decoration-amber-300 underline-offset-8`}
        >
          {data.name}!
        </span>{' '}
        🎉
      </h1>

      {/* Age Shown as Big Glowing Numbers */}
      <div className="mt-8 flex flex-col items-center justify-center">
        <div
          onClick={handleHeroConfetti}
          className="relative inline-flex items-center justify-center group cursor-pointer"
          title="Click for a burst of confetti!"
        >
          {/* Glowing backdrop halo */}
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity"
            style={{ backgroundColor: theme.accentHex }}
          />

          {/* Number Container */}
          <div className="relative px-8 py-4 sm:px-12 sm:py-6 rounded-3xl bg-white/80 backdrop-blur-md border border-white/60 shadow-2xl flex items-center gap-4 transition-transform group-hover:scale-105 active:scale-95">
            <span
              className="text-6xl sm:text-8xl md:text-9xl font-extrabold font-display tracking-tighter"
              style={{
                color: theme.accentHex,
                textShadow: `0 0 25px ${theme.accentHex}60`,
              }}
            >
              {data.age}
            </span>

            <div className="text-left">
              <span className="block text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-400">
                Years of
              </span>
              <span className="block text-lg sm:text-2xl font-bold text-slate-800 font-display">
                Pure Awesomeness ✨
              </span>
              <span className="text-[11px] text-rose-500 font-semibold flex items-center gap-1 mt-0.5">
                <PartyPopper className="w-3 h-3" /> Tap for confetti
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
