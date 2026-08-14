import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Activity, AlertTriangle, ArrowLeftRight, BarChart3, Bell, Boxes, BrainCircuit, Building2, ChevronLeft, ClipboardCheck, Database, FileText, FlaskConical, HeartPulse, LayoutDashboard, LockKeyhole, Menu, PackageSearch, PhoneCall, Plus, Receipt, Search, ShieldCheck, ShoppingCart, Stethoscope, Ticket, UserRound, Users, WalletCards, X } from "lucide-react";
import { skipToken } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

const modules = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "pos", label: "نقطة البيع", icon: ShoppingCart },
  { id: "inventory", label: "المخزون و FEFO", icon: Boxes },
  { id: "prescriptions", label: "الوصفات الذكية", icon: BrainCircuit },
  { id: "insurance", label: "التأمين والمطالبات", icon: ClipboardCheck },
  { id: "compliance", label: "الامتثال الإقليمي", icon: ShieldCheck },
  { id: "compounding", label: "التحضير الصيدلي", icon: FlaskConical },
  { id: "finance", label: "المالية والتقارير", icon: WalletCards },
  { id: "people", label: "الموظفون والفروع", icon: Users },
  { id: "customerCare", label: "خدمة العملاء", icon: UserRound },
  { id: "callCentre", label: "مركز الاتصال", icon: PhoneCall },
  { id: "catalog", label: "كتالوج الأصناف", icon: Database },
];

const metrics = [
  { label: "مبيعات اليوم", value: "—", hint: "تظهر بعد ربط قاعدة البيانات", icon: Receipt, tone: "bg-cyan-50 text-cyan-700" },
  { label: "قيمة المخزون", value: "—", hint: "بانتظار بيانات الفروع", icon: Boxes, tone: "bg-violet-50 text-violet-700" },
  { label: "مطالبات معلقة", value: "—", hint: "حالة مباشرة من النظام", icon: ClipboardCheck, tone: "bg-amber-50 text-amber-700" },
  { label: "تنبيهات حرجة", value: "—", hint: "فحص يومي مجدول", icon: AlertTriangle, tone: "bg-rose-50 text-rose-700" },
];

