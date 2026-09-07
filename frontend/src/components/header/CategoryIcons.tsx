import React from "react";

// 1. All: 3D Antique Desktop Globe on Golden Brass Stand with Wooden Base
export function AllGlobeIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="All categories"
    >
      <defs>
        {/* Globe Ocean Gradient */}
        <radialGradient id="globeOcean" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F5E4B7" />
          <stop offset="45%" stopColor="#DFC386" />
          <stop offset="80%" stopColor="#C49F50" />
          <stop offset="100%" stopColor="#9C772F" />
        </radialGradient>

        {/* Globe Land Gradient */}
        <linearGradient id="globeLand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6C8E4D" />
          <stop offset="100%" stopColor="#415C2B" />
        </linearGradient>

        {/* Brass Stand Gradient */}
        <linearGradient id="brassStand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E2BD68" />
          <stop offset="50%" stopColor="#B88A34" />
          <stop offset="100%" stopColor="#755018" />
        </linearGradient>

        {/* Wood Base Gradient */}
        <linearGradient id="woodBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#966038" />
          <stop offset="50%" stopColor="#6E3F1F" />
          <stop offset="100%" stopColor="#4A2510" />
        </linearGradient>

        {/* Sphere Shadow */}
        <radialGradient id="sphereShadow" cx="70%" cy="75%" r="60%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#000000" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Axis Rod */}
      <line x1="24" y1="8" x2="38" y2="44" stroke="url(#brassStand)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Brass Meridian Ring (Behind and Around Globe) */}
      <path
        d="M 17 38 C 10 26, 16 11, 28 8 C 40 5, 49 14, 49 26 C 49 34, 44 42, 36 45"
        stroke="url(#brassStand)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Globe Sphere */}
      <circle cx="31" cy="26" r="15" fill="url(#globeOcean)" />

      {/* Continents / Landmasses */}
      <g clipPath="url(#globeClip)">
        <path
          d="M 23 18 C 24 16, 27 15, 29 17 C 31 19, 29 23, 27 25 C 25 27, 21 24, 23 18 Z"
          fill="url(#globeLand)"
          opacity="0.9"
        />
        <path
          d="M 33 19 C 36 17, 40 18, 41 21 C 42 24, 38 27, 36 29 C 34 31, 33 26, 33 22 Z"
          fill="url(#globeLand)"
          opacity="0.9"
        />
        <path
          d="M 27 29 C 29 28, 33 30, 34 34 C 33 37, 28 38, 26 36 C 24 34, 25 30, 27 29 Z"
          fill="url(#globeLand)"
          opacity="0.9"
        />
        <path
          d="M 37 32 C 39 31, 42 33, 41 36 C 39 38, 36 36, 37 32 Z"
          fill="url(#globeLand)"
          opacity="0.9"
        />
        {/* Sphere Shading Overlay */}
        <circle cx="31" cy="26" r="15" fill="url(#sphereShadow)" />
      </g>

      <clipPath id="globeClip">
        <circle cx="31" cy="26" r="15" />
      </clipPath>

      {/* Finial Top Cap */}
      <circle cx="23" cy="7.5" r="2.2" fill="url(#brassStand)" />

      {/* Stand Arm Under Globe */}
      <path
        d="M 31 46 C 31 49, 31 52, 31 54"
        stroke="url(#brassStand)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Turned Wood Base */}
      <ellipse cx="31" cy="56" rx="13" ry="4" fill="url(#woodBase)" />
      <ellipse cx="31" cy="54" rx="10" ry="2.5" fill="#B27442" />
      <ellipse cx="31" cy="58" rx="14" ry="3.5" fill="#3D1D09" opacity="0.6" />
    </svg>
  );
}

