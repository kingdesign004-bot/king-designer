import React from "react";
import { BadgeCheck, Crown } from "lucide-react";

export default function IdentityBadges({ user, compact = false }: { user?: { verified?: number | null; level?: string | number | null } | null; compact?: boolean }) {
  if (!user) return null;
  return <span className="inline-flex items-center gap-1 align-middle" aria-label="شارات الهوية">
    {user.verified ? <BadgeCheck className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"} fill-[#f6c94c] text-neutral-950`} aria-label="موثق" /> : null}
    {user.level ? <span className={`inline-flex items-center gap-0.5 rounded-full bg-gradient-to-l from-[#fff0ae] to-[#fff8df] px-1.5 py-0.5 font-bold text-[#8b5a00] ${compact ? "text-[9px]" : "text-[10px]"}`}><Crown className="h-2.5 w-2.5" />{user.level}</span> : null}
  </span>;
}
