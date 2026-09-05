import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Bell, Compass, LogOut, MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";

const logo = "/manus-storage/king-designer-mark_ec43f952.png";

export default function AppChrome({ children, title }: { children: ReactNode; title?: string }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const markOnline = trpc.presence.markOnline.useMutation();
  const markOffline = trpc.presence.markOffline.useMutation();

  useEffect(() => {
    if (!isAuthenticated) return;
    markOnline.mutate();
    const handleOffline = () => markOffline.mutate();
    window.addEventListener("beforeunload", handleOffline);
    return () => window.removeEventListener("beforeunload", handleOffline);
  }, [isAuthenticated]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return <div dir="rtl" className="min-h-screen bg-[#f8f7f3] text-neutral-950">
    <header className="sticky top-0 z-30 border-b border-neutral-200/80 bg-[#f8f7f3]/95 backdrop-blur-xl">
      <div className="container flex min-h-20 flex-wrap items-center justify-between gap-3 py-3 sm:flex-nowrap sm:gap-5 sm:py-0">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="العودة إلى التغذية"><img src={logo} alt="KING DESIGNER" className="h-10 w-10 object-contain sm:h-11 sm:w-11" /><div className="hidden sm:block"><div className="font-display text-sm font-extrabold">KING DESIGNER</div><div className="text-[10px] font-semibold text-neutral-500">مساحة تصنع الفرق</div></div></Link>
        <nav className="order-2 flex items-center gap-0.5 sm:order-3 sm:gap-1">
          <Link href="/" className="grid h-10 w-10 place-items-center rounded-xl text-neutral-500 transition hover:bg-white" aria-label="التغذية"><Compass className="h-4 w-4" /></Link>
          <Link href="/messages" className="grid h-10 w-10 place-items-center rounded-xl text-neutral-500 transition hover:bg-white" aria-label="الرسائل"><MessageCircle className="h-4 w-4" /></Link>
          <Link href="/notifications" className="grid h-10 w-10 place-items-center rounded-xl text-neutral-500 transition hover:bg-white" aria-label="الإشعارات"><Bell className="h-4 w-4" /></Link>
          {user?.role === "admin" && <Link href="/admin" className="hidden rounded-xl bg-[#fff4cf] px-3 py-2 text-xs font-bold text-[#a36e00] transition hover:bg-[#ffeaa8] sm:block">الإدارة</Link>}
          {isAuthenticated ? <><Link href={`/profile/${user?.id}`} className="mr-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold">ملفي</Link><button onClick={() => logout()} className="grid h-10 w-10 place-items-center rounded-xl text-neutral-500 transition hover:bg-white" aria-label="تسجيل الخروج"><LogOut className="h-4 w-4" /></button></> : <Button onClick={() => startLogin()} className="rounded-xl bg-neutral-950 px-4 text-white">دخول</Button>}
        </nav>
        <form onSubmit={submitSearch} className="order-3 w-full sm:order-2 sm:flex-1 sm:max-w-md md:max-w-lg">
          <div className="flex h-11 items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-400 shadow-sm focus-within:border-[#d8ad40] focus-within:ring-2 focus-within:ring-[#f6c94c]/20"><Search className="h-4 w-4 shrink-0" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث عن مصمم أو مشروع أو وسم" aria-label="البحث" className="w-full bg-transparent outline-none placeholder:text-neutral-400" /></div>
        </form>
      </div>
    </header>
    <main>{title && <div className="container pt-8"><h1 className="font-display text-2xl font-extrabold">{title}</h1></div>}{children}</main>
  </div>;
}
