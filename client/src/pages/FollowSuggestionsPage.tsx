import { Link } from "wouter";
import { UserPlus, Loader2, Sparkles, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import AppChrome from "@/components/AppChrome";
import { Button } from "@/components/ui/button";
import ColoredName from "@/components/ColoredName";
import IdentityBadges from "@/components/IdentityBadges";

export default function FollowSuggestionsPage() {
  const utils = trpc.useUtils();
  const { data: suggestions, isLoading } = trpc.social.suggestions.useQuery();
  const follow = trpc.social.requestFollow.useMutation({
    onSuccess: data => {
      toast.success(data.status === "pending" ? "تم إرسال طلب المتابعة" : "تمت المتابعة");
      utils.social.suggestions.invalidate();
    },
    onError: e => toast.error(e.message),
  });

  return (
    <AppChrome title="اقتراحات للمتابعة">
      <div className="container py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neutral-950 text-[#f6c94c]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">اقتراحات للمتابعة</h1>
              <p className="mt-1 text-sm text-neutral-500">مصممون قد يهمك متابعتهم بناءً على نشاطك.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid place-items-center rounded-[1.75rem] border border-neutral-200 bg-white py-24">
              <Loader2 className="h-6 w-6 animate-spin text-[#c38a10]" />
            </div>
          ) : suggestions?.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {suggestions.map(user => (
                <div key={user.id} className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
                  <Link href={`/profile/${user.id}`}>
                    <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-neutral-900 font-bold text-[#f6c94c]">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name || "مستخدم"} className="h-full w-full object-cover" />
                      ) : (
                        (user.name || "KD").slice(0, 2)
                      )}
                    </div>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1">
                      <Link href={`/profile/${user.id}`}>
                        <ColoredName user={user} className="text-sm hover:underline" />
                      </Link>
                      <IdentityBadges user={user} compact />
                    </span>
                    <p className="mt-1 text-xs text-neutral-400">{user.specialty || "مصمم"}</p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-neutral-400">
                      <Users className="h-3 w-3" /> {user.followersCount} متابع
                    </p>
                  </div>
                  <Button
                    onClick={() => follow.mutate({ userId: user.id })}
                    disabled={follow.isPending}
                    className="shrink-0 rounded-xl bg-neutral-950 text-white"
                  >
                    <UserPlus className="ml-1 h-4 w-4" />متابعة
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid place-items-center rounded-[1.75rem] border border-dashed border-neutral-300 bg-white py-20 text-center">
              <Sparkles className="h-10 w-10 text-[#c38a10]" />
              <h3 className="mt-4 font-display font-bold">لا توجد اقتراحات حاليًا</h3>
              <p className="mt-2 max-w-sm text-sm text-neutral-500">تابع بعض المصممين أولاً وسنقترح لك المزيد بناءً على اهتماماتك.</p>
            </div>
          )}
        </div>
      </div>
    </AppChrome>
  );
}
