import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Activity, AlertTriangle, ArrowLeftRight, BarChart3, Bell, Boxes, BrainCircuit, Building2, ChevronLeft, ClipboardCheck, FileText, FlaskConical, HeartPulse, LayoutDashboard, LockKeyhole, Menu, PackageSearch, Receipt, Search, ShieldCheck, ShoppingCart, Stethoscope, Users, WalletCards, X } from "lucide-react";
import { useMemo, useState } from "react";

const modules = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "pos", label: "نقطة البيع", icon: ShoppingCart },
  { id: "inventory", label: "المخزون و FEFO", icon: Boxes },
  { id: "prescriptions", label: "الوصفات الذكية", icon: BrainCircuit },
  { id: "insurance", label: "التأمين والمطالبات", icon: ClipboardCheck },
  { id: "compliance", label: "الامتثال المصري", icon: ShieldCheck },
  { id: "compounding", label: "التحضير الصيدلي", icon: FlaskConical },
  { id: "finance", label: "المالية والتقارير", icon: WalletCards },
  { id: "people", label: "الموظفون والفروع", icon: Users },
];

const metrics = [
  { label: "مبيعات اليوم", value: "—", hint: "تظهر بعد ربط قاعدة البيانات", icon: Receipt, tone: "bg-cyan-50 text-cyan-700" },
  { label: "قيمة المخزون", value: "—", hint: "بانتظار بيانات الفروع", icon: Boxes, tone: "bg-violet-50 text-violet-700" },
  { label: "مطالبات معلقة", value: "—", hint: "حالة مباشرة من النظام", icon: ClipboardCheck, tone: "bg-amber-50 text-amber-700" },
  { label: "تنبيهات حرجة", value: "—", hint: "فحص يومي مجدول", icon: AlertTriangle, tone: "bg-rose-50 text-rose-700" },
];

