import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { BadgeCheck, Copy, Crown, Flag, Loader2, MapPin, MessageCircle, Share2, ShieldBan, Sparkles, UserPlus } from "lucide-react";
import AppChrome from "@/components/AppChrome";
import PostCard from "@/components/PostCard";

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const imageTypes = ["image/jpeg", "image/webp", "image/png"];

type ImageKind = "avatar" | "cover";

export default function ProfilePage() {
  const [, params] = useRoute("/profile/:id");
  const [, navigate] = useLocation();
  const { user: current, isAuthenticated } = useAuth();
  const userId = Number(params?.id);
  const { data: profile, isLoading } = trpc.profile.get.useQuery({ userId }, { enabled: Number.isFinite(userId) });
  const detectedProfile = trpc.profile.detectCountry.useQuery(undefined, { enabled: isAuthenticated && current?.id === userId, refetchOnWindowFocus: false });
  const { data: profilePosts, isLoading: postsLoading } = trpc.profile.posts.useQuery({ userId }, { enabled: Number.isFinite(userId) });
  const relationship = trpc.social.relationship.useQuery({ userId }, { enabled: isAuthenticated && Number.isFinite(userId) && current?.id !== userId });
  const utils = trpc.useUtils();
  const update = trpc.profile.update.useMutation({ onSuccess: () => { toast.success("تم حفظ الملف الشخصي"); setEditing(false); utils.profile.get.invalidate({ userId }); }, onError: e => toast.error(e.message) });
  const mediaUpload = trpc.media.upload.useMutation();
  const follow = trpc.social.requestFollow.useMutation({ onSuccess: data => { toast.success(data.status === "pending" ? "تم إرسال طلب المتابعة" : "أنت تتابع هذا المستخدم"); utils.social.relationship.invalidate({ userId }); }, onError: e => toast.error(e.message) });
  const toggleFollow = trpc.social.toggleFollow.useMutation({ onSuccess: data => { toast.success(data.following ? "تمت المتابعة" : "تم إلغاء المتابعة"); utils.social.relationship.invalidate({ userId }); }, onError: e => toast.error(e.message) });
  const respond = trpc.social.respondFollow.useMutation({ onSuccess: () => { toast.success("تم تحديث طلب المتابعة"); utils.social.relationship.invalidate({ userId }); }, onError: e => toast.error(e.message) });
  const block = trpc.social.toggleBlock.useMutation({ onSuccess: data => toast.success(data.blocked ? "تم حظر المستخدم" : "تم إلغاء الحظر"), onError: e => toast.error(e.message) }); const reportUser = trpc.reports.create.useMutation({ onSuccess: () => toast.success("تم إرسال البلاغ للمراجعة"), onError: e => toast.error(e.message) }); const conversation = trpc.messages.getOrCreateConversation.useMutation({ onSuccess: ({ conversationId }) => navigate(`/messages?conversationId=${conversationId}`), onError: e => toast.error(e.message) });
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [country, setCountry] = useState("");
  const [level, setLevel] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  if (isLoading) return <AppChrome><div className="container grid place-items-center py-32"><Loader2 className="animate-spin text-[#c38a10]" /></div></AppChrome>;
  if (!profile) return <AppChrome><div className="container py-20 text-center">لم يتم العثور على الملف.</div></AppChrome>;

  const isMine = current?.id === profile.id;
  const isPrestige = Boolean(profile.verified) || isMine;
  const countryLabel = profile.country || detectedProfile.data?.country;
  const levelLabel = profile.level || "1";
  const copyPublicId = async () => { if (!profile.publicId) return; await navigator.clipboard.writeText(profile.publicId); toast.success("تم نسخ ID"); };
  const shareProfile = async () => { const url = `${window.location.origin}/profile/${profile.id}`; try { if (navigator.share) await navigator.share({ title: profile.name || "KING DESIGNER", url }); else { await navigator.clipboard.writeText(url); toast.success("تم نسخ رابط الملف"); } } catch { toast.error("تعذر مشاركة الملف"); } };
  const followStatus = relationship.data?.following;
  const incomingStatus = relationship.data?.incoming;
  const beginEdit = () => { setName(profile.name || ""); setHandle(profile.handle || ""); setBio(profile.bio || ""); setSpecialty(profile.specialty || ""); setCountry(countryLabel || ""); setLevel(levelLabel); setAvatarFile(null); setCoverFile(null); setAvatarPreview(profile.avatarUrl || ""); setCoverPreview(profile.coverUrl || ""); setEditing(true); };
  const chooseImage = (file: File | undefined, kind: ImageKind) => {
    if (!file) return;
    if (!imageTypes.includes(file.type)) return toast.error("اختر صورة PNG أو JPG أو WEBP");
    if (file.size > MAX_IMAGE_BYTES) return toast.error("حجم الصورة يجب ألا يتجاوز 5MB");
    const preview = URL.createObjectURL(file);
    if (kind === "avatar") { setAvatarFile(file); setAvatarPreview(preview); } else { setCoverFile(file); setCoverPreview(preview); }
  };
  const saveProfile = async () => {
    try {
      const avatar = avatarFile ? await mediaUpload.mutateAsync({ fileName: avatarFile.name, mimeType: avatarFile.type as "image/jpeg" | "image/webp" | "image/png", data: await readFile(avatarFile) }) : null;
      const cover = coverFile ? await mediaUpload.mutateAsync({ fileName: coverFile.name, mimeType: coverFile.type as "image/jpeg" | "image/webp" | "image/png", data: await readFile(coverFile) }) : null;
      await update.mutateAsync({ name, handle: handle || undefined, bio, specialty, country, avatarUrl: avatar?.url, coverUrl: cover?.url });
    } catch (error) { toast.error(error instanceof Error ? error.message : "تعذر حفظ الملف"); }
  };

  return <AppChrome>
    <div className="container py-8">
      <section className={`overflow-hidden rounded-[2rem] border bg-white shadow-sm ${isPrestige ? "border-[#d7ab39] ring-1 ring-[#f6c94c]/30" : "border-neutral-200"}`}>
        <div className="relative h-56 overflow-hidden bg-neutral-950">
          {profile.coverUrl ? <img src={profile.coverUrl} alt="صورة الغلاف" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,#604c13,transparent_35%),linear-gradient(135deg,#0c0c0c,#2a2414)]" />}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/10 to-transparent" />
          <div className="absolute bottom-4 right-5 inline-flex items-center gap-2 rounded-full border border-[#f6c94c]/40 bg-neutral-950/80 px-4 py-2 text-xs font-bold text-[#f6c94c] backdrop-blur"><Crown className="h-4 w-4" />{isPrestige ? "ملف مميز" : "ملف إبداعي"}</div>
        </div>
        <div className="relative px-6 pb-7">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-1 items-end gap-4">
              <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-[1.5rem] border-4 border-white bg-neutral-900 text-2xl font-bold text-[#f6c94c] shadow-xl">{profile.avatarUrl ? <img src={profile.avatarUrl} alt={profile.name || "المستخدم"} className="h-full w-full object-cover" /> : (profile.name || "KD").slice(0, 2)}</div>
              <div className="min-w-0 flex-1 pt-14 sm:pt-12">
                <div className="flex flex-wrap items-center gap-2"><h1 className={`font-display text-2xl font-extrabold tracking-tight ${isPrestige ? "bg-gradient-to-l from-[#8b5a00] via-[#f6c94c] to-[#9d6b0a] bg-clip-text text-transparent" : "text-neutral-950"}`}>{profile.name || "مستخدم KING DESIGNER"}</h1>{profile.verified ? <BadgeCheck className="h-5 w-5 fill-[#f6c94c] text-neutral-950" aria-label="حساب موثق" /> : null}</div>
                <p className="mt-1 text-sm text-neutral-500">{profile.specialty || "مصمم مستقل"}</p>
                {profile.handle && <p className="mt-1 text-[11px] font-bold text-[#a36e00]">@{profile.handle}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                  {profile.publicId && <button onClick={copyPublicId} className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-l from-[#221806] via-[#5d4210] to-[#1a1408] px-3 py-1.5 font-bold text-[#f6c94c] shadow-sm">ID: {profile.publicId}<Copy className="h-3 w-3" /></button>}
                  <button onClick={shareProfile} className="inline-flex items-center gap-1 rounded-xl bg-[#f8f7f3] px-3 py-1.5 font-bold text-neutral-600"><Share2 className="h-3 w-3" />مشاركة الملف</button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">{isMine ? <Button onClick={beginEdit} className="rounded-xl bg-neutral-950 text-white">تعديل الملف</Button> : <>{isAuthenticated && <Button onClick={() => incomingStatus === "pending" ? respond.mutate({ followerId: profile.id, accept: true }) : followStatus === "accepted" ? toggleFollow.mutate({ userId: profile.id }) : followStatus === "pending" ? undefined : follow.mutate({ userId: profile.id })} disabled={follow.isPending || toggleFollow.isPending || respond.isPending || followStatus === "pending"} className="rounded-xl bg-neutral-950 text-white"><UserPlus className="ml-2 h-4 w-4" />{incomingStatus === "pending" ? "قبول المتابعة" : followStatus === "accepted" ? "إلغاء المتابعة" : followStatus === "pending" ? "قيد الانتظار" : "متابعة"}</Button>}<Button onClick={() => conversation.mutate({ userId: profile.id })} disabled={!isAuthenticated || conversation.isPending} variant="outline" className="rounded-xl"><MessageCircle className="ml-2 h-4 w-4" />رسالة</Button><Button onClick={() => block.mutate({ userId: profile.id })} variant="outline" className="rounded-xl text-red-600"><ShieldBan className="ml-2 h-4 w-4" />حظر</Button><Button onClick={() => { if (!isAuthenticated) return toast.error("سجّل الدخول للإبلاغ"); const reason = window.prompt("اكتب سبب البلاغ عن المستخدم"); if (reason?.trim()) reportUser.mutate({ targetType: "user", targetId: profile.id, reason: reason.trim() }); }} variant="outline" className="rounded-xl"><Flag className="ml-2 h-4 w-4" />إبلاغ</Button></>}</div>
          </div>
          <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_330px]">
            <div><p className="max-w-2xl text-sm leading-8 text-neutral-600">{profile.bio || "لم يضف هذا المستخدم نبذة بعد."}</p><div className="mt-4 flex flex-wrap gap-2 text-xs text-neutral-500">{countryLabel && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{countryLabel}</span>}<span className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-bold ${isPrestige ? "bg-gradient-to-l from-[#fff0ae] to-[#fff8df] text-[#8b5a00]" : "bg-[#f8f7f3] text-neutral-600"}`}><Crown className="h-3.5 w-3.5" />المستوى {levelLabel}</span></div></div>
            <div className="grid grid-cols-3 gap-3"><div className="rounded-2xl bg-[#f8f7f3] p-4"><div className="font-display text-xl font-extrabold">{profile.followersCount}</div><div className="mt-1 text-xs text-neutral-500">متابعون</div></div><div className="rounded-2xl bg-[#f8f7f3] p-4"><div className="font-display text-xl font-extrabold">{profile.followingCount}</div><div className="mt-1 text-xs text-neutral-500">يتابع</div></div><div className="rounded-2xl border border-[#ead48d] bg-gradient-to-br from-[#fff8df] to-[#f6c94c]/30 p-4"><div className="flex items-center gap-1 font-display text-xl font-extrabold text-[#8b5a00]"><Crown className="h-4 w-4" />{levelLabel}</div><div className="mt-1 text-xs text-[#8b5a00]">تقدم حقيقي</div></div></div>
          </div>
        </div>
      </section>
      {editing && <div className="mt-5 rounded-[1.5rem] border border-[#ead48d] bg-[#fff8df] p-6"><h2 className="font-display font-bold">تعديل معلوماتك</h2><div className="mt-4 grid gap-3 md:grid-cols-2"><Input value={name} onChange={e => setName(e.target.value)} placeholder="الاسم" className="rounded-xl bg-white" /><Input value={handle} onChange={e => setHandle(e.target.value.replace(/[^A-Za-z0-9_\u0600-\u06FF]/g, ""))} placeholder="المعرّف الفريد (handle)" className="rounded-xl bg-white" /><Input value={specialty} onChange={e => setSpecialty(e.target.value)} placeholder="التخصص" className="rounded-xl bg-white" /><Input value={country} onChange={e => setCountry(e.target.value)} placeholder="الدولة — يحددها النظام أو الإدارة" disabled className="rounded-xl bg-neutral-100 text-neutral-500" /><Input value={level} readOnly placeholder="المستوى" className="rounded-xl bg-neutral-100 text-neutral-500" /><Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="نبذة" className="rounded-xl bg-white md:col-span-2" /><div className="grid gap-3 sm:grid-cols-2"><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-white px-4 py-3 text-xs text-neutral-500"><span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-neutral-100">{avatarPreview ? <img src={avatarPreview} alt="معاينة الصورة الشخصية" className="h-full w-full object-cover" /> : "لا توجد"}</span><span>اختيار الصورة الشخصية<input type="file" accept="image/jpeg,image/webp,image/png" className="hidden" onChange={e => chooseImage(e.target.files?.[0], "avatar")} /></span></label><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-white px-4 py-3 text-xs text-neutral-500"><span className="grid h-14 w-20 shrink-0 items-center overflow-hidden rounded-xl bg-neutral-100">{coverPreview ? <img src={coverPreview} alt="معاينة صورة الغلاف" className="h-full w-full object-cover" /> : "لا يوجد"}</span><span>اختيار صورة الغلاف<input type="file" accept="image/jpeg,image/webp,image/png" className="hidden" onChange={e => chooseImage(e.target.files?.[0], "cover")} /></span></label></div></div><div className="mt-4 flex gap-2"><Button onClick={saveProfile} disabled={update.isPending || mediaUpload.isPending} className="rounded-xl bg-neutral-950 text-white">{update.isPending || mediaUpload.isPending ? <Loader2 className="animate-spin" /> : "حفظ التعديلات"}</Button><Button variant="ghost" onClick={() => setEditing(false)} className="rounded-xl">إلغاء</Button></div></div>}
      <div className="mt-8 flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#c38a10]" /><h2 className="font-display text-lg font-bold">معرض الأعمال</h2><span className="text-xs text-neutral-400">— الأعمال الحقيقية لهذا المصمم</span></div>
      <div className="mt-4 space-y-5">{postsLoading ? <div className="grid place-items-center rounded-[1.5rem] bg-white py-20"><Loader2 className="animate-spin text-[#c38a10]" /></div> : profilePosts?.length ? profilePosts.map(post => <PostCard key={post.id} post={post} isAuthenticated={isAuthenticated} viewerId={current?.id} />) : <div className="grid place-items-center rounded-[1.5rem] border border-dashed border-neutral-300 bg-white py-16 text-sm text-neutral-500">سيظهر هنا فقط ما ينشره هذا المستخدم فعليًا.</div>}</div>
    </div>
  </AppChrome>;
}
