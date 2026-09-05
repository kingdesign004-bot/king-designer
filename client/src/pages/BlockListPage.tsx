import { Link } from "wouter";
import { ShieldBan, Loader2, UserX } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import AppChrome from "@/components/AppChrome";
import { Button } from "@/components/ui/button";

export default function BlockListPage() {
  const utils = trpc.useUtils();
  const { data: blockedUsers, isLoading } = trpc.social.blockList.useQuery();
  const unblock = trpc.social.toggleBlock.useMutation({
    onSuccess: data => {
      toast.success(data.blocked ? "تم الحظر" : "تم إلغاء الحظر");
      utils.social.blockList.invalidate();
    },
    onError: e => toast.error(e.message),
  });

  return (
    <AppChrome title="قائمة الحظر">
      <div className="container py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neutral-950 text-[#f6c94c]">
              <ShieldBan className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">قائمة الحظر</h1>
              <p className="mt-1 text-sm text-neutral-500">يمكنك إلغاء حظر أي مستخدم حظرته سابقًا.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid place-items-center rounded-[1.75rem] border border-neutral-200 bg-white py-24">
              <Loader2 className="h-6 w-6 animate-spin text-[#c38a10]" />
            </div>
          ) : blockedUsers?.length ? (
            <div className="space-y-3">
              {blockedUsers.map(item => (
                <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-neutral-900 font-bold text-[#f6c94c]">
                    {item.user.avatarUrl ? (
                      <img src={item.user.avatarUrl} alt={item.user.name || "مستخدم"} className="h-full w-full object-cover" />
                    ) : (
                      (item.user.name || "KD").slice(0, 2)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/profile/${item.user.id}`} className="font-bold hover:underline">
                      {item.user.name || "مستخدم"}
                    </Link>
                    <p className="mt-1 text-xs text-neutral-400">
                      {item.user.specialty || "مصمم"} · {item.isPermanent ? "حظر دائم" : item.unblockAt ? `ينتهي ${new Date(item.unblockAt).toLocaleString("ar-EG")}` : "محظور"}
                    </p>
                  </div>
                  <Button
                    onClick={() => unblock.mutate({ userId: item.user.id })}
                    disabled={unblock.isPending}
                    variant="outline"
                    className="rounded-xl text-xs"
                  >
                    إلغاء الحظر
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid place-items-center rounded-[1.75rem] border border-dashed border-neutral-300 bg-white py-20 text-center">
              <UserX className="h-10 w-10 text-[#c38a10]" />
              <h3 className="mt-4 font-display font-bold">قائمة الحظر فارغة</h3>
              <p className="mt-2 max-w-sm text-sm text-neutral-500">لم تقم بحظر أي مستخدم. يمكنك حظر مستخدم من قائمة الإجراءات في أي منشور أو من ملفه الشخصي.</p>
            </div>
          )}
        </div>
      </div>
    </AppChrome>
  );
}