export default function Home() {
  const { user, loading } = useAuth();
  const [active, setActive] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const activeModule = modules.find(item => item.id === active) ?? modules[0];
  const filteredModules = useMemo(() => modules.filter(item => item.label.includes(query.trim())), [query]);

  if (loading) return <div className="min-h-screen grid place-items-center bg-[#f4f7fb] text-slate-500">جارٍ التحقق من جلسة الدخول…</div>;

  return (
    <div dir="rtl" className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <aside className={cn("fixed inset-y-0 right-0 z-40 flex w-[286px] flex-col border-l border-slate-200 bg-[#0d1b2a] text-white transition-transform duration-200 lg:translate-x-0", mobileOpen ? "translate-x-0" : "translate-x-full")}>
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-400 text-[#0d1b2a]"><HeartPulse className="h-5 w-5" /></div><div><p className="font-bold tracking-tight">BDF Pharma ERP</p><p className="text-[11px] text-cyan-200/70">منصة الصيدلية المصرية</p></div></div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 lg:hidden" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></Button>
        </div>
        <div className="px-4 py-5"><p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">مساحة العمل</p><nav className="space-y-1">{filteredModules.map(item => { const Icon = item.icon; const selected = active === item.id; return <button key={item.id} onClick={() => { setActive(item.id); setMobileOpen(false); }} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-3 text-right text-sm transition", selected ? "bg-cyan-400 font-semibold text-[#0d1b2a] shadow-lg shadow-cyan-950/20" : "text-slate-300 hover:bg-white/10 hover:text-white")}><Icon className="h-[18px] w-[18px]" /><span>{item.label}</span>{selected && <ChevronLeft className="mr-auto h-4 w-4" />}</button>; })}</nav></div>
        <div className="mt-auto border-t border-white/10 p-4"><div className="rounded-2xl bg-white/5 p-4"><div className="mb-3 flex items-center gap-2 text-cyan-200"><LockKeyhole className="h-4 w-4" /><span className="text-xs font-semibold">حماية مؤسسية</span></div><p className="text-xs leading-6 text-slate-400">صلاحيات الخادم، سجل تدقيق، وقواعد FEFO مركزية للعمليات الحساسة.</p></div></div>
      </aside>
      {mobileOpen && <button aria-label="إغلاق القائمة" className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <main className="lg:mr-[286px]">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f4f7fb]/90 px-4 py-4 backdrop-blur-xl sm:px-8"><div className="flex items-center gap-3"><Button variant="outline" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5" /></Button><div className="min-w-0 flex-1"><p className="text-xs font-medium text-slate-500">الثلاثاء، ١٤ أغسطس ٢٠٢٦</p><h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">{activeModule.label}</h1></div><div className="hidden w-64 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 sm:flex"><Search className="h-4 w-4 text-slate-400" /><Input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث في الوحدات" className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" /></div><Button variant="outline" size="icon" className="relative bg-white"><Bell className="h-4 w-4" /><span className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-rose-500" /></Button>{user ? <Badge variant="secondary" className="hidden gap-2 px-3 py-2 sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-500" />{user.name || "مستخدم"}</Badge> : <Button onClick={() => startLogin()} className="hidden bg-[#0d1b2a] sm:flex">تسجيل الدخول</Button>}</div></header>
        <div className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-8">
          {!user && <div className="flex items-center justify-between gap-4 rounded-2xl border border-cyan-200 bg-cyan-50 px-5 py-4"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 text-cyan-700" /><div><p className="font-semibold text-cyan-950">وضع العرض الآمن</p><p className="text-sm leading-6 text-cyan-800">سجّل الدخول للوصول إلى العمليات المحمية وقاعدة بيانات الفروع.</p></div></div><Button onClick={() => startLogin()} className="shrink-0 bg-cyan-700 hover:bg-cyan-800">دخول</Button></div>}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(metric => { const Icon = metric.icon; return <Card key={metric.label} className="border-0 shadow-sm shadow-slate-200/60"><CardContent className="p-5"><div className="mb-5 flex items-start justify-between"><div className={cn("grid h-11 w-11 place-items-center rounded-2xl", metric.tone)}><Icon className="h-5 w-5" /></div><span className="text-xs font-medium text-slate-400">اليوم</span></div><p className="text-sm text-slate-500">{metric.label}</p><p className="mt-1 text-3xl font-bold tracking-tight">{metric.value}</p><p className="mt-2 text-xs text-slate-400">{metric.hint}</p></CardContent></Card>; })}</section>
          <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
            <Card className="border-0 shadow-sm shadow-slate-200/60"><CardHeader className="flex-row items-center justify-between space-y-0"><div><CardTitle className="text-lg">مركز العمليات</CardTitle><p className="mt-1 text-sm text-slate-500">ابدأ من الوحدة المناسبة لإدارة دورة العمل.</p></div><Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">جاهز للتهيئة</Badge></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">{[[ShoppingCart,"نقطة البيع","صرف جزئي، خصم MOH، إيصال ETA","pos"],[PackageSearch,"المخزون","FEFO، التشغيلات، الصلاحيات","inventory"],[BrainCircuit,"الوصفة الذكية","رفع ومراجعة الوصفة بالرؤية","prescriptions"],[ArrowLeftRight,"نقل بين الفروع","تسوية المخزون بين المواقع","inventory"]].map(([Icon,title,desc,id]) => <button key={title as string} onClick={() => setActive(id as string)} className="group rounded-2xl border border-slate-200 bg-white p-4 text-right transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"><div className="mb-4 flex items-center justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-cyan-50 group-hover:text-cyan-700"><Icon className="h-5 w-5" /></div><ChevronLeft className="h-4 w-4 text-slate-300 group-hover:text-cyan-600" /></div><p className="font-semibold">{title as string}</p><p className="mt-1 text-xs leading-5 text-slate-500">{desc as string}</p></button>)}</CardContent></Card>
            <Card className="border-0 bg-[#0d1b2a] text-white shadow-sm shadow-slate-300"><CardHeader><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/15 text-cyan-300"><Activity className="h-5 w-5" /></div><div><CardTitle className="text-white">حالة المنظومة</CardTitle><p className="mt-1 text-sm text-slate-400">مراقبة الخدمات الأساسية</p></div></div></CardHeader><CardContent className="space-y-5"><div><div className="mb-2 flex justify-between text-sm"><span className="text-slate-300">المصادقة والصلاحيات</span><span className="text-emerald-300">محمية</span></div><Progress value={100} className="h-2 bg-white/10" /></div><div><div className="mb-2 flex justify-between text-sm"><span className="text-slate-300">قواعد المخزون FEFO</span><span className="text-emerald-300">مفعلة</span></div><Progress value={100} className="h-2 bg-white/10" /></div><div><div className="mb-2 flex justify-between text-sm"><span className="text-slate-300">التنبيهات المجدولة</span><span className="text-amber-300">بانتظار النشر</span></div><Progress value={45} className="h-2 bg-white/10" /></div><div className="flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-slate-400"><Building2 className="h-4 w-4" /> متعدد الفروع · بيانات مصرية · سجل تدقيق</div></CardContent></Card>
          </section>
          <section className="grid gap-6 lg:grid-cols-3"><Card className="border-0 shadow-sm shadow-slate-200/60 lg:col-span-2"><CardHeader className="flex-row items-center justify-between space-y-0"><div><CardTitle className="text-lg">آخر النشاطات</CardTitle><p className="mt-1 text-sm text-slate-500">ستظهر الأحداث بعد تسجيل الدخول وربط الفروع.</p></div><Button variant="ghost" className="text-cyan-700">سجل التدقيق <ChevronLeft className="mr-1 h-4 w-4" /></Button></CardHeader><CardContent><div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-12 text-center"><FileText className="mb-3 h-8 w-8 text-slate-300" /><p className="font-medium text-slate-600">لا توجد أحداث معروضة بعد</p><p className="mt-1 max-w-sm text-sm leading-6 text-slate-400">لن يتم إنشاء بيانات تجريبية. سيعرض النظام السجلات الفعلية فقط بعد تهيئة الفروع والمستخدمين.</p></div></CardContent></Card><Card className="border-0 shadow-sm shadow-slate-200/60"><CardHeader><CardTitle className="text-lg">قواعد لا يمكن تجاوزها</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" /><p className="text-sm leading-6 text-slate-600">الخصم الأقصى <strong>٧٪</strong> وفق محرك MOH على الخادم.</p></div><div className="flex gap-3"><PackageSearch className="h-5 w-5 shrink-0 text-cyan-600" /><p className="text-sm leading-6 text-slate-600">الصرف من أقرب تاريخ انتهاء عبر FEFO.</p></div><div className="flex gap-3"><Stethoscope className="h-5 w-5 shrink-0 text-violet-600" /><p className="text-sm leading-6 text-slate-600">الوصفة الذكية تحتاج مراجعة صيدلي قبل الصرف.</p></div></CardContent></Card></section>
        </div>
      </main>
    </div>
  );
}
