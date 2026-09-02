import { useState } from "react";
import { CheckCircle2, CreditCard, FileText, Loader2, ShieldCheck, Sparkles, WalletCards, XCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Metric = { label: string; value: number; icon: typeof ShieldCheck };

export default function AdminControlPanel() {
  const users = trpc.adminControl.users.useQuery();
  const profiles = trpc.adminControl.profiles.useQuery();
  const posts = trpc.adminControl.posts.useQuery();
  const blocks = trpc.adminControl.blocks.useQuery();
  const comments = trpc.adminControl.comments.useQuery();
  const reports = trpc.adminControl.reports.useQuery();
  const messages = trpc.adminControl.messages.useQuery();
  const credits = trpc.adminControl.credits.useQuery();
  const payments = trpc.adminControl.payments.useQuery();
  const subscriptions = trpc.adminControl.subscriptions.useQuery();
  const providers = trpc.adminControl.aiProviders.useQuery();
  const models = trpc.adminControl.aiModels.useQuery();
  const pricing = trpc.adminControl.pricing.useQuery();
  const rewards = trpc.adminControl.rewards.useQuery();
  const notifications = trpc.adminControl.notifications.useQuery();
  const audit = trpc.adminControl.audit.useQuery();
  const utils = trpc.useUtils();
  const [idDrafts, setIdDrafts] = useState<Record<number, string>>({});
  const [creditDrafts, setCreditDrafts] = useState<Record<number, string>>({});

  const verify = trpc.adminControl.verifyUser.useMutation({
    onSuccess: () => { toast.success("تم تحديث التوثيق"); utils.adminControl.users.invalidate(); utils.adminControl.profiles.invalidate(); },
    onError: error => toast.error(error.message),
  });
  const setId = trpc.adminControl.setPublicId.useMutation({
    onSuccess: () => { toast.success("تم تحديث ID"); utils.adminControl.users.invalidate(); },
    onError: error => toast.error(error.message),
  });
  const adjustCredits = trpc.adminControl.adjustCredits.useMutation({
    onSuccess: () => { toast.success("تم تسجيل حركة الرصيد"); setCreditDrafts({}); utils.adminControl.credits.invalidate(); },
    onError: error => toast.error(error.message),
  });
  const setBan = trpc.adminControl.setBan.useMutation({
    onSuccess: () => { toast.success("تم تحديث الحظر"); utils.adminControl.blocks.invalidate(); },
    onError: error => toast.error(error.message),
  });
  const deleteComment = trpc.adminControl.deleteComment.useMutation({
    onSuccess: () => { toast.success("تم حذف التعليق"); utils.adminControl.comments.invalidate(); },
    onError: error => toast.error(error.message),
  });
  const resolveReport = trpc.adminControl.updateReport.useMutation({
    onSuccess: () => { toast.success("تم تحديث البلاغ"); utils.adminControl.reports.invalidate(); },
    onError: error => toast.error(error.message),
  });
  const toggleProvider = trpc.adminControl.toggleProvider.useMutation({ onSuccess: () => utils.adminControl.aiProviders.invalidate(), onError: error => toast.error(error.message) });
  const toggleModel = trpc.adminControl.toggleModel.useMutation({ onSuccess: () => utils.adminControl.aiModels.invalidate(), onError: error => toast.error(error.message) });

  const loading = [users, profiles, posts, blocks, comments, reports, messages, credits, payments, subscriptions, providers, models, pricing, rewards, notifications, audit].some(query => query.isLoading);
  if (loading) return <div className="grid place-items-center rounded-[1.75rem] border border-neutral-200 bg-white py-24"><Loader2 className="animate-spin text-[#c38a10]" /></div>;

  const adminId = users.data?.find(user => user.role === "admin")?.id;
  const metrics: Metric[] = [
    { label: "Users", value: users.data?.length || 0, icon: ShieldCheck },
    { label: "Profiles", value: profiles.data?.length || 0, icon: FileText },
    { label: "Posts / Portfolio", value: posts.data?.length || 0, icon: Sparkles },
    { label: "Comments", value: comments.data?.length || 0, icon: FileText },
    { label: "Reports", value: reports.data?.length || 0, icon: XCircle },
    { label: "Messages", value: messages.data?.length || 0, icon: CheckCircle2 },
    { label: "Credits ledger", value: credits.data?.length || 0, icon: WalletCards },
    { label: "Payments", value: payments.data?.length || 0, icon: CreditCard },
    { label: "PRO / VIP", value: subscriptions.data?.filter(item => item.plan !== "free").length || 0, icon: CreditCard },
    { label: "Rewards", value: rewards.data?.length || 0, icon: Sparkles },
    { label: "Bans", value: blocks.data?.length || 0, icon: ShieldCheck },
    { label: "Notifications", value: notifications.data?.length || 0, icon: CheckCircle2 },
  ];

  return <div className="space-y-6">
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(metric => { const Icon = metric.icon; return <div key={metric.label} className="rounded-2xl border border-neutral-200 bg-white p-4"><div className="flex items-center justify-between text-neutral-500"><span className="text-xs font-bold">{metric.label}</span><Icon className="h-4 w-4 text-[#c38a10]" /></div><div className="mt-3 font-display text-2xl font-extrabold">{metric.value}</div><p className="mt-1 text-[11px] text-neutral-400">من السجلات الفعلية فقط</p></div>; })}</div>

    <section className="rounded-[1.75rem] border border-neutral-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between"><div><h2 className="font-display text-lg font-bold">Users / Profiles</h2><p className="mt-1 text-xs text-neutral-500">توثيق الحساب وتعديل ID والرصيد والحظر تحت صلاحية Admin، مع حجز 10000 للحساب الإداري.</p></div><ShieldCheck className="text-[#c38a10]" /></div>
      <div className="space-y-2">{users.data?.map(member => { const banned = Boolean(blocks.data?.some(item => item.blockerId === adminId && item.blockedId === member.id)); return <div key={member.id} className="grid gap-2 rounded-2xl border border-neutral-100 p-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
        <div><p className="text-sm font-bold">{member.name || "مستخدم"} {member.verified ? <span className="text-[#a36e00]">✓</span> : null}</p><p className="mt-1 text-[11px] text-neutral-400">ID: {member.publicId || "غير معيّن"} · @{member.handle || "بدون handle"}</p></div>
        <Button onClick={() => verify.mutate({ userId: member.id, verified: !Boolean(member.verified) })} disabled={verify.isPending} className="h-9 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-700">{member.verified ? "إلغاء التوثيق" : "توثيق"}</Button>
        <div className="flex gap-2"><Input value={idDrafts[member.id] ?? member.publicId ?? ""} onChange={event => setIdDrafts(prev => ({ ...prev, [member.id]: event.target.value }))} placeholder="ID" className="h-9 w-28 rounded-xl" /><Button onClick={() => setId.mutate({ userId: member.id, publicId: idDrafts[member.id] || member.publicId || "" })} disabled={setId.isPending || !/^\d{4,20}$/.test(idDrafts[member.id] || member.publicId || "")} className="h-9 rounded-xl bg-neutral-950 text-xs text-white">حفظ ID</Button></div>
        <div className="flex gap-2"><Input value={creditDrafts[member.id] ?? ""} onChange={event => setCreditDrafts(prev => ({ ...prev, [member.id]: event.target.value }))} placeholder="±credits" className="h-9 w-24 rounded-xl" /><Button onClick={() => adjustCredits.mutate({ userId: member.id, amount: Number(creditDrafts[member.id]), reason: "تعديل إداري موثق" })} disabled={adjustCredits.isPending || !Number.isInteger(Number(creditDrafts[member.id])) || Number(creditDrafts[member.id]) === 0} className="h-9 rounded-xl bg-[#fff4cf] text-xs font-bold text-[#8c6100]">رصيد</Button></div>
        <Button onClick={() => setBan.mutate({ userId: member.id, banned: !banned })} disabled={setBan.isPending || member.id === adminId} className="h-9 rounded-xl border border-red-100 bg-white text-xs font-bold text-red-600">{banned ? "فك الحظر" : "حظر"}</Button>
      </div>; })}</div>
    </section>

    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-[1.75rem] border border-neutral-200 bg-white p-5"><h2 className="font-display font-bold">Reports / Comments</h2><div className="mt-4 space-y-2">{reports.data?.length ? reports.data.map(report => <div key={report.id} className="flex items-center gap-3 rounded-xl bg-[#f8f7f3] p-3"><div className="min-w-0 flex-1"><p className="text-xs font-bold">#{report.id} · {report.targetType} · {report.status}</p><p className="mt-1 truncate text-[11px] text-neutral-500">{report.reason}</p></div>{report.status === "open" && <Button onClick={() => resolveReport.mutate({ reportId: report.id, status: "resolved" })} disabled={resolveReport.isPending} className="h-8 rounded-lg bg-neutral-950 text-[11px] text-white">حل البلاغ</Button>}</div>) : <p className="py-8 text-center text-sm text-neutral-400">لا توجد بلاغات محفوظة.</p>}</div><div className="mt-5 border-t border-neutral-100 pt-4"><h3 className="text-sm font-bold">آخر التعليقات</h3><div className="mt-2 space-y-2">{comments.data?.slice(0, 8).map(({ comment, author }) => <div key={comment.id} className="flex items-center gap-2 rounded-xl bg-[#f8f7f3] p-2"><p className="min-w-0 flex-1 truncate text-xs font-bold">{author.name || "مستخدم"}: {comment.body}</p><Button onClick={() => deleteComment.mutate({ commentId: comment.id })} disabled={deleteComment.isPending} className="h-7 rounded-lg bg-red-50 text-[10px] text-red-600">حذف</Button></div>)}</div></div></section>
      <section className="rounded-[1.75rem] border border-neutral-200 bg-white p-5"><h2 className="font-display font-bold">AI Providers / Models / Pricing</h2><div className="mt-4 space-y-2">{providers.data?.map(provider => <div key={provider.id} className="flex items-center justify-between rounded-xl bg-[#f8f7f3] p-3"><span className="text-sm font-bold">{provider.name}</span><Button onClick={() => toggleProvider.mutate({ providerId: provider.id, active: !Boolean(provider.isActive) })} className="h-8 rounded-lg bg-neutral-950 text-[11px] text-white">{provider.isActive ? "تعطيل" : "تفعيل"}</Button></div>)}{models.data?.map(model => <div key={model.id} className="flex items-center justify-between rounded-xl border border-neutral-100 p-3"><span className="text-xs">{model.name} · {model.modelKey}</span><Button onClick={() => toggleModel.mutate({ modelId: model.id, active: !Boolean(model.isActive) })} className="h-8 rounded-lg bg-neutral-950 text-[11px] text-white">{model.isActive ? "تعطيل" : "تفعيل"}</Button></div>)}<p className="pt-2 text-[11px] text-neutral-400">خطط التسعير المعرفة: {pricing.data?.length || 0}. لا يتم تفعيل مزود أو نموذج غير مسجل.</p></div></section>
    </div>

    <section className="rounded-[1.75rem] border border-neutral-200 bg-white p-5"><h2 className="font-display font-bold">Payments / Credits / PRO / VIP / Rewards / Notifications / Audit</h2><div className="mt-4 grid gap-3 text-xs text-neutral-500 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-xl bg-[#f8f7f3] p-3">مدفوعات: {payments.data?.length || 0}</div><div className="rounded-xl bg-[#f8f7f3] p-3">حركات رصيد: {credits.data?.length || 0}</div><div className="rounded-xl bg-[#f8f7f3] p-3">اشتراكات PRO/VIP: {subscriptions.data?.filter(item => item.plan !== "free").length || 0}</div><div className="rounded-xl bg-[#f8f7f3] p-3">سجل التدقيق: {audit.data?.length || 0}</div></div><p className="mt-4 text-xs leading-6 text-neutral-500">تُعرض السجلات الحقيقية فقط. الدفع والاسترداد مرتبطان بمزود خارجي ولم يتم اختلاق تدفق دفع محلي قبل تزويد مفاتيح Stripe وWebhook.</p></section>
  </div>;
}
