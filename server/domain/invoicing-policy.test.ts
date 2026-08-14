import { describe, expect, it } from "vitest";
import { assertInvoiceCatalogScope, requireInvoiceIntegration, validateInvoiceDocument, type InvoiceAdapter } from "./invoicing-policy";

const adapter: InvoiceAdapter = { countryCode: "SA", submit: async () => ({ externalId: "x", status: "submitted" }) };
const rules = { invoicing: { integration: true, endpoint: "https://official.example/invoice" } } as const;

describe("invoicing policy", () => {
  it("rejects a missing verified country adapter", () => {
    expect(() => requireInvoiceIntegration(rules, "SA")).toThrow(/adapter/);
    expect(() => requireInvoiceIntegration(rules, "EG", adapter)).toThrow(/adapter/);
  });

  it("accepts only a country-matched adapter and a reconciled document", () => {
    expect(requireInvoiceIntegration(rules, "SA", adapter).endpoint).toContain("official");
    expect(validateInvoiceDocument({ invoiceNumber: "INV-1", currencyCode: "SAR", subtotal: 100, discountAmount: 7, totalAmount: 93, items: [{ sku: "A", quantity: 1, unitPrice: 100 }] }).totalAmount).toBe(93);
  });

  it("rejects an unreconciled invoice", () => {
    expect(() => validateInvoiceDocument({ invoiceNumber: "INV-1", currencyCode: "SAR", subtotal: 100, discountAmount: 7, totalAmount: 94, items: [{ sku: "A", quantity: 1, unitPrice: 100 }] })).toThrow(/reconcile/);
  });

  it("requires matching jurisdiction, organization, approval, and evidence for invoice catalog use", () => {
    const valid = { jurisdictionId: 1, organizationId: 7, catalogJurisdictionId: 1, catalogOrganizationId: 7, catalogVerificationStatus: "approved" as const, verifiedEvidenceCount: 1 };
    expect(assertInvoiceCatalogScope(valid)).toBe(true);
    expect(() => assertInvoiceCatalogScope({ ...valid, catalogOrganizationId: 8 })).toThrow(/outside/);
    expect(() => assertInvoiceCatalogScope({ ...valid, catalogVerificationStatus: "pending" })).toThrow(/approved/);
    expect(() => assertInvoiceCatalogScope({ ...valid, verifiedEvidenceCount: 0 })).toThrow(/evidence/);
  });

  it("rejects invoice catalog scope without tenant or jurisdiction", () => {
    expect(() => assertInvoiceCatalogScope({ jurisdictionId: null, organizationId: 7, catalogJurisdictionId: null, catalogOrganizationId: 7, catalogVerificationStatus: "approved", verifiedEvidenceCount: 1 })).toThrow(/scope/);
  });
});
