# Project TODO

- [x] Analyze all supplied BDF source files, exports, HTML references, archive contents, and APK metadata.
- [x] Define the cross-platform delivery model for iPhone, Android, and Windows as a responsive installable web application/PWA with a documented native-wrapper path if needed.
- [x] Implement secure authentication with protected routes and four roles: admin, pharmacist, cashier, and manager.
- [x] Enforce role permissions in implemented server procedures and UI navigation without relying only on client-side checks.
- [x] Implement POS sales foundation with fractional unit planning, server validation, and FEFO allocation; final fiscal settlement remains integration-gated.
- [x] Implement and test FEFO deduction adapters for inventory operations beyond POS; current selector now covers transfer/return/damaged/insurance adjustment planning.
- [x] Implement MOH pricing validation with an immutable 7% maximum discount cap and server-side tests.
- [x] Implement ETA invoice field validation and auditable pending/submission status foundation; live ETA credentials and submission endpoint remain production prerequisites.
- [x] Implement core inventory batch, expiry, reorder-point, multi-branch, alert, and FEFO schema foundation; transfer/return/damage screens remain integration backlog.
- [x] Add explicit cold-chain monitoring rule coverage and document the dashboard/sensor integration boundary; sensor connector remains a production prerequisite.
- [x] Add verifiable insurance aging classification helper logic and tests alongside the validated 25-provider TPA catalog.
- [x] Add verifiable QR/barcode/legal-label fields and compliance-boundary helper coverage for EDA/ETA/MOH/NFSA/UHIA/syndicate workflows.
- [x] Implement and test compounding costing/pricing and BOM/liability rule foundation; sterile persistence remains a production backlog item.
- [x] Implement payroll, night-shift, Ramadan-hours, overtime, and employee-role rule foundations with tests; employee/leave persistence remains a production backlog item.
- [x] Add verifiable finance tax-validation and balanced cash-flow rule helper/tests plus InstaPay/Meeza integration boundary documentation.
- [x] Implement multi-branch dashboard shell, KPI empty states, smart alert queue foundation, and tamper-evident audit hash helpers; live BI aggregation awaits operational data.
- [x] Implement prescription image upload and server-side built-in LLM vision extraction for drug names, dosages, quantities, and confidence/verification state.
- [x] Ensure prescription AI results require pharmacist confirmation before dispensing and never silently create a sale.
- [x] Add a verifiable customer/patient record-boundary helper with consent, access-control, auditability, and chronic-care safeguards.
- [x] Implement daily scheduled inventory and expiry scan using platform-managed Heartbeat at a documented UTC schedule.
- [x] Scope scheduled alert queueing to branch managers only and make the scheduled handler idempotent; push provider connection remains a production prerequisite.
- [x] Add and apply non-destructive migrations for implemented core business entities and verify database connectivity; remaining production backlog entities are documented.
- [x] Add explicit schedule-policy and authorization unit coverage in addition to the existing test suites.
- [x] Run type checks, build checks, Vitest, and browser flow verification for the implemented vertical slice.
- [x] Verify responsive behavior for desktop Windows and mobile viewport layouts.
- [x] Review security controls, error handling, sensitive-data exposure, upload validation, and audit trails for the implemented vertical slice.
- [x] Document setup, roles, operational workflows, regulatory assumptions, deployment, backups, and known integration prerequisites.
- [x] Prepare the final checkpoint and user-facing delivery summary.

- [x] Create a verifiable source-analysis document covering the HTML references, SPASS payload, APK metadata, archive, and source-quality limitations.
- [x] Create a documented cross-platform architecture and delivery model covering PWA installability, offline boundaries, security, integrations, and native-wrapper deferral.

- [x] Add a documented PWA manifest and service-worker shell for installability across supported browsers.
- [x] Add server-side policy functions and tests for roles, the immutable 7% discount cap, FEFO deduction, and inventory alerts.
- [x] Add database schema and migrations for branches, branch users, products, inventory batches, sales, sale items, audit logs, scheduled jobs, and branch alert queue.
- [x] Add typed tRPC procedures for discount validation, FEFO planning, and built-in vision-model prescription extraction with pharmacist-review status.
- [x] Add an authenticated Heartbeat callback endpoint for daily inventory/expiry alert queueing by branch manager.
- [x] Run TypeScript checks and Vitest successfully after the implemented vertical slice.

- [x] Add deterministic payroll, ETA-field validation, insurance claim classification, 25-provider TPA catalog, and tamper-evident audit hash helpers with tests.
- [x] Verify desktop and mobile viewport rendering with preview screenshots.
- [x] Document Egyptian regulatory integration boundaries and production prerequisites without fabricating approvals or payment responses.
- [x] Run a successful production build for the current vertical slice.
- [x] Document operational setup, scheduled callback behavior, release gates, and integration prerequisites.
- [x] Add contextual workspace panels for POS, inventory, prescriptions, insurance, compliance, compounding, finance, and people modules.
- [x] Re-run TypeScript and Vitest successfully after the workspace UI change.
- [x] Add a protected schedule mutation that creates or reuses the daily inventory Heartbeat task and persists its task UID.
- [x] Re-run TypeScript and Vitest successfully after adding schedule creation.
- [x] Implement a real prescription upload experience with client file selection, server validation, storage upload, intake persistence, and built-in vision extraction wiring.
- [x] Add a server-enforced dispensing guard requiring CONFIRMED pharmacist status before the dispensing workflow can proceed.
- [x] Verify the prescription workspace interactively in the browser and confirm the file input accepts only JPEG/PNG/WEBP.
- [x] Add a security review report covering auth, roles, uploads, errors, sensitive data, auditability, and production release blockers.
- [x] Add explicit unit coverage for prescription confirmation and invalid upload MIME/size cases.
- [x] Re-run TypeScript, Vitest, and production build successfully after the security fixes.
- [x] Make dashboard/module navigation role-aware for unauthenticated users and the four configured roles.
- [x] Add role-matrix tests proving cashier denial on prescriptions and finance, plus pharmacist/manager access cases.
- [x] Re-run TypeScript, Vitest, production build, and desktop preview after the role-navigation change.
- [x] Implement a server-side POS preparation workflow for fractional quantities, immutable MOH discount cap enforcement, FEFO allocation, and pending ETA status.
- [x] Add unit coverage for fractional POS planning, cross-batch FEFO allocation, and discount rejection.
- [x] Re-run TypeScript, Vitest, and production build successfully after the POS workflow change.
- [x] Expose the fractional POS/FEFO preparation workflow through a protected typed tRPC procedure.
- [x] Re-run TypeScript, Vitest, and production build successfully after adding the POS procedure.
- [x] Add explicit cold-chain monitoring content to the operations runbook, including sensor identity, signed readings, timestamps, branch, batch, and escalation requirements.
- [x] Add authority-specific artifact boundary documentation for EDA, ETA, MOH, NFSA, UHIA, and syndicate workflows, including QR/barcode legal-label fields.
- [x] Add and test compounding BOM deduction and pharmacist-approved liability helpers.
- [x] Re-run TypeScript, Vitest, and production build successfully after the final domain-rule additions.

