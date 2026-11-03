import React, { useState, useEffect } from 'react';
import { THEMES } from '../utils/themes';
import { ThemeColor } from '../types';
import { Clock, Calendar, Sparkles, PartyPopper } from 'lucide-react';

interface CountdownTimerProps {
  birthDateString: string; // YYYY-MM-DD
  name: string;
  themeColor: ThemeColor;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
  isNextYearTarget: boolean;
}

export function CountdownTimer({ birthDateString, name, themeColor }: CountdownTimerProps) {
  const theme = THEMES[themeColor] || THEMES.pink;

  const calculateTimeRemaining = (): TimeRemaining => {
    const now = new Date();
    // Parse target date
    const [targetYear, targetMonth, targetDay] = birthDateString.split('-').map(Number);

    // Check if today matches month and day
    const isToday =
      now.getMonth() + 1 === targetMonth && now.getDate() === targetDay;

    if (isToday) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isToday: true, isNextYearTarget: false };
    }

    // Determine the next birthday timestamp
    const currentYear = now.getFullYear();
    let nextBday = new Date(currentYear, targetMonth - 1, targetDay, 0, 0, 0);

    let isNextYearTarget = false;
    // If that date has already passed this year, countdown to next year's birthday
    if (nextBday.getTime() < now.getTime()) {
      nextBday = new Date(currentYear + 1, targetMonth - 1, targetDay, 0, 0, 0);
      isNextYearTarget = true;
    }

    const diff = Math.max(0, nextBday.getTime() - now.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isToday: false, isNextYearTarget };
  };

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [birthDateString]);

  // Format readable birthday date for banner
  const [bYear, bMonth, bDay] = birthDateString.split('-').map(Number);
  const formattedDate = new Date(bYear, bMonth - 1, bDay).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      {timeLeft.isToday ? (
        /* TODAY IS THE BIRTHDAY BANNER */
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white shadow-xl text-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase mb-3">
            <PartyPopper className="w-4 h-4 text-amber-200" />
            <span>Official Celebration</span>
          </div>
          <h3 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white drop-shadow-sm">
            It's your day! 🎂
          </h3>
          <p className="mt-2 text-base sm:text-lg text-white/95 max-w-md mx-auto font-medium">
            Today is officially {name}'s birthday! May every moment today be filled with laughter, love, and sweet treats!
          </p>
        </div>
      ) : (
        /* LIVE COUNTDOWN TIMER */
        <div className={`p-6 sm:p-8 rounded-3xl ${theme.containerBg} ${theme.cardBorder} border shadow-lg relative`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                <Clock className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-display">
                  Birthday Countdown ⏳
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Target: {formattedDate} {timeLeft.isNextYearTarget ? '(Next year)' : ''}
                </p>
              </div>
            </div>

            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Counting down the seconds</span>
            </div>
          </div>

          {/* Time digits grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="bg-slate-50/80 rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-inner flex flex-col items-center justify-center"
              >
                <div
                  className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-900"
                  style={{ color: idx === 3 ? theme.accentHex : undefined }}
                >
                  {String(unit.value).padStart(2, '0')}
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