export default function Home() {
  const { user, loading } = useAuth();
  const localization = useLocalization();
  const [online, setOnline] = useState(() => typeof navigator === "undefined" ? true : navigator.onLine);
  const [active, setActive] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const role = user?.role as "admin" | "manager" | "pharmacist" | "cashier" | "user" | undefined;
  const allowedModules = useMemo(() => {
    if (!role) return modules.filter(item => item.id === "overview");
    const access: Record<string, string[]> = { overview: ["admin", "manager", "pharmacist", "cashier"], pos: ["admin", "manager", "pharmacist", "cashier"], inventory: ["admin", "manager", "pharmacist"], prescriptions: ["admin", "manager", "pharmacist"], insurance: ["admin", "manager", "pharmacist"], compliance: ["admin", "manager", "pharmacist"], compounding: ["admin", "manager", "pharmacist"], finance: ["admin", "manager"], people: ["admin", "manager"], customerCare: ["admin", "manager", "pharmacist", "cashier"], callCentre: ["admin", "manager", "pharmacist", "cashier"], catalog: ["admin", "manager", "pharmacist"] };
    return modules.filter(item => access[item.id]?.includes(role));
  }, [role]);
  const activeModule = allowedModules.find(item => item.id === active) ?? allowedModules[0] ?? modules[0];
  const filteredModules = useMemo(() => allowedModules.filter(item => item.label.includes(query.trim())), [allowedModules, query]);
  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    navigator.serviceWorker?.controller?.postMessage({ type: "BDF_SYNC_STATUS" });
    return () => { window.removeEventListener("online", onOnline); window.removeEventListener("offline", onOffline); };
  }, []);

  if (loading) return <div className="min-h-screen grid place-items-center bg-[#f4f7fb] text-slate-500">جارٍ التحقق من جلسة الدخول…</div>;

  return (
    <div dir={localization.direction} data-country={localization.countryCode} className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <aside className={cn("fixed inset-y-0 right-0 z-40 flex w-[286px] flex-col border-l border-slate-200 bg-[#0d1b2a] text-white transition-transform duration-200 lg:translate-x-0", mobileOpen ? "translate-x-0" : "translate-x-full")}>
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-400 text-[#0d1b2a]"><HeartPulse className="h-5 w-5" /></div><div><p className="font-bold tracking-tight">BDF Pharma ERP</p><p className="text-[11px] text-cyan-200/70">منصة الصيدليات العربية متعددة الدول</p></div></div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 lg:hidden" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></Button>
        </div>
        <div className="px-4 py-5"><p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">مساحة العمل</p><p className="mb-3 px-3 text-xs text-cyan-200/70">{user ? `الدور: ${user.role}` : "الوضع العام: تسجيل الدخول مطلوب"}</p><nav className="space-y-1">{filteredModules.map(item => { const Icon = item.icon; const selected = active === item.id; return <button key={item.id} onClick={() => { setActive(item.id); setMobileOpen(false); }} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-3 text-right text-sm transition", selected ? "bg-cyan-400 font-semibold text-[#0d1b2a] shadow-lg shadow-cyan-950/20" : "text-slate-300 hover:bg-white/10 hover:text-white")}><Icon className="h-[18px] w-[18px]" /><span>{item.label}</span>{selected && <ChevronLeft className="mr-auto h-4 w-4" />}</button>; })}</nav></div>
        <div className="mt-auto border-t border-white/10 p-4"><div className="rounded-2xl bg-white/5 p-4"><div className="mb-3 flex items-center gap-2 text-cyan-200"><LockKeyhole className="h-4 w-4" /><span className="text-xs font-semibold">حماية مؤسسية</span></div><p className="text-xs leading-6 text-slate-400">صلاحيات الخادم، سجل تدقيق، وقواعد FEFO مركزية للعمليات الحساسة.</p></div></div>
      </aside>
      {mobileOpen && <button aria-label="إغلاق القائمة" className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <main className="lg:mr-[286px]">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f4f7fb]/90 px-4 py-4 backdrop-blur-xl sm:px-8"><div className="flex items-center gap-3"><Button variant="outline" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5" /></Button><div className="min-w-0 flex-1"><p className="text-xs font-medium text-slate-500">الثلاثاء، ١٤ أغسطس ٢٠٢٦</p><h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">{activeModule.label}</h1></div><div className="hidden w-64 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 sm:flex"><Search className="h-4 w-4 text-slate-400" /><Input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث في الوحدات" className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" /></div><Badge variant="outline" className="hidden bg-white px-3 py-2 text-xs sm:flex">{localization.countryCode} · {localization.currencyCode}</Badge><Badge variant="outline" className={cn("hidden px-3 py-2 text-xs sm:flex", online ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>{online ? "متصل" : "مسودات محلية فقط"}</Badge><Button variant="outline" size="icon" className="relative bg-white"><Bell className="h-4 w-4" /><span className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-rose-500" /></Button>{user ? <Badge variant="secondary" className="hidden gap-2 px-3 py-2 sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-500" />{user.name || "مستخدم"}</Badge> : <Button onClick={() => startLogin()} className="hidden bg-[#0d1b2a] sm:flex">تسجيل الدخول</Button>}</div></header>
        <div className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-8">
          {!user && <div className="flex items-center justify-between gap-4 rounded-2xl border border-cyan-200 bg-cyan-50 px-5 py-4"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 text-cyan-700" /><div><p className="font-semibold text-cyan-950">وضع العرض الآمن</p><p className="text-sm leading-6 text-cyan-800">سجّل الدخول للوصول إلى العمليات المحمية وقاعدة بيانات الفروع.</p></div></div><Button onClick={() => startLogin()} className="shrink-0 bg-cyan-700 hover:bg-cyan-800">دخول</Button></div>}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(metric => { const Icon = metric.icon; return <Card key={metric.label} className="border-0 shadow-sm shadow-slate-200/60"><CardContent className="p-5"><div className="mb-5 flex items-start justify-between"><div className={cn("grid h-11 w-11 place-items-center rounded-2xl", metric.tone)}><Icon className="h-5 w-5" /></div><span className="text-xs font-medium text-slate-400">اليوم</span></div><p className="text-sm text-slate-500">{metric.label}</p><p className="mt-1 text-3xl font-bold tracking-tight">{metric.value}</p><p className="mt-2 text-xs text-slate-400">{metric.hint}</p></CardContent></Card>; })}</section>
          <ModulePanel active={active} />
          <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
            <Card className="border-0 shadow-sm shadow-slate-200/60"><CardHeader className="flex-row items-center justify-between space-y-0"><div><CardTitle className="text-lg">مركز العمليات</CardTitle><p className="mt-1 text-sm text-slate-500">ابدأ من الوحدة المناسبة لإدارة دورة العمل.</p></div><Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">جاهز للتهيئة</Badge></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">{[[ShoppingCart,"نقطة البيع","صرف جزئي، خصم MOH، إيصال ETA","pos"],[PackageSearch,"المخزون","FEFO، التشغيلات، الصلاحيات","inventory"],[BrainCircuit,"الوصفة الذكية","رفع ومراجعة الوصفة بالرؤية","prescriptions"],[ArrowLeftRight,"نقل بين الفروع","تسوية المخزون بين المواقع","inventory"]].map(([Icon,title,desc,id]) => <button key={title as string} onClick={() => setActive(id as string)} className="group rounded-2xl border border-slate-200 bg-white p-4 text-right transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"><div className="mb-4 flex items-center justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-cyan-50 group-hover:text-cyan-700"><Icon className="h-5 w-5" /></div><ChevronLeft className="h-4 w-4 text-slate-300 group-hover:text-cyan-600" /></div><p className="font-semibold">{title as string}</p><p className="mt-1 text-xs leading-5 text-slate-500">{desc as string}</p></button>)}</CardContent></Card>
            <Card className="border-0 bg-[#0d1b2a] text-white shadow-sm shadow-slate-300"><CardHeader><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/15 text-cyan-300"><Activity className="h-5 w-5" /></div><div><CardTitle className="text-white">حالة المنظومة</CardTitle><p className="mt-1 text-sm text-slate-400">مراقبة الخدمات الأساسية</p></div></div></CardHeader><CardContent className="space-y-5"><div><div className="mb-2 flex justify-between text-sm"><span className="text-slate-300">المصادقة والصلاحيات</span><span className="text-emerald-300">محمية</span></div><Progress value={100} className="h-2 bg-white/10" /></div><div><div className="mb-2 flex justify-between text-sm"><span className="text-slate-300">قواعد المخزون FEFO</span><span className="text-emerald-300">مفعلة</span></div><Progress value={100} className="h-2 bg-white/10" /></div><div><div className="mb-2 flex justify-between text-sm"><span className="text-slate-300">التنبيهات المجدولة</span><span className="text-amber-300">بانتظار النشر</span></div><Progress value={45} className="h-2 bg-white/10" /></div><div className="flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-slate-400"><Building2 className="h-4 w-4" /> متعدد الفروع · عزل حسب الدولة · سجل تدقيق</div></CardContent></Card>
          </section>
          <section className="grid gap-6 lg:grid-cols-3"><Card className="border-0 shadow-sm shadow-slate-200/60 lg:col-span-2"><CardHeader className="flex-row items-center justify-between space-y-0"><div><CardTitle className="text-lg">آخر النشاطات</CardTitle><p className="mt-1 text-sm text-slate-500">ستظهر الأحداث بعد تسجيل الدخول وربط الفروع.</p></div><Button variant="ghost" className="text-cyan-700">سجل التدقيق <ChevronLeft className="mr-1 h-4 w-4" /></Button></CardHeader><CardContent><div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-12 text-center"><FileText className="mb-3 h-8 w-8 text-slate-300" /><p className="font-medium text-slate-600">لا توجد أحداث معروضة بعد</p><p className="mt-1 max-w-sm text-sm leading-6 text-slate-400">لن يتم إنشاء بيانات تجريبية. سيعرض النظام السجلات الفعلية فقط بعد تهيئة الفروع والمستخدمين.</p></div></CardContent></Card><Card className="border-0 shadow-sm shadow-slate-200/60"><CardHeader><CardTitle className="text-lg">قواعد لا يمكن تجاوزها</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" /><p className="text-sm leading-6 text-slate-600">الخصم الأقصى <strong>٧٪</strong> وفق محرك MOH على الخادم.</p></div><div className="flex gap-3"><PackageSearch className="h-5 w-5 shrink-0 text-cyan-600" /><p className="text-sm leading-6 text-slate-600">الصرف من أقرب تاريخ انتهاء عبر FEFO.</p></div><div className="flex gap-3"><Stethoscope className="h-5 w-5 shrink-0 text-violet-600" /><p className="text-sm leading-6 text-slate-600">الوصفة الذكية تحتاج مراجعة صيدلي قبل الصرف.</p></div></CardContent></Card></section>
        </div>
      </main>
    </div>
  );
}