# Expansion TODO — Customer Care, Call Centre, Catalogs, AI Review, Offline

- [x] Add the implemented customer/patient care module foundation with profiles, consent, chronic-care boundary, auditable interactions, and safe empty states; advanced workflow automation remains extensible.
- [x] Add the implemented call-centre module foundation with inbound/outbound tickets, callback/priority/disposition/escalation fields, and recording metadata boundary.
- [x] Add a server-side AI-review safety foundation with human-approval gates, explainable findings, audit-ready outcomes, and safe fallback when the model is unavailable; live continuous orchestration remains a production integration step.
- [x] Improve the implemented UI with Arabic-first labels, friendly contextual workspaces, responsive controls, role-aware navigation, and explicit loading/empty/error states.
- [x] Add a local offline draft queue with idempotent identifiers and a server policy that blocks regulated work without online confirmation; full conflict-aware sync UI remains a production integration step.
- [x] Identify and document authoritative Egyptian catalog-source boundaries, provenance, licensing, and refresh prerequisites without fabricating a downloadable national database.
- [x] Add catalog models for medicines, cosmetics, and medical supplies with provenance, verification status, source identifiers, and searchable categories.
- [x] Add authorized item creation with role guard, duplicate/SKU checks, pending review status, provenance, and audit/sync record.
- [x] Add tests for AI review safety, regulated-operation blocking, catalog provenance, authorized item policy, and the implemented customer-care/call-centre procedures.
- [x] Verify responsive UX in desktop and mobile preview; verify offline draft policy and regulated-operation blocking through automated tests, while full conflict-aware sync remains a production integration step.
- [x] Add protected customer-care procedures for profiles, consent, chronic-care boundary, and auditable interactions.
- [x] Add protected call-centre procedures for inbound/outbound tickets, priority, callbacks, disposition, assignment, and escalation fields.
- [x] Add catalog tables for medicines, cosmetics, and medical supplies with provenance, verification status, source identifiers, and searchable categories.
- [x] Add authorized catalog-item creation and approval workflow with role guard and idempotent sync queue record.
- [x] Add customer-care, call-centre, and catalog UI workspaces with clear empty/loading/error states and mobile-friendly controls.
- [x] Run TypeScript, Vitest, and production build successfully after the customer-care, call-centre, catalog, and authorized-item changes.

# Shared Review Links TODO

- [x] Attempt to open and review the Claude shared conversation; content was unavailable in the current browser session.
- [x] Attempt to open and review the Grok shared conversation; only the page title was available in the current browser session.
- [x] Record that no concrete requirements could be safely extracted because both shared pages exposed no conversation text.
- [x] Compare the available evidence with the current BDF system; no verified proposal was available for implementation.
- [x] Avoid unverified changes and add a documented shared-link review report.
- [x] Run TypeScript, 19 Vitest tests, and production build for the review-driven documentation change; no UI code changed, so no new responsive regression was introduced.
- [x] Save a review-driven checkpoint and report exact additions and remaining prerequisites.

# Multi-country Arabic Expansion TODO

- [x] Define supported-country configuration model with country code, legal authority profile, currency, tax profile, timezone, locale, language, date/number formats, and branch jurisdiction.
- [x] Implement branch geolocation capture with explicit admin confirmation and a manual override; never infer legal jurisdiction from IP alone.
- [x] Separate shared ERP rules from versioned country compliance packs with activation date, source URL, owner, status, and expiry/review date.
- [x] Add country-aware tax, invoicing, pricing, prescription, controlled-medicine, labeling, insurance, payroll, and reporting rule interfaces.
- [x] Add Arabic localization architecture with RTL, country-specific terminology, currencies, calendars, numerals, and fallback translations.
- [x] Add country-aware offline policy, sync conflict rules, and safeguards against using stale regulatory rules.
- [x] Add admin workflow for legal-pack review, approval, rollback, and audit history.
- [x] Research and document authoritative regulatory sources for the initial Arabic-country coverage; do not fabricate legal rules or claim legal certification.
- [x] Add country, jurisdiction, rule-version, stale-rule, and geolocation override tests.
- [x] Run TypeScript, Vitest, and production build for the multi-country changes; responsive verification remains a final release check.
- [x] Save a multi-country checkpoint and report supported scope and legal prerequisites.

# Per-country Data Isolation Clarification

- [x] Create a country data-boundary model enumerating medicine, cosmetic, medical-supply, authority, tax, invoice, price, prescription, insurance, payroll, and label records, requiring both jurisdiction profile and organization scope; query enforcement remains tracked separately.
- [x] Add explicit per-country catalog provenance and refresh metadata; never merge records across countries without a controlled mapping.
- [x] Add per-country regulatory pack lifecycle with approval, effective dates, stale detection, rollback, and audit history.
- [x] Add branch-to-country assignment with admin confirmation/manual override and deny regulated transactions when jurisdiction is missing or stale in implemented POS/prescription paths.
- [ ] Add cross-country isolation tests for catalog search, pricing, tax, prescription, and compliance procedures, including persisted-record denial.

# Comprehensive Country Compliance Requirement

- [ ] Verify each enabled country has an independent, source-linked compliance pack covering pharmacy licensing, medicines, cosmetics, medical supplies, controlled substances, prescriptions, dispensing, pricing, tax, e-invoicing, insurance, payroll, privacy, retention, localization, timezone, and audit requirements.
- [x] Ensure no country is represented as fully compliant when its official rules or authoritative catalog sources have not been verified and approved.
- [x] Add stale-pack blocking and mandatory human/regulatory approval before regulated transactions use a new country rule set.
- [x] Add an evidence registry linking every active rule and catalog field to an official authority source, effective date, review date, and responsible approver.

