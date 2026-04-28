'use client';

import { useState, useEffect, useRef } from 'react';
import { usePlayerStore } from '@/store/playerStore';

const STREAM_URL = 'https://stream.hoperadio.fr/hoperadio';
const POLL_INTERVAL = 30_000;

function parseXmlMeta(xml: string) {
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  const get = (tag: string) => doc.querySelector(tag)?.textContent?.trim() ?? '';
  return {
    title: get('titre'),
    artist: get('artiste'),
    coverUrl: get('cover_url'),
  };
}

export default function RadioPlayer() {
  const isVisible = usePlayerStore((s) => s.isVisible);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const meta = usePlayerStore((s) => s.meta);
  const setPlaying = usePlayerStore((s) => s.setPlaying);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const setMeta = usePlayerStore((s) => s.setMeta);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Create audio element once + écouter les événements de buffering
  useEffect(() => {
    const audio = new Audio(STREAM_URL);
    audio.preload = 'none';
    audioRef.current = audio;

    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);
    const onError   = () => { setIsLoading(false); setPlaying(false); };

    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('error',   onError);

    return () => {
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('error',   onError);
      audio.pause();
      audio.src = '';
    };
  }, [setPlaying]);

  // Sync play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      setIsLoading(true);
      audio.play().catch(() => { setIsLoading(false); setPlaying(false); });
    } else {
      audio.pause();
    }
  }, [isPlaying, setPlaying]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Poll metadata every 30s — does not touch audio
  useEffect(() => {
    async function fetchMeta() {
      try {
        const res = await fetch('/api/radio-meta');
        const xml = await res.text();
        setMeta(parseXmlMeta(xml));
      } catch {
        // silently ignore
      }
    }
    fetchMeta();
    const id = setInterval(fetchMeta, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [setMeta]);

  if (!isVisible) return null;

  const togglePlay = () => setPlaying(!isPlaying);

  return (
    <div
      className="fixed bottom-0 left-0 w-full z-50 flex items-center py-2"
      style={{ backgroundColor: '#310C52' }}
    >
      {/* ── Desktop layout (≥980px) ── */}
      <div className="hidden min-[980px]:flex w-full items-center gap-4 px-6" style={{ height: '95px' }}>
        {/* Play/Pause */}
        <button
          type="button"
          aria-label={isLoading ? 'Chargement…' : isPlaying ? 'Pause' : 'Play'}
          onClick={togglePlay}
          className="shrink-0 flex items-center justify-center rounded-full bg-secondary cursor-pointer"
          style={{ width: '72px', height: '72px' }}
        >
          {isLoading ? (
            <div className="w-8 h-8 border-4 border-black/30 border-t-black rounded-full animate-spin" />
          ) : isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="28" viewBox="0 0 21 28" fill="none">
              <path d="M8 28H0V0H8V28ZM21 28H13V0H21V28Z" fill="#0A0B0A"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 20 24" fill="none">
              <path d="M0 0L20 12L0 24V0Z" fill="#0A0B0A"/>
            </svg>
          )}
        </button>

        {/* Cover */}
        {meta?.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={meta.coverUrl}
            alt={meta.title}
            width={95}
            height={95}
            className="shrink-0 object-cover rounded-md"
            style={{ width: '95px', height: '95px' }}
          />
        ) : (
          <div className="shrink-0 bg-brand-violet" style={{ width: '95px', height: '95px' }} />
        )}

        {/* Track info */}
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <span
            className="font-nav font-[900] leading-[20px]"
            style={{ color: '#E85B21', fontSize: '12px' }}
          >
            HOPE RADIO - LE DIRECT
          </span>
          <span
            className="font-nav font-[900] leading-[110%] truncate"
            style={{ color: '#fff', fontSize: '28px' }}
          >
            {meta?.title ?? '—'}
          </span>
          <span
            className="font-heading font-[700] leading-[116%] uppercase truncate pt-2"
            style={{ color: '#fff', fontSize: '10px' }}
          >
            {meta?.artist ?? ''}
          </span>
        </div>

        {/* Decorative icons (♡ share) */}
        <div className="flex items-center gap-4 shrink-0">
          <button type="button" aria-label="Aimer" className="text-white/60 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 22 20" fill="none">
              <path d="M11 19L9.55 17.7C4.4 13.1 1 10.1 1 6.5C1 3.5 3.5 1 6.5 1C8.2 1 9.85 1.81 11 3.09C12.15 1.81 13.8 1 15.5 1C18.5 1 21 3.5 21 6.5C21 10.1 17.6 13.1 12.45 17.7L11 19Z" stroke="white" strokeOpacity="0.6" strokeWidth="1.5"/>
            </svg>
          </button>
          <button type="button" aria-label="Partager" className="text-white/60 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="16" cy="4" r="2.5" stroke="white" strokeOpacity="0.6" strokeWidth="1.5"/>
              <circle cx="4" cy="10" r="2.5" stroke="white" strokeOpacity="0.6" strokeWidth="1.5"/>
              <circle cx="16" cy="16" r="2.5" stroke="white" strokeOpacity="0.6" strokeWidth="1.5"/>
              <line x1="6.4" y1="11.2" x2="13.6" y2="15.2" stroke="white" strokeOpacity="0.6" strokeWidth="1.5"/>
              <line x1="13.6" y1="5.2" x2="6.4" y2="9.2" stroke="white" strokeOpacity="0.6" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 shrink-0 ml-[84px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
            <path d="M0 6V12H4L9 17V1L4 6H0ZM13.5 9C13.5 7.23 12.48 5.71 11 4.97V13.02C12.48 12.29 13.5 10.77 13.5 9ZM11 0.23V2.29C13.89 3.15 16 5.83 16 9C16 12.17 13.89 14.85 11 15.71V17.77C15.01 16.86 18 13.28 18 9C18 4.72 15.01 1.14 11 0.23Z" fill="white" fillOpacity="0.8"/>
          </svg>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            aria-label="Volume"
            className="w-24 accent-white cursor-pointer"
          />
        </div>

        {/* Réagissez en direct */}
        <button
          type="button"
          className="shrink-0 flex items-center gap-3 rounded-[30px] text-white font-button font-semibold text-[14px] px-[24px] h-[50px] cursor-pointer"
          style={{ backgroundColor: '#5A3D75' }}
        >
          Réagissez en direct
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="19" viewBox="0 0 26 19" fill="none">
            <path d="M19 0C22.866 1.93277e-07 26 3.13401 26 7C26 10.866 22.866 14 19 14H8.16504L6 19L3.4043 13.0059C1.3652 11.7824 0 9.55105 0 7C0 3.13401 3.13401 1.93277e-07 7 0H19Z" fill="white"/>
          </svg>
        </button>
      </div>

      {/* ── Mobile layout (<980px) ── */}
      <div className="flex min-[980px]:hidden w-full items-center gap-3 px-4" style={{ height: '85px' }}>
        {/* Cover */}
        {meta?.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={meta.coverUrl}
            alt={meta.title}
            width={65}
            height={65}
            className="shrink-0 object-cover"
            style={{ width: '65px', height: '65px' }}
          />
        ) : (
          <div className="shrink-0 bg-brand-violet" style={{ width: '65px', height: '65px' }} />
        )}

        {/* Track info */}
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <span
            className="font-nav font-[900] leading-[20px]"
            style={{ color: '#E85B21', fontSize: '12px' }}
          >
            Le direct
          </span>
          <span
            className="font-nav font-[900] leading-[110%] truncate"
            style={{ color: '#fff', fontSize: '20px' }}
          >
            {meta?.title ?? '—'}
          </span>
          <span
            className="font-heading font-[700] leading-[116%] uppercase truncate"
            style={{ color: '#fff', fontSize: '10px' }}
          >
            {meta?.artist ?? ''}
          </span>
        </div>

        {/* Réagissez (speech bubble icon) */}
        <button
          type="button"
          aria-label="Réagissez en direct"
          className="shrink-0 flex items-center justify-center rounded-full cursor-pointer"
          style={{ backgroundColor: '#5A3D75', width: '56px', height: '56px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="19" viewBox="0 0 26 19" fill="none">
            <path d="M19 0C22.866 1.93277e-07 26 3.13401 26 7C26 10.866 22.866 14 19 14H8.16504L6 19L3.4043 13.0059C1.3652 11.7824 0 9.55105 0 7C0 3.13401 3.13401 1.93277e-07 7 0H19Z" fill="white"/>
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          type="button"
          aria-label={isLoading ? 'Chargement…' : isPlaying ? 'Pause' : 'Play'}
          onClick={togglePlay}
          className="shrink-0 flex items-center justify-center rounded-full bg-secondary cursor-pointer"
          style={{ width: '56px', height: '56px' }}
        >
          {isLoading ? (
            <div className="w-7 h-7 border-4 border-black/30 border-t-black rounded-full animate-spin" />
          ) : isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="21" viewBox="0 0 21 28" fill="none">
              <path d="M8 28H0V0H8V28ZM21 28H13V0H21V28Z" fill="#0A0B0A"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 20 24" fill="none">
              <path d="M0 0L20 12L0 24V0Z" fill="#0A0B0A"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
