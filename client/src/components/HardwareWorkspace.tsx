import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CheckCircle2, CircleStop, Cpu, Printer, ScanLine, Settings2, ShieldCheck, Wifi } from "lucide-react";
import { useMemo, useState } from "react";

export type PrinterModel = {
  id: string;
  name: string;
  family: "حرارية" | "ملصقات" | "مكتبية";
  transports: Array<"browser-download" | "local-bridge" | "network-ipps" | "usb" | "bluetooth">;
  media: string[];
};

export const printerModels: PrinterModel[] = [
  { id: "thermal-generic-80", name: "Thermal 80mm — Generic", family: "حرارية", transports: ["local-bridge", "usb", "bluetooth"], media: ["إيصال 80mm"] },
  { id: "thermal-generic-58", name: "Thermal 58mm — Generic", family: "حرارية", transports: ["local-bridge", "usb", "bluetooth"], media: ["إيصال 58mm"] },
  { id: "label-zpl-generic", name: "Label ZPL — Generic", family: "ملصقات", transports: ["local-bridge", "network-ipps", "usb"], media: ["ملصق Data Matrix", "ملصق باركود"] },
  { id: "office-a4", name: "Office A4 — PDF", family: "مكتبية", transports: ["browser-download", "network-ipps"], media: ["A4", "A5"] },
];

export const connectionLabels: Record<PrinterModel["transports"][number], string> = {
  "browser-download": "ملف المتصفح / PDF",
  "local-bridge": "Local Bridge",
  "network-ipps": "شبكة IPPS",
  usb: "USB عبر Bridge",
  bluetooth: "Bluetooth عبر Bridge",
};

export function validateDemoBarcode(value: string) {
  const normalized = value.trim();
  return normalized.length >= 6 && normalized.length <= 80 && /^[A-Za-z0-9._:/-]+$/.test(normalized);
}

export function buildDemoReceipt(modelId: string, barcode: string, media: string) {
  const model = printerModels.find(item => item.id === modelId);
  return {
    model: model?.name ?? "طابعة غير محددة",
    media,
    barcode: barcode.trim() || "8901234567890",
    lines: ["ألدورا | منظومة الرعاية الصحية المتكاملة", "DEMO RECEIPT — NOT A REAL SALE", "Paracetamol 500mg     42.00 EGP", "TOTAL                 42.00 EGP"],
  };
}