# Remaining Compliance Hardening

- [x] Add explicit language and legal-authority-profile fields to jurisdiction configuration and enforce them in Regional Engine validation.
- [x] Update regional registry readiness so a country is only configured with an approved, non-stale pack and verified evidence for enabled rule keys.
- [x] Enforce evidence linkage for every active catalog field before catalog approval and regulated sale use; other regulated consumers remain tracked separately.
- [x] Add unit coverage for country code normalization, profile completeness, approval, stale-pack blocking, missing evidence, and cross-country access denial.
- [x] Block stale or unapproved packs in the Regional Engine before regulated operations.

# Enforcement Coverage Follow-up

- [ ] Apply branch-jurisdiction and compliance-pack gating to prescription upload/dispensing, invoice, insurance, payroll, reporting, and inventory mutation entry points, not only POS preparation and catalog approval.
- [ ] Require catalog evidence validation again at downstream regulated use when a product is loaded for sale, prescription, dispensing, or invoice-numbered sale generation; commitSale enforces the sale path, while prescription/dispensing product matching and standalone invoice procedures do not yet exist.
- [x] Add server-side POS branch gate requiring an administrator-confirmed or documented manual-override assignment and a current approved pack with verified evidence.
- [x] Expand catalog approval evidence to all supported non-empty catalog fields plus jurisdiction-pack-specific required fields.

# Prescription Jurisdiction Enforcement

- [x] Add nullable branchId and jurisdictionId to prescription_intakes through non-destructive migration 0009.
- [x] Require a branch identifier and approved current prescription compliance pack before prescription upload.
- [x] Require the same branch-bound pack before prescription extraction and dispensing; reject legacy or unbound intake records.
- [x] Disable the legacy direct image extraction path because it cannot prove jurisdiction context.
- [ ] Apply equivalent gates to any future invoice, insurance, payroll, reporting, and inventory mutation procedures as those entry points are wired to the database.
- [ ] Add invoice-generation or invoice-persistence procedures that revalidate catalog evidence and composite jurisdiction/organization scope before creating regulated invoice records.
- [ ] Add tests proving invoice paths reject missing verified catalog evidence or mismatched jurisdiction/organization scope.

# Core Operational Data Boundary

- [x] Add nullable jurisdictionId to inventory_batches and sales schema; apply non-destructive migration 0010 for inventory batches.
- [x] Populate jurisdictionId from the confirmed branch assignment in the implemented inventory and sale write paths before allowing regulated persistence.
- [ ] Add database/query tests proving products, batches, sales, prescriptions, and catalog records cannot cross jurisdiction boundaries.

# Jurisdiction Record Policy

- [x] Add reusable server policy for product, inventory batch, sale, prescription, and catalog jurisdiction-bound records.
- [x] Add unit tests for same-country acceptance, cross-country rejection, null legacy records, and invalid jurisdiction context.
- [x] Integrate the record policy into implemented database reads/writes rather than relying only on isolated policy tests; the static audit and router contracts cover the current product, batch, sale, prescription, and catalog paths, while future modules remain gated until wired.

# Boundary Integration Coverage

- [x] Re-check prescription intake jurisdictionId against the confirmed branch assignment during extraction.
- [x] Re-check prescription intake jurisdictionId against the confirmed branch assignment during dispensing.
- [x] Apply the same record-boundary policy to implemented catalog, inventory-batch, and sale reads/writes; future invoice/insurance/payroll/report procedures remain explicitly pending until their database entry points exist.

# Catalog Query Boundary

- [x] Require an active complete jurisdiction profile for catalog search.
- [x] Require an active complete jurisdiction profile for catalog creation.
- [x] Require an active complete jurisdiction profile plus current approved pack and verified evidence for catalog approval.
- [x] Re-check catalog jurisdiction and evidence when a catalog item is consumed by prescription, dispensing, or the implemented invoice-numbered commitSale workflow; a separate invoice workflow is not present.

# Batch Boundary Enforcement

- [x] Require jurisdictionId on FEFO batch inputs.
- [x] Reject any POS batch whose jurisdiction differs from the confirmed branch jurisdiction.
- [x] Add and gate a persisted inventory/sale write transaction that stores the branch jurisdictionId rather than returning only a prepared sale preview.

# Persisted Sale Boundary

- [x] Add protected commitSale transaction that validates branch assignment, approved sale pack, product jurisdiction, batch branch/jurisdiction, discount cap, stock, and persists sales/sale_items with jurisdictionId.
- [x] Decrement inventory batch quantity within the same database transaction as the sale write.
- [ ] Add country-specific e-invoicing submission/acknowledgement adapters only after each jurisdiction pack supplies verified technical requirements and credentials.

# E-Invoicing Safety Contract

- [x] Add a country-neutral invoicing policy that requires an approved pack rule, official endpoint, country-matched adapter, and reconciled invoice document.
- [x] Add unit tests for missing integration, country mismatch, and total reconciliation.
- [ ] Register and integrate a real adapter per country only after official technical specifications, credentials, and acceptance testing are supplied.

# Frontend Localization Integration

- [x] Wrap the application in LocalizationProvider and apply document language/direction and data-country.
- [x] Apply dynamic direction and country/currency display in the main Home workspace.
- [x] Avoid defaulting the UI to Egypt; use an unset country until a verified branch jurisdiction is selected.
- [x] Drive the provider from the authenticated branch jurisdiction registry instead of localStorage; keep UNSET until an active assigned branch profile is returned by the server.

# Offline Safety Foundation

- [x] Add a country-aware offline decision policy that allows only non-regulated drafts offline and blocks sale, inventory mutation, prescription, and invoice operations.
- [x] Add conflict resolution policy requiring manual review instead of silent overwrite.
- [x] Wire the offline policy into the PWA queue/service worker and visible sync-status UI; regulated requests remain blocked offline.

# PWA Offline Integration

- [x] Update the Service Worker to reject regulated non-GET requests offline and preserve app-shell fallback.
- [x] Add visible online/offline status to Home and request sync status from the Service Worker.
- [x] Implement a durable IndexedDB draft queue with idempotency keys and manual conflict review UI for non-regulated drafts.

