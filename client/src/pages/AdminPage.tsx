import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Check, ImagePlus, Loader2, ShieldAlert, ToggleLeft, ToggleRight, Trash2, Users, LayoutList, Crown, ShieldBan, Palette, Clock } from "lucide-react";
import AppChrome from "@/components/AppChrome";
import AdminControlPanel from "@/pages/AdminControlPanel";
import AdminOperationsPanel from "@/pages/AdminOperationsPanel";
import ColoredName from "@/components/ColoredName";
import IdentityBadges from "@/components/IdentityBadges";

function readFile(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); }); }

const gradientOptions = [
  { value: "", label: "بدون" },
  { value: "gold", label: "ذهبي" },
  { value: "fire", label: "ناري" },
  { value: "ocean", label: "محيط" },
  { value: "sunset", label: "غروب" },
  { value: "forest", label: "غابة" },
  { value: "royal", label: "ملكي" },
  { value: "ice", label: "جليدي" },
  { value: "rose", label: "وردي" },
  { value: "emerald", label: "زمردي" },
  { value: "crimson", label: "قرمزي" },
];

const colorOptions = ["#f6c94c", "#e63946", "#00b4d8", "#2d6a4f", "#7209b7", "#f77f00", "#0077b6", "#d62828", "#52b788", "#b5179e"];

