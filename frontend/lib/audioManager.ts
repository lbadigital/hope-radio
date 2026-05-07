const STREAM_BASE_URL =
  process.env.NEXT_PUBLIC_STREAM_URL ?? 'https://stream.hoperadio.fr/hoperadio';

export const STREAM_ORIGIN = (() => {
  try { return new URL(STREAM_BASE_URL).origin; } catch { return ''; }
})();

export function buildStreamUrl(): string {
  return `${STREAM_BASE_URL}?t=${Date.now()}`;
}

let _audio: HTMLAudioElement | null = null;

export function getAudio(): HTMLAudioElement {
  if (!_audio) {
    _audio = new Audio();
    _audio.crossOrigin = 'anonymous';
    _audio.preload = 'none';
  }
  return _audio;
}

/**
 * Start buffering before the user clicks — call on hover / touchstart.
 * No-ops if already loading or playing.
 */
export function preWarm(): void {
  if (typeof window === 'undefined') return;
  const audio = getAudio();
  if (audio.getAttribute('src')) return;
  audio.src = buildStreamUrl();
  audio.load();
}

/**
 * Cancel a pre-warm if the user left without clicking.
 * No-ops if playback is active or meaningful data was received.
 */
export function cancelPreWarm(): void {
  const audio = _audio;
  if (!audio || !audio.paused) return;
  audio.src = '';
}