# Durable Offline Draft Queue

- [x] Persist non-regulated drafts in IndexedDB with a localStorage fallback and stable idempotency keys.
- [x] Store auditable queued/conflict/failed status metadata and expose durable listing and conflict marking helpers.
- [x] Connect draft replay to authenticated server procedures with explicit idempotency validation; the visible review/removal panel is implemented.

# Authenticated Draft Replay

- [x] Add a server-side offline_drafts idempotency ledger with authenticated ownership, module allow-list, payload, status, and conflict metadata.
- [x] Add protected tRPC procedures to submit/replay only customer-care and call-centre drafts; reject regulated modules and duplicate keys deterministically.
- [x] Connect the visible draft panel to authenticated replay and refresh the local queue only after server acknowledgement.

# Compliance Evidence Lifecycle Completion

- [x] Add protected admin procedures to verify or reject compliance evidence and record verifier identity/date.
- [x] Add protected audit-history listing for compliance_rule_audits and evidence review history where available.
- [ ] Add end-to-end lifecycle tests covering create pack, add evidence, verify evidence, approve, stale blocking, rollback, and audit visibility.

# Evidence Governance Verification

- [x] Connect the tested compliance lifecycle policy to approvePack and rollbackPack router mutations.
- [x] Restrict audit-history listing to admin users and return reviewer timestamp consistently for evidence decisions.
- [ ] Add an integration test harness that exercises the actual protected router lifecycle against a test database.

# Product-to-Catalog Evidence Link

- [x] Add nullable catalogItemId to products with a non-destructive migration for legacy rows.
- [x] Require an approved verified catalog item and current evidence when a linked product is consumed by commitSale.
- [x] Add tests for linked verified products, rejected/unverified catalog records, and legacy unlinked product behavior.

# Catalog Consumption Verification

- [x] Add and apply product-to-catalog evidence policy at regulated sale consumption.
- [x] Add unit coverage for linked verified products, rejected/unverified catalog records, jurisdiction mismatch, and legacy unlinked products.
- [x] Re-run TypeScript, 49 Vitest tests, and production build successfully.

# Regional Administration UI

- [x] Add an admin-only regional administration panel for profile status, pack versions, evidence status, approve/rollback, and audit history.
- [x] Ensure non-admin users see read-only readiness and legal-prerequisite status without mutation controls.
- [x] Verify the panel compiles and renders its safe unauthenticated loading state; authenticated admin/non-admin browser-flow coverage remains a release follow-up.

# Catalog Consumption Evidence Hardening

- [x] Apply assertConsumableCatalogContext in commitSale so every active catalog field requires verified evidence at regulated sale use.
- [x] Add regression coverage for a sale rejected when a non-empty active catalog field lacks verified evidence.

# Prescription Confirmation Boundary Hardening

- [x] Re-check the assigned branch, jurisdiction record, approved current prescription pack, and pack usability before confirming a prescription.
- [ ] Add equivalent database-backed gates to future invoice, insurance, payroll, and reporting procedures when those persistence entry points are implemented.

# Server Jurisdiction Access Hardening

- [x] Require non-admin catalog and regulated branch operations to match an active branch membership before reading or writing jurisdiction-scoped records.
- [x] Add unit coverage for rejecting a jurisdiction request that is not assigned to the authenticated user.

# Prescription Membership Boundary Extension

- [x] Require active authenticated branch membership for prescription upload, extraction, confirmation, and dispensing paths.
- [ ] Add equivalent membership and pack gates to invoice, insurance, payroll, and reporting persistence paths when implemented.

# Customer Care and Call Centre Branch Isolation

- [x] Scope customer-care and call-centre reads and writes to active branches assigned to the authenticated user; reject new unbound records for non-admin users.
- [x] Add unit coverage for branch-scoped customer-care and call-centre access policy.

# ALDO Ownership and Brand Protection

- [x] Rename the product-facing system identity to ALDO Health Care Eco System across app metadata, title, and visible brand surfaces.
- [x] Add a discreet ownership notice using the owner-provided professional name without exposing phone, email, address, CV, or other personal contact data.
- [x] Add copyright and provenance metadata to the repository, generated app metadata, and project ownership documentation without weakening security or licensing clarity.
- [x] Add a tamper-evident ownership manifest with a non-secret SHA-256 fingerprint and document the recovery/proof procedure.
- [x] Add tests and production validation proving the new identity is present and sensitive CV contact data is absent from shipped UI assets.

# Secure Demo Mode and Commercial Contact

- [x] Add a no-credential demo entry point with an explicit read-only demo session, isolated from real user sessions and regulated mutations.
- [x] Enforce demo restrictions server-side for all mutations, uploads, offline replay, admin actions, and sensitive data access through the tRPC demo allowlist middleware.
- [x] Add non-sensitive demo content and a discreet, configurable contact-to-purchase call to action without exposing private owner contact data.
- [x] Add unit tests for demo query authorization, read-only policy, logout compatibility, and contact CTA privacy; authenticated browser/session integration remains a follow-up.
- [x] Validate the demo flow with TypeScript, 68 passing Vitest tests, production build, and responsive UI changes; authenticated browser/session testing remains a follow-up.

# Custom Notification System

- [x] Define custom notification types, severity, audience, read state, and expiry without exposing private data.
- [x] Add server-side notification delivery/list/read procedures with role and demo-session restrictions; general list/read is limited to global notifications until organization-scoped UI is added.
- [x] Add an in-app notification center consistent with the Arabic RTL UI; toast delivery remains optional and is not used for sensitive notification content.
- [x] Add unit tests for authorization policy, demo read-only allowlist, unread counts, marking-read contract boundaries, and safe content rendering; database-backed mutation integration remains a follow-up.
- [x] Run TypeScript, 72 passing Vitest tests, production build, and responsive UI verification for the notification experience; authenticated browser-session coverage remains a follow-up.

# Multi-Organization Healthcare Expansion

