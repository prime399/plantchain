export function HeroTree({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="90" y="250" width="20" height="150" rx="4" fill="#6b4f3a" />
      <rect x="85" y="350" width="30" height="50" rx="6" fill="#5a3f2a" opacity="0.5" />
      <ellipse cx="100" cy="200" rx="70" ry="80" fill="#2d5a3d" />
      <ellipse cx="80" cy="170" rx="50" ry="60" fill="#3d7a52" />
      <ellipse cx="120" cy="180" rx="55" ry="65" fill="#3d7a52" opacity="0.9" />
      <ellipse cx="100" cy="150" rx="40" ry="50" fill="#5c9e6e" />
      <ellipse cx="85" cy="140" rx="25" ry="30" fill="#8fc99e" opacity="0.6" />
      <ellipse cx="115" cy="155" rx="20" ry="25" fill="#8fc99e" opacity="0.4" />
      <circle cx="70" cy="160" r="4" fill="#d4ead9" opacity="0.5" />
      <circle cx="130" cy="145" r="3" fill="#d4ead9" opacity="0.4" />
      <circle cx="95" cy="125" r="3" fill="#d4ead9" opacity="0.6" />
    </svg>
  );
}

export function Sapling({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="28" y="45" width="4" height="30" rx="2" fill="#6b4f3a" />
      <ellipse cx="30" cy="35" rx="18" ry="22" fill="#3d7a52" />
      <ellipse cx="25" cy="28" rx="12" ry="15" fill="#5c9e6e" />
      <ellipse cx="35" cy="32" rx="10" ry="13" fill="#5c9e6e" opacity="0.8" />
      <ellipse cx="30" cy="24" rx="8" ry="10" fill="#8fc99e" opacity="0.6" />
    </svg>
  );
}

export function LeafCluster({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M20 50 Q30 10 60 30 Q40 20 20 50Z"
        fill="#5c9e6e"
        opacity="0.7"
      />
      <path
        d="M50 55 Q55 15 85 25 Q65 15 50 55Z"
        fill="#3d7a52"
        opacity="0.6"
      />
      <path
        d="M80 50 Q90 20 110 35 Q95 25 80 50Z"
        fill="#8fc99e"
        opacity="0.5"
      />
      <path
        d="M35 45 Q50 25 70 40 Q55 30 35 45Z"
        fill="#5c9e6e"
        opacity="0.4"
      />
    </svg>
  );
}

export function TreeLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
    >
      <rect y="100" width="800" height="20" fill="#1a3a2a" />
      <ellipse cx="80" cy="70" rx="40" ry="45" fill="#2d5a3d" />
      <ellipse cx="80" cy="55" rx="30" ry="35" fill="#3d7a52" opacity="0.8" />
      <ellipse cx="200" cy="60" rx="50" ry="55" fill="#1a3a2a" />
      <ellipse cx="200" cy="45" rx="35" ry="40" fill="#2d5a3d" opacity="0.9" />
      <ellipse cx="340" cy="75" rx="35" ry="40" fill="#2d5a3d" />
      <ellipse cx="340" cy="62" rx="25" ry="30" fill="#3d7a52" opacity="0.7" />
      <ellipse cx="480" cy="55" rx="55" ry="60" fill="#1a3a2a" />
      <ellipse cx="480" cy="40" rx="40" ry="45" fill="#2d5a3d" opacity="0.8" />
      <ellipse cx="600" cy="70" rx="40" ry="45" fill="#2d5a3d" />
      <ellipse cx="600" cy="58" rx="28" ry="32" fill="#3d7a52" opacity="0.7" />
      <ellipse cx="720" cy="65" rx="45" ry="50" fill="#1a3a2a" />
      <ellipse cx="720" cy="50" rx="32" ry="38" fill="#2d5a3d" opacity="0.9" />
    </svg>
  );
}

