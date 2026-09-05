import { BadgeCheck, Crown, Palette } from "lucide-react";

export default function IdentityBadges({ user, compact = false }: { user?: { verified?: number | null; level?: string | number | null; plan?: "free" | "pro" | "vip" | null; badgeColor?: string | null } | null; compact?: boolean }) {
  if (!user) return null;
  const iconSize = compact ? "h-3.5 w-3.5" : "h-4 w-4";
  const textSize = compact ? "text-[9px]" : "text-[10px]";
  return (
    <span className="inline-flex items-center gap-1 align-middle" aria-label="شارات الهوية">
      {user.verified ? <BadgeCheck className={`${iconSize} fill-[#f6c94c] text-neutral-950`} aria-label="موثق" /> : null}
      {user.badgeColor ? (
        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-bold ${textSize}`}
          style={{ backgroundColor: `${user.badgeColor}20`, color: user.badgeColor, border: `1px solid ${user.badgeColor}40` }}
        >
          <Palette className="h-2.5 w-2.5" />
          مميز
        </span>
      ) : null}
      {user.level ? <span className={`inline-flex items-center gap-0.5 rounded-full bg-gradient-to-l from-[#fff0ae] to-[#fff8df] px-1.5 py-0.5 font-bold text-[#8b5a00] ${textSize}`}><Crown className="h-2.5 w-2.5" />{user.level}</span> : null}
      {user.plan === "vip" || user.plan === "pro" ? <span className={`rounded-full px-1.5 py-0.5 font-bold ${user.plan === "vip" ? "bg-[#1f1b12] text-[#f6c94c]" : "bg-[#e9eefb] text-[#3b5b9a]"} ${textSize}`}>{user.plan.toUpperCase()}</span> : null}
    </span>
  );
}
