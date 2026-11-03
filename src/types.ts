export type ThemeColor = 'pink' | 'purple' | 'blue' | 'gold';

export interface BirthdaySurpriseData {
  name: string;
  age: number;
  message: string;
  birthDate: string; // YYYY-MM-DD
  photoUrl?: string; // Data URL or URL
  theme: ThemeColor;
  creatorName?: string;
}

export interface WishNote {
  id: string;
  author: string;
  content: string;
  color: 'yellow' | 'pink' | 'purple' | 'green' | 'blue';
  rotation: number; // degrees for organic sticky note look
  createdAt: string;
}

export interface PoppedWish {
  id: string;
  message: string;
  author: string;
}
