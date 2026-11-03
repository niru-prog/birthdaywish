import { ThemeColor } from '../types';

export interface ThemeConfig {
  id: ThemeColor;
  name: string;
  badgeLabel: string;
  accentHex: string;
  secondaryHex: string;
  bgGradient: string;
  containerBg: string;
  cardBorder: string;
  heroGradientText: string;
  primaryButton: string;
  primaryButtonHover: string;
  secondaryButton: string;
  glowEffect: string;
  cakeFrosting: string;
  cakeFrostingSecondary: string;
  envelopeColor: string;
  envelopeFlap: string;
  envelopeInner: string;
  waxSealColor: string;
  balloonColors: string[];
}

export const THEMES: Record<ThemeColor, ThemeConfig> = {
  pink: {
    id: 'pink',
    name: 'Strawberry Bliss',
    badgeLabel: 'Pink',
    accentHex: '#ec4899',
    secondaryHex: '#f43f5e',
    bgGradient: 'from-pink-50 via-rose-50/60 to-purple-50/40',
    containerBg: 'bg-white/85 backdrop-blur-md',
    cardBorder: 'border-pink-200/80',
    heroGradientText: 'from-pink-600 via-rose-500 to-amber-500',
    primaryButton: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-200/80 hover:from-pink-600 hover:to-rose-600',
    primaryButtonHover: 'hover:shadow-pink-300',
    secondaryButton: 'bg-pink-100/80 text-pink-700 hover:bg-pink-200/80 border border-pink-200',
    glowEffect: 'shadow-[0_0_30px_rgba(244,63,94,0.25)]',
    cakeFrosting: '#f472b6',
    cakeFrostingSecondary: '#fbcfe8',
    envelopeColor: '#fda4af',
    envelopeFlap: '#fb7185',
    envelopeInner: '#fff1f2',
    waxSealColor: '#e11d48',
    balloonColors: ['#fb7185', '#f43f5e', '#f472b6', '#fda4af', '#facc15', '#c084fc'],
  },
  purple: {
    id: 'purple',
    name: 'Lavender Magic',
    badgeLabel: 'Purple',
    accentHex: '#a855f7',
    secondaryHex: '#8b5cf6',
    bgGradient: 'from-purple-50 via-violet-50/60 to-fuchsia-50/40',
    containerBg: 'bg-white/85 backdrop-blur-md',
    cardBorder: 'border-purple-200/80',
    heroGradientText: 'from-purple-600 via-violet-600 to-pink-500',
    primaryButton: 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-purple-200/80 hover:from-purple-700 hover:to-violet-700',
    primaryButtonHover: 'hover:shadow-purple-300',
    secondaryButton: 'bg-purple-100/80 text-purple-700 hover:bg-purple-200/80 border border-purple-200',
    glowEffect: 'shadow-[0_0_30px_rgba(168,85,247,0.25)]',
    cakeFrosting: '#c084fc',
    cakeFrostingSecondary: '#e9d5ff',
    envelopeColor: '#c4b5fd',
    envelopeFlap: '#a78bfa',
    envelopeInner: '#f5f3ff',
    waxSealColor: '#7c3aed',
    balloonColors: ['#a855f7', '#c084fc', '#818cf8', '#e879f9', '#fb7185', '#38bdf8'],
  },
  blue: {
    id: 'blue',
    name: 'Ocean Starlight',
    badgeLabel: 'Blue',
    accentHex: '#3b82f6',
    secondaryHex: '#0284c7',
    bgGradient: 'from-sky-50 via-blue-50/60 to-cyan-50/40',
    containerBg: 'bg-white/85 backdrop-blur-md',
    cardBorder: 'border-sky-200/80',
    heroGradientText: 'from-sky-600 via-blue-600 to-indigo-600',
    primaryButton: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-200/80 hover:from-sky-600 hover:to-blue-700',
    primaryButtonHover: 'hover:shadow-sky-300',
    secondaryButton: 'bg-sky-100/80 text-sky-800 hover:bg-sky-200/80 border border-sky-200',
    glowEffect: 'shadow-[0_0_30px_rgba(59,130,246,0.25)]',
    cakeFrosting: '#60a5fa',
    cakeFrostingSecondary: '#bfdbfe',
    envelopeColor: '#93c5fd',
    envelopeFlap: '#60a5fa',
    envelopeInner: '#eff6ff',
    waxSealColor: '#2563eb',
    balloonColors: ['#38bdf8', '#60a5fa', '#818cf8', '#34d399', '#f472b6', '#facc15'],
  },
  gold: {
    id: 'gold',
    name: 'Golden Glow',
    badgeLabel: 'Gold',
    accentHex: '#f59e0b',
    secondaryHex: '#d97706',
    bgGradient: 'from-amber-50 via-yellow-50/60 to-orange-50/40',
    containerBg: 'bg-white/85 backdrop-blur-md',
    cardBorder: 'border-amber-200/80',
    heroGradientText: 'from-amber-600 via-yellow-600 to-orange-500',
    primaryButton: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-amber-200/80 hover:from-amber-600 hover:to-yellow-600',
    primaryButtonHover: 'hover:shadow-amber-300',
    secondaryButton: 'bg-amber-100/80 text-amber-900 hover:bg-amber-200/80 border border-amber-200',
    glowEffect: 'shadow-[0_0_30px_rgba(245,158,11,0.25)]',
    cakeFrosting: '#fbbf24',
    cakeFrostingSecondary: '#fef3c7',
    envelopeColor: '#fde68a',
    envelopeFlap: '#fcd34d',
    envelopeInner: '#fffbeb',
    waxSealColor: '#b45309',
    balloonColors: ['#fbbf24', '#f59e0b', '#fb923c', '#f43f5e', '#a855f7', '#10b981'],
  },
};
