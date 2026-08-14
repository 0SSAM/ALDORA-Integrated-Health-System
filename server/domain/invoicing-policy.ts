import { requireRegionalRule, type RegionalRuleSet } from "./regional-rules";

export type InvoiceDocument = {
  invoiceNumber: string;
  currencyCode: string;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  items: Array<{ sku: string; quantity: number; unitPrice: number }>;
};

export type InvoiceAdapter = {
  countryCode: string;
  submit: (document: InvoiceDocument) => Promise<{ externalId: string; status: "submitted" | "accepted" | "rejected" }>;
};

export function requireInvoiceIntegration(rules: RegionalRuleSet, countryCode: string, adapter?: InvoiceAdapter) {
  const configured = requireRegionalRule(rules, "invoicing", "integration");
  if (configured !== true) throw new Error("Regional e-invoicing integration is not enabled by the approved pack");
  const endpoint = requireRegionalRule(rules, "invoicing", "endpoint");
  if (typeof endpoint !== "string" || endpoint.length < 1) throw new Error("Regional e-invoicing endpoint is missing");
  if (!adapter || adapter.countryCode !== countryCode) throw new Error("No verified e-invoicing adapter is registered for this country");
  return { endpoint, adapter };
}

export function validateInvoiceDocument(document: InvoiceDocument) {
  if (!document.invoiceNumber.trim() || !document.currencyCode.trim()) throw new Error("Invoice identity is incomplete");
  if (![document.subtotal, document.discountAmount, document.totalAmount].every(value => Number.isFinite(value) && value >= 0)) throw new Error("Invoice amounts must be finite and non-negative");
  if (document.totalAmount !== Number((document.subtotal - document.discountAmount).toFixed(2))) throw new Error("Invoice total does not reconcile");
  if (!document.items.length || document.items.some(item => !item.sku.trim() || !Number.isFinite(item.quantity) || item.quantity <= 0 || !Number.isFinite(item.unitPrice) || item.unitPrice < 0)) throw new Error("Invoice items are invalid");
  return document;
}
