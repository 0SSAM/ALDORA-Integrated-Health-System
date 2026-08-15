import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AlertTriangle, BarChart3, Boxes, BrainCircuit, CheckCircle2, ClipboardCheck, FileText, FlaskConical, PackageSearch, PhoneCall, Receipt, RotateCcw, Search, ShieldCheck, ShoppingCart, Ticket, UserRound, Users, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";

type DemoModule = "overview" | "pos" | "inventory" | "prescriptions" | "insurance" | "compliance" | "compounding" | "finance" | "people" | "customerCare" | "callCentre" | "catalog";

type DemoCartItem = { id: string; name: string; price: number; quantity: number };
type DemoTicket = { id: number; subject: string; priority: "عادي" | "مرتفع"; status: "جديدة" | "قيد المتابعة" };

export function clampDemoDiscount(value: string): number {
  return Math.min(Math.max(Number(value) || 0, 0), 7);
}

export function filterDemoCatalog(query: string) {
  const normalized = query.trim().toUpperCase();
  return catalogItems.filter(item => item.name.toUpperCase().includes(normalized) || item.id.includes(normalized));
}

const catalogItems = [
  { id: "MED-001", name: "باراسيتامول 500 مجم — عرض تجريبي", category: "دواء", source: "سجل اصطناعي" },
  { id: "COS-014", name: "مرطب جلدي — عرض تجريبي", category: "تجميل", source: "سجل اصطناعي" },
  { id: "SUP-032", name: "قفازات فحص — عرض تجريبي", category: "مستلزم طبي", source: "سجل اصطناعي" },
];

const initialCart: DemoCartItem[] = [
  { id: "MED-001", name: "باراسيتامول 500 مجم", price: 42, quantity: 1 },
  { id: "SUP-032", name: "قفازات فحص", price: 18, quantity: 2 },
];

const initialTickets: DemoTicket[] = [
  { id: 1001, subject: "استفسار عن توافر منتج", priority: "عادي", status: "قيد المتابعة" },
  { id: 1002, subject: "طلب متابعة خدمة", priority: "مرتفع", status: "جديدة" },
];

const moduleLabels: Record<DemoModule, string> = {
  overview: "نظرة عامة",
  pos: "نقطة البيع",
  inventory: "المخزون و FEFO",
  prescriptions: "الوصفات الذكية",
  insurance: "التأمين والمطالبات",
  compliance: "الامتثال الإقليمي",
  compounding: "التحضير الصيدلي",
  finance: "المالية والتقارير",
  people: "الموظفون والفروع",
  customerCare: "خدمة العملاء",
  callCentre: "مركز الاتصال",
  catalog: "كتالوج الأصناف",
};

