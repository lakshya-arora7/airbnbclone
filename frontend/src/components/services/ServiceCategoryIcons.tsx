import React from "react";

// 1. Photography: Realistic Camera with Lens and Leather Strap
export function PhotographyServiceIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Photography"
    >
      <defs>
        <radialGradient id="camLensGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#718096" />
          <stop offset="40%" stopColor="#2D3748" />
          <stop offset="85%" stopColor="#1A202C" />
          <stop offset="100%" stopColor="#0D1117" />
        </radialGradient>
        <radialGradient id="camGlassReflection" cx="30%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#63B3ED" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#3182CE" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2B6CB0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="camBodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A5568" />
          <stop offset="35%" stopColor="#2D3748" />
          <stop offset="100%" stopColor="#1A202C" />
        </linearGradient>
        <linearGradient id="camStrapGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C05621" />
          <stop offset="60%" stopColor="#9C4221" />
          <stop offset="100%" stopColor="#7B341E" />
        </linearGradient>
        <linearGradient id="camSilverGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EDF2F7" />
          <stop offset="50%" stopColor="#CBD5E0" />
          <stop offset="100%" stopColor="#A0AEC0" />
        </linearGradient>
      </defs>

      {/* Strap behind body */}
      <path
        d="M 12 30 C 6 22, 10 12, 18 10 C 26 8, 30 16, 26 22"
        stroke="url(#camStrapGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 52 32 C 58 24, 54 14, 46 12 C 38 10, 34 18, 38 24"
        stroke="url(#camStrapGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Shadow */}
      <ellipse cx="32" cy="52" rx="22" ry="4" fill="#000000" opacity="0.25" />

      {/* Camera Body */}
      <rect x="12" y="22" width="40" height="27" rx="5" fill="url(#camBodyGrad)" />

      {/* Top Silver Plate */}
      <path
        d="M 14 22 L 14 19 C 14 17.5, 15.5 16, 17 16 L 47 16 C 48.5 16, 50 17.5, 50 19 L 50 22 Z"
        fill="url(#camSilverGrad)"
      />

      {/* Shutter Button & Dial */}
      <rect x="18" y="13" width="6" height="3" rx="1" fill="url(#camSilverGrad)" />
      <rect x="40" y="14" width="7" height="2" rx="1" fill="#718096" />

      {/* Viewfinder Hump */}
      <path d="M 28 16 L 31 13 L 33 13 L 36 16 Z" fill="url(#camSilverGrad)" />
      <rect x="30" y="14.5" width="4" height="2" rx="0.5" fill="#1A202C" />

      {/* Grip detail */}
      <path d="M 14 24 L 18 24 C 19 24, 20 25, 20 26 L 20 46 C 20 47, 19 48, 18 48 L 14 48 Z" fill="#2D3748" opacity="0.6" />

      {/* Flash window / Red dot */}
      <rect x="22" y="18" width="4" height="3" rx="1" fill="#FEFCBF" stroke="#D69E2E" strokeWidth="0.5" />
      <circle cx="45" cy="27" r="1.5" fill="#E53E3E" />

      {/* Main Lens Barrel Ring */}
      <circle cx="33" cy="35" r="13" fill="url(#camSilverGrad)" />
      <circle cx="33" cy="35" r="11.5" fill="#1A202C" />
      <circle cx="33" cy="35" r="10" fill="url(#camLensGrad)" />
      <circle cx="33" cy="35" r="7.5" fill="#0D1117" />

      {/* Optical Glass Reflection */}
      <ellipse cx="31" cy="33" rx="6" ry="4" fill="url(#camGlassReflection)" />
      <circle cx="29.5" cy="31.5" r="1.5" fill="#FFFFFF" opacity="0.8" />
    </svg>
  );
}