// 2. Homes: Modern Architectural House with Red Door & Lush Green Tree
export function HomesHouseIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Homes"
    >
      <defs>
        <linearGradient id="wallGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C4C8CC" />
          <stop offset="60%" stopColor="#D8DCE0" />
          <stop offset="100%" stopColor="#E6EAEF" />
        </linearGradient>

        <linearGradient id="roofGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3F464D" />
          <stop offset="100%" stopColor="#252A2E" />
        </linearGradient>

        <linearGradient id="doorGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF385C" />
          <stop offset="100%" stopColor="#D70466" />
        </linearGradient>

        <radialGradient id="treeGradient" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#68B93C" />
          <stop offset="50%" stopColor="#4A8F24" />
          <stop offset="100%" stopColor="#2D6013" />
        </radialGradient>
      </defs>

      {/* Tree Trunk behind house */}
      <rect x="44" y="24" width="5" height="28" rx="2" fill="#5A3A1E" />

      {/* Lush Green Leafy Tree Canopy */}
      <circle cx="46" cy="18" r="13" fill="url(#treeGradient)" />
      <circle cx="53" cy="22" r="9" fill="url(#treeGradient)" opacity="0.9" />
      <circle cx="39" cy="20" r="8" fill="url(#treeGradient)" opacity="0.95" />
      <circle cx="47" cy="12" r="8" fill="#75CA44" opacity="0.75" />

      {/* House Chimney */}
      <rect x="18" y="14" width="4.5" height="12" fill="#525B64" rx="1" />
      <rect x="17" y="13" width="6.5" height="2.5" fill="#2C3238" rx="0.5" />

      {/* Sloping Modern Roof */}
      <polygon points="10,24 40,16 41,20 11,28" fill="url(#roofGradient)" />
      <polygon points="9,26 40,18 39,21 8,29" fill="#1C2024" />

      {/* House Main Body / Concrete Walls */}
      <path
        d="M 12 28 L 38 21 L 38 54 L 12 54 Z"
        fill="url(#wallGradient)"
        stroke="#A4A8AD"
        strokeWidth="0.75"
      />

      {/* Red Modern Front Door */}
      <rect x="20" y="35" width="10" height="19" rx="1.5" fill="url(#doorGradient)" />

      {/* Door Frame / Molding */}
      <rect x="21" y="36.5" width="8" height="6.5" rx="0.5" fill="#FFFFFF" opacity="0.3" />
      <circle cx="28.5" cy="46" r="0.9" fill="#FFD700" />

      {/* Small Upper Window */}
      <rect x="28" y="26" width="6" height="5" rx="1" fill="#4B6584" stroke="#D1D8E0" strokeWidth="0.8" />
      <line x1="31" y1="26" x2="31" y2="31" stroke="#FFFFFF" strokeWidth="0.5" />

      {/* Ground line shadow */}
      <ellipse cx="28" cy="55" rx="20" ry="2" fill="#000000" opacity="0.12" />
    </svg>
  );
}

// 3. Experiences: 3D Striped Hot Air Balloon with Basket
export function ExperiencesBalloonIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Experiences"
    >
      <defs>
        {/* Red Stripe Gradient */}
        <linearGradient id="redStripe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF385C" />
          <stop offset="100%" stopColor="#C9103C" />
        </linearGradient>

        {/* Orange Stripe Gradient */}
        <linearGradient id="orangeStripe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF8F3D" />
          <stop offset="100%" stopColor="#E65100" />
        </linearGradient>

        {/* Yellow Stripe Gradient */}
        <linearGradient id="yellowStripe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFDA44" />
          <stop offset="100%" stopColor="#F9A825" />
        </linearGradient>

        {/* Wicker Basket Gradient */}
        <linearGradient id="wickerBasket" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A07246" />
          <stop offset="100%" stopColor="#6D451D" />
        </linearGradient>
      </defs>

      {/* Rigging Lines connecting envelope to basket */}
      <line x1="25" y1="45" x2="27" y2="52" stroke="#4A3420" strokeWidth="1" />
      <line x1="39" y1="45" x2="37" y2="52" stroke="#4A3420" strokeWidth="1" />
      <line x1="32" y1="46" x2="32" y2="52" stroke="#4A3420" strokeWidth="1" />

      {/* Hot Air Balloon Envelope Shape with Clipping */}
      <g clipPath="url(#balloonClip)">
        {/* Background base */}
        <rect x="12" y="6" width="40" height="42" fill="url(#redStripe)" />

        {/* Outer Left Stripe (Red/Orange) */}
        <path d="M 14 16 C 14 8, 22 7, 24 7 L 26 44 C 21 41, 14 30, 14 16 Z" fill="url(#orangeStripe)" />

        {/* Mid Left Stripe (Yellow) */}
        <path d="M 23 7 C 27 7, 28 8, 29 8 L 29 45 C 27 44, 25 43, 24 43 Z" fill="url(#yellowStripe)" />

        {/* Center Stripe (Red) */}
        <path d="M 29 7 C 32 6.5, 35 7, 35 7 L 35 45 C 33 45.5, 31 45.5, 29 45 Z" fill="url(#redStripe)" />

        {/* Mid Right Stripe (Orange) */}
        <path d="M 35 7 C 38 7.5, 41 8, 41 9 L 38 44 C 36 44.5, 35 44.8, 35 45 Z" fill="url(#orangeStripe)" />

        {/* Outer Right Stripe (Yellow/Red) */}
        <path d="M 40 8 C 47 11, 50 20, 50 25 C 50 33, 42 41, 38 44 Z" fill="url(#yellowStripe)" />

        {/* Specular Highlight / 3D sheen */}
        <path
          d="M 20 12 C 22 9, 27 9, 27 9 C 25 18, 23 28, 23 35 C 19 31, 18 20, 20 12 Z"
          fill="#FFFFFF"
          opacity="0.3"
        />
      </g>

      <clipPath id="balloonClip">
        <path d="M 32 6 C 18 6, 14 18, 14 26 C 14 36, 25 45, 26 46 L 38 46 C 39 45, 50 36, 50 26 C 50 18, 46 6, 32 6 Z" />
      </clipPath>

      {/* Burner Collar / Ring */}
      <rect x="27" y="45" width="10" height="2" rx="1" fill="#3E2723" />

      {/* Passenger Wicker Basket */}
      <rect x="27" y="52" width="10" height="7" rx="1.5" fill="url(#wickerBasket)" />
      <line x1="27" y1="55.5" x2="37" y2="55.5" stroke="#4E342E" strokeWidth="1" />
      <line x1="30.5" y1="52" x2="30.5" y2="59" stroke="#4E342E" strokeWidth="1" />
      <line x1="33.5" y1="52" x2="33.5" y2="59" stroke="#4E342E" strokeWidth="1" />

      {/* Floating shadow */}
      <ellipse cx="32" cy="61" rx="7" ry="1.5" fill="#000000" opacity="0.1" />
    </svg>
  );
}