function ModulePanel({ active }: { active: string }) {
  const panels: Record<string, { title: string; description: string; items: string[] }> = {
    overview: { title: "ملخص التشغيل", description: "نظرة آمنة لا تعرض أرقاماً غير موجودة في قاعدة البيانات.", items: ["مؤشرات الفروع", "التنبيهات الحرجة", "حالة التكاملات"] },
    pos: { title: "نقطة البيع", description: "العمليات الحساسة ستُنفذ على الخادم مع خصم أقصى ٧٪ وFEFO.", items: ["صرف كسري للوحدات", "تحقق MOH قبل الإتمام", "حالة إيصال ETA"] },
    inventory: { title: "المخزون و FEFO", description: "ترتيب التشغيلات حسب أقرب انتهاء مع تنبيهات نقطة إعادة الطلب.", items: ["رقم التشغيلة والانتهاء", "نقل بين الفروع", "مرتجعات وتالف"] },
    prescriptions: { title: "الوصفة الذكية", description: "ارفع صورة الوصفة ليقوم النموذج المدمج بالاستخراج، ثم يراجعها الصيدلي.", items: ["رفع صورة آمن", "أسماء وجرعات وكميات", "تأكيد صيدلي إلزامي"] },
    insurance: { title: "التأمين والمطالبات", description: "دورة مطالبة قابلة للتدقيق مع حالة رفض ومبالغ معلقة.", items: ["موافقة مسبقة", "25 مزود TPA", "تقارير aging"] },
    compliance: { title: "الامتثال الإقليمي", description: "كل دولة لها ملف ومصادر وحزمة قواعد مستقلة؛ لا تُفعل العمليات المنظمة قبل اعتماد الحزمة وتحديث أدلتها.", items: ["ملف دولة مستقل", "حزمة قواعد بإصدار", "أدلة ومراجعة بشرية"] },
    compounding: { title: "التحضير الصيدلي", description: "تركيبات وBOM وتكلفة مع سجل مسؤولية.", items: ["تركيبة ومكونات", "خصم BOM", "تتبع التحضير المعقم"] },
    finance: { title: "المالية والتقارير", description: "تقارير على بيانات فعلية مع حدود دفع وتسوية واضحة.", items: ["دفتر وحركة نقدية", "Meeza / InstaPay", "تسوية ومراجعة"] },
    people: { title: "الموظفون والفروع", description: "أدوار مرتبطة بالفروع وقواعد حضور ورواتب مصدرها حزمة الدولة المعتمدة.", items: ["أدوار وصلاحيات", "وردية وتوقيت محلي", "إجازات ورواتب"] },
    customerCare: { title: "خدمة العملاء", description: "ملفات العملاء، الموافقات، المتابعة، والشكاوى مع سجل قابل للتدقيق.", items: ["ملف عميل", "متابعة علاجية", "موافقة وخصوصية"] },
    callCentre: { title: "مركز الاتصال", description: "استقبال المكالمات وتوزيع التذاكر ومواعيد إعادة الاتصال دون حفظ تسجيلات حساسة تلقائياً.", items: ["تذكرة جديدة", "أولوية وتصعيد", "موعد متابعة"] },
    catalog: { title: "كتالوج الأصناف", description: "بحث معزول حسب الدولة في الأدوية والتجميل والمستلزمات، مع مصدر ودرجة تحقق لكل صنف.", items: ["أدوية الدولة", "تجميل", "مستلزمات طبية"] },
  };
  const panel = panels[active] ?? panels.overview;
  if (active === "compliance") return <RegionalComplianceWorkspace />;
  if (active === "prescriptions") return <PrescriptionWorkspace />;
  if (active === "customerCare") return <CustomerCareWorkspace />;
  if (active === "callCentre") return <CallCentreWorkspace />;
  if (active === "catalog") return <CatalogWorkspace />;
  return <Card className="overflow-hidden border-0 bg-white shadow-sm shadow-slate-200/60"><CardContent className="p-0"><div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><div className="mb-2 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-500" /><span className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">مساحة عمل</span></div><h2 className="text-xl font-bold tracking-tight">{panel.title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{panel.description}</p></div><div className="grid grid-cols-1 gap-2 sm:min-w-[300px] sm:grid-cols-3">{panel.items.map(item => <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center text-xs font-medium text-slate-600">{item}</div>)}</div></div></CardContent></Card>;
}

