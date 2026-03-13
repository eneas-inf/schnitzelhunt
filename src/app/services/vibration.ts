import { Haptics } from '@capacitor/haptics';

export function vibratePattern(...pattern: number[]): void {
  let delay = 0;
  for (let i = 0; i < pattern.length; i++) {
    const ms = pattern[i];
    if (i % 2 === 0) {
      setTimeout(() => Haptics.vibrate({ duration: ms }), delay);
    }
    delay += ms;
  }
}