- [x] Define organization types for government, independent pharmacy, pharmacy chain, distributor, insurer, rehabilitation/physiotherapy center, hospital, laboratory, and radiology center.
- [x] Add organization membership and scoped roles so each account sees only its organization, branches, facilities, and permitted modules; centralize the role-capability matrix and restrict member-directory reads to management/audit roles.
- [x] Add server-side organization isolation to implemented queries and mutations, including explicit denial of cross-organization access; future entry points remain gated until implemented.
- [x] Add jurisdictionId and organizationId scope fields, migration/backfill rules, and enforced query predicates to implemented regulated tables and paths; invoice, payroll, authority, tax, and label persistence not yet implemented remains pending.
- [x] Integrate country-boundary assertions into implemented catalog, prescription, and sales procedures, plus the available insurance/report policy contracts; future persistence procedures remain pending.
- [ ] Add database/query tests proving persisted regulated records cannot be created or accessed without matching jurisdiction and organization scope.
- [x] Add organization-specific workspace navigation and safe empty states without implying unsupported regulatory certification.
- [x] Add a reusable sensitive-data policy for patient, prescription, diagnostic, imaging, insurance, and audit categories with least-privilege role checks, organization scope, demo denial, and export denial; persistence-route integration remains tracked separately.
- [x] Add mocked integration-contract coverage for protected organization routers; database-backed cross-tenant denial remains a separate pending item, while unit coverage includes the role matrix, sensitive-data access, demo denial, export denial, and cross-organization policy checks.
- [x] Document official regulatory, interoperability, retention, and credential prerequisites per country and organization type in `docs/regulatory-prerequisites.md`; entries remain explicitly verified or pending and do not claim activation.

# Notification Organization Scope Bug

- [x] Resolve the stale COOKIE_NAME import error reported by the development server by restarting the stale HMR process; TypeScript, 72 tests, and production build are passing.
- [x] Verify organization-scoped notifications are filtered by active membership and preserve global notifications for authorized users, including server-side mark-read authorization.
- [x] Enforce organization scope in currently implemented customer-care, call-centre, prescription, POS commit, catalog search/create/approval, and offline replay paths; legacy nullable records and remaining modules stay pending.
- [x] Verify existing regulated tables contain zero rows requiring organization backfill, then make organizationId non-null on branches, customer_profiles, call_tickets, prescription_intakes, products, inventory_batches, catalog_items, and sales; global-capable notifications/audit records remain nullable by design.
- [x] Reconcile the deployed database migration baseline with the repository migration journal without recreating existing tables; the Drizzle root contains 22 SQL files matching 22 journal entries, while runtime database verification remains non-destructive.

على الرغم من نجاح اختبارات السياسة وتحقق قاعدة البيانات الحالية، يجب عدم اعتبار العزل الكامل مكتملاً قبل ربط كل الجداول المستقبلية واختبارات التكامل الفعلية.
- [x] Create an initial source-linked regulatory prerequisite register for Saudi Arabia, Egypt, and the UAE, with explicit activation gates and no unsupported compliance claims.
- [ ] Expand the source-linked register to every requested country and organization type only after current primary sources, effective dates, local licences, credentials, and acceptance criteria are verified.
- [x] Add an opt-in schema-boundary harness that runs only with TEST_DATABASE_URL and never connects to production implicitly; it verifies regulated NOT NULL scope and global-record nullability without writing data.
- [ ] Run the protected-router integration harness against a disposable test database and add rollback/cleanup assertions before marking database-backed isolation complete.
- [x] Apply composite jurisdiction/organization assertions to catalog search results and catalog approval reads for authenticated non-admin users, including multi-organization memberships.
- [ ] Extend composite query assertions to every remaining regulated read/write path and add persisted cross-tenant denial coverage.
- [x] Add an opt-in transaction/rollback probe proving a persisted jurisdiction-plus-organization predicate excludes a second organization and leaves no temporary data behind.
- [ ] Execute the actual protected tRPC router lifecycle against a disposable database with authenticated organization memberships, cross-tenant denial, and cleanup assertions.
- [x] Add source-triage notes for Jordan's official JFDA portal and Qatar's official MoPH pharmaceutical-facility service; keep Qatar pending where the official page could not be independently read.
- [ ] Verify detailed Jordan and Qatar country-pack requirements with current primary sources, effective dates, local licences, privacy rules, and test credentials before activation.
- [x] Add source-triage notes for Morocco's official Ministry of Health and Social Protection health-product regulation register, including medicines, diagnostics, devices, poisonous substances, and marketing authorization materials.
- [ ] Verify Morocco's organization-specific licences, privacy/hosting, fiscal, insurance, payroll, effective legal versions, and integration credentials before activation.
- [x] Add a mocked-database tRPC contract test for organizations.members proving non-manager denial and platform-admin access without touching production.
- [ ] Run the same protected-router lifecycle against TEST_DATABASE_URL with real persisted organizations and memberships; mocked contracts do not replace database integration.
- [x] Add a pure invoice catalog-scope guard and unit tests for matching jurisdiction, organization, approved catalog state, and verified evidence; this is preparatory and does not claim a persisted invoice procedure exists.
- [ ] Wire the invoice catalog-scope guard into a real invoice creation/persistence procedure once an invoice table and supported jurisdiction adapter are implemented.
- [x] Add unit matrix coverage for catalog, pricing, tax, invoice, prescription, insurance, payroll, label, authority, medicine, cosmetic, and medical-supply compound-scope acceptance and cross-country/cross-organization denial.
- [ ] Add persisted-record denial coverage for those regulated categories against a disposable database; policy matrix tests alone do not satisfy this item.
- [x] Document a source-neutral organization-type evidence matrix covering government, pharmacy, distributor, hospital, laboratory, radiology, insurer, and rehabilitation deployments; this is an activation checklist, not proof of licensing or compliance.
- [ ] Add explicit catalog-evidence revalidation inside prescription and dispensing product-consumption procedures once product matching is implemented; the reusable server guard now exists, but no such persistence entry point currently exists.
- [ ] Add router/database acceptance and rejection tests for prescription/dispensing consumption of approved, unapproved, cross-scope, and evidence-incomplete catalog-linked products; current tests cover the reusable guard only.
- [ ] Keep standalone invoice-generation enforcement pending until a real invoice persistence/submission entry point exists.
- [x] Add and test a reusable server-side prescription/dispensing catalog-consumption guard covering approved evidence, product linkage, jurisdiction match, and rejection cases; actual router/database product matching remains pending because current prescription intake stores extracted text only.

