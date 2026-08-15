import { TRPCError } from "@trpc/server";

export const NLM_ICD10CM_ENDPOINT = "https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search";
export const NLM_ICD10CM_SOURCE = "NLM Clinical Table Search Service – ICD-10-CM";
export const NLM_ICD10CM_VERSION = "2026";
export const NLM_ICD10CM_JURISDICTION = "US";

export type NlmIcd10Result = {
  code: string;
  description: string;
  source: typeof NLM_ICD10CM_SOURCE;
  version: typeof NLM_ICD10CM_VERSION;
  jurisdiction: typeof NLM_ICD10CM_JURISDICTION;
  sourceUrl: string;
};

function assertSearchTerms(terms: string) {
  const normalized = terms.trim().replace(/[\u0000-\u001f\u007f]/g, "");
  if (normalized.length < 2 || normalized.length > 120) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "أدخل كلمتين على الأقل للبحث المرجعي." });
  }
  return normalized;
}

export async function searchNlmIcd10Cm(terms: string, options: { count?: number; signal?: AbortSignal } = {}): Promise<NlmIcd10Result[]> {
  const normalized = assertSearchTerms(terms);
  const count = Math.max(1, Math.min(options.count ?? 20, 50));
  const url = new URL(NLM_ICD10CM_ENDPOINT);
  url.searchParams.set("terms", normalized);
  url.searchParams.set("count", String(count));
  url.searchParams.set("offset", "0");
  url.searchParams.set("df", "code,name");
  url.searchParams.set("sf", "code,name");
  url.searchParams.set("ef", "code,name");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  const onAbort = () => controller.abort();
  options.signal?.addEventListener("abort", onAbort, { once: true });
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    if (!response.ok) throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "خدمة البحث المرجعي غير متاحة حالياً." });
    const payload: unknown = await response.json();
    if (!Array.isArray(payload) || !Array.isArray(payload[3])) throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "تعذر التحقق من استجابة المصدر المرجعي." });
    return payload[3].slice(0, count).flatMap((row: unknown) => {
      if (!Array.isArray(row) || typeof row[0] !== "string" || typeof row[1] !== "string") return [];
      return [{ code: row[0], description: row[1], source: NLM_ICD10CM_SOURCE, version: NLM_ICD10CM_VERSION, jurisdiction: NLM_ICD10CM_JURISDICTION, sourceUrl: NLM_ICD10CM_ENDPOINT }];
    });
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "تعذر الوصول إلى خدمة البحث المرجعي؛ حاول لاحقاً." });
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener("abort", onAbort);
  }
}
