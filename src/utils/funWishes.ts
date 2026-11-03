export const BALLOON_WISHES: string[] = [
  "You bring so much sunshine wherever you go! ☀️",
  "May your year ahead be filled with zero bugs and endless coffee/boba! 🧋",
  "Officially the coolest person in the room today! 🕶️",
  "May your Spotify playlists stay immaculate this year! 🎧",
  "Universe forecast: 100% chance of greatness! 🌟",
  "Wishing you endless laughs and hilarious late-night memories! 😂",
  "You deserve all the cake, presents, and naps today! 🍰",
  "May all your exam guesses be correct this year! 🎯",
  "Another year wiser, bolder, and even more fabulous! ✨",
  "May your wifi be fast and your battery never drop below 20%! 🔋",
  "Here's to conquering every single goal you have set! 🚀",
  "You're not just a year older; you leveled up! 🎮",
  "Warning: Extreme awesomeness detected today! 🚨",
  "May your days be sweet and your troubles be tiny! 🍬",
  "Sending you giant virtual bear hugs and celebratory fist bumps! 🐻",
  "May the universe grant your biggest, boldest wish! 💫",
  "Keep being your wonderfully unique self! 🌈",
  "Best friend VIP club president for life! 👑",
  "May your year be as radiant as your smile! 😊",
  "Time to eat dessert first! 🍦",
  "Cheers to another trip around the sun in style! 🪐",
  "May joy follow you in every step you take! 🎈",
];

export function getRandomBalloonWish(): string {
  const index = Math.floor(Math.random() * BALLOON_WISHES.length);
  return BALLOON_WISHES[index];
}