function RegionalComplianceWorkspace() {
  const registry = trpc.regional.registry.useQuery(undefined, { retry: false });
  const configured = registry.data?.filter(country => country.status === "configured").length ?? 0;
  const pending = registry.data?.filter(country => country.status !== "configured").length ?? 0;
  return <WorkspaceShell title="إدارة الدول وحزم الامتثال"><div className="space-y-4"><div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>بوابة الاعتماد:</strong> لا يُعتبر أي بلد جاهزاً للعمليات المنظمة بمجرد إدخاله. يجب وجود ملف نشط، حزمة معتمدة، أدلة رسمية، وتاريخ مراجعة غير منتهٍ.</div><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-emerald-50 p-4"><p className="text-xs text-emerald-700">دول مهيأة</p><p className="mt-1 text-2xl font-bold text-emerald-900">{configured}</p></div><div className="rounded-xl bg-slate-100 p-4"><p className="text-xs text-slate-600">تحتاج إعداداً أو اعتماداً</p><p className="mt-1 text-2xl font-bold text-slate-900">{pending}</p></div><div className="rounded-xl bg-cyan-50 p-4"><p className="text-xs text-cyan-700">إجمالي السجل العربي</p><p className="mt-1 text-2xl font-bold text-cyan-900">{registry.data?.length ?? 0}</p></div></div>{registry.isLoading ? <p className="text-sm text-slate-500">جارٍ تحميل سجل الدول…</p> : registry.error ? <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">تعذر تحميل حالة الدول؛ ستظل العمليات المنظمة محجوبة.</p> : <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{registry.data?.map(country => <div key={country.countryCode} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3"><div><p className="font-medium">{country.countryNameAr}</p><p className="text-xs text-slate-500">{country.countryCode}</p></div><Badge variant={country.status === "configured" ? "default" : "outline"}>{country.status === "configured" ? "مهيأ" : "غير معتمد"}</Badge></div>)}</div>}</div></WorkspaceShell>;
}

function PrescriptionWorkspace() {
  const [intakeId, setIntakeId] = useState<number | null>(null);
  const [branchId, setBranchId] = useState("");
  const [status, setStatus] = useState("لم تُرفع صورة بعد");
  const [resultText, setResultText] = useState("");
  const upload = trpc.erp.prescription.upload.useMutation();
  const extract = trpc.erp.prescription.extractFromIntake.useMutation();

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) { setStatus("الملف يجب أن يكون صورة"); return; }
    if (file.size > 8 * 1024 * 1024) { setStatus("الحد الأقصى للصورة 8MB"); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result);
      setStatus("جارٍ رفع الصورة بأمان…");
      try {
        const selectedBranchId = Number(branchId);
        if (!Number.isInteger(selectedBranchId) || selectedBranchId <= 0) { setStatus("أدخل رقم فرع مرتبطاً باختصاص مؤكد قبل رفع الوصفة"); return; }
        const uploaded = await upload.mutateAsync({ branchId: selectedBranchId, fileName: file.name, mimeType: file.type as "image/jpeg" | "image/png" | "image/webp", dataUrl });
        setIntakeId(uploaded.intakeId);
        setStatus("تم الرفع. يمكنك بدء الاستخراج الآن.");
      } catch (error) { setStatus(error instanceof Error ? error.message : "تعذر رفع الصورة"); }
    };
    reader.readAsDataURL(file);
  };

  const runExtraction = async () => {
    if (!intakeId) return;
    setStatus("جارٍ تحليل الوصفة بالرؤية المدمجة…");
    try {
      const response = await extract.mutateAsync({ intakeId });
      setResultText(JSON.stringify(response.extraction, null, 2));
      setStatus("اكتمل الاستخراج، وتبقى مراجعة الصيدلي إلزامية قبل الصرف.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "تعذر تحليل الوصفة"); }
  };

  return <Card className="overflow-hidden border-0 bg-white shadow-sm shadow-slate-200/60"><CardHeader><CardTitle className="flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-cyan-600" />استقبال الوصفة الذكية</CardTitle><p className="text-sm text-slate-500">ارفع صورة واضحة؛ النتيجة تظل قيد مراجعة صيدلي ولا تنشئ بيعاً تلقائياً.</p></CardHeader><CardContent className="space-y-4">
    <label className="block text-sm font-medium text-slate-700">رقم الفرع المرتبط بالاختصاص المؤكد<input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2" type="number" min="1" value={branchId} onChange={event => setBranchId(event.target.value)} placeholder="أدخل رقم الفرع" /></label>
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cyan-200 bg-cyan-50/50 px-6 py-10 text-center hover:bg-cyan-50"><UploadIcon /><span className="mt-3 font-semibold text-slate-700">اختر صورة الوصفة</span><span className="mt-1 text-xs text-slate-500">JPG أو PNG أو WEBP، بحد أقصى 8MB</span><input className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => { const file = event.target.files?.[0]; if (file) handleFile(file); }} /></label>
    <div className="flex flex-wrap items-center gap-3"><Badge variant="outline">{status}</Badge>{intakeId && <Button onClick={runExtraction} disabled={extract.isPending}>{extract.isPending ? "جارٍ التحليل…" : "تحليل الوصفة"}</Button>}</div>
    {resultText && <pre className="max-h-72 overflow-auto rounded-xl bg-slate-950 p-4 text-left text-xs text-cyan-100" dir="ltr">{resultText}</pre>}
  </CardContent></Card>;
}

function UploadIcon() { return <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-cyan-600 shadow-sm"><FileText className="h-6 w-6" /></div>; }

function WorkspaceShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card className="overflow-hidden border-0 bg-white shadow-sm shadow-slate-200/60"><CardHeader><CardTitle className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-500" />{title}</CardTitle></CardHeader><CardContent>{children}</CardContent></Card>;
}

function CustomerCareWorkspace() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const create = trpc.erp.customerCare.create.useMutation();
  const customers = trpc.erp.customerCare.list.useQuery(undefined, { retry: false });
  const submit = async () => {
    if (!fullName.trim() || !phone.trim()) { setStatus("أدخل الاسم ورقم الهاتف بعد الحصول على الموافقة اللازمة."); return; }
    try { const result = await create.mutateAsync({ fullName, phone, consentStatus: "pending", chronicCareEnabled: false }); setStatus(`تم إنشاء ملف عميل رقم ${result.customerId} بحالة موافقة معلقة.`); setFullName(""); setPhone(""); await customers.refetch(); } catch (error) { setStatus(error instanceof Error ? error.message : "تعذر إنشاء الملف"); }
  };
  return <WorkspaceShell title="خدمة العملاء"><div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]"><div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-semibold">ملف عميل جديد</p><Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="الاسم الكامل" aria-label="الاسم الكامل" /><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="رقم الهاتف" aria-label="رقم الهاتف" /><p className="text-xs leading-5 text-slate-500">سيظل consent بحالة معلقة حتى يتم توثيق موافقة العميل وفق سياسة الفرع.</p><Button onClick={submit} disabled={create.isPending} className="w-full bg-[#0d1b2a]">{create.isPending ? "جارٍ الحفظ…" : <><Plus className="ml-2 h-4 w-4" />إنشاء ملف</>}</Button>{status && <Badge variant="outline">{status}</Badge>}</div><div><p className="mb-3 text-sm font-semibold">آخر الملفات</p>{customers.isLoading ? <p className="text-sm text-slate-500">جارٍ التحميل…</p> : customers.data?.length ? <div className="space-y-2">{customers.data.slice(0, 5).map(customer => <div key={customer.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3"><div><p className="font-medium">{customer.fullName}</p><p className="text-xs text-slate-500">{customer.phone}</p></div><Badge variant="secondary">{customer.consentStatus}</Badge></div>)}</div> : <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">لا توجد ملفات فعلية بعد.</p>}</div></div></WorkspaceShell>;
}

function CallCentreWorkspace() {
  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState("");
  const create = trpc.erp.callCentre.create.useMutation();
  const tickets = trpc.erp.callCentre.list.useQuery(undefined, { retry: false });
  const submit = async () => { if (!subject.trim()) { setStatus("اكتب موضوع التذكرة."); return; } try { const result = await create.mutateAsync({ subject, channel: "phone", direction: "inbound", priority: "normal" }); setStatus(`تم إنشاء التذكرة #${result.ticketId}`); setSubject(""); await tickets.refetch(); } catch (error) { setStatus(error instanceof Error ? error.message : "تعذر إنشاء التذكرة"); } };
  return <WorkspaceShell title="مركز الاتصال"><div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]"><div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-semibold">مكالمة واردة</p><Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="موضوع الاتصال أو الطلب" aria-label="موضوع الاتصال" /><p className="text-xs leading-5 text-slate-500">لا يتم حفظ تسجيل صوتي تلقائياً؛ يُحفظ فقط مرجع التسجيل عند تفعيل سياسة قانونية واضحة.</p><Button onClick={submit} disabled={create.isPending} className="w-full bg-[#0d1b2a]">{create.isPending ? "جارٍ الإنشاء…" : <><Ticket className="ml-2 h-4 w-4" />فتح تذكرة</>}</Button>{status && <Badge variant="outline">{status}</Badge>}</div><div><p className="mb-3 text-sm font-semibold">طابور التذاكر</p>{tickets.isLoading ? <p className="text-sm text-slate-500">جارٍ التحميل…</p> : tickets.data?.length ? <div className="space-y-2">{tickets.data.slice(0, 6).map(ticket => <div key={ticket.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3"><div><p className="font-medium">{ticket.subject}</p><p className="text-xs text-slate-500">{ticket.channel} · {ticket.direction}</p></div><Badge variant="secondary">{ticket.status}</Badge></div>)}</div> : <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">لا توجد تذاكر مفتوحة.</p>}</div></div></WorkspaceShell>;
}

function CatalogWorkspace() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"medicine" | "cosmetic" | "medical_supply" | undefined>(undefined);
  const [nameAr, setNameAr] = useState("");
  const [sku, setSku] = useState("");
  const [sourceAuthority, setSourceAuthority] = useState("LOCAL_PENDING_REVIEW");
  const [status, setStatus] = useState("");
  const registry = trpc.regional.registry.useQuery(undefined, { retry: false });
  const jurisdictionId = registry.data?.find(country => country.status === "configured")?.profile?.id;
  const catalog = trpc.erp.catalog.search.useQuery(jurisdictionId ? { jurisdictionId, query, category } : skipToken, { retry: false });
  const createItem = trpc.erp.catalog.createItem.useMutation();
  const submitItem = async () => {
    if (!jurisdictionId) { setStatus("لا يوجد اختصاص معتمد للكتالوج حالياً؛ يجب اعتماد حزمة الدولة أولاً."); return; }
    if (!nameAr.trim() || !sku.trim() || !category) { setStatus("اختر الفئة وأدخل الاسم العربي وSKU."); return; }
    try { const result = await createItem.mutateAsync({ jurisdictionId, category, nameAr, sku, sourceAuthority }); setStatus(`تم تسجيل الصنف #${result.itemId} بحالة ${result.verificationStatus}`); setNameAr(""); setSku(""); await catalog.refetch(); } catch (error) { setStatus(error instanceof Error ? error.message : "تعذر تسجيل الصنف"); }
  };
  return <WorkspaceShell title="كتالوج الأصناف"><div className="space-y-4"><div className="rounded-2xl border border-cyan-100 bg-cyan-50/50 p-4"><div className="mb-3 flex items-center gap-2"><Plus className="h-4 w-4 text-cyan-700" /><p className="text-sm font-semibold text-cyan-950">إضافة صنف للمراجعة</p></div><p className="mb-3 text-xs text-slate-600">الدولة النشطة: {registry.data?.find(country => country.profile?.id === jurisdictionId)?.countryNameAr ?? "لا توجد دولة معتمدة"}. لا يتم إنشاء أو عرض أصناف خارج اختصاص معتمد.</p><div className="grid gap-2 md:grid-cols-4"><Input value={nameAr} onChange={e => setNameAr(e.target.value)} placeholder="الاسم العربي" aria-label="اسم الصنف" /><Input value={sku} onChange={e => setSku(e.target.value)} placeholder="SKU داخلي" aria-label="SKU" /><select value={category ?? ""} onChange={e => setCategory((e.target.value || undefined) as typeof category)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"><option value="">الفئة</option><option value="medicine">دواء</option><option value="cosmetic">تجميل</option><option value="medical_supply">مستلزم</option></select><Input value={sourceAuthority} onChange={e => setSourceAuthority(e.target.value)} placeholder="الجهة المرجعية الرسمية" aria-label="الجهة المرجعية" /></div><div className="mt-3 flex flex-wrap items-center gap-3"><Button onClick={submitItem} disabled={createItem.isPending} className="bg-[#0d1b2a]">{createItem.isPending ? "جارٍ التسجيل…" : "إرسال للمراجعة"}</Button>{status && <Badge variant="outline">{status}</Badge>}</div></div><div className="flex flex-col gap-2 sm:flex-row"><Input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث بالاسم العربي" aria-label="بحث الكتالوج" /><select value={category ?? ""} onChange={e => setCategory((e.target.value || undefined) as typeof category)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"><option value="">كل الفئات</option><option value="medicine">أدوية</option><option value="cosmetic">مستحضرات تجميل</option><option value="medical_supply">مستلزمات طبية</option></select></div>{catalog.isLoading ? <p className="text-sm text-slate-500">جارٍ البحث…</p> : catalog.data?.length ? <div className="grid gap-2 md:grid-cols-2">{catalog.data.map(item => <div key={item.id} className="rounded-xl border border-slate-200 p-3"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{item.nameAr}</p><p className="text-xs text-slate-500">{item.sku} · {item.category}</p></div><Badge variant="outline">{item.verificationStatus}</Badge></div><p className="mt-2 text-xs text-slate-500">المصدر: {item.sourceAuthority}{item.registrationNumber ? ` · ${item.registrationNumber}` : ""}</p></div>)}</div> : <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500"><Database className="mx-auto mb-2 h-6 w-6 text-slate-300" />لا توجد أصناف موثقة مطابقة. يمكن للمصرّح له إضافة صنف مع مصدر ومراجعة.</div>}</div></WorkspaceShell>;
}
