/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { BirthdaySurpriseData } from './types';
import {
  loadSurpriseFromStorage,
  saveSurpriseToStorage,
  loadSurpriseFromUrl,
  encodeSurpriseToUrl,
} from './utils/storage';
import { THEMES } from './utils/themes';
import { playHappyBirthdaySong, stopHappyBirthdaySong } from './utils/audio';
import { fireCelebrationCannons } from './utils/confetti';

import { SetupForm } from './components/SetupForm';
import { OpeningEnvelope } from './components/OpeningEnvelope';
import { HeroSection } from './components/HeroSection';
import { FloatingBalloons } from './components/FloatingBalloons';
import { BirthdayCake } from './components/BirthdayCake';
import { CountdownTimer } from './components/CountdownTimer';
import { PersonalMessageCard } from './components/PersonalMessageCard';
import { PhotoPolaroid } from './components/PhotoPolaroid';
import { WishesWall } from './components/WishesWall';
import { FunFactsSection } from './components/FunFactsSection';
import { Heart, Sparkles, Share2, Check, ArrowUp } from 'lucide-react';

type ScreenState = 'setup' | 'envelope' | 'surprise';

export default function App() {
  const [data, setData] = useState<BirthdaySurpriseData | null>(null);
  const [screen, setScreen] = useState<ScreenState>('setup');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const musicControllerRef = useRef<{ stop: () => void } | null>(null);

  // Initialize from URL or LocalStorage on mount
  useEffect(() => {
    // 1. Check URL hash first (shared link)
    const urlData = loadSurpriseFromUrl();
    if (urlData) {
      setData(urlData);
      saveSurpriseToStorage(urlData);
      setScreen('envelope');
      return;
    }

    // 2. Check localStorage
    const stored = loadSurpriseFromStorage();
    if (stored) {
      setData(stored);
      // If returning user has existing data, start at envelope or surprise
      setScreen('envelope');
    } else {
      // First time: show setup screen
      setScreen('setup');
    }
  }, []);

  // Track scroll position for "Back to top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Music toggle handler
  const handleToggleMusic = () => {
    if (isPlayingMusic) {
      if (musicControllerRef.current) {
        musicControllerRef.current.stop();
        musicControllerRef.current = null;
      }
      stopHappyBirthdaySong();
      setIsPlayingMusic(false);
    } else {
      const controller = playHappyBirthdaySong();
      musicControllerRef.current = controller;
      setIsPlayingMusic(true);
    }
  };

  // Stop music when unmounting or switching to setup
  useEffect(() => {
    return () => {
      if (musicControllerRef.current) {
        musicControllerRef.current.stop();
      }
      stopHappyBirthdaySong();
    };
  }, []);

  // Handle Form Submission from Setup Screen
  const handleCreateSurprise = (formData: BirthdaySurpriseData) => {
    setData(formData);
    saveSurpriseToStorage(formData);
    // Show envelope first for the magical reveal!
    setScreen('envelope');
  };

  // Handle Envelope Open
  const handleOpenEnvelope = () => {
    setScreen('surprise');
    // Start gentle celebratory music upon user interaction
    if (!isPlayingMusic) {
      const controller = playHappyBirthdaySong();
      musicControllerRef.current = controller;
      setIsPlayingMusic(true);
    }
    // Confetti explosion
    fireCelebrationCannons();
  };

  // Handle Share button
  const handleShare = async () => {
    if (!data) return;
    const shareUrl = encodeSurpriseToUrl(data);

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for environments where navigator.clipboard might be restricted
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const currentTheme = data ? THEMES[data.theme] || THEMES.pink : THEMES.pink;

  // Render Setup Screen
  if (screen === 'setup') {
    return (
      <SetupForm
        initialData={data}
        onSubmit={handleCreateSurprise}
        onCancel={data ? () => setScreen('surprise') : undefined}
      />
    );
  }

  // Render Envelope Screen (Step 1 of surprise)
  if (screen === 'envelope' && data) {
    return <OpeningEnvelope data={data} onOpen={handleOpenEnvelope} />;
  }

  // Render Full Birthday Surprise Screen
  if (screen === 'surprise' && data) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${currentTheme.bgGradient} relative overflow-x-hidden selection:bg-rose-500 selection:text-white`}>
        {/* Floating Interactive Balloons (poppable anywhere on screen!) */}
        <FloatingBalloons themeColor={data.theme} friendName={data.name} />

        {/* Main Content Container */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 pb-20">
          {/* Hero Section with Title, Big Glowing Age, Controls */}
          <HeroSection
            data={data}
            isPlayingMusic={isPlayingMusic}
            onToggleMusic={handleToggleMusic}
            onEdit={() => {
              if (musicControllerRef.current) {
                musicControllerRef.current.stop();
                setIsPlayingMusic(false);
              }
              setScreen('setup');
            }}
            onReopenEnvelope={() => setScreen('envelope')}
            onShare={handleShare}
            shareCopied={shareCopied}
          />

          {/* Countdown or "It's your day! 🎂" Banner */}
          <CountdownTimer
            birthDateString={data.birthDate}
            name={data.name}
            themeColor={data.theme}
          />

          {/* Personal Message Handwritten Card */}
          <PersonalMessageCard
            message={data.message}
            senderName={data.creatorName}
            recipientName={data.name}
            themeColor={data.theme}
          />

          {/* Polaroid Photo Section (if photo provided) */}
          <PhotoPolaroid photoUrl={data.photoUrl} name={data.name} />

          {/* Illustrated Birthday Cake with Blow-out Candles */}
          <div className="my-14">
            <BirthdayCake
              age={data.age}
              name={data.name}
              themeColor={data.theme}
            />
          </div>

          {/* Fun Facts Section (Days, Hours, Heartbeats, Orbits) */}
          <FunFactsSection
            age={data.age}
            name={data.name}
            themeColor={data.theme}
          />

          {/* Community Wishes Wall */}
          <WishesWall
            friendName={data.name}
            themeColor={data.theme}
          />

          {/* Bottom Share & Footer Card */}
          <div className="mt-16 text-center pt-8 border-t border-slate-200/60">
            <div className="inline-flex flex-col items-center">
              <p className="text-sm font-semibold text-slate-700 font-display">
                Share this surprise with {data.name}!
              </p>
              <button
                onClick={handleShare}
                className="mt-3 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
              >
                {shareCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-amber-400" />
                    <span>Copy Page Link to Share</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-6 flex items-center justify-center gap-1.5">
              <span>Made with love for {data.name}’s special day</span>
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            </p>
          </div>
        </main>

        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-slate-200 text-slate-700 hover:text-slate-900 transition hover:scale-110 active:scale-95"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  return null;
}
