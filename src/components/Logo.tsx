import React from "react";

interface LogoProps {
  className?: string;
  size?: number; // Adjusts scale of the SVG icon
  variant?: "icon-only" | "horizontal" | "vertical";
  textColor?: string; // Options: "dark" or "light" (for dark overlays)
}

export default function Logo({
  className = "",
  size = 40,
  variant = "horizontal",
  textColor = "dark"
}: LogoProps) {
  // Brand color variables matching the editorial aesthetic
  const brandDark = textColor === "light" ? "text-white" : "text-neutral-900";
  const brandMuted = textColor === "light" ? "text-neutral-400" : "text-neutral-500";
  
  // High-fidelity SVG Icon Mark (S + Globe + Sound Waves)
  const renderIcon = (iconSize: number) => {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 select-none"
      >
        <defs>
          {/* S-Shape Purple/Indigo Gradient */}
          <linearGradient id="speakGlobalSGradient" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818CF8" /> {/* Indigo 400 */}
            <stop offset="50%" stopColor="#6366F1" /> {/* Indigo 500 */}
            <stop offset="100%" stopColor="#4F46E5" /> {/* Indigo 600 */}
          </linearGradient>
          
          {/* Sound Wave Amber Gradient */}
          <linearGradient id="speakGlobalWaveGradient" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#F59E0B" /> {/* Amber 500 */}
            <stop offset="100%" stopColor="#D97706" /> {/* Amber 600 */}
          </linearGradient>
        </defs>

        {/* 1. Stylized Globe Grid nestled inside the upper S loop */}
        <g opacity="0.85">
          {/* Globe Boundary */}
          <circle cx="50" cy="33" r="15" stroke={textColor === "light" ? "#E5E7EB" : "#1E1B4B"} strokeWidth="1.2" fill="none" />
          
          {/* Vertical Grid Line (Prime Meridian) */}
          <line x1="50" y1="18" x2="50" y2="48" stroke={textColor === "light" ? "#E5E7EB" : "#1E1B4B"} strokeWidth="1.2" />
          
          {/* Horizontal Grid Line (Equator) */}
          <line x1="35" y1="33" x2="65" y2="33" stroke={textColor === "light" ? "#E5E7EB" : "#1E1B4B"} strokeWidth="1.2" />
          
          {/* Longitude Ellipse Curve */}
          <path
            d="M 50,18 C 42,23 42,43 50,48 M 50,18 C 58,23 58,43 50,48"
            stroke={textColor === "light" ? "#E5E7EB" : "#1E1B4B"}
            strokeWidth="1"
            fill="none"
          />
          
          {/* Latitude Curved Lines */}
          <path
            d="M 37.5,25.5 C 42,28.5 58,28.5 62.5,25.5 M 37.5,40.5 C 42,37.5 58,37.5 62.5,40.5"
            stroke={textColor === "light" ? "#E5E7EB" : "#1E1B4B"}
            strokeWidth="1"
            fill="none"
          />
        </g>

        {/* 2. Stylized Ribbon "S" with Speech Bubble tail pointing down-left */}
        <path
          d="
            M 52,20 
            C 68,20 78,28 78,41 
            C 78,49 71,54 58,57 
            C 44,60 37,64 37,70 
            C 37,73 40,77 47,77 
            C 53,77 59,74 65,69 
            L 70,75 
            C 63,82 54,85 45,85 
            C 30,85 24,77 24,68 
            C 24,65 25,62 27,59
            L 15,67 
            L 22,54 
            C 29,46 38,42 49,39 
            C 61,36 65,33 65,28 
            C 65,24 60,21 51,21 
            C 43,21 35,24 29,29 
            L 24,23 
            C 32,16 42,20 52,20 Z
          "
          fill="url(#speakGlobalSGradient)"
        />

        {/* 3. Sound Wave bars representing Confidence/Speech AI */}
        {/* Short Wave Bar (Left) */}
        <rect x="85" y="44" width="4" height="12" rx="2" fill="url(#speakGlobalWaveGradient)" />
        {/* Tall Wave Bar (Center) */}
        <rect x="92" y="30" width="4" height="40" rx="2" fill="url(#speakGlobalWaveGradient)" />
        {/* Medium Wave Bar (Right) */}
        <rect x="99" y="38" width="4" height="24" rx="2" fill="url(#speakGlobalWaveGradient)" />
      </svg>
    );
  };

  if (variant === "icon-only") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderIcon(size)}
      </div>
    );
  }

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {/* Large Brand Icon Mark */}
        {renderIcon(size * 2)}

        {/* Core Brand Typography */}
        <div className="mt-4 select-none">
          <span className={`text-4xl font-bold tracking-tight ${brandDark}`}>
            Speak<span className="text-indigo-600">Global</span>
          </span>
        </div>

        {/* Editorial Tagline with Balanced Architectonic Margins */}
        <div className="mt-4 flex items-center justify-center gap-3 w-full max-w-lg">
          <div className="h-[1px] flex-grow bg-neutral-300 opacity-60" />
          <span className={`text-[10px] sm:text-xs font-mono uppercase tracking-widest ${brandMuted} whitespace-nowrap`}>
            Speak Clearly. Communicate Confidently. Connect Globally.
          </span>
          <div className="h-[1px] flex-grow bg-neutral-300 opacity-60" />
        </div>
      </div>
    );
  }

  // Default: Horizontal logo (perfect for headers and sidebars)
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {renderIcon(size)}
      <div className="flex flex-col">
        <span className={`text-lg sm:text-xl font-bold tracking-tight leading-none ${brandDark}`}>
          Speak<span className="text-indigo-600">Global</span>
        </span>
      </div>
    </div>
  );
}
