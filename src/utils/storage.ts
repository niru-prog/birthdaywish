import { BirthdaySurpriseData, WishNote } from '../types';

const STORAGE_KEY = 'celebrationbox_birthday_surprise_v1';
const WISHES_KEY = 'celebrationbox_wishes_wall_v1';

export const DEFAULT_SURPRISE: BirthdaySurpriseData = {
  name: 'Alex',
  age: 18,
  message: 'Happy Birthday! 🌟 May this new year bring you thrilling adventures, endless joy, and all the success in the world. Thank you for always being the most genuine, supportive, and hilarious friend anyone could ever ask for. Here’s to making unforgettable memories together! 🎂✨',
  birthDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0], // 3 days in future by default for demo
  theme: 'pink',
  creatorName: 'Jordan',
};

export const INITIAL_WISHES: WishNote[] = [
  {
    id: 'wish-1',
    author: 'Maya',
    content: 'Wishing you the happiest birthday ever! Keep shining bright and chasing your biggest dreams! 💖🎉',
    color: 'yellow',
    rotation: -2,
    createdAt: 'Just now',
  },
  {
    id: 'wish-2',
    author: 'Sam & Leo',
    content: 'Happy Birthday to the coolest person on campus! Don’t forget to save us a slice of cake! 🍰🎈',
    color: 'pink',
    rotation: 2.5,
    createdAt: '2 hours ago',
  },
  {
    id: 'wish-3',
    author: 'Chloe',
    content: 'May your year ahead be as awesome, radiant, and kind as you are! Love you tons! ✨🎁',
    color: 'purple',
    rotation: -1.5,
    createdAt: 'Yesterday',
  },
];

export function saveSurpriseToStorage(data: BirthdaySurpriseData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save surprise to localStorage:', error);
    // If quota exceeded due to large photo, try removing photo and saving text
    if (data.photoUrl) {
      try {
        const withoutPhoto = { ...data, photoUrl: undefined };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(withoutPhoto));
        return true;
      } catch (innerErr) {
        console.error('Failed fallback save:', innerErr);
      }
    }
    return false;
  }
}

export function loadSurpriseFromStorage(): BirthdaySurpriseData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.name === 'string' && typeof parsed.age === 'number') {
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load surprise from localStorage:', error);
  }
  return null;
}

export function saveWishesToStorage(wishes: WishNote[]): boolean {
  try {
    localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
    return true;
  } catch (error) {
    console.error('Failed to save wishes to localStorage:', error);
    return false;
  }
}

export function loadWishesFromStorage(): WishNote[] {
  try {
    const raw = localStorage.getItem(WISHES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load wishes from localStorage:', error);
  }
  return INITIAL_WISHES;
}

/**
 * Encode surprise data into URL hash for direct sharing
 */
export function encodeSurpriseToUrl(data: BirthdaySurpriseData): string {
  try {
    // Exclude large photo dataUrl from URL to avoid exceeding browser URL length limits
    const payload = {
      n: data.name,
      a: data.age,
      m: data.message,
      d: data.birthDate,
      t: data.theme,
      c: data.creatorName || '',
    };
    const json = JSON.stringify(payload);
    const encoded = btoa(encodeURIComponent(json));
    const url = new URL(window.location.href);
    url.searchParams.delete('surprise');
    url.hash = `surprise=${encoded}`;
    return url.toString();
  } catch (e) {
    console.error('Error generating share URL:', e);
    return window.location.href;
  }
}

/**
 * Try to parse surprise data from URL hash or query params
 */
export function loadSurpriseFromUrl(): BirthdaySurpriseData | null {
  if (typeof window === 'undefined') return null;
  try {
    let encodedStr = '';
    const hash = window.location.hash;
    if (hash.includes('surprise=')) {
      encodedStr = hash.split('surprise=')[1]?.split('&')[0] || '';
    } else {
      const params = new URLSearchParams(window.location.search);
      encodedStr = params.get('surprise') || '';
    }

    if (!encodedStr) return null;

    const decodedJson = decodeURIComponent(atob(encodedStr));
    const obj = JSON.parse(decodedJson);
    if (obj && obj.n && obj.a) {
      return {
        name: obj.n,
        age: Number(obj.a),
        message: obj.m || '',
        birthDate: obj.d || new Date().toISOString().split('T')[0],
        theme: ['pink', 'purple', 'blue', 'gold'].includes(obj.t) ? obj.t : 'pink',
        creatorName: obj.c || '',
      };
    }
  } catch (e) {
    console.error('Error reading surprise from URL:', e);
  }
  return null;
}
