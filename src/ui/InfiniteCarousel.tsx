import { useEffect, useRef, useState } from 'react';

interface InfiniteCarouselProps {
  colorClass?: string;
  bgClass?: string;
  speed?: number;
  iconSize?: number;
  gap?: number;
  direction?: 'left' | 'right';
}

/**
 * InfiniteCarousel
 *
 * Props:
 *   colorClass — Tailwind text color class (default: "text-indigo-500")
 *   bgClass    — Tailwind bg class for the wrapper (default: "bg-slate-950")
 *   speed      — scroll speed in px/ms (default: 0.05)
 *   iconSize   — icon size in px (default: 64)
 *   gap        — gap between icons in px (default: 48)
 */
export default function InfiniteCarousel({
  colorClass = 'text-olivine-700',
  speed = 0.05,
  iconSize = 64,
  gap = 48,
  direction = 'left',
}: InfiniteCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const posRef = useRef<number>(0);
  const lastRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  const SET_W = icons.length * (iconSize + gap);

  useEffect(() => {
    if (direction === 'right' && posRef.current === 0) posRef.current = -SET_W;

    const tick = (ts: number) => {
      if (lastRef.current === null) lastRef.current = ts;
      const dt = ts - lastRef.current;
      lastRef.current = ts;

      if (!paused) {
        if (direction === 'left') {
          posRef.current -= speed * dt;
          if (posRef.current <= -SET_W) posRef.current += SET_W;
        } else {
          posRef.current += speed * dt;
          if (posRef.current >= 0) posRef.current -= SET_W;
        }
        if (trackRef.current)
          trackRef.current.style.transform = `translateX(${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, speed, SET_W, direction]);

  const loopIcons = [...icons, ...icons, ...icons];

  return (
    <div
      className={`bg-transparent flex items-center justify-center overflow-hidden w-full min-w-0`}
    >
      <div className="relative w-full min-w-0 overflow-hidden">
        {/* Edge fades */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16"
          style={{
            background: 'inherit',
            maskImage: 'linear-gradient(to right, black, transparent)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16"
          style={{
            background: 'inherit',
            maskImage: 'linear-gradient(to left, black, transparent)',
          }}
        />

        {/* Track */}
        <div
          ref={trackRef}
          className="flex items-center py-4 w-max"
          style={{ gap, willChange: 'transform' }}
        >
          {loopIcons.map((icon, i) => (
            <div
              key={i}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              className={`shrink-0 transition-all duration-200 hover:scale-110 hover:opacity-100 opacity-70 ${colorClass}`}
              style={{ width: iconSize, height: iconSize }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const icons = [
  // Package
  <svg
    key="1"
    viewBox="0 0 64 64"
    className="w-full h-full"
    fill="currentColor"
  >
    <rect
      x="8"
      y="16"
      width="48"
      height="40"
      rx="2"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect
      x="8"
      y="16"
      width="48"
      height="8"
      fillOpacity="0.4"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M28 16V56M36 16V56" stroke="currentColor" strokeWidth="2" />
    <rect x="28" y="32" width="8" height="12" />
  </svg>,
  // Box 3D
  <svg
    key="2"
    viewBox="0 0 64 64"
    className="w-full h-full"
    fill="currentColor"
  >
    <path
      d="M8 24L32 12L56 24V48L32 60L8 48V24Z"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M32 36V60M8 24L32 36L56 24M20 18L44 30"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>,
  // Delivery
  <svg
    key="3"
    viewBox="0 0 64 64"
    className="w-full h-full"
    fill="currentColor"
  >
    <rect
      x="6"
      y="20"
      width="52"
      height="36"
      rx="3"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M6 32H58" stroke="currentColor" strokeWidth="2" />
    <rect x="24" y="38" width="16" height="8" rx="1" />
    <path
      d="M16 20V14C16 12.9 16.9 12 18 12H46C47.1 12 48 12.9 48 14V20"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>,
  // Gift
  <svg
    key="4"
    viewBox="0 0 64 64"
    className="w-full h-full"
    fill="currentColor"
  >
    <rect
      x="8"
      y="24"
      width="48"
      height="32"
      rx="2"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect
      x="8"
      y="24"
      width="48"
      height="10"
      fillOpacity="0.4"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect x="28" y="24" width="8" height="32" />
    <path d="M32 24V8" stroke="currentColor" strokeWidth="3" />
    <path
      d="M32 8C32 8 24 8 20 12S20 20 24 20S32 16 32 16M32 8C32 8 40 8 44 12S44 20 40 20S32 16 32 16"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>,
  // Shipping
  <svg
    key="5"
    viewBox="0 0 64 64"
    className="w-full h-full"
    fill="currentColor"
  >
    <rect
      x="4"
      y="22"
      width="56"
      height="34"
      rx="2"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M4 30H60M32 22V56"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="4 2"
    />
    <circle cx="20" cy="42" r="6" />
    <circle cx="44" cy="42" r="6" />
  </svg>,
  // Parcel
  <svg
    key="6"
    viewBox="0 0 64 64"
    className="w-full h-full"
    fill="currentColor"
  >
    <path
      d="M12 20L32 8L52 20V44L32 56L12 44V20Z"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M32 32V56M12 20L32 32L52 20M22 14L42 26"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="32" cy="20" r="4" />
  </svg>,
  // Carton
  <svg
    key="7"
    viewBox="0 0 64 64"
    className="w-full h-full"
    fill="currentColor"
  >
    <rect
      x="10"
      y="18"
      width="44"
      height="38"
      rx="2"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M10 26H54" stroke="currentColor" strokeWidth="2" />
    <path
      d="M10 18L18 10H46L54 18"
      stroke="currentColor"
      strokeWidth="2"
      fillOpacity="0.3"
    />
    <rect x="26" y="34" width="12" height="14" rx="1" fillOpacity="0.6" />
  </svg>,
  // Express
  <svg
    key="8"
    viewBox="0 0 64 64"
    className="w-full h-full"
    fill="currentColor"
  >
    <rect
      x="8"
      y="16"
      width="48"
      height="36"
      rx="3"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M8 28H56" stroke="currentColor" strokeWidth="2" />
    <path
      d="M20 36L26 42L44 24"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>,
];
