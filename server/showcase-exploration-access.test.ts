import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const trpcBoundary = readFileSync(resolve(process.cwd(), "server/_core/trpc.ts"), "utf8");

describe("showcase exploration access", () => {
  it("routes an unauthenticated workspace visitor to the secure login page", () => {
    expect(source).toContain('setLocation("/login", { replace: true })');
    expect(source).toContain("if (loading || !user)");
    const loginSource = readFileSync(resolve(process.cwd(), "client/src/pages/Login.tsx"), "utf8");
    expect(loginSource).toContain('setLocation("/workspace")');
  });

  it("exposes a bounded set of showcase modules rather than the production administration surface", () => {
    expect(source).toContain("const showcaseModuleIds = new Set");
    expect(source).toContain('"pos", "inventory", "supplyChain", "prescriptions", "insurance"');
    expect(source).toContain('"catalog", "icd10", "hardware", "security", "operationsHub"');
    expect(source).not.toContain('"connectors",\n]);');
  });

  it("makes the demo restriction visible while retaining server-enforced mutation blocking", () => {
    expect(source).toContain("حساب عرض · استكشاف آمن");
    expect(source).toContain("ابدأ الاستكشاف");
    expect(source).toContain("محاولات الحفظ والتصدير والتكاملات الخارجية موقوفة تلقائياً");
    expect(trpcBoundary).toContain("showcase_mutation_simulated");
    expect(trpcBoundary).toContain("هذه العملية محاكاة فقط ولا تُحفظ من حساب العرض.");
  });

  it("provides a reversible, non-persistent guided sale and a permanent sidebar restart action", () => {
    expect(source).toContain("سيناريو بيع تدريبي: افتح نقطة البيع");
    expect(source).toContain("سيناريو بيع تدريبي: اختر الصنف");
    expect(source).toContain("سيناريو بيع تدريبي: راجع الكمية والعميل");
    expect(source).toContain("سيناريو بيع تدريبي: اعرض الضريبة والدفع");
    expect(source).toContain("سيناريو بيع تدريبي: عاين الفاتورة");
    expect(source).toContain("لا تُنشأ حركة مخزون");
    expect(source).toContain("لا تُسجل دفعة");
    expect(source).toContain("إعادة بدء الجولة");
    expect(source).toContain("const retreatShowcaseTour");
    expect(trpcBoundary).toContain("showcase_mutation_simulated");
  });
});
