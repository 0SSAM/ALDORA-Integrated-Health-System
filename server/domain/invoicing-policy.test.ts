import { describe, expect, it } from "vitest";
import { requireInvoiceIntegration, validateInvoiceDocument, type InvoiceAdapter } from "./invoicing-policy";

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
});
