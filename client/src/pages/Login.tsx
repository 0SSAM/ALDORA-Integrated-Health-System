import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShoppingCart, ArrowLeft, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Login() {
  const { user, loading, startDemo, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return <main dir="rtl" className="grid min-h-screen place-items-center bg-[#f4f7fb] text-slate-600"><Loader2 className="h-6 w-6 animate-spin" aria-label="جارٍ التحقق" /></main>;
  }

  return (
    <main dir="rtl" className="relative grid min-h-screen overflow-hidden bg-[#f4f7fb] px-5 py-8 text-slate-900 sm:px-8">
      <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl" />
      <section className="relative m-auto grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 shadow-[0_30px_100px_rgba(13,27,42,0.14)] backdrop-blur-xl lg:grid-cols-[1.05fr_.95fr]" aria-labelledby="login-title">
        <div className="flex flex-col justify-between bg-[#0d1b2a] p-8 text-white sm:p-12">
          <div>
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-teal-200 shadow-lg shadow-cyan-950/30" aria-label="ALDO logo">
              <ShieldCheck className="h-9 w-9 text-[#0d1b2a]" />
            </div>
            <p className="mt-7 text-sm font-semibold tracking-[0.16em] text-cyan-200">ALDO HEALTH CARE ECO SYSTEM</p>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">منصة رعاية صحية آمنة ومتعددة الجهات</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">دخول موحّد بصلاحيات مؤسسية وعزل حسب المؤسسة والجهة والاختصاص. لا توجد كلمات مرور تجريبية مشتركة.</p>
          </div>
          <div className="mt-12 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><strong className="block text-white">حماية متعددة الطبقات</strong><span className="mt-1 block">جلسات، صلاحيات، وسجل تدقيق.</span></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><strong className="block text-white">تتبع آمن</strong><span className="mt-1 block">Data Matrix جاهز للموصل الرسمي.</span></div>
          </div>
        </div>
        <div className="p-8 sm:p-12">
          <button type="button" onClick={() => setLocation("/")} className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> العودة للصفحة العامة</button>
          <div className="max-w-md">
            <p className="text-sm font-semibold text-cyan-700">تسجيل الدخول</p>
            <h2 id="login-title" className="mt-2 text-3xl font-bold tracking-tight">مرحباً بعودتك</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">استخدم حساب مؤسستك عبر بوابة الدخول الآمنة. سيحدد الخادم المؤسسة والدور والصلاحيات بعد نجاح المصادقة.</p>
            {user ? <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"><p className="font-semibold">أنت مسجل الدخول بالفعل</p><p className="mt-1 text-sm leading-6">الحساب: {user.name || "مستخدم مصادق"} · الدور: {user.role}</p><div className="mt-4 flex flex-wrap gap-2"><Button type="button" onClick={() => setLocation("/")} className="bg-[#0d1b2a] hover:bg-[#16324a]">فتح مساحة العمل</Button><Button type="button" variant="outline" onClick={() => void logout()} className="border-emerald-300 bg-white">تسجيل الخروج</Button></div></div> : <><Button type="button" onClick={() => startLogin()} className="mt-8 h-12 w-full bg-[#0d1b2a] text-base hover:bg-[#16324a]">المتابعة إلى الدخول الآمن</Button><div className="my-7 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" /><span>أو</span><span className="h-px flex-1 bg-slate-200" /></div><Button type="button" variant="outline" onClick={() => void startDemo()} className="h-12 w-full border-cyan-200 bg-cyan-50/60 text-cyan-900 hover:bg-cyan-100"><ShoppingCart className="ml-2 h-4 w-4" />استعراض النظام في وضع العرض الآمن</Button><p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">العرض التجريبي للقراءة فقط، ولا يقرأ بيانات تشغيلية أو يرسل معاملات. لا تستخدمه لإدخال بيانات حقيقية.</p></>}
          </div>
        </div>
      </section>
    </main>
  );
}
