<!-- King Designer Logo Component -->
<svg
  width="200"
  height="200"
  viewBox="0 0 200 200"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  className="king-designer-logo"
>
  <!-- Gold Crown/King Symbol -->
  <defs>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f5a04d;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d97a00;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="darkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2d2d2d;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Crown Points (Left) -->
  <path
    d="M 40 120 L 60 60 L 70 100 L 80 50 L 90 100 L 100 70 L 90 100 L 80 50 L 70 100 L 60 60 L 40 120"
    fill="url(#goldGradient)"
    stroke="#663300"
    strokeWidth="2"
  />

  <!-- Crown Arc (Right) -->
  <path
    d="M 120 60 Q 130 40 150 60 Q 140 50 130 55 Q 120 60 120 60"
    fill="url(#goldGradient)"
    stroke="#663300"
    strokeWidth="2"
  />

  <!-- Center Jewel -->
  <circle cx="100" cy="85" r="12" fill="url(#goldGradient)" stroke="#663300" strokeWidth="2" />
  <circle cx="100" cy="85" r="8" fill="#fef9f3" opacity="0.6" />

  <!-- Letter K (Designer) -->
  <text
    x="100"
    y="160"
    fontSize="48"
    fontFamily="Arial, sans-serif"
    fontWeight="bold"
    textAnchor="middle"
    fill="url(#goldGradient)"
    stroke="#663300"
    strokeWidth="0.5"
  >
    K
  </text>

  <!-- Decorative Base Lines -->
  <line x1="50" y1="175" x2="150" y2="175" stroke="url(#goldGradient)" strokeWidth="3" />
</svg>