export function HardwareWorkspace() {
  const [modelId, setModelId] = useState(printerModels[0].id);
  const selectedModel = printerModels.find(model => model.id === modelId) ?? printerModels[0];
  const [transport, setTransport] = useState<PrinterModel["transports"][number]>(selectedModel.transports[0]);
  const [media, setMedia] = useState(selectedModel.media[0]);
  const [barcode, setBarcode] = useState("8901234567890");
  const [scanLog, setScanLog] = useState<string[]>([]);
  const [printStatus, setPrintStatus] = useState("لم تبدأ المحاكاة بعد");
  const [activeTab, setActiveTab] = useState<"settings" | "scanner" | "thermal">("settings");

  const receipt = useMemo(() => buildDemoReceipt(modelId, barcode, media), [modelId, barcode, media]);
  const modelChange = (value: string) => {
    const next = printerModels.find(model => model.id === value) ?? printerModels[0];
    setModelId(next.id);
    setTransport(next.transports[0]);
    setMedia(next.media[0]);
    setPrintStatus("تم تحديث إعدادات المحاكاة محلياً");
  };
  const simulateScan = () => {
    if (!validateDemoBarcode(barcode)) {
      setScanLog(previous => [`مرفوض: صيغة باركود غير صالحة — ${barcode || "فارغ"}`, ...previous].slice(0, 5));
      return;
    }
    setScanLog(previous => [`مقبول محلياً: ${barcode}`, ...previous].slice(0, 5));
  };
  const simulatePrint = () => {
    setPrintStatus(`تمت محاكاة الطباعة عبر ${connectionLabels[transport]} — لا يوجد جهاز متصل`);
  };

  return <div className="space-y-4" dir="rtl">
    <Card className="border-cyan-200 bg-cyan-50/70">
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-700" /><div><p className="font-semibold text-cyan-950">مختبر الأجهزة — محاكاة محلية آمنة</p><p className="mt-1 text-sm leading-6 text-cyan-800">الإعدادات والنتائج محلية داخل المتصفح. لا يتم فتح USB أو Bluetooth أو الشبكة، ولا تُرسل عملية بيع أو ملصق أو بيانات مراقبة إلى الإنتاج.</p></div></div>
        <Badge variant="outline" className="w-fit border-cyan-300 bg-white text-cyan-800">بدون جهاز فعلي</Badge>
      </CardContent>
    </Card>
    <div className="grid gap-2 sm:grid-cols-3">
      <Button variant={activeTab === "settings" ? "default" : "outline"} onClick={() => setActiveTab("settings")} className={cn(activeTab === "settings" && "bg-[#0d1b2a]")}><Settings2 className="ml-2 h-4 w-4" />إعداد الطابعة</Button>
      <Button variant={activeTab === "scanner" ? "default" : "outline"} onClick={() => setActiveTab("scanner")} className={cn(activeTab === "scanner" && "bg-[#0d1b2a]")}><ScanLine className="ml-2 h-4 w-4" />محاكاة الماسح</Button>
      <Button variant={activeTab === "thermal" ? "default" : "outline"} onClick={() => setActiveTab("thermal")} className={cn(activeTab === "thermal" && "bg-[#0d1b2a]")}><Printer className="ml-2 h-4 w-4" />محاكاة حرارية</Button>
    </div>
    {activeTab === "settings" && <Card><CardHeader><CardTitle className="flex items-center gap-2"><Cpu className="h-5 w-5 text-cyan-700" />اختيار الموديل ونوع الاتصال</CardTitle></CardHeader><CardContent className="grid gap-4 lg:grid-cols-3"><label className="space-y-2 text-sm"><span className="font-medium">موديل الطابعة</span><Select value={modelId} onValueChange={modelChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{printerModels.map(model => <SelectItem key={model.id} value={model.id}>{model.name} · {model.family}</SelectItem>)}</SelectContent></Select></label><label className="space-y-2 text-sm"><span className="font-medium">نوع الاتصال</span><Select value={transport} onValueChange={value => setTransport(value as PrinterModel["transports"][number])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{selectedModel.transports.map(item => <SelectItem key={item} value={item}>{connectionLabels[item]}</SelectItem>)}</SelectContent></Select></label><label className="space-y-2 text-sm"><span className="font-medium">نوع الوسيط</span><Select value={media} onValueChange={setMedia}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{selectedModel.media.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label><div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 lg:col-span-3"><div className="flex items-center gap-2 font-semibold"><Wifi className="h-4 w-4 text-cyan-700" />حالة المسار</div><p className="mt-1 text-slate-600">{connectionLabels[transport]} متاح للاختبار الوصفي فقط. التفعيل الحقيقي يحتاج Local Bridge أو موصل معتمد واختبار قبول.</p></div></CardContent></Card>}
    {activeTab === "scanner" && <Card><CardHeader><CardTitle className="flex items-center gap-2"><ScanLine className="h-5 w-5 text-violet-700" />محاكاة قارئ الباركود وData Matrix</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex flex-col gap-2 sm:flex-row"><Input value={barcode} onChange={event => setBarcode(event.target.value)} placeholder="مثال: 8901234567890" aria-label="قيمة باركود تجريبية" /><Button onClick={simulateScan} className="bg-[#0d1b2a]">إرسال قراءة محاكاة</Button></div><p className="text-xs text-slate-500">التحقق محلي ومحدود بصيغة تجريبية؛ لا يعني قبول المنتج أو التحقق الحكومي.</p><div className="rounded-xl border border-dashed border-violet-300 bg-violet-50 p-4"><p className="mb-2 font-semibold text-violet-950">سجل أحداث الماسح</p>{scanLog.length ? <div className="space-y-2">{scanLog.map((item, index) => <p key={`${item}-${index}`} className="rounded-lg bg-white p-2 text-sm text-violet-900">{item}</p>)}</div> : <p className="text-sm text-violet-800">ابدأ بإرسال قراءة لرؤية نتيجة المحاكاة.</p>}</div></CardContent></Card>}
    {activeTab === "thermal" && <Card><CardHeader><CardTitle className="flex items-center gap-2"><Printer className="h-5 w-5 text-amber-700" />اختبار الطباعة الحرارية</CardTitle></CardHeader><CardContent className="grid gap-4 lg:grid-cols-[1fr_0.9fr]"><div className="rounded-xl border border-slate-200 bg-white p-4 shadow-inner"><div className="mb-3 flex items-center justify-between text-xs text-slate-500"><span>{receipt.model}</span><span>{receipt.media}</span></div>{receipt.lines.map(line => <p key={line} className="font-mono text-xs leading-6" dir="ltr">{line}</p>)}<div className="mt-3 border-t border-dashed border-slate-300 pt-2 text-center text-[10px] text-slate-400">SIMULATION ONLY</div></div><div className="space-y-3 rounded-xl bg-amber-50 p-4"><p className="font-semibold text-amber-950">نتيجة الاختبار</p><p className="text-sm leading-6 text-amber-900">{printStatus}</p><Button onClick={simulatePrint} className="w-full bg-[#0d1b2a]"><Printer className="ml-2 h-4 w-4" />محاكاة إرسال للطابعة</Button><div className="flex items-center gap-2 text-xs text-amber-800"><CircleStop className="h-4 w-4" />لا يوجد اتصال فعلي</div></div></CardContent></Card>}
    <div className="flex items-center gap-2 text-xs text-slate-500"><CheckCircle2 className="h-4 w-4 text-emerald-600" />المحاكاة لا تغيّر المخزون ولا تنشئ فاتورة ولا تحفظ إعداد جهاز إنتاجي.</div>
  </div>;
}
