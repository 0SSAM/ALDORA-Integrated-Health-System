import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { ShieldCheck, ArrowLeft, Loader2, UserRound } from "lucide-react";
import { useLocation } from "wouter";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocalization } from "@/contexts/LocalizationContext";

export default function Login() {
  const { user, loading, logout } = useAuth();
  const { direction } = useLocalization();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [internalError, setInternalError] = useState("");
  const internalLogin = trpc.auth.internalLogin.useMutation({
    onSuccess: result => {
      if (!result.success) {
        setInternalError(result.message);
        return;
      }
      setInternalError("");
      setLocation("/");
    },
    onError: () => setInternalError("تعذر إتمام الدخول حالياً. حاول مرة أخرى لاحقاً."),
  });

  if (loading) {
    return <main dir="rtl" className="grid min-h-screen place-items-center bg-[#f4f7fb] text-slate-600"><Loader2 className="h-6 w-6 animate-spin" aria-label="جارٍ التحقق" /></main>;
  }

  return (
    <main dir={direction} className="relative grid min-h-screen overflow-hidden bg-[#f4f7fb] px-5 py-8 text-slate-900 sm:px-8">
      <div className="absolute left-5 top-5 z-10 sm:left-8 sm:top-8"><LanguageSwitcher /></div>
      <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl" />
      <section className="relative m-auto grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 shadow-[0_30px_100px_rgba(13,27,42,0.14)] backdrop-blur-xl lg:grid-cols-[1.05fr_.95fr]" aria-labelledby="login-title">
        <div className="flex flex-col justify-between bg-[#0d1b2a] p-8 text-white sm:p-12">
          <div>
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-teal-200 shadow-lg shadow-cyan-950/30" aria-label="شعار ألدورا"><ShieldCheck className="h-9 w-9 text-[#0d1b2a]" /></div>
            <p className="mt-7 text-sm font-semibold tracking-[0.16em] text-cyan-200">ALDORA INTEGRATED HEALTH SYSTEM</p>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">منظومة الرعاية الصحية المتكاملة الآمنة</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">دخول مؤسسي بصلاحيات مرتبطة بالفرع والجهة والاختصاص، مع سجل تدقيق للموظفين. لا توجد كلمات مرور تجريبية مشتركة.</p>
          </div>
          <div className="mt-12 grid gap-3 text-sm text-slate-300 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><strong className="block text-white">حماية متعددة الطبقات</strong><span className="mt-1 block">جلسات، صلاحيات، وحظر محاولات متكررة.</span></div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><strong className="block text-white">تتبع آمن</strong><span className="mt-1 block">أحداث الدخول مرتبطة بسجل تدقيق قابل للتحقق.</span></div></div>
        </div>
        <div className="p-8 sm:p-12">
          <button type="button" onClick={() => setLocation("/")} className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> العودة للصفحة العامة</button>
          <div className="max-w-md">
            <p className="text-sm font-semibold text-cyan-700">تسجيل دخول الموظفين</p>
            <h2 id="login-title" className="mt-2 text-3xl font-bold tracking-tight">دخول آمن حسب الدور</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">استخدم اسم المستخدم وكلمة المرور التي أنشأها مسؤول مؤسستك. لا تُرسل كلمة المرور إلى سجل التدقيق.</p>
            {user ? <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"><p className="font-semibold">أنت مسجل الدخول بالفعل</p><p className="mt-1 text-sm leading-6">الحساب: {user.name || "مستخدم مصادق"} · الدور: {user.role}</p><p className="mt-2 text-xs leading-5 text-emerald-800">هذه جلسة إدارة عبر OAuth. لتسجيل دخول موظف بيوزر وكلمة مرور، سجّل الخروج أولاً ثم سيظهر نموذج الموظفين الداخليين.</p><div className="mt-4 flex flex-wrap gap-2"><Button type="button" onClick={() => setLocation("/")} className="bg-[#0d1b2a] hover:bg-[#16324a]">فتح مساحة العمل</Button><Button type="button" variant="outline" onClick={() => void logout()} className="border-emerald-300 bg-white">تسجيل الخروج ثم دخول موظف</Button></div></div> : <>
              <form className="mt-8 space-y-4" onSubmit={event => { event.preventDefault(); setInternalError(""); internalLogin.mutate({ username, password }); }}>
                <div className="space-y-2"><Label htmlFor="internal-username">اسم المستخدم</Label><Input id="internal-username" autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} placeholder="مثال: cashier.branch1" disabled={internalLogin.isPending} /></div>
                <div className="space-y-2"><Label htmlFor="internal-password">كلمة المرور</Label><Input id="internal-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} disabled={internalLogin.isPending} /></div>
                {internalError && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{internalError}</p>}
                <Button type="submit" disabled={internalLogin.isPending || username.trim().length < 3 || password.length === 0} className="h-12 w-full bg-[#0d1b2a] text-base hover:bg-[#16324a]">{internalLogin.isPending ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <UserRound className="ml-2 h-4 w-4" />}دخول الموظفين</Button>
              </form>
              <div className="my-7 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" /><span>أو حساب الإدارة</span><span className="h-px flex-1 bg-slate-200" /></div>
              <Button type="button" variant="outline" onClick={() => startLogin()} className="h-12 w-full border-cyan-200 bg-white text-cyan-900 hover:bg-cyan-50">المتابعة إلى دخول الإدارة الآمن</Button>
            </>}
          </div>
        </div>
      </section>
    </main>
  );
}
