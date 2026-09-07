import { useState } from "react";
import { Check, FileText, Loader2, MessageSquare, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AdminRequestsPanel() {
  const utils = trpc.useUtils();
  const verification = trpc.adminControl.verificationRequests.useQuery();
  const tickets = trpc.adminControl.supportTickets.useQuery();
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [replies, setReplies] = useState<Record<number, string>>({});
  const review = trpc.adminControl.reviewVerification.useMutation({
    onSuccess: () => { toast.success("تم تحديث طلب التحقق"); utils.adminControl.verificationRequests.invalidate(); },
    onError: error => toast.error(error.message),
  });
  const reply = trpc.adminControl.replySupport.useMutation({
    onSuccess: () => { toast.success("تم إرسال الرد"); utils.adminControl.supportTickets.invalidate(); },
    onError: error => toast.error(error.message),
  });
  const loading = verification.isLoading || tickets.isLoading;
  if (loading) return <div className="grid place-items-center rounded-3xl border border-neutral-200 bg-white py-12"><Loader2 className="animate-spin text-[#c38a10]" /></div>;
  return <div className="grid gap-6 lg:grid-cols-2">
    <section className="rounded-[1.75rem] border border-neutral-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2"><FileText className="text-[#c38a10]" /><div><h2 className="font-display font-bold">طلبات توثيق الهوية</h2><p className="text-xs text-neutral-500">راجع صورة البطاقة من الأمام والخلف والسيرة الذاتية قبل اعتماد الشارة.</p></div></div>
      <div className="space-y-3">{verification.data?.length ? verification.data.map(({ request, user }) => <article key={request.id} className="rounded-2xl bg-[#f8f7f3] p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{user.name || "مستخدم"} · ID {user.publicId || user.id}</p><p className="mt-1 text-xs text-neutral-500">الحالة: {request.status}</p></div><div className="flex gap-2"><a href={request.idFrontUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#a36e00] underline">الأمام</a><a href={request.idBackUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#a36e00] underline">الخلف</a><a href={request.cvUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#a36e00] underline">CV</a></div></div>{request.status === "pending" && <><Textarea value={notes[request.id] || ""} onChange={event => setNotes(prev => ({ ...prev, [request.id]: event.target.value }))} placeholder="ملاحظة للمستخدم (اختياري)" className="mt-3 min-h-20 rounded-xl" /><div className="mt-3 flex gap-2"><Button onClick={() => review.mutate({ requestId: request.id, status: "approved", note: notes[request.id] })} disabled={review.isPending} className="rounded-xl bg-emerald-600 text-white"><Check className="ml-1 h-4 w-4" />اعتماد</Button><Button onClick={() => review.mutate({ requestId: request.id, status: "rejected", note: notes[request.id] })} disabled={review.isPending} className="rounded-xl bg-red-600 text-white"><X className="ml-1 h-4 w-4" />رفض</Button></div></>}</article>) : <p className="py-8 text-center text-sm text-neutral-400">لا توجد طلبات تحقق.</p>}</div>
    </section>
    <section className="rounded-[1.75rem] border border-neutral-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2"><MessageSquare className="text-[#c38a10]" /><div><h2 className="font-display font-bold">تواصل المستخدمين</h2><p className="text-xs text-neutral-500">الرسائل والمستندات والمرفقات تصل للإدارة مع حالة واضحة.</p></div></div>
      <div className="space-y-3">{tickets.data?.length ? tickets.data.map(({ ticket, user }) => <article key={ticket.id} className="rounded-2xl bg-[#f8f7f3] p-4"><p className="font-bold">{ticket.subject}</p><p className="mt-1 text-xs text-neutral-500">{user.name || "مستخدم"} · {ticket.status}</p><p className="mt-3 whitespace-pre-wrap text-sm leading-6">{ticket.body}</p>{ticket.attachmentUrl && <a href={ticket.attachmentUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-bold text-[#a36e00] underline">فتح المرفق</a>}<Textarea value={replies[ticket.id] || ""} onChange={event => setReplies(prev => ({ ...prev, [ticket.id]: event.target.value }))} placeholder="رد الإدارة" className="mt-3 min-h-20 rounded-xl" /><Button onClick={() => reply.mutate({ ticketId: ticket.id, status: "resolved", reply: replies[ticket.id] })} disabled={reply.isPending || !replies[ticket.id]?.trim()} className="mt-3 rounded-xl bg-neutral-950 text-white">إرسال الرد وإغلاق الطلب</Button></article>) : <p className="py-8 text-center text-sm text-neutral-400">لا توجد رسائل دعم.</p>}</div>
    </section>
  </div>;
}