export function DemoWorkspace({ active, onNavigate }: { active: string; onNavigate: (module: DemoModule) => void }) {
  const [cart, setCart] = useState<DemoCartItem[]>(initialCart);
  const [discount, setDiscount] = useState("7");
  const [cartStatus, setCartStatus] = useState("السلة محلية — لم يتم إنشاء بيع حقيقي");
  const [inventoryStatus, setInventoryStatus] = useState("لم تبدأ المحاكاة بعد");
  const [prescriptionStatus, setPrescriptionStatus] = useState("تحتاج مراجعة صيدلي");
  const [claimStatus, setClaimStatus] = useState("بانتظار الموافقة المسبقة");
  const [reportStatus, setReportStatus] = useState("لم يتم إنشاء تقرير");
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerStatus, setCustomerStatus] = useState("لا يتم حفظ ملفات العملاء في Demo");
  const [ticketSubject, setTicketSubject] = useState("");
  const [tickets, setTickets] = useState<DemoTicket[]>(initialTickets);
  const [ticketStatus, setTicketStatus] = useState("التذاكر محلية — لا يوجد اتصال بمركز حقيقي");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const safeDiscount = clampDemoDiscount(discount);
  const discountedTotal = total - (total * safeDiscount) / 100;
  const filteredCatalog = useMemo(() => filterDemoCatalog(search), [search]);
  const resetDemo = () => {
    setCart(initialCart);
    setDiscount("7");
    setCartStatus("السلة محلية — لم يتم إنشاء بيع حقيقي");
    setInventoryStatus("لم تبدأ المحاكاة بعد");
    setPrescriptionStatus("تحتاج مراجعة صيدلي");
    setClaimStatus("بانتظار الموافقة المسبقة");
    setReportStatus("لم يتم إنشاء تقرير");
    setSearch("");
    setCustomerName("");
    setCustomerStatus("لا يتم حفظ ملفات العملاء في Demo");
    setTicketSubject("");
    setTickets(initialTickets);
    setTicketStatus("التذاكر محلية — لا يوجد اتصال بمركز حقيقي");
  };

  const addToCart = (item: DemoCartItem) => {
    setCart(current => current.some(existing => existing.id === item.id) ? current.map(existing => existing.id === item.id ? { ...existing, quantity: existing.quantity + 1 } : existing) : [...current, item]);
    setCartStatus("تمت إضافة صنف اصطناعي إلى السلة المحلية");
  };

  const renderPanel = () => {
    switch (active as DemoModule) {
      case "pos":
        return <DemoPanel title="نقطة بيع تفاعلية" icon={ShoppingCart} description="جرّب السلة والحساب والحد الأقصى للخصم. زر الإتمام محاكاة فقط ولا ينشئ فاتورة أو حركة مخزون."><div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]"><div className="space-y-2">{catalogItems.map(item => <button key={item.id} onClick={() => addToCart({ id: item.id, name: item.name, price: item.id === "MED-001" ? 42 : item.id === "SUP-032" ? 18 : 65, quantity: 1 })} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-right transition hover:border-cyan-300 hover:shadow-sm"><span><span className="block font-medium">{item.name}</span><span className="text-xs text-slate-500">{item.id} · {item.category}</span></span><span className="text-xs font-semibold text-cyan-700">إضافة</span></button>)}</div><div className="rounded-2xl bg-slate-50 p-4"><div className="mb-3 flex items-center justify-between"><p className="font-semibold">السلة المحلية</p><Badge variant="outline">{cart.length} أصناف</Badge></div>{cart.map(item => <div key={item.id} className="flex items-center justify-between border-b border-slate-200 py-2 text-sm"><span>{item.name} × {item.quantity}</span><span>{item.price * item.quantity} ج.م</span></div>)}<div className="mt-4 grid gap-2 text-sm"><label className="flex items-center justify-between gap-3">خصم تجريبي %<Input value={discount} onChange={event => setDiscount(event.target.value)} className="h-8 w-20 text-center" inputMode="decimal" /></label><p className="text-xs text-slate-500">المحرك يحد الخصم تلقائياً إلى ٧٪: {safeDiscount}%</p><div className="flex justify-between font-semibold"><span>الإجمالي التجريبي</span><span>{discountedTotal.toFixed(2)} ج.م</span></div><Button onClick={() => setCartStatus("تمت محاكاة التحقق: لا توجد فاتورة حقيقية ولا إرسال ETA")} className="mt-2 bg-[#0d1b2a]">تحقق من السلة</Button><Badge variant="outline" className="justify-center">{cartStatus}</Badge></div></div></div></DemoPanel>;
      case "inventory":
        return <DemoPanel title="المخزون و FEFO" icon={Boxes} description="استعرض تشغيلات اصطناعية وجرب ترتيب الصرف حسب أقرب انتهاء دون تعديل مخزون حقيقي."><div className="space-y-3">{[{ batch: "DEMO-A24", expiry: "2026-09-18", quantity: 24, tone: "border-rose-200 bg-rose-50" }, { batch: "DEMO-B11", expiry: "2027-01-09", quantity: 60, tone: "border-amber-200 bg-amber-50" }, { batch: "DEMO-C07", expiry: "2027-06-22", quantity: 120, tone: "border-emerald-200 bg-emerald-50" }].map((batch, index) => <div key={batch.batch} className={cn("flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between", batch.tone)}><div><p className="font-semibold">{batch.batch} {index === 0 && <Badge className="mr-2 bg-rose-600">FEFO أولاً</Badge>}</p><p className="text-xs text-slate-600">انتهاء {batch.expiry} · كمية {batch.quantity} وحدة</p></div><span className="text-xs font-medium text-slate-700">حالة اصطناعية</span></div>)}<Button onClick={() => setInventoryStatus("تمت محاكاة الصرف من DEMO-A24 أولاً — لم يتغير مخزون حقيقي")} className="bg-[#0d1b2a]">محاكاة صرف FEFO</Button>{inventoryStatus && <Badge variant="outline">{inventoryStatus}</Badge>}</div></DemoPanel>;
      case "prescriptions":
        return <DemoPanel title="الوصفة الذكية" icon={BrainCircuit} description="شاهد نتيجة استخراج اصطناعية مع خطوة مراجعة الصيدلي. لا يوجد رفع ملف ولا صرف دواء في Demo."><div className="grid gap-4 lg:grid-cols-[1fr_1fr]"><div className="rounded-2xl border border-violet-200 bg-violet-50 p-5"><p className="text-sm font-semibold text-violet-950">نتيجة رؤية اصطناعية</p><pre className="mt-3 whitespace-pre-wrap text-left text-xs leading-6 text-violet-950" dir="ltr">{`drug: Paracetamol 500mg\nquantity: 2\ndosage: 1 tablet / 8h\nconfidence: 0.96`}</pre></div><div className="rounded-2xl border border-slate-200 p-5"><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-600" /><p className="font-semibold">بوابة الصرف</p></div><p className="mt-2 text-sm leading-6 text-slate-600">المراجعة البشرية إلزامية قبل الصرف، حتى مع ارتفاع ثقة النموذج.</p><Button onClick={() => setPrescriptionStatus("تمت محاكاة مراجعة الصيدلي — لا يوجد صرف أو وصفة حقيقية")} className="mt-4 bg-[#0d1b2a]">محاكاة مراجعة الصيدلي</Button><Badge variant="outline" className="mt-3">{prescriptionStatus}</Badge></div></div></DemoPanel>;
      case "customerCare":
        return <DemoPanel title="خدمة العملاء" icon={UserRound} description="جرّب إنشاء ملف محلي اصطناعي وملاحظة الموافقة. البيانات تختفي عند إعادة الضبط أو مغادرة Demo."><div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]"><div className="space-y-3 rounded-2xl bg-slate-50 p-4"><Input value={customerName} onChange={event => setCustomerName(event.target.value)} placeholder="اسم تجريبي" aria-label="اسم تجريبي" /><Button onClick={() => { setCustomerStatus(customerName.trim() ? `تم إنشاء ملف محلي اصطناعي لـ ${customerName.trim()} — الموافقة غير معتمدة` : "أدخل اسماً تجريبياً أولاً"); setCustomerName(""); }} className="w-full bg-[#0d1b2a]">إنشاء ملف محلي</Button><Badge variant="outline">{customerStatus}</Badge></div><div className="rounded-2xl border border-slate-200 p-4"><p className="font-semibold">ما الذي تتعلمه؟</p><div className="mt-3 space-y-2 text-sm text-slate-600"><p>• ربط الملف بالفرع والجهة.</p><p>• حالة موافقة منفصلة عن إنشاء الملف.</p><p>• عدم تفعيل الرعاية المزمنة تلقائياً.</p></div></div></div></DemoPanel>;
      case "callCentre":
        return <DemoPanel title="مركز الاتصال" icon={PhoneCall} description="أنشئ تذاكر محلية، غيّر الأولوية، وتابع دورة الحالة دون حفظ تسجيلات أو اتصال بخدمة هاتفية."><div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]"><div className="space-y-3 rounded-2xl bg-slate-50 p-4"><Input value={ticketSubject} onChange={event => setTicketSubject(event.target.value)} placeholder="موضوع تذكرة تجريبية" aria-label="موضوع تذكرة تجريبية" /><Button onClick={() => { if (!ticketSubject.trim()) { setTicketStatus("اكتب موضوع التذكرة أولاً"); return; } setTickets(current => [{ id: Date.now(), subject: ticketSubject.trim(), priority: "عادي", status: "جديدة" }, ...current]); setTicketSubject(""); setTicketStatus("تم إنشاء تذكرة محلية اصطناعية"); }} className="w-full bg-[#0d1b2a]"><Ticket className="ml-2 h-4 w-4" />فتح تذكرة محلية</Button><Badge variant="outline">{ticketStatus}</Badge></div><div className="space-y-2">{tickets.map(ticket => <div key={ticket.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"><div><p className="font-medium">#{ticket.id} · {ticket.subject}</p><p className="text-xs text-slate-500">{ticket.status} · {ticket.priority}</p></div><Button variant="ghost" size="sm" onClick={() => setTickets(current => current.map(item => item.id === ticket.id ? { ...item, status: item.status === "جديدة" ? "قيد المتابعة" : "جديدة" } : item))}>تبديل الحالة</Button></div>)}</div></div></DemoPanel>;
      case "catalog":
        return <DemoPanel title="كتالوج الأصناف" icon={PackageSearch} description="ابحث في ثلاثة أصناف اصطناعية توضح فصل الأدوية والتجميل والمستلزمات ومصدر كل سجل."><div className="flex items-center gap-2"><Search className="h-4 w-4 text-slate-400" /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="ابحث بالاسم أو SKU" aria-label="بحث أصناف Demo" /></div><div className="mt-4 grid gap-3 md:grid-cols-3">{filteredCatalog.map(item => <div key={item.id} className="rounded-xl border border-slate-200 p-4"><Badge variant="outline">{item.category}</Badge><p className="mt-3 font-medium">{item.name}</p><p className="mt-2 text-xs text-slate-500">{item.id} · {item.source}</p></div>)}{filteredCatalog.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500 md:col-span-3">لا توجد نتائج في السجل الاصطناعي.</p>}</div></DemoPanel>;
      case "insurance":
        return <DemoPanel title="التأمين والمطالبات" icon={ClipboardCheck} description="جرّب انتقال مطالبة اصطناعية من الانتظار إلى المراجعة دون إرسالها إلى شركة تأمين."><div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">مطالبة DEMO-CLM-204</p><p className="mt-1 text-sm text-slate-600">خدمة دوائية تجريبية · مزود TPA اصطناعي</p></div><Badge variant="outline">{claimStatus}</Badge></div><Button onClick={() => setClaimStatus("تمت محاكاة المراجعة — لم يتم الإرسال الخارجي")} className="mt-4 bg-[#0d1b2a]">محاكاة مراجعة المطالبة</Button></div></DemoPanel>;
      case "compliance":
        return <DemoPanel title="الامتثال الإقليمي" icon={ShieldCheck} description="تعرض هذه الشاشة كيف يمنع النظام العمليات المنظمة عندما لا تكون حزمة الدولة موثقة ومعتمدة."><div className="rounded-2xl border border-rose-200 bg-rose-50 p-5"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 text-rose-700" /><div><p className="font-semibold text-rose-950">العمليات المنظمة محجوبة في Demo</p><p className="mt-2 text-sm leading-6 text-rose-800">لا توجد موافقات حكومية أو حزمة قانونية حقيقية في هذه الجلسة. هذه نتيجة أمان مقصودة وليست عطلاً.</p></div></div></div></DemoPanel>;
      case "finance":
        return <DemoPanel title="المالية والتقارير" icon={WalletCards} description="أنشئ تقريراً محلياً تجريبياً لترى شكل المؤشرات والتسويات دون أرقام تشغيلية حقيقية."><div className="grid gap-3 sm:grid-cols-3"><DemoStat label="إيراد تجريبي" value="١٢٬٨٤٠ ج.م" tone="text-cyan-700" /><DemoStat label="مطالبات" value="٣" tone="text-amber-700" /><DemoStat label="هامش" value="١٨٪" tone="text-emerald-700" /></div><Button onClick={() => setReportStatus("تم إنشاء تقرير تجريبي محلي — لا يمكن تصديره كسجل مالي رسمي")} className="mt-4 bg-[#0d1b2a]">إنشاء تقرير محلي</Button><Badge variant="outline" className="mr-2">{reportStatus}</Badge></DemoPanel>;
      case "compounding":
        return <DemoPanel title="التحضير الصيدلي" icon={FlaskConical} description="استعرض BOM اصطناعي وتكلفة محاكاة مع إبقاء اعتماد الصيدلي والتتبع الحقيقي خارج Demo."><div className="grid gap-3 sm:grid-cols-3"><DemoStat label="مكونات" value="٤" tone="text-violet-700" /><DemoStat label="تكلفة" value="٨٥ ج.م" tone="text-cyan-700" /><DemoStat label="اعتماد" value="مطلوب" tone="text-amber-700" /></div><div className="mt-4 rounded-xl bg-violet-50 p-4 text-sm text-violet-950">التركيبة: قاعدة مرطبة + مكوّنات اصطناعية · لا يوجد خصم مخزون أو سجل تحضير فعلي.</div></DemoPanel>;
      case "people":
        return <DemoPanel title="الموظفون والفروع" icon={Users} description="استعرض نموذج الصلاحيات والفروع بدون عرض موظفين حقيقيين أو بيانات شخصية."><div className="grid gap-3 sm:grid-cols-3"><DemoStat label="أدوار" value="٤" tone="text-cyan-700" /><DemoStat label="فروع" value="٢" tone="text-violet-700" /><DemoStat label="عزل" value="مفعّل" tone="text-emerald-700" /></div><div className="mt-4 grid gap-2 sm:grid-cols-2"><div className="rounded-xl border border-slate-200 p-3 text-sm">فرع القاهرة — نموذج</div><div className="rounded-xl border border-slate-200 p-3 text-sm">فرع الإسكندرية — نموذج</div></div></DemoPanel>;
      case "overview":
      default:
        return <DemoOverview onNavigate={onNavigate} />;
    }
  };

  return <div className="space-y-4"><Card className="border-violet-200 bg-violet-50/70 shadow-sm"><CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" /><div><p className="font-semibold text-violet-950">مختبر العرض التفاعلي — بيانات اصطناعية</p><p className="text-sm leading-6 text-violet-800">كل ما تراه وتضيفه هنا محلي ومؤقت. لا توجد فواتير أو وصفات أو مطالبات أو مكالمات حقيقية، ولا يتم استدعاء موصلات خارجية.</p></div></div><Button variant="outline" onClick={resetDemo} className="shrink-0 border-violet-300 bg-white text-violet-900"><RotateCcw className="ml-2 h-4 w-4" />إعادة العرض</Button></CardContent></Card><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><DemoStat label="مبيعات محاكاة" value="١٢٬٨٤٠ ج.م" tone="text-cyan-700" /><DemoStat label="أصناف FEFO" value="٣" tone="text-violet-700" /><DemoStat label="مطالبات Demo" value="٣" tone="text-amber-700" /><DemoStat label="حالة الأمان" value="Fail-closed" tone="text-emerald-700" /></div>{renderPanel()}</div>;
}

