import React from "react";

const gradientPresets: Record<string, string> = {
  gold: "from-[#f6c94c] via-[#e8a317] to-[#c38a10]",
  fire: "from-[#ff6b35] via-[#f7931e] to-[#ffcc02]",
  ocean: "from-[#00b4d8] via-[#0077b6] to-[#03045e]",
  sunset: "from-[#ff006e] via-[#fb5607] to-[#ffbe0b]",
  forest: "from-[#2d6a4f] via-[#52b788] to-[#95d5b2]",
  royal: "from-[#7209b7] via-[#b5179e] to-[#f72585]",
  ice: "from-[#a2d2ff] via-[#bde0fe] to-[#e0e1dd]",
  rose: "from-[#e97777] via-[#d62246] to-[#800f2f]",
  emerald: "from-[#00c896] via-[#00a878] to-[#00755e]",
  crimson: "from-[#e63946] via-[#d62828] to-[#9d0208]",
};

export function getGradientClass(name: string | null | undefined): string | null {
  if (!name) return null;
  return gradientPresets[name] || null;
}

export function getSolidColor(name: string | null | undefined): string | null {
  if (!name) return null;
  return name;
}

export default function ColoredName({
  user,
  className = "",
  as: Tag = "span",
}: {
  user?: { name?: string | null; nameColor?: string | null; nameGradient?: string | null } | null;
  className?: string;
  as?: React.ElementType;
}) {
  if (!user?.name) return <Tag className={className}>{Tag === "span" ? "مستخدم" : null}</Tag>;

  const gradient = getGradientClass(user.nameGradient);
  const solid = getSolidColor(user.nameColor);

  if (gradient) {
    return (
      <Tag
        className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent font-bold ${className}`}
      >
        {user.name}
      </Tag>
    );
  }

  if (solid) {
    return (
      <Tag className={`font-bold ${className}`} style={{ color: solid }}>
        {user.name}
      </Tag>
    );
  }

  return <Tag className={`font-bold ${className}`}>{user.name}</Tag>;
}
