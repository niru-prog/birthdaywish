import confetti from 'canvas-confetti';

/**
 * Triggers a lively burst of colorful confetti in the center
 */
export function fireConfetti(options?: confetti.Options) {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#eab308', '#10b981'],
      ...options,
    });
  } catch (e) {
    console.error('Confetti trigger error', e);
  }
}

/**
 * Massive celebration explosion with side cannons (for candle extinguish or envelope open)
 */
export function fireCelebrationCannons() {
  try {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#ec4899', '#f43f5e', '#fbbf24'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#a855f7', '#6366f1', '#38bdf8'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      shapes: ['circle'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  } catch (e) {
    console.error('Celebration confetti error', e);
  }
}

/**
 * Star sparkle confetti
 */
export function fireStars() {
  try {
    confetti({
      shapes: ['star'],
      particleCount: 40,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#f59e0b', '#f43f5e', '#a855f7'],
      scalar: 1.2,
    });
  } catch (e) {
    console.error('Stars confetti error', e);
  }
}
