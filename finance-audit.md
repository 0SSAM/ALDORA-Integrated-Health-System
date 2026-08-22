# MEDORA Finance & Reporting Audit - Aug 2026

## Current Status
- **Reports Module**: Exists but focuses on infrastructure (scheduling, definitions, runs). Supports:
  - Inventory Alerts
  - Daily Sales
  - Compliance & Expiry
  - Operations Summary
- **Invoicing**: Robust local tax invoice engine with VAT calculation, credit notes (returns), and branch-scoped branding templates.
- **Accounting Primitives**: Minimal `validateFinanceEntry` helper exists in `server/domain/erp.ts`, but no general ledger, journal entries, or financial statements (P&L, Balance Sheet) are implemented in the data model or UI.
- **Payroll**: Readiness gate exists, but no calculation or payment logic is implemented.
- **Insurance**: Remittance tracking and reconciliation blobs are defined in the schema but not fully exposed in the UI beyond draft claim creation.

## Identified Gaps
1. **Missing Financial Statements**: No Balance Sheet, P&L, or Cash Flow reports.
2. **Missing General Ledger**: No double-entry accounting persistence.
3. **Navigation**: Finance is combined with Reports under a single "Finance & Reports" module.
4. **Dashboard Metrics**: Financial metrics (Daily Sales, Inventory Value) are currently placeholders ("—").

## Enhancement Plan
1. **Expose Financial Modules**: Split "Finance & Reports" into dedicated "Accounting & Finance" and "Business Intelligence & Reports".
2. **Implement Financial Dashboards**: Create a dedicated Finance Workspace with real-time (simulated) financial health metrics.
3. **Expand Reporting**: Add placeholders/logic for P&L and Balance Sheet within the Reports Workspace.
4. **Improve UI**: Add Arabic/English financial reporting sections.
