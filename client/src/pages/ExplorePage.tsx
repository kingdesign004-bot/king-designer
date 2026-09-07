import { Loader2, Search, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import AppChrome from "@/components/AppChrome";
import PostCard from "@/components/PostCard";
import StoriesStrip from "@/components/StoriesStrip";

export default function ExplorePage() {
  const { user, isAuthenticated } = useAuth(); const { data: posts, isLoading, isError } = trpc.feed.list.useQuery();
  return <AppChrome><div className="container py-8" dir="rtl"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 flex items-center gap-2 text-xs font-bold text-[#bd8210]"><Sparkles className="h-4 w-4" />مساحة الاكتشاف</p><h1 className="font-display text-3xl font-extrabold">استكشف الأعمال</h1><p className="mt-2 text-sm text-neutral-500">كل المنشورات في مكان واحد — اضغط على أي مشروع لمعاينته كاملًا.</p></div><Link href="/search" className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-bold text-neutral-700"><Search className="h-4 w-4" />بحث متقدم</Link></div><StoriesStrip isAuthenticated={isAuthenticated} viewerId={user?.id} />{isLoading ? <div className="grid place-items-center py-24"><Loader2 className="animate-spin text-[#c38a10]" /></div> : isError ? <div className="rounded-2xl bg-white p-10 text-center text-red-600">تعذر تحميل الاستكشاف.</div> : posts?.length ? <div className="mx-auto max-w-3xl space-y-5">{posts.map(post => <PostCard key={post.id} post={post} isAuthenticated={isAuthenticated} viewerId={user?.id} />)}</div> : <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-16 text-center text-neutral-500">لا توجد منشورات بعد.</div>}</div></AppChrome>;
}