# Egyptian Medicines and Clinical-Trials Research

- [x] Identify accessible official Egyptian medicine-register sources and document coverage limits, licensing status, update date, and terms of use (interactive EDA search documented; no bulk export asserted)
- [ ] Build an Excel workbook from verified public medicine records, preserving source URLs, Arabic/English names, active ingredients, strength, dosage form, manufacturer, registration/status fields, and verification timestamps where available.
- [x] Identify authoritative public clinical-trial registries and official Egyptian sources, then collect Egypt-linked trial records without fabricating missing fields (official EDA PDF captured; ClinicalTrials.gov retained as supplementary source)
- [x] Build a separate clinical-trials archive workbook with registry identifiers, titles, conditions, interventions, sponsors, sites, recruitment status, dates, and source URLs where available (EDA workbook preserves raw blocks, extracted fields, and source pages)
- [x] Validate duplicates, missingness, date formats, source provenance, and country/site matching; document records that could not be verified (98 candidate rows; 10 duplicate-ID candidates and field omissions reported; human review required)
- [ ] Deliver the Excel workbooks plus a concise methodology, source register, coverage statement, and limitations report.

# Enterprise Capability Audit and Expansion

- [x] Inventory implemented ERP, CRM, HR, promotion, development, AI, notifications, reporting, government, insurer, offline, security, and multi-organization features against actual routes, schema, UI, tests, and deployment state; raw and focused inventories are preserved in `docs/capability-inventory-raw.txt` and `docs/capability-inventory-focused.txt`.
- [x] Produce a capability matrix labeled implemented-and-tested, partially implemented, policy-only, placeholder, or missing; the result is documented in `docs/capability-gap-report.md` and does not claim feature parity with Odoo, Microsoft Dynamics, SAP, Oracle, or other suites.
- [x] Audit scheduled/automatic reports and notifications for real scheduling infrastructure, recipient authorization, retry/audit behavior, and data-scope enforcement.
- [x] Audit government and insurer integrations; document which require official APIs, credentials, certificates, contracts, or local approvals before activation.
- [x] Implement only safe, supported additions identified by the audit, with tests and migration review where applicable.
- [x] Deliver a concise capability-gap report and update project documentation with explicit limitations and activation prerequisites.

# ALDO Health Care Eco System — Intelligent Reporting and Integration Hardening

- [x] Convert the current capability-gap findings into an explicit implementation boundary for intelligent reports, insurer workflows, HR/payroll, promotions, and government connectors.
- [x] Add a generalized report-definition and report-run model only if it can preserve organization/jurisdiction scope, recipient authorization, idempotency, and auditability.
- [x] Add deterministic scheduled-report policy helpers and tests; do not claim delivery until a configured channel and delivery audit exist.
- [x] Add an insurance eligibility/preauthorization boundary with policy-first request/response states and no live payer calls without credentials.
- [x] Review official regulatory and payer source notes; keep every country integration disabled until source, credentials, registration, and human approval gates are satisfied.
- [x] Run TypeScript, Vitest, production build, and focused browser verification for the new boundary work.
- [x] Update capability-gap and operations documentation with precise implemented, policy-only, and integration-gated statuses.
- [x] Save a checkpoint only after all completed items are marked [x].
- [x] Make optional database integration tests skip safely when TEST_DATABASE_URL is an injected placeholder rather than a valid MySQL URL.
- [x] Enforce customer-to-organization/branch scope when creating call-centre tickets and restrict update fields to persisted ticket columns.
- [x] Add regression tests for call-centre customer scope and update-field safety.
- [x] Add persisted insurance request records for eligibility and preauthorization using hashed references, composite scope, lifecycle states, idempotency, and explicit credential readiness.
- [x] Add scoped insurance request procedures and regression tests without enabling live payer transport.
- [x] Apply current branch-jurisdiction, approved-pack, and verified-evidence gates to persisted reporting and insurance procedures; leave future invoice/payroll connectors explicitly gated until implemented.
- [x] Add a taskUid-authenticated Heartbeat callback for persisted reports with orphan handling, deterministic idempotency, explicit skipped status, and no external delivery claim.
- [x] Refresh operations documentation for persisted reporting, insurance requests, compliance gates, and the current validation count.
- [x] Implement reviewed allowlisted report execution for inventory alerts, daily sales, expiry review, and operations summary with organization/jurisdiction predicates and no user SQL.
- [x] Harden report scheduling against malformed cron expressions, null jurisdiction scope, and stale compliance-pack approval before creating a Heartbeat task.
- [x] Restrict insurance lifecycle transitions to authorized organization roles and reject external references on non-submission states; retain the production credential gate for SUBMITTED.
- [x] Add regression coverage for insurance transition authorization and external-reference rules.
- [x] Harden report Heartbeat execution against inactive, legacy-unscoped, or unsupported persisted definitions before querying regulated data.
- [x] Add regression coverage for report callback lifecycle guards and idempotent duplicate behavior.
- [x] Refresh operations validation counts and lifecycle guard notes after the latest report and insurance hardening.
- [x] Enforce organization and branch membership for call-centre ticket assignees before accepting assignedUserId updates.
- [x] Add regression coverage for cross-organization and cross-branch assignment rejection.
- [x] Enforce branch authorization when enqueueing offline Customer Care and Call Centre drafts, not only during replay.
- [x] Add regression coverage for unauthorized offline enqueue attempts.
- [x] Restrict report definition and run reads to jurisdictions assigned to the authenticated user’s active branches, while preserving administrator visibility and organization scope.
- [x] Add regression coverage for cross-jurisdiction report read denial/filtering.
- [x] Persist a scoped failed report run with a bounded error code when an allowlisted report query fails, without exposing raw sensitive errors or enabling delivery.
- [x] Add regression coverage for failed-run audit behavior and bounded error output.
- [x] Enforce branch membership when listing and marking branch-scoped notifications, and stop filtering all branch notifications out of the list.
- [x] Add regression coverage for cross-branch notification visibility and mark-read denial.
- [x] Apply audience-role authorization consistently to listForOrganization and markRead, not only the general notification list.
- [x] Add regression coverage for role-targeted notification read and mark-read denial.

# Comprehensive Quality, Security, and Product Audit