// 2. Chefs: Wooden Cutting Board with Knife & Fresh Veggies
export function ChefsServiceIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Chefs"
    >
      <defs>
        <linearGradient id="boardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E2A668" />
          <stop offset="50%" stopColor="#C68545" />
          <stop offset="100%" stopColor="#9C5C28" />
        </linearGradient>
        <linearGradient id="boardSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8A4E1E" />
          <stop offset="100%" stopColor="#5E3210" />
        </linearGradient>
        <linearGradient id="knifeSteel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#E2E8F0" />
          <stop offset="80%" stopColor="#A0AEC0" />
          <stop offset="100%" stopColor="#CBD5E0" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="53" rx="23" ry="5" fill="#000000" opacity="0.2" />

      {/* Cutting Board Thickness/Side */}
      <path
        d="M 12 36 L 38 18 L 54 28 L 28 46 Z"
        fill="url(#boardSide)"
        transform="translate(0, 4)"
      />

      {/* Cutting Board Top Face (Iso angle) */}
      <path
        d="M 12 34 L 38 16 L 54 26 L 28 44 Z"
        fill="url(#boardGrad)"
      />
      {/* Board subtle bevel edge */}
      <path
        d="M 12 34 L 28 44 L 54 26"
        stroke="#F6D5A8"
        strokeWidth="1"
        fill="none"
      />

      {/* Carrot on board */}
      <path
        d="M 33 24 L 46 29 C 47 29.5, 47 31, 45.5 31.5 L 31 27 C 30 26.5, 31 24.5, 33 24 Z"
        fill="#ED8936"
      />
      {/* Carrot greens */}
      <path d="M 46 29 L 51 28 M 46.5 30 L 52 31 M 46 30.5 L 50 33" stroke="#38A169" strokeWidth="1.8" strokeLinecap="round" />

      {/* Sliced veggies (cucumber/onion rings) */}
      <ellipse cx="28" cy="27" rx="3.5" ry="2" fill="#48BB78" stroke="#2F855A" strokeWidth="0.8" />
      <ellipse cx="23" cy="30" rx="3.2" ry="1.8" fill="#F7FAFC" stroke="#E2E8F0" strokeWidth="0.8" />
      <ellipse cx="25" cy="34" rx="3.5" ry="2" fill="#E53E3E" stroke="#C53030" strokeWidth="0.8" />

      {/* Chef Knife Blade */}
      <path
        d="M 14 47 L 31 29 L 36 33 L 20 51 Z"
        fill="url(#knifeSteel)"
      />
      {/* Knife cutting edge highlight */}
      <line x1="14" y1="47" x2="20" y2="51" stroke="#FFFFFF" strokeWidth="1.2" />

      {/* Knife Handle (Black wood/Pakkawood) */}
      <path
        d="M 8 53 L 14 47 L 18 50 L 12 56 Z"
        fill="#2D3748"
      />
      {/* Knife handle rivets */}
      <circle cx="11" cy="51" r="0.8" fill="#CBD5E0" />
      <circle cx="14" cy="53" r="0.8" fill="#CBD5E0" />
    </svg>
  );
}

// 3. Training: Iron Kettlebell & Modern Stopwatch
export function TrainingServiceIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Training"
    >
      <defs>
        <radialGradient id="kettleGrad" cx="35%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#4A5568" />
          <stop offset="50%" stopColor="#2D3748" />
          <stop offset="85%" stopColor="#1A202C" />
          <stop offset="100%" stopColor="#0F1319" />
        </radialGradient>
        <linearGradient id="stopwatchGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E0" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="28" cy="53" rx="16" ry="4" fill="#000000" opacity="0.25" />
      <ellipse cx="44" cy="51" rx="9" ry="3" fill="#000000" opacity="0.2" />

      {/* Kettlebell Handle */}
      <path
        d="M 19 28 C 19 18, 35 18, 35 28"
        stroke="#2D3748"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Kettlebell Handle Top Highlight */}
      <path
        d="M 21 26 C 22 20, 32 20, 33 26"
        stroke="#718096"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Kettlebell Body Sphere */}
      <circle cx="27" cy="38" r="14" fill="url(#kettleGrad)" />
      {/* Kettlebell Flat bottom */}
      <ellipse cx="27" cy="49" rx="8" ry="2" fill="#1A202C" />
      {/* Kettlebell Weight Label */}
      <text x="27" y="40" textAnchor="middle" fill="#718096" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">
        16KG
      </text>

      {/* Stopwatch beside Kettlebell */}
      {/* Stopwatch loop & button */}
      <rect x="42.5" y="31" width="3" height="3" rx="1" fill="#718096" />
      <circle cx="44" cy="30" r="2.5" stroke="#A0AEC0" strokeWidth="1.2" fill="none" />

      {/* Stopwatch Body */}
      <circle cx="44" cy="42" r="9" fill="url(#stopwatchGrad)" stroke="#A0AEC0" strokeWidth="1" />
      <circle cx="44" cy="42" r="7.5" fill="#FFFFFF" />

      {/* Stopwatch dial markers & needle */}
      <circle cx="44" cy="42" r="0.8" fill="#E53E3E" />
      <line x1="44" y1="42" x2="44" y2="37" stroke="#E53E3E" strokeWidth="1" strokeLinecap="round" />
      <line x1="44" y1="42" x2="47" y2="43" stroke="#2D3748" strokeWidth="1" strokeLinecap="round" />
      <circle cx="44" cy="36" r="0.5" fill="#2B6CB0" />
      <circle cx="50" cy="42" r="0.5" fill="#2B6CB0" />
      <circle cx="44" cy="48" r="0.5" fill="#2B6CB0" />
      <circle cx="38" cy="42" r="0.5" fill="#2B6CB0" />
    </svg>
  );
}