export function IconPlant({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="22" fill="#2d5a3d" opacity="0.15" />
      <rect x="22" y="24" width="4" height="14" rx="2" fill="#6b4f3a" />
      <ellipse cx="24" cy="20" rx="10" ry="12" fill="#3d7a52" />
      <ellipse cx="24" cy="16" rx="6" ry="8" fill="#5c9e6e" />
      <path d="M18 38 Q24 34 30 38" stroke="#6b4f3a" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function IconCamera({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="22" fill="#2d5a3d" opacity="0.15" />
      <rect x="10" y="18" width="28" height="18" rx="3" fill="#3d7a52" />
      <path d="M18 18 L20 14 H28 L30 18" fill="#2d5a3d" />
      <circle cx="24" cy="27" r="6" fill="#8fc99e" />
      <circle cx="24" cy="27" r="3" fill="#d4ead9" />
    </svg>
  );
}

export function IconVerify({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="22" fill="#2d5a3d" opacity="0.15" />
      <circle cx="24" cy="24" r="14" fill="#3d7a52" />
      <path
        d="M17 24 L22 29 L31 19"
        stroke="#d4ead9"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconRecord({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="22" fill="#2d5a3d" opacity="0.15" />
      <rect x="12" y="14" width="24" height="20" rx="3" fill="#3d7a52" />
      <path d="M18 20 H30 M18 25 H28 M18 30 H24" stroke="#d4ead9" strokeWidth="2" strokeLinecap="round" />
      <circle cx="34" cy="32" r="6" fill="#c8943a" />
      <path d="M32 32 L34 34 L37 30" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function PineTree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 80" fill="none" className={className}>
      <rect x="27" y="55" width="6" height="20" rx="2" fill="#6b4f3a" />
      <polygon points="30,8 10,40 50,40" fill="#2d5a3d" />
      <polygon points="30,18 14,48 46,48" fill="#3d7a52" />
      <polygon points="30,28 18,55 42,55" fill="#5c9e6e" opacity="0.8" />
      <circle cx="25" cy="30" r="2" fill="#8fc99e" opacity="0.5" />
      <circle cx="35" cy="38" r="1.5" fill="#d4ead9" opacity="0.4" />
    </svg>
  );
}

export function PalmTree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 80" fill="none" className={className}>
      <path d="M28 35 Q26 55 27 75" stroke="#6b4f3a" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M28 35 Q10 20 2 28" stroke="#3d7a52" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M28 35 Q12 30 5 38" stroke="#5c9e6e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M28 35 Q45 18 55 24" stroke="#3d7a52" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M28 35 Q48 28 56 36" stroke="#5c9e6e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M28 35 Q22 12 18 5" stroke="#2d5a3d" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M28 35 Q35 10 40 4" stroke="#3d7a52" strokeWidth="3" strokeLinecap="round" fill="none" />
      <ellipse cx="28" cy="34" rx="4" ry="3" fill="#5c9e6e" />
    </svg>
  );
}

export function BaobabTree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 80" fill="none" className={className}>
      <path d="M22 40 Q20 55 18 75 L42 75 Q40 55 38 40Z" fill="#6b4f3a" />
      <path d="M25 42 Q24 55 23 70" stroke="#5a3f2a" strokeWidth="1" opacity="0.4" fill="none" />
      <path d="M35 42 Q36 55 37 70" stroke="#5a3f2a" strokeWidth="1" opacity="0.4" fill="none" />
      <ellipse cx="30" cy="28" rx="26" ry="22" fill="#2d5a3d" />
      <ellipse cx="22" cy="22" rx="16" ry="14" fill="#3d7a52" />
      <ellipse cx="38" cy="24" rx="14" ry="13" fill="#3d7a52" opacity="0.9" />
      <ellipse cx="30" cy="18" rx="10" ry="10" fill="#5c9e6e" opacity="0.7" />
      <circle cx="20" cy="18" r="2" fill="#8fc99e" opacity="0.5" />
      <circle cx="38" cy="16" r="1.5" fill="#d4ead9" opacity="0.4" />
    </svg>
  );
}

export function WillowTree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 80" fill="none" className={className}>
      <rect x="27" y="35" width="6" height="40" rx="2" fill="#6b4f3a" />
      <ellipse cx="30" cy="28" rx="22" ry="20" fill="#2d5a3d" opacity="0.6" />
      <path d="M15 25 Q10 45 8 60" stroke="#3d7a52" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M20 22 Q14 42 12 58" stroke="#5c9e6e" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M25 20 Q20 40 18 55" stroke="#3d7a52" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M35 20 Q40 40 42 55" stroke="#3d7a52" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M40 22 Q46 42 48 58" stroke="#5c9e6e" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M45 25 Q50 45 52 60" stroke="#3d7a52" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
      <ellipse cx="30" cy="22" rx="14" ry="12" fill="#5c9e6e" opacity="0.5" />
    </svg>
  );
}

export function OakTree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 80" fill="none" className={className}>
      <rect x="26" y="48" width="8" height="27" rx="3" fill="#6b4f3a" />
      <path d="M30 50 Q18 48 14 60" stroke="#6b4f3a" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M30 50 Q42 48 46 60" stroke="#6b4f3a" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
      <ellipse cx="30" cy="30" rx="25" ry="24" fill="#2d5a3d" />
      <ellipse cx="20" cy="25" rx="15" ry="16" fill="#3d7a52" />
      <ellipse cx="40" cy="27" rx="14" ry="15" fill="#3d7a52" opacity="0.9" />
      <ellipse cx="30" cy="20" rx="12" ry="13" fill="#5c9e6e" opacity="0.7" />
      <ellipse cx="22" cy="16" rx="8" ry="8" fill="#8fc99e" opacity="0.4" />
      <ellipse cx="38" cy="18" rx="7" ry="7" fill="#8fc99e" opacity="0.3" />
      <circle cx="16" cy="22" r="2" fill="#d4ead9" opacity="0.4" />
      <circle cx="42" cy="20" r="1.5" fill="#d4ead9" opacity="0.3" />
    </svg>
  );
}

export function RedwoodTree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 80" fill="none" className={className}>
      <rect x="25" y="30" width="10" height="45" rx="3" fill="#5a3f2a" />
      <rect x="27" y="35" width="6" height="40" rx="2" fill="#6b4f3a" />
      <polygon points="30,4 16,28 44,28" fill="#2d5a3d" />
      <polygon points="30,12 18,34 42,34" fill="#3d7a52" />
      <polygon points="30,20 20,40 40,40" fill="#3d7a52" opacity="0.9" />
      <polygon points="30,28 22,46 38,46" fill="#5c9e6e" opacity="0.7" />
      <circle cx="26" cy="20" r="1.5" fill="#8fc99e" opacity="0.5" />
      <circle cx="34" cy="28" r="1" fill="#d4ead9" opacity="0.4" />
    </svg>
  );
}
