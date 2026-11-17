import React from 'react';

export interface DoodleIconProps {
  className?: string;
  size?: number;
  title?: string;
}

/**
 * Hand-sketched organic 5-point star with slightly offset butter-yellow fill
 */
export const DoodleStar: React.FC<DoodleIconProps> = ({ className = '', size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden={title ? undefined : true}
    role={title ? 'img' : undefined}
    className={`inline-block shrink-0 ${className}`}
  >
    {title && <title>{title}</title>}
    {/* Offset pastel fill */}
    <path
      d="M15.1 4.2c.6 3.5 1.8 5.6 4.9 6.6 2.8.9 4.5 1.2 4.3 2.1-.2.9-2.7 2-4.8 4.1-1.6 1.6-2 4.3-1.6 6.8.2 1.2-.8 1.7-1.8 1-2.2-1.5-4.3-2.3-6.8-.8-1.9 1.1-3.4 1.6-3.8.6-.4-1 .5-3.4-.3-5.6-.8-2.1-3.1-3.4-4.2-4.4-.9-.8-.2-1.7 1.2-1.9 2.7-.4 4.8-1.5 6.1-4.2 1.1-2.3 1.9-4.5 2.8-4.5.6 0 1.4.8 2 2.2Z"
      fill="#FFE566"
    />
    {/* Hand-drawn ink outline */}
    <path
      d="M13.8 3.2c.8 2.9 2.2 5.4 5.3 6.3 2.6.8 4.9 1.1 4.8 2-.1 1-2.8 2.2-4.7 4.2-1.6 1.7-1.9 4.5-1.4 7 .2 1.1-.7 1.6-1.7.9-2.2-1.6-4.4-2.1-6.9-.5-1.8 1.2-3.2 1.5-3.5.5-.4-1.1.7-3.6-.2-5.7-.8-2-3.2-3.3-4.3-4.3-.9-.8-.1-1.7 1.4-1.9 2.8-.3 4.8-1.6 6.1-4.3 1.1-2.3 1.9-4.4 2.9-4.4.7 0 1.5.8 2.2 2.2Z"
      stroke="#18181B"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M11.2 11.5c.7-.5 1.6-.6 2.4-.3" stroke="#18181B" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/**
 * Cute four-point hand-drawn sparkle mark (minimal ink accent)
 */
export const DoodleSpark: React.FC<DoodleIconProps> = ({ className = '', size = 18, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden={title ? undefined : true}
    className={`inline-block shrink-0 ${className}`}
  >
    {title && <title>{title}</title>}
    <path
      d="M12 2.5c.5 4.3 2.2 6.8 6.8 7.6-4.4.9-6.2 3.2-6.8 8.4-.7-5.1-2.5-7.4-7-8.4 4.5-.8 6.3-3.3 7-7.6Z"
      fill="#FFE566"
      stroke="#18181B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="19.2" cy="5.2" r="1.3" fill="#FF94B9" />
  </svg>
);

/**
 * Cozy hand-drawn campfire / streak flame with tiny friendly eyes
 */
export const DoodleFire: React.FC<DoodleIconProps> = ({ className = '', size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden={title ? undefined : true}
    className={`inline-block shrink-0 ${className}`}
  >
    {title && <title>{title}</title>}
    <path
      d="M15.2 3.6c.4 3.4-1.6 5.4-1.3 7.6.3 1.5 2 1.8 2.9.2.9-1.5 1.3-2.6 1.8-2.4 2.5 2.3 4.3 5.7 4 9.2-.4 4.4-4 7.3-8.6 7.2-4.8-.1-8.2-3.4-8.1-8 .1-3.9 2.5-6.9 5.3-9.8 1.5-1.6 2.8-3 4-4Z"
      fill="#FDBA74"
    />
    <path
      d="M14.3 13.8c1.7 1.5 2.8 3.6 2.6 5.8-.2 2.4-2 4.1-4.4 4.1-2.5 0-4.3-1.8-4.2-4.2.1-2.1 1.4-3.8 3.1-5.5.9-.9 2-.9 2.9-.2Z"
      fill="#FFE566"
    />
    <path
      d="M14.6 3.2c.5 3.4-1.6 5.5-1.2 7.7.3 1.5 2 1.8 2.9.2.8-1.4 1.3-2.5 1.8-2.3 2.5 2.3 4.2 5.7 3.9 9.2-.4 4.4-3.9 7.3-8.5 7.2-4.7-.1-8.1-3.4-8-8 .1-3.9 2.5-6.9 5.2-9.8 1.5-1.6 2.8-3 3.9-4.2Z"
      stroke="#18181B"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="11.6" cy="18.6" r="1.05" fill="#18181B" />
    <circle cx="15.7" cy="18.6" r="1.05" fill="#18181B" />
    <path d="M12.9 20.4c.5.5 1.2.5 1.7 0" stroke="#18181B" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/**
 * Plump hand-drawn heart with soft highlight mark
 */
export const DoodleHeart: React.FC<DoodleIconProps & { muted?: boolean }> = ({
  className = '',
  size = 20,
  muted = false,
  title,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden={title ? undefined : true}
    className={`inline-block shrink-0 ${className}`}
  >
    {title && <title>{title}</title>}
    <path
      d="M14.4 23.8c-.7.5-1.4.4-2.1-.1-4.5-3.3-8.6-7.4-8.5-12.3.1-3.5 2.7-5.9 5.9-5.8 2 .1 3.6 1.2 4.6 2.8 1.1-1.7 2.8-2.9 5-2.8 3.3.1 5.6 2.7 5.5 6.1-.2 4.9-5.3 9.1-10.4 12.1Z"
      fill={muted ? '#E5E7EB' : '#FF94B9'}
    />
    <path
      d="M13.9 23.4c-.6.4-1.3.4-2-.1C7.5 20 3.5 15.9 3.6 11c.1-3.5 2.7-5.9 5.8-5.8 2 .1 3.6 1.2 4.6 2.8 1.1-1.7 2.8-2.9 4.9-2.8 3.3.1 5.6 2.7 5.5 6.1-.2 4.9-5.2 9.1-10.5 12.1Z"
      stroke={muted ? '#9CA3AF' : '#18181B'}
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {!muted && (
      <path d="M7.3 9.6c.4-1.3 1.4-2 2.6-2" stroke="#FFFFFF" strokeWidth="1.9" strokeLinecap="round" />
    )}
  </svg>
);

/**
 * Hand-drawn cracked heart (gentle comic style instead of harsh skull emoji)
 */
export const DoodleBrokenHeart: React.FC<DoodleIconProps> = ({ className = '', size = 22, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden={title ? undefined : true}
    className={`inline-block shrink-0 ${className}`}
  >
    {title && <title>{title}</title>}
    <path
      d="M13.9 23.4c-.6.4-1.3.4-2-.1C7.5 20 3.5 15.9 3.6 11c.1-3.5 2.7-5.9 5.8-5.8 2 .1 3.6 1.2 4.6 2.8 1.1-1.7 2.8-2.9 4.9-2.8 3.3.1 5.6 2.7 5.5 6.1-.2 4.9-5.2 9.1-10.5 12.1Z"
      fill="#FECDD3"
      stroke="#18181B"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 8.2l-2 4.1 3.2 2.2-2.1 4.6"
      stroke="#18181B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Hand-drawn brown-sugar boba milk tea cup (signature Ing Lịch Tét icon!)
 */
export const DoodleBoba: React.FC<DoodleIconProps> = ({ className = '', size = 22, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden={title ? undefined : true}
    className={`inline-block shrink-0 ${className}`}
  >
    {title && <title>{title}</title>}
    {/* Straw */}
    <path d="M15.8 2.5l2.2-.4-1.6 6.8h-2.1l1.5-6.4Z" fill="#FF94B9" stroke="#18181B" strokeWidth="1.8" strokeLinejoin="round" />
    {/* Cup body */}
    <path d="M7.4 9.2h13.2l-1.7 14.2c-.1 1-.9 1.7-1.9 1.7H11c-1 0-1.8-.7-1.9-1.7L7.4 9.2Z" fill="#FDE68A" stroke="#18181B" strokeWidth="2" strokeLinejoin="round" />
    {/* Milk foam wave */}
    <path d="M7.8 12.4c2 .9 4-.7 6.1.1 2.1.8 4-.6 6.1.1" stroke="#18181B" strokeWidth="1.6" strokeLinecap="round" />
    {/* Dome lid */}
    <path d="M6.2 9.2h15.6" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" />
    {/* Tapioca pearls */}
    <circle cx="11.2" cy="21.5" r="1.35" fill="#18181B" />
    <circle cx="14.3" cy="22.1" r="1.35" fill="#18181B" />
    <circle cx="16.9" cy="21.2" r="1.35" fill="#18181B" />
    <circle cx="12.8" cy="19.4" r="1.2" fill="#18181B" />
  </svg>
);

/**
 * Open hand-drawn study notebook with bookmark ribbon
 */
export const DoodleBook: React.FC<DoodleIconProps> = ({ className = '', size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden={title ? undefined : true}
    className={`inline-block shrink-0 ${className}`}
  >
    {title && <title>{title}</title>}
    <path
      d="M4.2 6.8c3.2-.8 6.6-.5 9.8 1.1 3.2-1.6 6.6-1.9 9.8-1.1v14.5c-3.2-.7-6.6-.4-9.8 1.2-3.2-1.6-6.6-1.9-9.8-1.2V6.8Z"
      fill="#FEF3C7"
      stroke="#18181B"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M14 7.9v14.6" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
    <path d="M7.2 11.2h4.2M7.2 14.5h4.2M16.6 11.2h4.2M16.6 14.5h3.4" stroke="#18181B" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M19.2 6.4v5.5l-1.5-1.1-1.5 1.1V6.6" fill="#FF94B9" stroke="#18181B" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

/**
 * Chubby hand-drawn pencil with little scribble trail
 */
export const DoodlePencil: React.FC<DoodleIconProps> = ({ className = '', size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden={title ? undefined : true}
    className={`inline-block shrink-0 ${className}`}
  >
    {title && <title>{title}</title>}
    <path d="M18.6 4.6l4.8 4.8-11.8 11.8-6.1 1.5 1.5-6.1L18.6 4.6Z" fill="#FFE566" stroke="#18181B" strokeWidth="2.1" strokeLinejoin="round" />
    <path d="M16.4 6.8l4.8 4.8" stroke="#18181B" strokeWidth="1.9" strokeLinecap="round" />
    <path d="M18.6 4.6l1.7-1.7c.9-.9 2.3-.9 3.2 0l1.6 1.6c.9.9.9 2.3 0 3.2l-1.7 1.7" fill="#FF94B9" stroke="#18181B" strokeWidth="2" strokeLinejoin="round" />
    <path d="M14.2 23.2c2.1-.9 4 .8 6.1-.2 1.4-.6 2.4-.2 3.3.1" stroke="#18181B" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * Retro hand-drawn studio microphone
 */
export const DoodleMic: React.FC<DoodleIconProps> = ({ className = '', size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden={title ? undefined : true}
    className={`inline-block shrink-0 ${className}`}
  >
    {title && <title>{title}</title>}
    <rect x="9.5" y="3.5" width="9" height="13" rx="4.5" fill="#67E8F9" stroke="#18181B" strokeWidth="2.1" />
    <path d="M10 9.5h8M11 12.5h6" stroke="#18181B" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M6.5 12.5c0 4.2 3.3 7.3 7.5 7.3s7.5-3.1 7.5-7.3" stroke="#18181B" strokeWidth="2.1" strokeLinecap="round" />
    <path d="M14 19.8v4.4M9.8 24.2h8.4" stroke="#18181B" strokeWidth="2.1" strokeLinecap="round" />
  </svg>
);

/**
 * Hand-drawn bullseye target with tiny feathered dart
 */
export const DoodleTarget: React.FC<DoodleIconProps> = ({ className = '', size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden={title ? undefined : true}
    className={`inline-block shrink-0 ${className}`}
  >
    {title && <title>{title}</title>}
    <circle cx="13.5" cy="14.5" r="9.5" fill="#FFE4E6" stroke="#18181B" strokeWidth="2.1" />
    <circle cx="13.5" cy="14.5" r="5.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="1.9" />
    <circle cx="13.5" cy="14.5" r="2.3" fill="#FF94B9" stroke="#18181B" strokeWidth="1.7" />
    <path d="M14.2 13.8L23.5 4.5M20.2 4.5h3.3v3.3" stroke="#18181B" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Cute hand-drawn golden trophy cup
 */
export const DoodleTrophy: React.FC<DoodleIconProps> = ({ className = '', size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden={title ? undefined : true}
    className={`inline-block shrink-0 ${className}`}
  >
    {title && <title>{title}</title>}
    <path d="M8.5 5h11v6.2c0 3.3-2.4 5.8-5.5 5.8s-5.5-2.5-5.5-5.8V5Z" fill="#FFE566" stroke="#18181B" strokeWidth="2.1" strokeLinejoin="round" />
    <path d="M8.5 7H5.2c-.3 2.8 1.1 4.6 3.5 4.9M19.5 7h3.3c.3 2.8-1.1 4.6-3.5 4.9" stroke="#18181B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 17v4.2M9.5 23.5h9l-1-2.3h-7l-1 2.3Z" fill="#FDBA74" stroke="#18181B" strokeWidth="2" strokeLinejoin="round" />
    <path d="M12.2 9.4l1.2 1.2 2.4-2.3" stroke="#18181B" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Hand-drawn idea lightbulb with warm glow rays
 */
export const DoodleBulb: React.FC<DoodleIconProps> = ({ className = '', size = 20, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden={title ? undefined : true}
    className={`inline-block shrink-0 ${className}`}
  >
    {title && <title>{title}</title>}
    <path
      d="M14 5.2c-3.9 0-6.8 2.8-6.8 6.5 0 2.4 1.3 4.2 2.8 5.6.6.6.9 1.3 1 2.2h6c.1-.9.4-1.6 1-2.2 1.5-1.4 2.8-3.2 2.8-5.6 0-3.7-2.9-6.5-6.8-6.5Z"
      fill="#FFE566"
      stroke="#18181B"
      strokeWidth="2.1"
      strokeLinejoin="round"
    />
    <path d="M11.2 22.2h5.6M12.2 24.6h3.6" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 1.8v1.5M4.4 6.6l1.3 1M23.6 6.6l-1.3 1" stroke="#18181B" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);

/**
 * Hand-drawn stationery pushpin / note tack
 */
export const DoodlePin: React.FC<DoodleIconProps> = ({ className = '', size = 18, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden={title ? undefined : true}
    className={`inline-block shrink-0 ${className}`}
  >
    {title && <title>{title}</title>}
    <path
      d="M14.5 3.8l5.7 5.7-2.2 1.4-2.5 4.2 1.1 2.2-1.5 1.5-4.1-4.1-5.2 5.2m8.7-16.1l-1.5 1.5 1.1 1.1-4.2 2.5-2.2-1.1-1.5 1.5 4.1 4.1"
      stroke="#18181B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="15.2" cy="8.8" r="3.4" fill="#FF94B9" stroke="#18181B" strokeWidth="1.9" />
  </svg>
);

/**
 * Hand-drawn round checkmark sticker
 */
export const DoodleCheck: React.FC<DoodleIconProps> = ({ className = '', size = 18, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden={title ? undefined : true}
    className={`inline-block shrink-0 ${className}`}
  >
    {title && <title>{title}</title>}
    <circle cx="12" cy="12" r="9.2" fill="#6EE7B7" stroke="#18181B" strokeWidth="2" />
    <path d="M8.1 12.3l2.6 2.7 5.4-5.7" stroke="#18181B" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Hand-drawn highlighter brush stroke underline
 */
export const DoodleUnderline: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#FF94B9',
}) => (
  <svg
    viewBox="0 0 210 16"
    fill="none"
    preserveAspectRatio="none"
    aria-hidden="true"
    className={`w-full h-3 pointer-events-none select-none ${className}`}
  >
    <path
      d="M4 10.5C52 4.2 138 3.6 206 9.2"
      stroke={color}
      strokeWidth="6.5"
      strokeLinecap="round"
      opacity="0.65"
    />
    <path
      d="M8 12.2C64 7.4 142 6.8 202 11.4"
      stroke="#18181B"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const WASHI_TONES: Record<
  'pink' | 'yellow' | 'mint' | 'sky' | 'lavender' | 'peach',
  string
> = {
  pink: 'bg-[#FFD6E5] text-[#4A1026]',
  yellow: 'bg-[#FFF099] text-[#3B2F00]',
  mint: 'bg-[#C6F6DF] text-[#0B3B28]',
  sky: 'bg-[#CCF2FF] text-[#0C3547]',
  lavender: 'bg-[#E5DCFF] text-[#2B195A]',
  peach: 'bg-[#FFE2C2] text-[#4A2104]',
};

/**
 * Matte stationery washi-tape / paper label replacing harsh pulsing neon badges
 */
export const WashiTapeBadge: React.FC<{
  children: React.ReactNode;
  tone?: 'pink' | 'yellow' | 'mint' | 'sky' | 'lavender' | 'peach';
  rotate?: 'left' | 'right' | 'none';
  className?: string;
}> = ({ children, tone = 'yellow', rotate = 'none', className = '' }) => {
  const rotClass =
    rotate === 'left' ? '-rotate-2' : rotate === 'right' ? 'rotate-2' : '';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border-2 border-black font-black text-[10px] sm:text-xs tracking-wide shadow-neo-sm select-none ${WASHI_TONES[tone]} ${rotClass} ${className}`}
    >
      {children}
    </span>
  );
};

export type MascotStickerPath =
  | '/doodles/mascot-study.png'
  | '/doodles/mascot-streak.png'
  | '/doodles/mascot-hearts.png'
  | '/doodles/mascot-victory.png';

/**
 * Renders one of the 4 cozy 2D hand-drawn mascot stickers with layout-safe sizing
 */
export const MascotSticker: React.FC<{
  src: MascotStickerPath;
  alt: string;
  className?: string;
  size?: number;
}> = ({ src, alt, className = '', size = 84 }) => (
  <img
    src={src}
    alt={alt}
    width={size}
    height={size}
    loading="eager"
    decoding="async"
    onError={(e) => {
      (e.currentTarget as HTMLImageElement).style.display = 'none';
    }}
    className={`object-contain select-none pointer-events-none ${className}`}
  />
);