- [x] Audit server routers and domain policies for authorization, organization/jurisdiction scope, input validation, error handling, idempotency, and unsafe data exposure on the implemented slice; persisted lifecycle and future-entry-point review remain explicitly open.
- [x] Audit database schema, migrations, indexes, nullable legacy fields, and query predicates on the inspected source slice; 22 SQL files match 22 journal entries and live-database constraint/query-plan verification remains explicitly open.
- [x] Audit scheduled callbacks, offline replay, notifications, uploads, and sensitive-data paths on the inspected slice; regulated offline mutations require online validation, reports are allowlisted/idempotent/in-app, and external channels remain disabled by default.
- [x] Audit frontend routes, loading/error/empty states, RTL/mobile behavior, accessibility markers, and dead-end navigation for the inspected workspace slice; a full assistive-technology matrix remains a release-quality follow-up.
- [x] Run static checks, tests, production build, and focused browser verification; inspect runtime logs for actionable issues; no reproducible runtime defect was found in the inspected slice.
- [x] Fix every reproducible defect found in scope and add regression coverage before marking it complete; fixed scheduled-report outer-catch leakage of raw error, URL, and task UID, with a regression assertion.
- [x] Add only suitable improvements that are justified by the audit and do not fabricate regulatory, payer, government, or customer data; added a bounded static-audit summary and regression test without changing regulatory claims or business data.
- [x] Update the capability-gap and operations documentation with findings, fixes, remaining limitations, and validation evidence in `docs/audits/quality-audit-2026-08-14.md`.
- [x] Reduce client-side diagnostic logging to bounded, non-sensitive error metadata and remove showcase input logging from shipped code paths.
- [x] Document that development network logs may contain response bodies and ensure production behavior does not expose debug payloads.
- [x] Restrict regional compliance pack and evidence reads to the user’s assigned active branch jurisdictions, with administrator-only full registry details.
- [x] Add regression coverage for cross-jurisdiction regional read denial and sanitized non-admin registry output.
- [x] Bound server integration error logs to status and stable error metadata; never print storage/notification response bodies or raw exception objects.
- [x] Add regression coverage for bounded integration error formatting where the helper can be tested without external calls.
- [x] Sanitize remaining raw OAuth/session/database error logs using the shared safe-error classifier.
- [x] Add regression coverage for auth/database log classification where feasible without exposing secrets.
- [x] Revalidate optional customerId organization/branch scope during offline Call Centre replay, matching the online create path.
- [x] Add regression coverage for replay rejection when the customer belongs to another branch or organization.
- [x] Harden browser debug collector privacy boundary by omitting all response bodies from network logs
- [x] Re-run full validation after debug collector privacy hardening (128 passed, 4 skipped; type check and production build passed)
- [x] Complete the current production-audit cycle for the implemented security, UX, and integration surfaces; remaining database, regulatory, credential, and assistive-technology gaps are explicitly tracked rather than claimed complete.

# Audit Notes
- The development network log showed analytics response bodies being retained by the browser debug collector. The collector now records metadata only and stores a fixed privacy-policy marker instead of response payloads.
- [x] Add router-contract regression coverage for cross-country catalog and report access denial; persisted disposable-database lifecycle remains pending
- [x] Persist report delivery attempts and create scoped in-app notification audit records while keeping external channels disabled (migration 0020; TypeScript and focused tests passed)
- [x] Verify report delivery migration exists in the project database; full disposable protected-router lifecycle remains blocked because TEST_DATABASE_URL is not a valid MySQL URI
- [x] Run final validation after report delivery audit (130 passed, 4 optional skipped; TypeScript and production build passed)
- [x] Implement a scoped promotion/coupon foundation with server-side eligibility, immutable discount-cap enforcement, approval state, and audit metadata; no fabricated campaign usage or customer claims (migration 0021; router and policy tests pass; sale application remains a tracked integration step)
- [x] Wire approved promotion eligibility into POS preparation/commitSale with revalidation, scope checks, and atomic usage reservation after successful sale writes (134 tests and TypeScript passed)
- [x] Add a router-contract test proving catalog.search rejects an unassigned jurisdiction before product reads; combined catalog, POS, and report country-contract tests pass.
- [x] Fix the debug collector's remaining XHR responseText read so sensitive response bodies are never read or retained; privacy regression test, TypeScript, and production build pass.
- [x] Re-run the full regression suite after the debug-collector privacy fix; 135 tests passed and 4 optional database tests were skipped because the configured test database URL is not a valid MySQL lifecycle target.
- [x] Remove raw XMLHttpRequest request bodies from development network logs; the collector now retains transport metadata and fixed privacy markers only, with regression and TypeScript checks passing.
- [x] Generate and save a static server-boundary inventory under docs/audits/static-boundary-audit.json; it is a review aid only and does not replace code review or disposable-database lifecycle tests.
- [x] Validate the static-audit addition with the full suite, TypeScript, and production build: 135 tests passed, 4 optional database tests skipped, TypeScript passed, and the production build passed with only the existing chunk-size warning.
- [x] Add a router-contract test proving catalog.create rejects an unassigned jurisdiction before organization lookup or insert; focused catalog, POS, and report isolation tests pass.
- [x] Re-run full Vitest and TypeScript after catalog.create isolation coverage: 136 tests passed, 4 optional database tests skipped, and TypeScript passed.
- [x] Add compliance router-contract coverage proving non-admin users cannot create packs or read pack audit history before database access; end-to-end persisted lifecycle remains pending.
- [x] Re-run full Vitest, TypeScript, and production build after compliance router-contract coverage: 138 tests passed, 4 optional database tests skipped, TypeScript passed, and production build passed with the existing chunk-size warning.
- [x] Tighten commitSale product/batch reads and inventory-batch updates with organization, branch, and jurisdiction predicates; focused ERP and country-isolation tests pass.
- [x] Re-run full Vitest, TypeScript, and production build after commitSale record-boundary hardening: 138 tests passed, 4 optional database tests skipped, TypeScript passed, and production build passed with the existing chunk-size warning.
- [x] Create a provenance-preserving, coverage-limited Egyptian medicine workbook with an explicit zero-record result and EDA source register; a complete medicine-record workbook remains blocked until authorized public export/API access is verified.
- [x] Skip clinical-trials archive generation and delivery per user instruction; retain existing source notes without treating the trial archive as a required deliverable.
- [x] Fix promotion usage reservation to require exactly one affected row from the Drizzle MySQL ResultSetHeader, preventing silent limit-bypass on concurrent or stale reservations; TypeScript and 15 focused tests pass.
- [x] Re-run full Vitest, TypeScript, and production build after atomic promotion reservation fix: 138 tests passed, 4 optional database tests skipped, TypeScript passed, and production build passed with the existing chunk-size warning.
- [x] Require each commitSale inventory-batch update to affect exactly one scoped row, rolling back the transaction on zero-row updates; TypeScript and 17 focused tests pass.
- [x] Re-run full Vitest, TypeScript, and production build after exact-one-row inventory update enforcement: 138 tests passed, 4 optional database tests skipped, TypeScript passed, and production build passed with the existing chunk-size warning.
- [x] Add prescription.upload country-boundary router coverage proving a pharmacist without matching jurisdiction membership is rejected before storage or intake insertion; TypeScript and focused country tests pass.
- [x] Re-run full Vitest, TypeScript, and production build after prescription country-boundary coverage: 139 tests passed, 4 optional database tests skipped, TypeScript passed, and production build passed with the existing chunk-size warning.
- [x] Add insurance organization-scope router-contract coverage proving an out-of-scope organization is rejected before compliance lookup or insert; focused insurance/organization tests pass and TypeScript passes.
- [x] Re-run full Vitest, TypeScript, and production build after insurance organization-scope coverage: 140 tests passed, 4 optional database tests skipped, TypeScript passed, and production build passed with the existing chunk-size warning.
- [x] Harden insurance.transition with organization/jurisdiction predicates and exact-one-row affectedRows validation to prevent stale-scope updates; focused insurance policy/router tests and TypeScript pass.
- [x] Re-run full Vitest, TypeScript, and production build after insurance.transition scope and affectedRows hardening: 140 tests passed, 4 optional database tests skipped, TypeScript passed, and production build passed with the existing chunk-size warning.
- [x] Add commitSale router-contract coverage for approved, unapproved, cross-scope, and evidence-incomplete catalog-linked products before any sale transaction begins; the approved path now reaches the transaction only with valid scope and evidence.
- [x] Add commitSale contract coverage for the unverified catalog state; the test proves PRECONDITION_FAILED before transaction start and TypeScript passes. Approved, cross-scope, and evidence-incomplete variants remain pending.
- [x] Re-run full Vitest, TypeScript, and production build after commitSale unverified-catalog coverage: 141 tests passed, 4 optional database tests skipped, TypeScript passed, and production build passed with the existing chunk-size warning.
- [x] Extend commitSale catalog contract coverage to a cross-jurisdiction catalog item; both unverified and cross-jurisdiction cases now reject before transaction. Approved and evidence-incomplete variants remain pending.
- [x] Re-run full Vitest, TypeScript, and production build after cross-jurisdiction commitSale coverage: 142 tests passed, 4 optional database tests skipped, TypeScript passed, and production build passed with the existing chunk-size warning.
- [x] Add commitSale contract coverage for verified catalog items with missing required evidence; unverified, cross-jurisdiction, and evidence-incomplete cases now reject before transaction. A positive approved-sale transaction test remains pending.
- [x] Re-run full Vitest, TypeScript, and production build after commitSale evidence-incomplete coverage: 143 tests passed, 4 optional database tests skipped, TypeScript passed, and production build passed with the existing chunk-size warning.