function UserBanModal({ userId, userName, onClose }: { userId: number; userName: string; onClose: () => void }) {
  const [isPermanent, setIsPermanent] = useState(false);
  const [durationHours, setDurationHours] = useState(24);
  const [reason, setReason] = useState("");
  const setBan = trpc.adminControl.setBan.useMutation({
    onSuccess: () => { toast.success("تم تطبيق الحظر"); onClose(); },
    onError: e => toast.error(e.message),
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/60 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center gap-2">
          <ShieldBan className="h-5 w-5 text-red-500" />
          <h3 className="font-display text-lg font-bold">حظر {userName}</h3>
        </div>
        <div className="space-y-4">
          <div className="flex gap-2">
            <button onClick={() => setIsPermanent(false)} className={`flex-1 rounded-xl border p-3 text-sm font-bold ${!isPermanent ? "border-[#ead48d] bg-[#fff8df] text-[#a36e00]" : "border-neutral-200 text-neutral-500"}`}>
              <Clock className="mx-auto mb-1 h-4 w-4" />حظر مؤقت
            </button>
            <button onClick={() => setIsPermanent(true)} className={`flex-1 rounded-xl border p-3 text-sm font-bold ${isPermanent ? "border-red-300 bg-red-50 text-red-600" : "border-neutral-200 text-neutral-500"}`}>
              <ShieldBan className="mx-auto mb-1 h-4 w-4" />حظر دائم
            </button>
          </div>
          {!isPermanent && (
            <div>
              <label className="mb-1 block text-xs font-bold text-neutral-500">مدة الحظر (بالساعات)</label>
              <Input type="number" value={durationHours} onChange={e => setDurationHours(Number(e.target.value))} min={1} max={720} className="rounded-xl" />
              <div className="mt-2 flex gap-2">
                {[1, 24, 72, 168].map(h => <button key={h} onClick={() => setDurationHours(h)} className="rounded-lg bg-neutral-100 px-3 py-1 text-xs font-bold hover:bg-neutral-200">{h === 24 ? "يوم" : h === 72 ? "3 أيام" : h === 168 ? "أسبوع" : "ساعة"}</button>)}
              </div>
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-bold text-neutral-500">سبب الحظر (اختياري)</label>
            <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="اكتب سبب الحظر..." className="rounded-xl" />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setBan.mutate({ userId, banned: true, isPermanent, durationHours: isPermanent ? undefined : durationHours, reason: reason.trim() || undefined })} disabled={setBan.isPending} className="flex-1 rounded-xl bg-red-600 text-white hover:bg-red-700">
              {setBan.isPending ? <Loader2 className="animate-spin" /> : "تأكيد الحظر"}
            </Button>
            <Button variant="ghost" onClick={onClose} className="rounded-xl">إلغاء</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserBadgeModal({ userId, userName, currentBadgeColor, currentNameColor, currentNameGradient, onClose }: { userId: number; userName: string; currentBadgeColor?: string | null; currentNameColor?: string | null; currentNameGradient?: string | null; onClose: () => void }) {
  const [badgeColor, setBadgeColor] = useState(currentBadgeColor || "");
  const [nameColor, setNameColor] = useState(currentNameColor || "");
  const [nameGradient, setNameGradient] = useState(currentNameGradient || "");
  const setBadge = trpc.adminControl.setBadge.useMutation({
    onSuccess: () => { toast.success("تم تحديث الشارة والألوان"); onClose(); },
    onError: e => toast.error(e.message),
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/60 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5 text-[#c38a10]" />
          <h3 className="font-display text-lg font-bold">تخصيص {userName}</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-bold text-neutral-500">لون الشارة المميزة</label>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setBadgeColor("")} className={`rounded-lg border-2 px-3 py-1.5 text-xs font-bold ${!badgeColor ? "border-neutral-900" : "border-neutral-200"}`}>بدون</button>
              {colorOptions.map(c => <button key={c} onClick={() => setBadgeColor(c)} className={`rounded-lg border-2 px-3 py-1.5 text-xs font-bold ${badgeColor === c ? "border-neutral-900" : "border-neutral-200"}`} style={{ color: c }}>شارة</button>)}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold text-neutral-500">لون الاسم</label>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setNameColor("")} className={`rounded-lg border-2 px-3 py-1.5 text-xs font-bold ${!nameColor ? "border-neutral-900" : "border-neutral-200"}`}>بدون</button>
              {colorOptions.map(c => <button key={c} onClick={() => setNameColor(c)} className={`rounded-lg border-2 px-3 py-1.5 text-xs font-bold ${nameColor === c ? "border-neutral-900" : "border-neutral-200"}`} style={{ color: c }}>أبجد</button>)}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold text-neutral-500">تدرج لوني للاسم</label>
            <select value={nameGradient} onChange={e => setNameGradient(e.target.value)} className="w-full rounded-xl border border-neutral-200 p-2 text-sm">
              {gradientOptions.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
          <div className="rounded-xl bg-[#f8f7f3] p-3">
            <p className="mb-1 text-xs text-neutral-400">معاينة:</p>
            <ColoredName user={{ name: userName, nameColor: nameColor || null, nameGradient: nameGradient || null }} className="text-base" />
            {badgeColor && <span className="mr-2 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold" style={{ backgroundColor: `${badgeColor}20`, color: badgeColor, border: `1px solid ${badgeColor}40` }}>مميز</span>}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setBadge.mutate({ userId, badgeColor: badgeColor || null, nameColor: nameColor || null, nameGradient: nameGradient || null })} disabled={setBadge.isPending} className="flex-1 rounded-xl bg-neutral-950 text-white">
              {setBadge.isPending ? <Loader2 className="animate-spin" /> : "حفظ"}
            </Button>
            <Button variant="ghost" onClick={onClose} className="rounded-xl">إلغاء</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, loading } = useAuth(); const enabled = user?.role === "admin"; const [section, setSection] = useState<"control" | "splash" | "posts" | "users">("control");
  const splashQuery = trpc.splash.adminList.useQuery(undefined, { enabled }); const postsQuery = trpc.admin.posts.useQuery(undefined, { enabled: enabled && section === "posts" }); const usersQuery = trpc.adminControl.users.useQuery(undefined, { enabled: enabled && section === "users" });
  const upload = trpc.splash.upload.useMutation(); const create = trpc.splash.create.useMutation({ onSuccess: () => { toast.success("تمت إضافة الشريحة"); splashQuery.refetch(); setTitle(""); setSubtitle(""); setFile(null); }, onError: e => toast.error(e.message) }); const update = trpc.splash.update.useMutation({ onSuccess: () => { toast.success("تم تحديث حالة الشريحة"); splashQuery.refetch(); }, onError: e => toast.error(e.message) }); const deletePost = trpc.admin.deletePost.useMutation({ onSuccess: () => { toast.success("تم حذف العمل من المنصة"); postsQuery.refetch(); }, onError: e => toast.error(e.message) }); const setRole = trpc.admin.setUserRole.useMutation({ onSuccess: () => { toast.success("تم تحديث صلاحية المستخدم"); usersQuery.refetch(); }, onError: e => toast.error(e.message) });
  const setBan = trpc.adminControl.setBan.useMutation({ onSuccess: () => { toast.success("تم تحديث حالة الحظر"); usersQuery.refetch(); }, onError: e => toast.error(e.message) });
  const [title, setTitle] = useState(""); const [subtitle, setSubtitle] = useState(""); const [file, setFile] = useState<File | null>(null);
  const [banTarget, setBanTarget] = useState<{ id: number; name: string } | null>(null);
  const [badgeTarget, setBadgeTarget] = useState<{ id: number; name: string; badgeColor?: string | null; nameColor?: string | null; nameGradient?: string | null } | null>(null);
  if (loading) return <AppChrome><div className="container grid place-items-center py-32"><Loader2 className="animate-spin text-[#c38a10]" /></div></AppChrome>;
  if (!enabled) return <AppChrome><div className="container grid place-items-center py-28 text-center"><ShieldAlert className="h-10 w-10 text-red-500" /><h1 className="mt-4 font-display text-xl font-bold">هذه الصفحة للإدارة فقط</h1><p className="mt-2 text-sm text-neutral-500">لا يمكن للمستخدم العادي الوصول إلى أدوات الإدارة.</p><Link href="/" className="mt-5 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white">العودة للتغذية</Link></div></AppChrome>;
  const submit = async () => { if (!file || !title.trim()) return toast.error("أضف عنوانًا وصورة"); if (!file.type.startsWith("image/")) return toast.error("الملف المختار ليس صورة"); try { const dataUrl = await readFile(file); const stored = await upload.mutateAsync({ fileName: file.name, mimeType: file.type, data: dataUrl }); await create.mutateAsync({ title, subtitle, imageUrl: stored.url, fileKey: stored.key }); } catch (error) { toast.error(error instanceof Error ? error.message : "تعذر رفع الصورة"); } };
  return <AppChrome title="لوحة الإدارة"><div className="container py-8"><div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-neutral-200 bg-white p-2"><button onClick={() => setSection("control")} className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${section === "control" ? "bg-[#fff4cf] text-[#a36e00]" : "text-neutral-500"}`}><Crown className="h-4 w-4" />مركز التحكم</button><button onClick={() => setSection("splash")} className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${section === "splash" ? "bg-[#fff4cf] text-[#a36e00]" : "text-neutral-500"}`}><ImagePlus className="h-4 w-4" />Splash</button><button onClick={() => setSection("posts")} className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${section === "posts" ? "bg-[#fff4cf] text-[#a36e00]" : "text-neutral-500"}`}><LayoutList className="h-4 w-4" />مراجعة الأعمال</button><button onClick={() => setSection("users")} className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${section === "users" ? "bg-[#fff4cf] text-[#a36e00]" : "text-neutral-500"}`}><Users className="h-4 w-4" />المستخدمون</button></div>{section === "control" && <div className="space-y-6"><AdminControlPanel /><AdminOperationsPanel /></div>}{section === "splash" && <div className="grid gap-6 lg:grid-cols-[1fr_360px]"><section className="rounded-[1.75rem] border border-neutral-200 bg-white p-6"><div className="flex items-start justify-between"><div><h2 className="font-display text-xl font-bold">شرائح Splash</h2><p className="mt-1 text-sm text-neutral-500">فعّل حتى ثلاث شرائح تظهر للزوار لمدة خمس ثوانٍ مع خيار التخطي.</p></div><ImagePlus className="h-5 w-5 text-[#c38a10]" /></div>{splashQuery.isLoading ? <div className="grid place-items-center py-20"><Loader2 className="animate-spin text-[#c38a10]" /></div> : splashQuery.data?.length ? <div className="mt-6 space-y-3">{splashQuery.data.map(slide => <div key={slide.id} className="flex items-center gap-3 rounded-2xl border border-neutral-100 p-3"><img src={slide.imageUrl} alt={slide.title} className="h-16 w-24 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{slide.title}</p><p className="mt-1 text-xs text-neutral-400">{slide.isActive ? "مفعّلة" : "متوقفة"}</p></div><button onClick={() => { if (!slide.isActive && splashQuery.data.filter(item => item.isActive).length >= 3) return toast.error("يمكن تفعيل ثلاث شرائح فقط"); update.mutate({ id: slide.id, isActive: slide.isActive ? 0 : 1 }); }} className={slide.isActive ? "text-[#a36e00]" : "text-neutral-400"} aria-label="تبديل الحالة">{slide.isActive ? <ToggleRight /> : <ToggleLeft />}</button></div>)}</div> : <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 py-16 text-center text-sm text-neutral-500">لم تُضف شرائح بعد.</div>}</section><aside className="h-fit rounded-[1.75rem] bg-neutral-950 p-6 text-white"><div className="mb-5 flex items-center gap-2 text-[#f6c94c]"><ImagePlus className="h-5 w-5" /><h2 className="font-display font-bold">إضافة شريحة</h2></div><div className="space-y-4"><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="عنوان الإعلان" className="border-white/10 bg-white/10 text-white placeholder:text-white/40" /><Textarea value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="وصف مختصر" className="border-white/10 bg-white/10 text-white placeholder:text-white/40" /><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/20 p-4 text-sm text-white/60"><ImagePlus className="h-5 w-5 text-[#f6c94c]" /><span>{file ? file.name : "اختر أي صيغة صورة"}</span><input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} /></label><Button onClick={submit} disabled={upload.isPending || create.isPending} className="h-12 w-full rounded-xl bg-[#f6c94c] font-bold text-neutral-950 hover:bg-[#e5b637]">{upload.isPending || create.isPending ? <Loader2 className="animate-spin" /> : <><Check className="ml-2 h-4 w-4" />حفظ الشريحة</>}</Button></div></aside></div>}{section === "posts" && <section className="rounded-[1.75rem] border border-neutral-200 bg-white p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-display text-xl font-bold">مراجعة الأعمال</h2><p className="mt-1 text-sm text-neutral-500">حذف الأعمال المخالفة من قاعدة البيانات مع سجلات التفاعل التابعة لها.</p></div><LayoutList className="text-[#c38a10]" /></div>{postsQuery.isLoading ? <Loader2 className="mx-auto my-20 animate-spin text-[#c38a10]" /> : postsQuery.data?.length ? <div className="space-y-3">{postsQuery.data.map(({ post, author }) => <div key={post.id} className="flex items-center gap-3 rounded-2xl border border-neutral-100 p-4"><div className="min-w-0 flex-1"><p className="font-bold">{post.title}</p><p className="mt-1 text-xs text-neutral-400">بواسطة {author.name || "مستخدم"} · {new Date(post.createdAt).toLocaleDateString("ar-EG")}</p></div><Link href={`/profile/${author.id}`} className="text-xs font-bold text-[#a36e00]">الملف</Link><button onClick={() => deletePost.mutate({ postId: post.id })} disabled={deletePost.isPending} className="rounded-xl p-2 text-red-500 hover:bg-red-50" aria-label="حذف العمل"><Trash2 className="h-4 w-4" /></button></div>)}</div> : <div className="py-20 text-center text-sm text-neutral-500">لا توجد أعمال للمراجعة.</div>}</section>}{section === "users" && <section className="rounded-[1.75rem] border border-neutral-200 bg-white p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-display text-xl font-bold">المستخدمون</h2><p className="mt-1 text-sm text-neutral-500">إدارة الحسابات: حظر مؤقت/دائم، شارات وألوان مميزة، وتغيير الصلاحيات.</p></div><Crown className="text-[#c38a10]" /></div>{usersQuery.isLoading ? <Loader2 className="mx-auto my-20 animate-spin text-[#c38a10]" /> : usersQuery.data?.length ? <div className="space-y-3">{usersQuery.data.map(member => <div key={member.id} className="rounded-2xl border border-neutral-100 p-4"><div className="flex items-center gap-3"><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><ColoredName user={member} className="text-sm" /><IdentityBadges user={member} compact />{member.isBanned ? <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">{member.banUntil ? `حظر حتى ${new Date(member.banUntil).toLocaleDateString("ar-EG")}` : "حظر دائم"}</span> : null}</div><p className="mt-1 text-xs text-neutral-400">{member.email || "لا يوجد بريد"} · {member.role === "admin" ? "إدارة" : "مستخدم"}</p></div><span className="rounded-full bg-[#fff4cf] px-3 py-1 text-xs font-bold text-[#a36e00]">{member.role === "admin" ? "Admin" : "User"}</span></div>{member.id !== user?.id && member.role !== "admin" && <div className="mt-3 flex flex-wrap gap-2 border-t border-neutral-100 pt-3">{member.isBanned ? <button onClick={() => setBan.mutate({ userId: member.id, banned: false })} disabled={setBan.isPending} className="rounded-xl border border-neutral-200 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50">إلغاء الحظر</button> : <button onClick={() => setBanTarget({ id: member.id, name: member.name || "مستخدم" })} className="rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"><ShieldBan className="ml-1 h-3 w-3" />حظر</button>}<button onClick={() => setBadgeTarget({ id: member.id, name: member.name || "مستخدم", badgeColor: member.badgeColor, nameColor: member.nameColor, nameGradient: member.nameGradient })} className="rounded-xl border border-neutral-200 px-3 py-2 text-xs font-bold hover:bg-neutral-50"><Palette className="ml-1 h-3 w-3" />شارة ولون</button><button onClick={() => setRole.mutate({ userId: member.id, role: member.role === "admin" ? "user" : "admin" })} className="rounded-xl border border-neutral-200 px-3 py-2 text-xs font-bold">تبديل الدور</button></div>}</div>)}</div> : <div className="py-20 text-center text-sm text-neutral-500">لا يوجد مستخدمون.</div>}</section>}</div>{banTarget && <UserBanModal userId={banTarget.id} userName={banTarget.name} onClose={() => setBanTarget(null)} />}{badgeTarget && <UserBadgeModal userId={badgeTarget.id} userName={badgeTarget.name} currentBadgeColor={badgeTarget.badgeColor} currentNameColor={badgeTarget.nameColor} currentNameGradient={badgeTarget.nameGradient} onClose={() => setBadgeTarget(null)} />}</AppChrome>;
}
