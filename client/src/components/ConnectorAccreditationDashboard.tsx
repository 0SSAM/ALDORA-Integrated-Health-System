import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, CheckCircle2, Clock3, Info, LockKeyhole, ShieldCheck } from "lucide-react";

const stateLabels = {
  blocked: { ar: "مغلق بأمان", en: "Fail-closed", className: "border-slate-300 bg-slate-100 text-slate-700" },
  deferred: { ar: "مؤجل", en: "Deferred", className: "border-amber-300 bg-amber-50 text-amber-900" },
  ready: { ar: "جاهز للمراجعة", en: "Ready for review", className: "border-emerald-300 bg-emerald-50 text-emerald-800" },
} as const;

export function ConnectorAccreditationDashboard() {
  const readiness = trpc.auth.connectorReadiness.useQuery(undefined, { retry: false });

  if (readiness.isLoading) {
    return <Card className="border-slate-200 bg-white/80"><CardContent className="flex items-center gap-3 p-6 text-sm text-slate-600"><Clock3 className="h-5 w-5 animate-pulse text-cyan-700" aria-hidden="true" />جارٍ تحميل سجل جاهزية الموصلات…</CardContent></Card>;
  }

  if (readiness.isError || !readiness.data) {
    return <Card className="border-rose-200 bg-rose-50"><CardContent className="flex items-start gap-3 p-6 text-sm leading-6 text-rose-900" role="alert"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /><span>تعذر تحميل لوحة الموصلات. لم يتم تغيير أي حالة أو محاولة اتصال خارجي.</span></CardContent></Card>;
  }

  const blockedCount = readiness.data.connectors.filter(item => item.state === "blocked").length;
  const total = readiness.data.connectors.length;
  const reviewedAt = new Date(readiness.data.reviewedAt).toLocaleDateString("ar-EG");

  return (
    <section className="space-y-4" aria-labelledby="connector-dashboard-title" dir="rtl">
      <Card className="border-cyan-100 bg-gradient-to-br from-white to-cyan-50/50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle id="connector-dashboard-title" className="flex items-center gap-2 text-xl text-slate-900"><ShieldCheck className="h-5 w-5 text-cyan-700" aria-hidden="true" />مركز الموصلات والاعتمادات</CardTitle>
              <p className="mt-2 text-sm leading-6 text-slate-600">متابعة مركزية للجاهزية التنظيمية والتأمينية. هذه اللوحة للقراءة والتدقيق فقط ولا تفعّل أي إرسال خارجي.</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild><Badge variant="outline" className="cursor-help border-slate-300 bg-white text-slate-700"><LockKeyhole className="ml-1 h-3.5 w-3.5" aria-hidden="true" />سياسة fail-closed</Badge></TooltipTrigger>
              <TooltipContent className="max-w-sm text-right leading-5">لا يتحول الموصل إلى نشط إلا بعد المواصفة الرسمية، الاعتمادات، بيئة الاختبار، واختبار القبول الموثق. لا تعرض هذه اللوحة أسراراً ولا تنفذ اتصالاً خارجياً.</TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white/80 p-4"><p className="text-xs text-slate-500">إجمالي الموصلات</p><p className="mt-1 text-2xl font-bold text-slate-900">{total}</p></div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4"><p className="text-xs text-amber-800">مغلق بأمان</p><p className="mt-1 text-2xl font-bold text-amber-950">{blockedCount}</p></div>
          <div className="rounded-xl border border-cyan-200 bg-cyan-50/70 p-4"><p className="text-xs text-cyan-800">آخر مراجعة</p><p className="mt-1 text-sm font-bold text-cyan-950">{reviewedAt}</p></div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {readiness.data.connectors.map(connector => {
          const state = stateLabels[connector.state];
          return <Card key={connector.id} className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-3"><div className="flex items-start justify-between gap-3"><div><CardTitle className="text-base text-slate-900">{connector.name}</CardTitle><p className="mt-1 text-xs text-slate-500">{connector.jurisdiction} · {connector.providers.join(" · ")}</p></div><Tooltip><TooltipTrigger asChild><Badge variant="outline" className={`cursor-help ${state.className}`}><LockKeyhole className="ml-1 h-3.5 w-3.5" aria-hidden="true" />{state.ar}</Badge></TooltipTrigger><TooltipContent className="max-w-xs text-right leading-5">الحالة الإنجليزية: {state.en}. لا يوجد تفعيل خارجي في هذه المرحلة.</TooltipContent></Tooltip></div></CardHeader>
            <CardContent className="space-y-4"><div><div className="mb-1 flex justify-between text-xs text-slate-500"><span>نسبة الجاهزية الداخلية</span><span>{connector.readinessPercent}%</span></div><Progress value={connector.readinessPercent} aria-label={`نسبة جاهزية ${connector.name}`} /></div><div><p className="mb-2 text-sm font-semibold text-slate-800">المتطلبات المتبقية</p><ul className="space-y-2 text-sm leading-5 text-slate-600">{connector.prerequisites.map(item => <li key={item} className="flex items-start gap-2"><Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" aria-hidden="true" /><span>{item}</span></li>)}</ul></div><div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />{connector.note}</div></CardContent>
          </Card>;
        })}
      </div>
    </section>
  );
}