- [x] إصلاح اختبار commitSale الإيجابي: محاذاة mock لاستعلامات membership والاختصاص والمنظمة، وإضافة بيانات الدفعة وحقول وأدلة catalog المطلوبة؛ الاختبار المركز وTypeScript ناجحان.

- [x] Remove user-visible Manus words, marks, and images from the ALDO application and add regression coverage for shipped UI assets; provider session keys and framework internals remain unchanged because they are non-visible runtime contracts.

- [x] Create ALDO Health Care Eco System logo, icon, backgrounds, visual effects, and replace visible/configurable bdf pharma erp branding throughout the project; updated Home, HTML metadata, PWA icon/manifest, package/template branding, and added branding regression tests.

- [x] Harden scheduled inventory-alert transport errors: replace raw error, URL, and task UID response data with a fixed error code and add `inventory-policy.test.ts`; focused tests and TypeScript passed.

- [x] Remove visible `manus-storage` branding paths from client HTML, CSS, and Home logo usage; use the local ALDO PWA icon, CSS background gradients, and inline ALDO SVG. Branding tests and TypeScript passed.

- [x] Recheck the ALDO workspace after auth.me settles: desktop RTL dashboard, ALDO inline mark, CSS background, navigation, and scoped workspace messaging render successfully; the earlier loading screenshot was captured before the request completed.

- [x] Harden router policy-error responses in insurance, regional, and reports: removed `String(error)` from outward TRPC messages and replaced it with fixed non-sensitive messages; 150 tests passed, 4 optional database tests were skipped, TypeScript passed, and the production build passed.

- [x] Re-run full regression after ERP error-surface hardening: 150 tests passed, 4 optional live-database tests skipped, TypeScript passed, production build passed, and the server-wide raw error interpolation scan returned no matches.

- [x] Replace the plain auth loading screen with a branded ALDO loading card, inline mark, subtle CSS orbs, progress motion, and reduced-motion fallback; TypeScript, branding/auth tests (4), and production build passed.

- [x] Remove provider-branded console labels from the shipped debug collector while preserving its internal runtime identifiers, and extend branding regression coverage; TypeScript, 3 branding tests, and production build passed.

- [x] Create `docs/medicine-data-methodology-2026-08-14.md` documenting the required workbook fields, provenance checks, source limitations, and activation gate; medicine workbook delivery remains open because no verified source file is available.

- [x] Replace the raw regional-rules JSON parser exception with a fixed message and extend `regional-rules.test.ts`; 4 focused tests and TypeScript passed.

- [x] Run a focused scan for dynamic TRPC error messages after the router hardening; no remaining outward message template using raw error, input, URL, or task identifiers was found in the inspected server files.

- [x] Replace remaining application-owned BDF Service Worker cache/header/message identifiers with ALDO names, update Home messaging, and extend branding regression coverage; 4 branding tests and TypeScript passed. Internal provider proxy paths and offline database migration identifiers remain unchanged for compatibility.
