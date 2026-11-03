import React from 'react';
import { THEMES } from '../utils/themes';
import { ThemeColor } from '../types';
import { Heart, Sun, Moon, Smile, Clock, Activity, Sparkles } from 'lucide-react';

interface FunFactsSectionProps {
  age: number;
  name: string;
  themeColor: ThemeColor;
}

export function FunFactsSection({ age, name, themeColor }: FunFactsSectionProps) {
  const theme = THEMES[themeColor] || THEMES.pink;

  // Exact calculations based on age
  const daysLived = Math.round(age * 365.25);
  const hoursLived = daysLived * 24;
  const approxHeartbeats = daysLived * 105000; // ~73 bpm avg * 1440 min
  const sleepHours = Math.round(daysLived * 8);
  const solarOrbits = age;
  const approxSmiles = Math.round(daysLived * 22);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const facts = [
    {
      label: 'Days of Spreading Joy',
      value: formatNumber(daysLived),
      sub: 'days lived so far',
      icon: Clock,
      color: 'text-rose-500',
      bgColor: 'bg-rose-50',
    },
    {
      label: 'Hours of Life',
      value: formatNumber(hoursLived),
      sub: 'hours of stories & moments',
      icon: Activity,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
    {
      label: 'Heartbeats',
      value: formatNumber(approxHeartbeats),
      sub: 'beats powering your dreams',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Solar Orbits',
      value: `${solarOrbits}`,
      sub: 'full journeys around the Sun ☀️',
      icon: Sun,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Dreaming & Sleep',
      value: formatNumber(sleepHours),
      sub: 'hours resting & recharging',
      icon: Moon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Smiles Shared',
      value: `~${formatNumber(approxSmiles)}`,
      sub: 'smiles brightening others’ days',
      icon: Smile,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-2">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Milestone Stats</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          {name}'s Life in Numbers 📊
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Look at all the magical time you’ve spent making the world brighter!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
        {facts.map((fact, idx) => {
          const Icon = fact.icon;
          return (
            <div
              key={idx}
              className={`p-4 sm:p-6 rounded-2xl ${theme.containerBg} ${theme.cardBorder} border shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${fact.bgColor} flex items-center justify-center ${fact.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Fact #{idx + 1}
                </span>
              </div>

              <div>
                <div className="text-xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                  {fact.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
                  {fact.label}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  {fact.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
