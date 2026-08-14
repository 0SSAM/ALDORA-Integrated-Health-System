# Project TODO

- [ ] Analyze all supplied BDF source files, exports, HTML references, archive contents, and APK metadata.
- [ ] Define the cross-platform delivery model for iPhone, Android, and Windows as a responsive installable web application/PWA with a documented native-wrapper path if needed.
- [ ] Implement secure authentication with protected routes and four roles: admin, pharmacist, cashier, and manager.
- [ ] Enforce role permissions in server procedures and UI navigation without relying only on client-side checks.
- [ ] Implement POS sales workflow with fractional unit dispensing.
- [ ] Implement FEFO inventory deduction consistently for POS, returns, transfers, damaged goods, compounding, and insurance dispensing.
- [ ] Implement MOH pricing validation with an immutable 7% maximum discount cap and server-side tests.
- [ ] Implement ETA fiscal receipt and e-invoicing data workflow with auditable statuses.
- [ ] Implement inventory management with batches, expiry dates, reorder points, multi-branch stock, transfers, returns, damaged goods, and expiry alerts.
- [ ] Implement cold-chain monitoring data model and dashboard indicators.
- [ ] Implement insurance contracts, pre-authorization, claims, rejection reports, aging reports, monthly billing, and TPA provider configuration for at least 25 providers.
- [ ] Implement Egyptian compliance workspaces for EDA, ETA, MOH, NFSA, UHIA, syndicate license verification, and legal labels with QR/barcode fields.
- [ ] Implement compounding formulations, BOM auto-deduction, sterile preparation tracking, costing, pricing, and liability logs.
- [ ] Implement HR employee management, labor-law shift calculations, Ramadan hours, overtime, leave management, and payroll processing.
- [ ] Implement finance ledger, tax validation, cash-flow monitoring, financial reports, and payment gateway integration boundaries for InstaPay and Meeza.
- [ ] Implement multi-branch dashboard with sales, inventory, insurance KPIs, BI charts, smart alerts, and tamper-evident audit hash records.
- [ ] Implement prescription image upload and server-side built-in LLM vision extraction for drug names, dosages, quantities, and confidence/verification state.
- [ ] Ensure prescription AI results require pharmacist confirmation before dispensing and never silently create a sale.
- [ ] Implement customer/patient records and chronic-care tracking with access control and auditability.
- [ ] Implement daily scheduled inventory and expiry scan using platform-managed Heartbeat at a documented UTC schedule.
- [ ] Scope scheduled push notifications to branch managers only and make the scheduled handler idempotent.
- [ ] Add schema migrations and database verification for all business entities.
- [ ] Add unit and integration tests for authentication, role guards, discount cap, FEFO, claims, payroll, AI extraction validation, audit logging, and scheduled handler authorization.
- [ ] Run type checks, build checks, Vitest, and browser flow verification.
- [ ] Verify responsive behavior for desktop Windows and mobile viewport layouts.
- [ ] Review security controls, error handling, sensitive-data exposure, upload validation, and audit trails.
- [ ] Document setup, roles, operational workflows, regulatory assumptions, deployment, backups, and known integration prerequisites.
- [ ] Prepare the final checkpoint and user-facing delivery summary.

- [x] Create a verifiable source-analysis document covering the HTML references, SPASS payload, APK metadata, archive, and source-quality limitations.
- [x] Create a documented cross-platform architecture and delivery model covering PWA installability, offline boundaries, security, integrations, and native-wrapper deferral.

- [x] Add a documented PWA manifest and service-worker shell for installability across supported browsers.
- [x] Add server-side policy functions and tests for roles, the immutable 7% discount cap, FEFO deduction, and inventory alerts.
- [x] Add database schema and migrations for branches, branch users, products, inventory batches, sales, sale items, audit logs, scheduled jobs, and branch alert queue.
- [x] Add typed tRPC procedures for discount validation, FEFO planning, and built-in vision-model prescription extraction with pharmacist-review status.
- [x] Add an authenticated Heartbeat callback endpoint for daily inventory/expiry alert queueing by branch manager.
- [x] Run TypeScript checks and Vitest successfully after the implemented vertical slice.
