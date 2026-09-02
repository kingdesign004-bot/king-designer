import React, { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import RichText from "@/components/RichText";
import { Heart, Loader2, MessageCircle, Send, Share2, Trash2, Users } from "lucide-react";

function readFile(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); }); }
function SmallAvatar({ name, src }: { name?: string | null; src?: string | null }) {
  if (src) return <img src={src} alt={name || "المستخدم"} className="h-8 w-8 rounded-xl object-cover" />;
  return <div className="grid h-8 w-8 place-items-center rounded-xl bg-neutral-900 text-[10px] font-bold text-[#f6c94c]">{(name || "KD").slice(0, 2)}</div>;
}

export default function PostCard({ post, isAuthenticated, viewerId }: { post: any; isAuthenticated: boolean; viewerId?: number }) {
  const [showComments, setShowComments] = useState(false); const [showInteractors, setShowInteractors] = useState(false); const [body, setBody] = useState(""); const [replyTo, setReplyTo] = useState<number>(); const [commentAttachment, setCommentAttachment] = useState<File | null>(null); const [editing, setEditing] = useState(false); const [editTitle, setEditTitle] = useState(post.title); const [editDescription, setEditDescription] = useState(post.description || "");
  const utils = trpc.useUtils();
  const commentsQuery = trpc.comments.list.useQuery({ postId: post.id }, { enabled: showComments }); const interactors = trpc.posts.interactors.useQuery({ postId: post.id }, { enabled: showInteractors });
  const like = trpc.posts.toggleLike.useMutation({ onSuccess: () => utils.feed.list.invalidate(), onError: e => toast.error(e.message) });
  const share = trpc.posts.share.useMutation({ onSuccess: () => { toast.success("تم تسجيل المشاركة ونسخ الرابط"); utils.feed.list.invalidate(); }, onError: e => toast.error(e.message) }); const updatePost = trpc.posts.update.useMutation({ onSuccess: () => { toast.success("تم تحديث العمل"); setEditing(false); utils.feed.list.invalidate(); }, onError: e => toast.error(e.message) }); const deletePost = trpc.posts.delete.useMutation({ onSuccess: () => { toast.success("تم حذف العمل"); utils.feed.list.invalidate(); }, onError: e => toast.error(e.message) });
  const createComment = trpc.comments.create.useMutation({ onSuccess: () => { setBody(""); setReplyTo(undefined); utils.comments.list.invalidate({ postId: post.id }); utils.feed.list.invalidate(); toast.success("تم حفظ التعليق"); }, onError: e => toast.error(e.message) });
  const removeComment = trpc.comments.delete.useMutation({ onSuccess: () => { utils.comments.list.invalidate({ postId: post.id }); utils.feed.list.invalidate(); toast.success("تم حذف التعليق"); }, onError: e => toast.error(e.message) });
  const commentLike = trpc.comments.toggleLike.useMutation({ onSuccess: () => utils.comments.list.invalidate({ postId: post.id }), onError: e => toast.error(e.message) }); const commentMediaUpload = trpc.media.upload.useMutation();
  const submitComment = async () => { if (!body.trim() && !commentAttachment) return; try { const stored = commentAttachment ? await commentMediaUpload.mutateAsync({ fileName: commentAttachment.name, mimeType: commentAttachment.type as "image/jpeg" | "image/webp" | "image/png" | "video/mp4", data: await readFile(commentAttachment) }) : null; createComment.mutate({ postId: post.id, body: body || "وسيط مرفق", parentId: replyTo, mediaUrl: stored?.url }); } catch (error) { toast.error(error instanceof Error ? error.message : "تعذر رفع الوسيط"); } };
  const copyAndShare = async () => { if (!isAuthenticated) return toast.error("سجّل الدخول للمشاركة"); await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`); share.mutate({ postId: post.id }); };

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author.id}`}><SmallAvatar name={post.author.name} src={post.author.avatarUrl} /></Link>
          <div>
            <Link href={`/profile/${post.author.id}`} className="text-sm font-bold hover:underline">{post.author.name || "مستخدم KING DESIGNER"}</Link>
            <p className="text-[11px] text-neutral-400">{new Date(post.createdAt).toLocaleDateString("ar-EG")}{post.author.id !== viewerId && " · متابعة"}</p>
          </div>
        </div>
      </div>
      {post.authorId === viewerId && <div className="flex items-center gap-2 border-t border-neutral-100 px-5 py-3"><button onClick={() => setEditing(!editing)} className="text-xs font-bold text-[#a36e00]">{editing ? "إغلاق التعديل" : "تعديل العمل"}</button><button onClick={() => deletePost.mutate({ postId: post.id })} disabled={deletePost.isPending} className="text-xs font-bold text-red-500">حذف العمل</button></div>}
      {editing && <div className="space-y-3 bg-[#fff8df] px-5 py-4"><Input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="rounded-xl bg-white" /><Input value={editDescription} onChange={e => setEditDescription(e.target.value)} className="rounded-xl bg-white" /><Button onClick={() => updatePost.mutate({ postId: post.id, title: editTitle, description: editDescription, visibility: post.visibility })} disabled={updatePost.isPending} className="rounded-xl bg-neutral-950 text-white">{updatePost.isPending ? <Loader2 className="animate-spin" /> : "حفظ التعديل"}</Button></div>}
      {post.media?.length ? (
        <div className="grid gap-2 bg-neutral-100 sm:grid-cols-2">
          {post.media.map((media: any) => media.mediaType === "video" ? <video key={media.id} src={media.url} controls className="h-72 w-full object-cover" /> : <img key={media.id} src={media.url} alt={post.title} className="h-72 w-full object-cover" />)}
        </div>
      ) : (
        <div className="grid-paper bg-[#f4f1e8] px-6 py-10">
          <div className="mx-auto max-w-lg text-center">
            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#a36e00]">{post.category || "مشروع إبداعي"}</span>
            <h3 className="mt-4 font-display text-2xl font-bold">{post.title}</h3>
            <p className="mt-3 text-sm leading-7 text-neutral-600"><RichText text={post.description || "شارك هذا المصمم عملًا جديدًا مع المجتمع."} /></p>
            {post.hashtags && <p className="mt-4 text-xs font-bold text-[#a36e00]"><RichText text={post.hashtags} /></p>}
          </div>
        </div>
      )}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>{post.likesCount} إعجاب · {post.commentsCount} تعليق · {post.sharesCount || 0} مشاركة</span>
          <button disabled={share.isPending} onClick={copyAndShare} className="flex items-center gap-1 hover:text-neutral-950"><Share2 className="h-4 w-4" /> مشاركة</button>
        </div>
        <button onClick={() => setShowInteractors(!showInteractors)} className="mt-3 flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-950"><Users className="h-3.5 w-3.5" />{showInteractors ? "إخفاء المتفاعلين" : "عرض من تفاعل"}</button>{showInteractors && <div className="mt-3 rounded-2xl bg-[#f8f7f3] p-3 text-xs"><div className="flex flex-wrap gap-2">{interactors.isLoading ? <Loader2 className="h-4 w-4 animate-spin text-[#c38a10]" /> : interactors.data?.likes.length ? interactors.data.likes.map(({ user }: any) => <Link key={`like-${user.id}`} href={`/profile/${user.id}`} className="rounded-full bg-white px-3 py-1 font-bold hover:text-[#a36e00]">{user.name || "مستخدم"} · إعجاب</Link>) : <span className="text-neutral-400">لا توجد إعجابات بعد.</span>}{interactors.data?.comments.map(({ comment, author }: any) => <Link key={`comment-${comment.id}`} href={`/profile/${author.id}`} className="rounded-full bg-white px-3 py-1 font-bold hover:text-[#a36e00]">{author.name || "مستخدم"} · تعليق</Link>)}</div></div>}<div className="mt-4 flex items-center gap-2 border-t border-neutral-100 pt-3">
          <button disabled={!isAuthenticated || like.isPending} onClick={() => like.mutate({ postId: post.id })} className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold ${post.liked ? "bg-[#fff4cf] text-[#a36e00]" : "text-neutral-500 hover:bg-neutral-50"}`}><Heart className={`h-4 w-4 ${post.liked ? "fill-current" : ""}`} />{post.liked ? "أعجبتك" : "إعجاب"}</button>
          <button onClick={() => setShowComments(!showComments)} className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold text-neutral-500 hover:bg-neutral-50"><MessageCircle className="h-4 w-4" /> تعليق</button>
        </div>
        {showComments && <div className="mt-4 space-y-3 border-t border-neutral-100 pt-4">
          {commentsQuery.isLoading ? <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#c38a10]" /> : commentsQuery.data?.length ? commentsQuery.data.map(({ comment, author }: any) => <div key={comment.id} className="rounded-2xl bg-[#f8f7f3] p-3"><div className="flex items-start gap-2"><SmallAvatar name={author.name} src={author.avatarUrl} /><div className="min-w-0 flex-1"><Link href={`/profile/${author.id}`} className="text-xs font-bold hover:underline">{author.name || "مستخدم"}</Link><p className="mt-1 text-sm leading-6 text-neutral-700"><RichText text={comment.body} /></p>{comment.mediaUrl && <img src={comment.mediaUrl} alt="مرفق التعليق" className="mt-2 max-h-48 rounded-xl object-cover" />}<div className="mt-2 flex items-center gap-3 text-[11px] text-neutral-400"><button disabled={!isAuthenticated || commentLike.isPending} onClick={() => commentLike.mutate({ commentId: comment.id })} className={`flex items-center gap-1 ${comment.liked ? "text-[#a36e00]" : "hover:text-neutral-900"}`}><Heart className={`h-3 w-3 ${comment.liked ? "fill-current" : ""}`} />{comment.likesCount || 0}</button><button onClick={() => setReplyTo(comment.id)} className="hover:text-neutral-900">رد</button>{(comment.authorId === viewerId || post.authorId === viewerId) && <button onClick={() => removeComment.mutate({ commentId: comment.id })} className="flex items-center gap-1 text-red-500"><Trash2 className="h-3 w-3" />حذف</button>}</div></div></div></div>) : <p className="text-center text-xs text-neutral-400">كن أول من يعلّق.</p>}
          {isAuthenticated && <div className="flex gap-2"><label className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-xl border border-neutral-200 text-neutral-400" aria-label="إرفاق صورة أو فيديو">+<input type="file" accept="image/jpeg,image/webp,image/png,video/mp4" className="hidden" onChange={e => setCommentAttachment(e.target.files?.[0] || null)} /></label><Input value={body} onChange={e => setBody(e.target.value)} onKeyDown={e => e.key === "Enter" && submitComment()} placeholder={replyTo ? "اكتب ردك..." : "اكتب تعليقًا يدعم صاحب العمل..."} className="h-10 rounded-xl" /><Button onClick={submitComment} disabled={createComment.isPending || commentMediaUpload.isPending} className="h-10 rounded-xl bg-neutral-950 text-white"><Send className="h-4 w-4" /></Button></div>}
        </div>}
      </div>
    </article>
  );
}
