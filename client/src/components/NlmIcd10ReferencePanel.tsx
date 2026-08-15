import { useState } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

export function NlmIcd10ReferencePanel() {
  const [terms, setTerms] = useState("");
  const [submitted, setSubmitted] = useState("");
  const query = trpc.reference.nlmIcd10CmSearch.useQuery({ terms: submitted, count: 20 }, { enabled: submitted.length >= 2, retry: false });
  const submit = () => setSubmitted(terms.trim());

  return <Card className="border-cyan-100 bg-white shadow-sm">
    <CardHeader className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><CardTitle className="flex items-center gap-2"><Search className="h-5 w-5 text-cyan-700" />بحث ICD-10-CM المرجعي</CardTitle><p className="mt-1 text-sm text-slate-500">بحث مساعد باللغة الإنجليزية في مصدر NLM الأمريكي، دون اعتماد تلقائي للتشخيص أو الفوترة.</p></div>
        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">مرجع فقط · US</Badge>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row"><Input value={terms} onChange={event => setTerms(event.target.value)} onKeyDown={event => { if (event.key === "Enter") submit(); }} placeholder="Search diagnosis or code…" aria-label="بحث ICD-10-CM" /><Button onClick={submit} disabled={terms.trim().length < 2 || query.isFetching} className="bg-[#0d1b2a]">{query.isFetching ? "جارٍ البحث…" : "بحث"}</Button></div>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-start gap-2 rounded-xl border border-cyan-100 bg-cyan-50/60 p-3 text-xs leading-5 text-cyan-950"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" /><span>المصدر: NLM Clinical Table Search Service · ICD-10-CM 2026. النتائج إرشادية ولا تغيّر ملف المريض أو المطالبة أو قيمة الفاتورة.</span></div>
      {query.isError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">تعذر الوصول إلى المصدر المرجعي حالياً. لم يتم حفظ أي نتيجة.</p>}
      {query.isFetching && <p className="text-sm text-slate-500" aria-live="polite">جارٍ التحقق من المصدر المرجعي…</p>}
      {!query.isFetching && submitted.length >= 2 && query.data?.results.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">لا توجد نتائج مطابقة في مصدر NLM.</p>}
      {query.data?.results.length ? <div className="space-y-2">{query.data.results.map(item => <div key={item.code} className="rounded-xl border border-slate-200 p-3"><div className="flex flex-wrap items-start justify-between gap-2"><p className="font-semibold text-slate-900">{item.code}</p><Badge variant="secondary">{item.version} · {item.jurisdiction}</Badge></div><p className="mt-1 text-sm text-slate-700">{item.description}</p></div>)}</div> : null}
    </CardContent>
  </Card>;
}