function DemoOverview({ onNavigate }: { onNavigate: (module: DemoModule) => void }) {
  const shortcuts: Array<{ id: DemoModule; title: string; description: string; icon: typeof ShoppingCart }> = [
    { id: "pos", title: "جرّب نقطة البيع", description: "سلة وحساب خصم FEFO/MOH محلي", icon: ShoppingCart },
    { id: "inventory", title: "افحص المخزون", description: "شاهد ترتيب التشغيلات حسب الانتهاء", icon: Boxes },
    { id: "prescriptions", title: "راجع وصفة ذكية", description: "نتيجة رؤية اصطناعية مع بوابة صيدلي", icon: BrainCircuit },
    { id: "customerCare", title: "أنشئ ملف عميل", description: "تفاعل محلي مع حالة الموافقة", icon: UserRound },
    { id: "callCentre", title: "افتح تذكرة", description: "محاكاة دورة مركز الاتصال", icon: PhoneCall },
    { id: "catalog", title: "ابحث في الكتالوج", description: "أدوية وتجميل ومستلزمات اصطناعية", icon: PackageSearch },
  ];
  return <Card className="border-0 bg-white shadow-sm"><CardHeader><CardTitle>ابدأ من هنا</CardTitle><p className="text-sm text-slate-500">اختر مساراً لتجربة الوظائف الأساسية خطوة بخطوة، ثم استخدم إعادة العرض لمسح حالتك المحلية.</p></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{shortcuts.map(item => { const Icon = item.icon; return <button key={item.id} onClick={() => onNavigate(item.id)} className="group rounded-2xl border border-slate-200 p-4 text-right transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"><div className="mb-4 flex items-center justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700"><Icon className="h-5 w-5" /></div><span className="text-xs text-violet-700">استعراض</span></div><p className="font-semibold">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p></button>; })}</CardContent></Card>;
}

function DemoPanel({ title, description, icon: Icon, children }: { title: string; description: string; icon: typeof ShoppingCart; children: React.ReactNode }) {
  return <Card className="border-0 bg-white shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-700"><Icon className="h-5 w-5" /></span>{title}</CardTitle><p className="text-sm leading-6 text-slate-500">{description}</p></CardHeader><CardContent>{children}</CardContent><div className="border-t border-slate-100 px-6 py-2 text-[10px] text-slate-400">Demo فقط · لا بيانات حقيقية · لا إرسال خارجي</div></Card>;
}

function DemoStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return <div className="rounded-2xl border border-white bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">{label}</p><p className={cn("mt-2 text-xl font-bold", tone)}>{value}</p></div>;
}