// 4. Make-up: Lipstick & Powder Blush Brush
export function MakeupServiceIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Make-up"
    >
      <defs>
        <linearGradient id="goldFerrule" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F6E05E" />
          <stop offset="40%" stopColor="#ECC94B" />
          <stop offset="80%" stopColor="#D69E2E" />
          <stop offset="100%" stopColor="#B7791F" />
        </linearGradient>
        <linearGradient id="lipstickRed" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FC8181" />
          <stop offset="40%" stopColor="#E53E3E" />
          <stop offset="100%" stopColor="#9B2C2C" />
        </linearGradient>
        <linearGradient id="brushBristles" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FED7E2" />
          <stop offset="30%" stopColor="#F687B3" />
          <stop offset="70%" stopColor="#4A5568" />
          <stop offset="100%" stopColor="#1A202C" />
        </linearGradient>
        <linearGradient id="blackCase" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4A5568" />
          <stop offset="45%" stopColor="#2D3748" />
          <stop offset="100%" stopColor="#1A202C" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="25" cy="52" rx="7" ry="2.5" fill="#000000" opacity="0.2" />
      <ellipse cx="42" cy="53" rx="10" ry="3" fill="#000000" opacity="0.2" />

      {/* Powder Brush (Angled left) */}
      {/* Brush Bristles (Fluffy dome) */}
      <path
        d="M 20 27 C 14 23, 16 11, 23 10 C 30 9, 34 21, 28 27 Z"
        fill="url(#brushBristles)"
      />
      {/* Brush Ferrule */}
      <path
        d="M 21 26 L 27 25 L 29 33 L 23 34 Z"
        fill="url(#goldFerrule)"
      />
      {/* Brush Handle */}
      <path
        d="M 23 34 L 29 33 L 33 50 C 33 52, 31 53, 29 53 L 26 53 C 24 53, 23 52, 23 50 Z"
        fill="url(#blackCase)"
      />

      {/* Lipstick Tube (Standing on right) */}
      {/* Red Lipstick Bullet with slant tip */}
      <path
        d="M 39 29 L 45 29 L 45 20 C 45 18, 43 17, 41 18 L 39 23 Z"
        fill="url(#lipstickRed)"
      />
      {/* Lipstick inner gold collar */}
      <rect x="38" y="28" width="8" height="6" rx="1" fill="url(#goldFerrule)" />

      {/* Lipstick base body (black matte cylinder) */}
      <rect x="37" y="33" width="10" height="19" rx="2" fill="url(#blackCase)" />
      {/* Gold ring accent on case */}
      <line x1="37" y1="38" x2="47" y2="38" stroke="url(#goldFerrule)" strokeWidth="1" />
      {/* Case shine highlight */}
      <line x1="39" y1="35" x2="39" y2="50" stroke="#718096" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

// 5. Hair: Sky-Blue Blow Dryer & Wooden Hair Comb
export function HairServiceIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Hair"
    >
      <defs>
        <linearGradient id="dryerBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#90CDF4" />
          <stop offset="45%" stopColor="#63B3ED" />
          <stop offset="100%" stopColor="#3182CE" />
        </linearGradient>
        <linearGradient id="dryerNozzle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A5568" />
          <stop offset="100%" stopColor="#2D3748" />
        </linearGradient>
        <linearGradient id="combWood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D69E2E" />
          <stop offset="50%" stopColor="#B7791F" />
          <stop offset="100%" stopColor="#7B341E" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="33" cy="53" rx="18" ry="4" fill="#000000" opacity="0.2" />

      {/* Hair Dryer Nozzle (Facing left) */}
      <path d="M 23 20 L 17 21 L 17 27 L 23 28 Z" fill="url(#dryerNozzle)" />

      {/* Hair Dryer Barrel & Motor Shell */}
      <ellipse cx="33" cy="24" rx="13" ry="8" fill="url(#dryerBody)" />
      {/* Air intake back cap */}
      <path
        d="M 43 18 C 45 20, 46 23, 46 25 C 46 27, 45 30, 43 32 Z"
        fill="#2D3748"
      />
      {/* Intake mesh lines */}
      <line x1="43.5" y1="20" x2="43.5" y2="30" stroke="#718096" strokeWidth="0.8" />
      <line x1="44.5" y1="22" x2="44.5" y2="28" stroke="#718096" strokeWidth="0.8" />

      {/* Hair Dryer Handle (Angled down) */}
      <path
        d="M 33 29 L 38 44 C 38.5 45.5, 37.5 47, 36 47 L 32 47 C 30.5 47, 29.5 45.5, 29 44 L 28 29 Z"
        fill="url(#dryerBody)"
      />
      {/* Handle Grip & Switch */}
      <rect x="30" y="35" width="2" height="4" rx="0.5" fill="#2D3748" />
      {/* Hanging loop / cord */}
      <path d="M 34 47 C 34 50, 36 51, 38 50" stroke="#718096" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Specular highlight on dryer body */}
      <path
        d="M 26 19 C 30 17, 37 17, 40 19"
        stroke="#EBF8FF"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Hair Comb lying in foreground */}
      <path
        d="M 18 45 L 34 49 C 35 49.3, 35 50.7, 34 51 L 18 47 C 17 46.7, 17 45.3, 18 45 Z"
        fill="url(#combWood)"
      />
      {/* Comb teeth */}
      {[20, 22, 24, 26, 28, 30, 32].map((x, i) => (
        <line
          key={i}
          x1={x}
          y1={46 + i * 0.5}
          x2={x + 1}
          y2={42 + i * 0.5}
          stroke="#975A16"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