// 4. Services: Polished Metallic Concierge Service Call Bell
export function ServicesBellIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Services"
    >
      <defs>
        {/* Chrome Metallic Dome Gradient */}
        <radialGradient id="chromeDome" cx="45%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#E4E9EC" />
          <stop offset="55%" stopColor="#A4B0B9" />
          <stop offset="85%" stopColor="#6C7A86" />
          <stop offset="100%" stopColor="#434D56" />
        </radialGradient>

        {/* Plunger / Button Gradient */}
        <linearGradient id="chromePlunger" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#B0BAC3" />
          <stop offset="100%" stopColor="#5B6873" />
        </linearGradient>

        {/* Black Base Plate Gradient */}
        <linearGradient id="blackBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#33383E" />
          <stop offset="40%" stopColor="#1C1F22" />
          <stop offset="100%" stopColor="#0B0D0E" />
        </linearGradient>
      </defs>

      {/* Cast Shadow under base */}
      <ellipse cx="32" cy="55" rx="21" ry="3" fill="#000000" opacity="0.2" />

      {/* Stepped Black Base Plate */}
      <ellipse cx="32" cy="53" rx="20" ry="3.5" fill="url(#blackBase)" />
      <ellipse cx="32" cy="51.5" rx="18.5" ry="2.5" fill="#4B535B" />
      <ellipse cx="32" cy="50" rx="17" ry="2.2" fill="url(#blackBase)" />

      {/* Chrome Hemispherical Bell Dome */}
      <path
        d="M 15 48 C 15 31, 21 21, 32 21 C 43 21, 49 31, 49 48 C 43 49.5, 21 49.5, 15 48 Z"
        fill="url(#chromeDome)"
      />

      {/* Chrome Lip Rim */}
      <ellipse cx="32" cy="48" rx="17" ry="2.5" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.7" />

      {/* Specular Highlight Streak on Dome */}
      <path
        d="M 23 27 C 28 23, 34 23, 37 25 C 34 26, 27 28, 23 36 Z"
        fill="#FFFFFF"
        opacity="0.65"
      />

      {/* Top Plunger / Push Button Stem */}
      <rect x="30" y="13" width="4" height="9" rx="1" fill="url(#chromePlunger)" />

      {/* Top Plunger Cap / Round Knob */}
      <circle cx="32" cy="13" r="3.2" fill="url(#chromePlunger)" />
      <circle cx="31.2" cy="12" r="1" fill="#FFFFFF" opacity="0.8" />
    </svg>
  );
}
