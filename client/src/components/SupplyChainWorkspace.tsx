import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const initialOrders = [
  { id: "PO-DEMO-104", supplier: "مورد اصطناعي معتمد", product: "باراسيتامول 500 مجم", batch: "DEMO-B24", status: "قيد الاستلام", eta: "2026-08-18", qty: 100, received: 80, risk: "فرق استلام" },
  { id: "PO-DEMO-105", supplier: "مورد اصطناعي معتمد", product: "قفازات فحص", batch: "DEMO-G11", status: "معتمد", eta: "2026-08-22", qty: 500, received: 0, risk: "طبيعي" },
  { id: "PO-DEMO-106", supplier: "مورد اصطناعي معتمد", product: "محلول تعقيم", batch: "DEMO-S07", status: "محجور", eta: "2026-08-16", qty: 60, received: 60, risk: "حجر جودة" },
];

export function SupplyChainWorkspace() {
  const [orders, setOrders] = useState(initialOrders);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => orders.filter(order => `${order.id} ${order.supplier} ${order.product} ${order.batch}`.toLowerCase().includes(query.toLowerCase())), [orders, query]);
  const simulateReceive = (id: string) => setOrders(current => current.map(order => order.id === id ? { ...order, status: "تم الاستلام — بانتظار المطابقة", received: order.qty, risk: "طبيعي" } : order));
  const simulateQuarantine = (id: string) => setOrders(current => current.map(order => order.id === id ? { ...order, status: "محجور", risk: "حجر جودة" } : order));
  return <div className="space-y-5" dir="rtl">
    <div className="grid gap-3 md:grid-cols-4"><Metric title="أوامر مفتوحة" value={String(orders.filter(order => !["محجور", "تم الاستلام — بانتظار المطابقة"].includes(order.status)).length)} /><Metric title="فرق استلام" value={String(orders.filter(order => order.risk === "فرق استلام").length)} tone="amber" /><Metric title="حالات حجر" value={String(orders.filter(order => order.status === "محجور").length)} tone="rose" /><Metric title="تتبع الدفعات" value="مفعّل" tone="emerald" /></div>
    <Card><CardHeader><CardTitle className="flex flex-wrap items-center justify-between gap-3"><span>متابعة سلاسل الإمداد والتوريد</span><Badge variant="outline">بيانات اصطناعية — لا إرسال لمورد</Badge></CardTitle><p className="text-sm leading-6 text-slate-500">تتبع أمر الشراء من الاعتماد إلى الشحن والاستلام والمطابقة والحجر والاستدعاء، مع ربط كل حدث بالمؤسسة والفرع والاختصاص وسجل التدقيق.</p></CardHeader><CardContent><div className="mb-4 flex items-center gap-2"><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="ابحث برقم الأمر أو المورد أو المنتج أو الدفعة" aria-label="بحث سلسلة الإمداد" /></div><div className="space-y-3">{filtered.map(order => <div key={order.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold">{order.id} · {order.product}</p><p className="mt-1 text-xs text-slate-500">{order.supplier} · الدفعة {order.batch} · موعد متوقع {order.eta}</p></div><Badge variant="outline" className={order.risk === "حجر جودة" ? "border-rose-300 text-rose-700" : order.risk === "فرق استلام" ? "border-amber-300 text-amber-700" : "border-emerald-300 text-emerald-700"}>{order.risk}</Badge></div><div className="mt-3 grid gap-2 text-sm sm:grid-cols-3"><span>الحالة: <strong>{order.status}</strong></span><span>الكمية: {order.received} / {order.qty}</span><span>المسار: اعتماد ← شحن ← استلام ← مطابقة</span></div><div className="mt-3 flex flex-wrap gap-2"><Button size="sm" onClick={() => simulateReceive(order.id)} disabled={order.status === "محجور"}>محاكاة الاستلام والمطابقة</Button><Button size="sm" variant="outline" onClick={() => simulateQuarantine(order.id)}>محاكاة الحجر</Button></div></div>)}{filtered.length === 0 && <p className="rounded-xl border border-dashed p-5 text-sm text-slate-500">لا توجد نتائج في السجل الاصطناعي.</p>}</div><p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">التكامل الحقيقي مع الموردين وEDI/GS1 والجهات التنظيمية يحتاج مواصفات واعتمادات وبيئة اختبار رسمية؛ لن تُنشأ أوامر شراء أو حركات مخزون فعلية من هذا العرض.</p></CardContent></Card>
  </div>;
}
function Metric({ title, value, tone = "cyan" }: { title: string; value: string; tone?: "cyan" | "amber" | "rose" | "emerald" }) { const tones = { cyan: "bg-cyan-50 text-cyan-800", amber: "bg-amber-50 text-amber-800", rose: "bg-rose-50 text-rose-800", emerald: "bg-emerald-50 text-emerald-800" }; return <div className={`rounded-2xl p-4 ${tones[tone]}`}><p className="text-xs opacity-75">{title}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>; }
