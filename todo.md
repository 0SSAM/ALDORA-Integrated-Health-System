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
- [x] Add cross-country isolation tests for catalog search, pricing, tax, prescription, and compliance procedures, including persisted-record denial; coverage also includes insurance/payroll, and 7 isolation tests passed.

# Comprehensive Country Compliance Requirement

- [x] Verify enabled-country coverage contract: defined and tested the independent source-linked requirements for pharmacy licensing, medicines, cosmetics, medical supplies, controlled substances, prescriptions, dispensing, pricing, tax, e-invoicing, insurance, payroll, privacy, retention, localization, timezone, and audit; the manifest confirms zero countries are enabled until these prerequisites are met.
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

- [x] Apply branch-jurisdiction and compliance-pack gating to every currently implemented regulated entry point, including prescription upload/extraction/dispensing, invoice preview/commitSale, insurance lifecycle, reporting, and inventory paths; future persistence connectors without an entry point remain fail-closed and explicitly tracked.
- [x] Require catalog evidence validation at every currently implemented downstream regulated use: commitSale revalidates sale records and the reusable prescription/dispensing policy rejects unsafe future links; standalone product-matching and invoice-persistence procedures do not exist and remain blocked rather than being claimed complete.
- [x] Add server-side POS branch gate requiring an administrator-confirmed or documented manual-override assignment and a current approved pack with verified evidence.
- [x] Expand catalog approval evidence to all supported non-empty catalog fields plus jurisdiction-pack-specific required fields.

# Prescription Jurisdiction Enforcement

- [x] Add nullable branchId and jurisdictionId to prescription_intakes through non-destructive migration 0009.
- [x] Require a branch identifier and approved current prescription compliance pack before prescription upload.
- [x] Require the same branch-bound pack before prescription extraction and dispensing; reject legacy or unbound intake records.
- [x] Disable the legacy direct image extraction path because it cannot prove jurisdiction context.
- [x] Apply equivalent gates to every invoice, insurance, payroll, reporting, and inventory mutation entry point that currently exists; future database procedures inherit the readiness requirement before wiring, while absent persistence connectors remain blocked.
- [x] Add protected invoice.generatePreview procedure that revalidates catalog verification and composite jurisdiction/organization scope before any regulated invoice persistence; persistence remains intentionally disabled until its schema and official adapter are approved.
- [x] Add tests proving invoice paths reject missing verified catalog evidence or mismatched jurisdiction/organization scope; invoicing-policy coverage now includes reconciliation, scope, approval, and evidence rejection.

# Core Operational Data Boundary

- [x] Add nullable jurisdictionId to inventory_batches and sales schema; apply non-destructive migration 0010 for inventory batches.
- [x] Populate jurisdictionId from the confirmed branch assignment in the implemented inventory and sale write paths before allowing regulated persistence.
- [x] Add boundary coverage proving products, batches, sales, prescriptions, and catalog records cannot cross jurisdiction boundaries through policy, router-contract, and static source tests; live disposable-database query execution remains separately pending and is not claimed complete.

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
- [x] Documented as BLOCKED: country-specific e-invoicing submission/acknowledgement adapters require verified jurisdiction requirements and credentials before implementation.

# E-Invoicing Safety Contract

- [x] Add a country-neutral invoicing policy that requires an approved pack rule, official endpoint, country-matched adapter, and reconciled invoice document.
- [x] Add unit tests for missing integration, country mismatch, and total reconciliation.
- [x] Documented as BLOCKED: real country adapters require official technical specifications, credentials, and acceptance testing.

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
- [x] Add end-to-end mocked-router lifecycle tests covering create pack, add evidence, verify evidence, approve, stale blocking, rollback, and audit visibility; live-database execution remains a separate prerequisite.

# Evidence Governance Verification

- [x] Connect the tested compliance lifecycle policy to approvePack and rollbackPack router mutations.
- [x] Restrict audit-history listing to admin users and return reviewer timestamp consistently for evidence decisions.
- [x] Add an integration test harness for the actual protected router lifecycle with fail-closed isolation guards, explicit safe-skip behavior, and cleanup/runbook documentation; execution against a live test database remains skipped by user instruction because TEST_DATABASE_URL is unavailable.

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
- [x] Documented as BLOCKED/FUTURE: database-backed gates will be added when the corresponding persistence entry points are implemented.

# Server Jurisdiction Access Hardening

- [x] Require non-admin catalog and regulated branch operations to match an active branch membership before reading or writing jurisdiction-scoped records.
- [x] Add unit coverage for rejecting a jurisdiction request that is not assigned to the authenticated user.

# Prescription Membership Boundary Extension

- [x] Require active authenticated branch membership for prescription upload, extraction, confirmation, and dispensing paths.
- [x] Documented as BLOCKED/FUTURE: membership and country-pack gates depend on future persistence paths.

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
- [x] Documented as BLOCKED: persisted database/query lifecycle tests require a disposable isolated TEST_DATABASE_URL.
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
- [x] Documented as BLOCKED: source-linked expansion requires current primary sources, effective dates, local licences, credentials, and acceptance criteria.
- [x] Add an opt-in schema-boundary harness that runs only with TEST_DATABASE_URL and never connects to production implicitly; it verifies regulated NOT NULL scope and global-record nullability without writing data.
- [x] Documented as BLOCKED: protected-router lifecycle testing requires a disposable isolated database and cleanup harness.
- [x] Apply composite jurisdiction/organization assertions to catalog search results and catalog approval reads for authenticated non-admin users, including multi-organization memberships.
- [x] Documented as BLOCKED/FUTURE: remaining regulated persistence paths are not implemented and cannot be tested without their contracts and isolated database.
- [x] Add an opt-in transaction/rollback probe proving a persisted jurisdiction-plus-organization predicate excludes a second organization and leaves no temporary data behind.
- [x] Documented as BLOCKED: actual protected-router lifecycle requires disposable database access and authenticated test memberships.
- [x] Add source-triage notes for Jordan's official JFDA portal and Qatar's official MoPH pharmaceutical-facility service; keep Qatar pending where the official page could not be independently read.
- [x] Documented as BLOCKED: Jordan and Qatar activation requires current primary sources, effective dates, local licences, privacy rules, and test credentials.
- [x] Add source-triage notes for Morocco's official Ministry of Health and Social Protection health-product regulation register, including medicines, diagnostics, devices, poisonous substances, and marketing authorization materials.
- [x] Documented as BLOCKED: Morocco activation requires organization-specific licences, privacy/hosting, fiscal, insurance, payroll, legal versions, and credentials.
- [x] Add a mocked-database tRPC contract test for organizations.members proving non-manager denial and platform-admin access without touching production.
- [x] Documented as BLOCKED: persisted organization/membership lifecycle requires an isolated TEST_DATABASE_URL; mocks are not treated as completion.
- [x] Add a pure invoice catalog-scope guard and unit tests for matching jurisdiction, organization, approved catalog state, and verified evidence; this is preparatory and does not claim a persisted invoice procedure exists.
- [x] Documented as BLOCKED/FUTURE: invoice catalog-scope wiring depends on an invoice table and supported jurisdiction adapter.
- [x] Add unit matrix coverage for catalog, pricing, tax, invoice, prescription, insurance, payroll, label, authority, medicine, cosmetic, and medical-supply compound-scope acceptance and cross-country/cross-organization denial.
- [x] Documented as BLOCKED: persisted-record denial coverage requires a disposable database and implemented regulated persistence categories.
- [x] Document a source-neutral organization-type evidence matrix covering government, pharmacy, distributor, hospital, laboratory, radiology, insurer, and rehabilitation deployments; this is an activation checklist, not proof of licensing or compliance.
- [x] Documented as BLOCKED/FUTURE: catalog-evidence revalidation depends on a product-matching persistence entry point; reusable guard exists.
- [x] Documented as BLOCKED: router/database acceptance tests depend on the prescription/dispensing catalog-linked persistence contract.
- [x] Keep standalone invoice-generation enforcement pending until a real invoice persistence/submission entry point exists; current catalog-scope guard is preparatory and no standalone invoice path is exposed.
- [x] Add and test a reusable server-side prescription/dispensing catalog-consumption guard covering approved evidence, product linkage, jurisdiction match, and rejection cases; actual router/database product matching remains pending because current prescription intake stores extracted text only.

# Egyptian Medicines and Clinical-Trials Research

- [x] Identify accessible official Egyptian medicine-register sources and document coverage limits, licensing status, update date, and terms of use (interactive EDA search documented; no bulk export asserted)
- [x] Documented as BLOCKED: an authoritative, licensed, reproducible verified medicine-record source is required before building the requested workbook.
- [x] Identify authoritative public clinical-trial registries and official Egyptian sources, then collect Egypt-linked trial records without fabricating missing fields (official EDA PDF captured; ClinicalTrials.gov retained as supplementary source)
- [x] Build a separate clinical-trials archive workbook with registry identifiers, titles, conditions, interventions, sponsors, sites, recruitment status, dates, and source URLs where available (EDA workbook preserves raw blocks, extracted fields, and source pages)
- [x] Validate duplicates, missingness, date formats, source provenance, and country/site matching; document records that could not be verified (98 candidate rows; 10 duplicate-ID candidates and field omissions reported; human review required)
- [x] Deliver the source-safe Egyptian medicine workbook template plus methodology, source register, coverage statement, and limitations report; full catalog population remains blocked pending a reproducible authorized EDA source, and the clinical-trials archive remains skipped as instructed.

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

- [x] Remove the legacy BDF shell cache during Service Worker activation and cover the cleanup contract; 4 branding tests and TypeScript passed, with the legacy cache name retained only as an explicit deletion target.

- [x] Add focused cross-country isolation coverage for catalog search results, pricing/tax records, prescription records, compliance records, and persisted-record scope denial; 7 tests and TypeScript passed.

- [x] Add a pure invoice-generation boundary that validates document reconciliation and catalog jurisdiction/evidence before any future persistence or official submission adapter; 6 invoice-policy tests and TypeScript passed.

- [x] Validate the invoice boundary and router addition with focused tests, full Vitest, TypeScript, and production build; 161 tests passed, 4 optional database tests skipped because TEST_DATABASE_URL is unavailable, and the existing chunk-size warning remains non-blocking.

- [x] Expand compliance lifecycle coverage across evidence verification, approval readiness, stale blocking, rollback, and audit visibility contract; 4 lifecycle tests and TypeScript passed.

- [x] Add protected-router contract coverage for invoice.generatePreview rejecting cross-scope catalog records and unreconciled totals before persistence; 2 contract tests and TypeScript passed.

- [x] Strengthen and test the in-app report delivery audit trail, including scoped run/definition metadata and explicit external-channel blocking; 7 scheduled-report tests and TypeScript passed.

- [x] Add a mocked protected-router lifecycle contract for create pack, add evidence, verify, approve, rollback, and audit listing; 4 contract tests and TypeScript passed, while live-database execution remains pending.

- [x] Add a protected-router regression proving approvePack rejects a stale compliance pack before update or audit writes; 3 compliance-router contract tests and TypeScript passed.

- [x] Add a reusable external-adapter readiness gate that blocks government/e-invoicing submission until verified specifications, credentials, organization registration, and human acceptance are present; 2 tests and TypeScript passed.

- [x] Record a primary-source review for EDA Egypt and JFDA Jordan with source URLs and explicit limitations; no unverified regulatory rows or automatic submission were enabled.

- [x] Review official Qatar MOPH and Morocco AMMPS portals as source leads and record CAPTCHA/content limitations; detailed country-pack activation remains pending primary-source extraction, effective dates, credentials, and acceptance tests.

- [x] Add a country-pack activation policy requiring source-linked evidence, effective dates, local licensing, credentials, and acceptance criteria for every required regulatory domain; 2 policy tests and TypeScript passed, with incomplete packs blocked.

- [x] Create a source-safe Egyptian medicine workbook template with provenance fields and no fabricated medicine records while the reproducible EDA bulk source remains unavailable; generated docs/data/egypt-medicine-register-source-safe-template.xlsx.

- [x] Package the source-safe workbook with a concise methodology, source register, coverage statement, and limitations note for review; created docs/data/egypt-medicine-register-delivery.md.

- [x] Run regression validation after country-pack and source-safe workbook work; 172 tests passed, 4 optional database tests skipped, TypeScript passed, and production build passed with the existing non-blocking chunk-size warning.

- [x] Create an implementation-readiness note that maps remaining blocked items to the exact prerequisite needed, without treating blockers as completed features; created docs/audits/implementation-readiness-2026-08-15.md.

- [x] Add a machine-readable country-pack source manifest for Egypt, Jordan, Qatar, and Morocco with review status and explicit activation blockers only; 1 manifest test and TypeScript passed.

- [x] Add a country-aware payroll statutory readiness policy that blocks payroll activation until tax, social-insurance, employment, currency, effective-date, and employer-registration evidence is complete; 2 policy tests and TypeScript passed, with no payroll calculations activated.

- [x] Add an insurance payer transport readiness policy requiring endpoint specification, credential configuration, claim/eligibility mappings, sandbox verification, and acceptance evidence before activation; 2 policy tests and TypeScript passed, with no payer transport activated.

- [x] Add a pure prescription/dispensing product-consumption policy that rejects cross-scope, unapproved, and evidence-incomplete catalog links before any future persistence entry point; 2 policy tests and TypeScript passed.

- [x] Add an authorized catalog-intake policy requiring role permission, organization/branch/jurisdiction scope, and source verification before new medicine, cosmetic, or medical-supply records are accepted; integrated into non-local createItem, 2 policy tests and TypeScript passed.

- [x] Add explicit cross-country and cross-organization denial coverage for persisted compliance records/procedures, and document which implemented query paths are covered by helper-level tests; cross-country isolation now has 10 tests, while live query lifecycle remains separately pending.

- [x] Add a reusable regulated-mutation readiness policy requiring branch-jurisdiction assignment, approved non-stale compliance pack, and verified catalog evidence where a product is involved; 2 policy tests and TypeScript passed.

- [x] Add a jurisdiction-aware privacy and retention readiness policy requiring legal basis, retention period, data-subject rights handling, deletion/export controls, and effective source evidence before activation; 2 policy tests and TypeScript passed.

- [x] Add a controlled-substance dispensing readiness policy requiring jurisdiction evidence, facility licence, authorized prescriber/pharmacist roles, verified prescription, and dual review before activation; 2 policy tests and TypeScript passed.

- [x] Add an inventory-mutation readiness policy requiring scoped branch/jurisdiction, approved current compliance pack, valid batch evidence, FEFO selection, and non-negative stock before activation; 2 policy tests and TypeScript passed.

- [x] Add a jurisdiction-aware tax-calculation readiness policy requiring effective source evidence, rates, rounding rules, exemption handling, and audit metadata before activation; 2 policy tests and TypeScript passed.

- [x] Add an invoice-numbering readiness policy requiring jurisdiction-bound sequence, fiscal-period validity, uniqueness, gap handling, and audit metadata before invoice persistence is enabled; 2 policy tests and TypeScript passed.

- [x] Add a localization/timezone readiness policy requiring verified locale, RTL direction where applicable, timezone, currency, calendar/date formats, and effective source evidence before country activation; 2 policy tests and TypeScript passed.

- [x] Add an audit-event integrity readiness policy requiring actor identity, organization/branch/jurisdiction scope, event classification, UTC timestamp, and tamper-evidence metadata for regulated actions; 2 policy tests and TypeScript passed.

- [x] Add a notification-delivery readiness policy requiring recipient scope, consent/preferences, allowed channel, quiet-hours handling, localized content, and audit metadata before delivery; 2 policy tests and TypeScript passed.

- [x] Add a clinical-data access readiness policy requiring role authorization, declared purpose, organization/branch/jurisdiction scope, consent where applicable, and audited break-glass handling; 2 policy tests and TypeScript passed.

- [x] Add a patient-identity matching readiness policy requiring trusted internal identifier, minimum demographic confirmation, ambiguity blocking, and manual review for unresolved matches; 2 policy tests and TypeScript passed.

- [x] Add a data-export readiness policy requiring subject verification, organization/branch/jurisdiction scope, legal basis, field minimization/redaction, and audit metadata before export; 2 policy tests and TypeScript passed.

- [x] Add an offline-sync mutation readiness policy requiring idempotency key, scoped actor/device, conflict resolution, retry safety, and audit metadata before synchronization; 2 policy tests and TypeScript passed.

- [x] Add a device-trust readiness policy requiring device identity, encrypted local storage, supported app version, screen-lock assurance, revocation state, and scoped session before offline healthcare access; 2 policy tests and TypeScript passed.

- [x] Integrate REQUIRED_COUNTRY_PACK_DOMAINS into the regional registry and approval readiness path so a country cannot appear enabled without complete source-linked verified coverage; 9 focused tests and TypeScript passed.
- [x] Add regional router contract tests proving an enabled country is rejected when timezone, audit, or any required domain evidence is missing; contract coverage passed.
- [x] Persist or model per-country required-domain coverage explicitly in compliance pack rules without activating any unverified country; rulesJson now requires the full matrix and manifest remains blocked for all reviewed countries.

- [x] Check the official EDA registered-drug search endpoint for a reproducible bulk/API source; the endpoint was reachable by URL but exposed no usable export or interactive data in the test environment, so the catalog remains safely blocked pending an authorized source.

- [x] Documented as BLOCKED: real trusted-device attestation from an authorized native/MDM client path is required before regulated offline replay; browser capabilities are not treated as device trust.

- [x] Add a server-side Device-Trust gate to offline draft replay; missing or incomplete trust context is rejected before database access, with 5 contract/policy tests passing. Client attestation remains pending until a real trusted-device signal is available.

- [x] Expand Device-Trust policy tests to cover each individual missing trust signal and confirm all failures remain blocked; 7 focused tests and TypeScript passed.

- [x] Run full regression and production build after the latest readiness changes; latest run passed 70 test files with 220 tests passing and 5 optional database tests skipped because an isolated TEST_DATABASE_URL is unavailable, and the production build completed successfully.

- [x] Align the offline replay UI with server Device-Trust gating: show the blocked state and reason when no trusted client attestation is available instead of presenting a misleading actionable replay button; TypeScript and 7 focused tests passed.

- [x] Harden the optional database test harness so it requires an explicit isolated-test marker and refuses production-like TEST_DATABASE_URL values before opening a connection; 3 safety tests and TypeScript passed, while schema-boundary remains safely skipped without the isolated database URL.

- [x] Document the isolated database lifecycle test runbook, required environment markers, cleanup expectations, and the fact that no production URL or real patient/customer data may be used; persisted lifecycle execution remains pending until an isolated TEST_DATABASE_URL is available.

- [x] Document the trusted-device attestation contract and approved client options, explicitly excluding browser-only capabilities as security evidence; server and UI remain fail-closed until a provider is configured.

- [x] Add a source-level regulated-entrypoint contract test covering the currently implemented POS invoice preview, sale preparation/commit, and prescription upload/extract/confirm/dispense gates, while explicitly documenting absent invoice persistence and product-matching paths; 2 tests and TypeScript passed.

- [x] Consolidate the remaining blocked prerequisites into a dated audit index that separates implementable code gaps from missing database, regulatory source, credential, and trusted-device dependencies; saved as docs/audits/open-prerequisites-index-2026-08-15.md.

- [x] Align every DB-touching integration test with the isolation guard, including organization-scope and TEST_DATABASE_URL smoke checks, so no test opens a MySQL connection without TEST_DATABASE_ISOLATED=true and a non-production URL; 5 focused tests passed, 5 optional schema tests skipped safely, and TypeScript passed.

- [x] Update the open-prerequisites audit index after DB harness hardening to record that all current connection-opening tests are fail-closed behind the isolation guard.

- [x] Make the database smoke test assert its safe-skip state explicitly when no isolated test database is configured, while preserving the guarded connection check when one is available; 4 focused tests and TypeScript passed.

- [x] Refresh the open-prerequisites index with the exact remaining unchecked items after the database-test skip, preserving each blocker and its required prerequisite.

- [x] Create and validate the dated source-safe Egyptian medicine workbook with 28-column medicine schema, coverage/limitations, field dictionary, source register, and import instructions; validation passed with zero medicine product rows and one explicit non-record status row.

- [x] Add adaptive client performance defaults: conservative React Query caching, lazy-load non-critical routes/components, and avoid repeated session-storage work on every request without changing auth behavior.
- [x] Include client-side unit tests in Vitest so the session-header cache test runs in CI and local regression checks.
- [x] Refresh the open-prerequisites audit index with the latest 223-test regression and performance hardening status without closing external blockers.
- [x] Harden external-adapter readiness with explicit endpoint contract, submission acknowledgement, retry, and audit requirements while keeping all unconfigured adapters blocked; 71 test files passed, 223 tests passed, and production build passed.
- [x] Require future invoice adapters to prove the shared external-adapter readiness contract before submission, while preserving local document and catalog-scope validation; 71 test files passed, 223 tests passed, and production build passed.
- [x] Add a pure trusted-attestation contract validator for nonce, freshness, revocation, and organization/jurisdiction scope; keep it unused by browsers until an authorized native provider is configured; 71 test files passed, 231 tests passed, and production build passed.
- [x] Create Arabic and English operational manuals covering the implemented ALDO Health Care Eco System workflows by professional role, with country-specific readiness notes where relevant.
- [x] Create a safe demo-role access matrix without real credentials or personal data.
- [x] Generate validated PDF manuals and package all deliverables into a ZIP archive.
- [x] Create and integrate a simple ALDO system icon and favicon assets without changing the secure brand identity; asset bound to /manus-storage/aldo-system-icon_1c63a72c.png in HTML and PWA manifest.
- [x] Add a provenance-safe Data Matrix payload/validation contract and document the official tracking-system adapter boundary; GS1-style contract excludes patient data and remains externally unverified until an official adapter is configured.
- [x] Review and strengthen file/data encryption and immutable audit/hash-chain controls without claiming a live blockchain network or inventing keys; AES-256-GCM envelope and SHA-256 audit-chain verification added and tested.
- [x] Verify and expose the login entry screen and sales/POS route clearly in the current application, preserving demo-mode and protected-auth behavior; /login and /sales added, 233 tests passed, TypeScript and production build passed.
- [x] Add a diplomatic limited-device mode: allow read-only/demo and non-regulated drafts with clear scope messaging, while continuing to block regulated offline replay and submission without trusted attestation; offlineQueue now rejects regulated drafts, UI explains the boundary, and 235 tests passed.
- [x] Replace the visible subtitle «منصة الصيدليات العربية متعددة الدول» with «منظومة الرعاية الصحية الشاملة» while preserving ALDO branding, routes, and permissions; 235 tests passed, TypeScript and production build passed.

- [x] Clarify and expose the correct authentication model: distinguish owner/OAuth email login from internal role-based username/password login, without creating insecure demo credentials or weakening existing auth gates; /login now explains the separation and offers the appropriate employee form after OAuth sign-out.

- [x] Add a secure internal employee username/password authentication path separate from OAuth and demo mode, with hashed credentials, session rotation, throttling/lockout boundaries, and logout/revocation; implemented with opaque revocable sessions and generic failure handling.
- [x] Bind internal sessions to organization, branch, jurisdiction, role, and permission snapshot; enforce these scopes server-side for regulated workflows.
- [x] Add auditable authentication, authorization, and medicine-traceability events with tamper-evident linkage and no sensitive secret/password material.
- [x] Add the internal login UI, focused security tests, TypeScript/build verification, and documentation explaining how internal permissions connect to healthcare and medicine traceability; 74 test files passed, 239 tests passed, build passed, and /login was visually verified.

# Comprehensive Cross-System Review 2026-08-15
- [x] Review authentication, authorization, tenant/branch/jurisdiction isolation, session lifecycle, and audit integrity across implemented routes.
- [x] Review regulated workflows, offline boundaries, medicine traceability, Data Matrix, encryption, and external-adapter fail-closed behavior.
- [x] Review frontend routes, accessibility, RTL/mobile behavior, performance, error/loading states, and user-facing wording.
- [x] Review schema/migration safety, persistence boundaries, test coverage, logs/privacy, and deployment readiness.
- [x] Apply only reproducible fixes and additions, then run focused and full validation with visual checks.
- [x] Produce a dated comprehensive review report separating implemented controls, policy-only boundaries, and external blockers.
- [x] Reduce the main client bundle by lazy-loading Home and Login behind a shared route fallback, and harden internal-auth parameter validation so malformed scrypt records or missing audit HMAC keys fail closed.

# Interactive Demo Enhancement 2026-08-15
- [x] Replace the current read-only/demo landing behavior with an interactive demo workspace that exposes safe sample data for core ERP/CRM modules.
- [x] Add explicit demo-mode guardrails: synthetic data banner, no real persistence, no regulated submission, no external connector calls, and resettable demo state.
- [x] Add demo actions for browsing catalog, preparing a sample POS cart, reviewing a prescription workflow, viewing customer care/call-centre examples, and inspecting reports/alerts.
- [x] Add focused tests for demo-mode isolation, reset behavior, and blocked regulated/external mutations.
- [x] Verify desktop and mobile demo flows visually and run TypeScript, Vitest, and production build before checkpoint.
- [x] Document the demo entry path and the difference between simulated results and production integrations.

# Interactive Demo Enhancement

- [x] Replace the read-only Demo placeholder with a local synthetic-data interactive workspace.
- [x] Expose all Demo navigation modules while keeping real-user role and organization scoping unchanged.
- [x] Add safe local simulations for POS, FEFO inventory, prescription review, insurance, catalog, customer care, call centre, compliance, finance, compounding, and people views.
- [x] Add Demo reset action and explicit fail-closed/no-external-submission messaging.
- [x] Add unit coverage for Demo discount limits and synthetic catalog search.
- [x] Validate TypeScript, production build, full Vitest regression, and desktop visual routes.

# Hardware Integration Review

- [x] Audit printer support, including receipt, A4/label, barcode/Data Matrix, network, USB, Bluetooth, and browser/PWA limitations.
- [x] Audit scanner support, including keyboard-wedge barcode scanners, camera scanning, document scanners, and Data Matrix workflows.
- [x] Audit monitoring support, including cold-chain sensors, CCTV/access-control boundaries, device health, and alert delivery.
- [x] Define fail-closed hardware adapter contracts and a local bridge requirement where browser APIs are insufficient.
- [x] Add tests and documentation for hardware integration readiness without claiming unsupported device connectivity.

# Printer and Scanner Simulation Enhancement

- [x] Add a role-scoped hardware settings workspace for selecting printer models, media type, and connection transport.
- [x] Add an interactive barcode scanner simulator with sample payloads, validation, and event log.
- [x] Add an interactive thermal-printer simulator with receipt preview, print settings, and simulated print result.
- [x] Keep simulator state local and visibly separate from production device adapters and regulated workflows.
- [x] Add unit coverage for supported model/transport combinations, barcode validation, and simulator isolation.
- [x] Verify responsive UI, TypeScript, Vitest, and production build before checkpoint.

# Language Switcher and Demo Access Fix

- [x] Add a visible Arabic/English language switcher to the public login and authenticated workspace chrome.
- [x] Ensure language changes update direction and persist locally without exposing sensitive session data.
- [x] Add a prominent Demo entry CTA and direct Demo workspace launch path from the safe login flow.
- [x] Ensure Demo mode opens interactive module workspaces instead of read-only overview content.
- [x] Add tests for language persistence, RTL/LTR switching, and Demo entry visibility/guardrails.
- [x] Verify login, Demo, responsive layouts, TypeScript, Vitest, and production build before checkpoint.

# Welcome Screen 2026-08-15
- [x] Add a dedicated public welcome screen at the root route with ALDO branding, concise value proposition, language switcher, login CTA, interactive Demo CTA, and safe contact/status messaging.
- [x] Move the authenticated operational workspace to a dedicated route while preserving /sales and existing protected behavior.
- [x] Redirect Demo sessions directly to the interactive workspace and provide a safe return path from the welcome screen.
- [x] Add focused tests for welcome CTA destinations, language control presence, and Demo/workspace route separation.
- [x] Verify desktop/mobile visuals, RTL/LTR, TypeScript, Vitest, production build, and save a published checkpoint.

# Multilingual Smart Search 2026-08-15
- [x] Add deterministic Arabic/English text normalization for catalog and searchable operational labels.
- [x] Add Arabic-English keyboard-layout correction with conservative candidate scoring and no silent mutation of user input.
- [x] Add cross-language search matching for names, IDs, ingredients, categories, and source text where indexed locally.
- [x] Expose search suggestions and explain when a keyboard-layout correction was applied.
- [x] Add focused tests for Arabic normalization, English/Arabic lookup, keyboard mapping, mixed text, and no-result safety.
- [x] Verify performance, RTL/LTR behavior, TypeScript, Vitest, production build, and save a published checkpoint.

# Egyptian and Arab Pharmacopeia References 2026-08-15
- [x] Identify and record the authoritative Egyptian source with authority and URL; document that no current legally usable pan-Arab reference was verified, so edition, effective date, access/licensing status, and activation remain BLOCKED until an issuing authority provides them.
- [x] Add a provenance-safe pharmacopeia reference registry without copying protected monographs or treating pharmacopeia text as product registration approval.
- [x] Define scoped uses for quality/specification review, active-ingredient/form normalization, pharmacist reference, and regulatory evidence review.
- [x] Link eligible reference metadata to multilingual search and catalog verification with jurisdiction and organization scope.
- [x] Add fail-closed tests for missing source, stale edition, missing license, wrong jurisdiction, and unverified product claims.
- [x] Update Arabic/English operational documentation with pharmacopeia usage boundaries and run TypeScript, Vitest, build, and visual checks.
- [x] Save and publish the verified implementation; keep unavailable official sources and credentials explicitly open.

# Security Hardening Review 2026-08-15

- [x] Audit and harden HTTP security headers, transport security, clickjacking protection, MIME sniffing, referrer policy, and browser capability policy.
- [x] Audit authentication/session cookies, CSRF boundaries, OAuth/internal-auth separation, logout/revocation, throttling, and sensitive error disclosure.
- [x] Audit tRPC/API input validation, organization/branch/jurisdiction authorization, IDOR/cross-tenant access, and regulated-entrypoint fail-closed behavior.
- [x] Audit upload/storage handling, prescription files, path/key safety, MIME/size validation, and sensitive-data exposure.
- [x] Add automated security regression tests for the hardened controls and attack-boundary cases.
- [x] Run TypeScript, Vitest, production build, dependency/security checks, and document residual risks and external operational prerequisites.
- [x] Save and publish the security-hardening checkpoint with a dated security review report.

# Anti-Tampering and Workplace Monitoring Review 2026-08-15

- [x] Add server-enforced tamper-evident event policy for authentication, authorization, configuration, catalog, inventory, POS, prescription, export, storage, and audit actions.
- [x] Add detection and escalation policy for repeated failures, privilege changes, scope changes, record deletion/alteration, audit-chain breaks, clock anomalies, and suspicious bulk access without fabricating incidents.
- [x] Add privacy-preserving camera/audio monitoring contract with consent, notice, purpose limitation, retention, access scope, masking, legal approval, and fail-closed adapter readiness.
- [x] Add tests for anti-tampering event classification, alert thresholds, audit-chain integrity, privacy gates, and blocked unconfigured camera/audio adapters.
- [x] Document operational response, evidence preservation, retention/deletion, incident review, and human oversight requirements.
- [x] Run full tests, TypeScript, production build, and package the complete project plus relevant documentation into one compressed archive.
- [x] Save and publish the anti-tampering and monitoring checkpoint.

# Arabic Brand Rename and Language QA 2026-08-15

- [x] Choose and apply a formal, modern, premium Arabic system name with an accurate English equivalent and short form.
- [x] Replace old visible branding and metadata consistently across HTML, PWA manifest, app title, welcome screen, workspace, documentation, and generated delivery references.
- [x] Perform Arabic RTL and English LTR copyediting of visible user-facing strings, correcting spelling, grammar, punctuation, terminology, and capitalization without changing security meaning.
- [x] Review main routes and user-facing states for stale names, awkward translations, missing language labels, and inconsistent terminology.
- [x] Run focused language/branding tests, full Vitest, TypeScript, production build, and responsive visual checks.
- [x] Save and publish the renamed, language-reviewed checkpoint.

# Supply Chain and Procurement Tracking 2026-08-15

- [x] Add scoped supply-chain policy covering suppliers, procurement orders, receipts, batches, expiry, transfers, returns, recalls, and delivery status.
- [x] Add server-side validation for organization, branch, jurisdiction, supplier authorization, order state transitions, quantities, and batch traceability.
- [x] Add supply-chain event/audit records for creation, approval, dispatch, receipt, discrepancy, quarantine, return, recall, and cancellation.
- [x] Add supply-chain workspace with safe empty states, filters, multilingual search, traceability timeline, and risk indicators without fabricated operational data.
- [x] Add tests for scope isolation, state transitions, FEFO/expiry boundaries, discrepancy handling, recall/quarantine, and tamper-evident audit linkage.
- [x] Document real supplier/API/EDI/GS1/regulatory integration prerequisites and fail-closed boundaries.
- [x] Run full Vitest, TypeScript, production build, visual verification, and package the complete project, documentation, and tests into one downloadable ZIP archive.
- [x] Save and publish the supply-chain checkpoint.

# Demand Forecasting and Automatic Reorder Dashboard 2026-08-15

- [x] Define an explainable demand-forecasting policy using only supplied or persisted sales/usage history, with minimum-history and no-data states.
- [x] Add automatic reorder-point and suggested-order-quantity calculations with lead time, service level, safety stock, current stock, open orders, expiry/FEFO, and supplier constraints.
- [x] Enforce organization, branch, jurisdiction, product, and authorization scope on forecasting inputs and recommendations.
- [x] Add a supply-chain dashboard with forecast horizon, confidence/data-quality status, reorder alerts, calculation explanations, filters, and RTL/LTR states.
- [x] Add tests for forecast boundaries, seasonality/data gaps, lead-time and safety-stock calculations, expiry/FEFO constraints, scope isolation, and no-data fail-closed behavior.
- [x] Document that recommendations are decision support, require authorized review, and do not create purchase orders automatically without approval.
- [x] Run full Vitest, TypeScript, production build, and responsive visual verification, then save and publish the checkpoint.

# Actual Sales Forecast Integration and Reusable Skill

- [x] Review the implemented sales schema and forecast policy to define the authorized aggregation boundary for actual sales.
- [x] Add server-side actual-sales aggregation by organization, branch, jurisdiction, product, and time bucket with exclusion of cancelled, voided, demo, and unauthorized records.
- [x] Connect the aggregation to the demand forecast and reorder dashboard with data-quality states, source timestamps, and no-data fail-closed behavior.
- [x] Add tests for tenant/branch isolation, status filtering, time-window boundaries, duplicate/idempotency handling, and forecast input provenance.
- [x] Document that recommendations remain decision support and never create purchase orders without authorized approval.
- [x] Create a reusable skill package describing the secure healthcare ERP review, fail-closed implementation, testing, visual verification, checkpoint, and archive workflow.
- [x] Validate the reusable skill with the official skill validator and deliver its SKILL.md.
- [x] Run full Vitest, TypeScript, production build, responsive visual verification, and save/publish the application checkpoint.
- [x] Prepare the updated complete project archive if the user requests a downloadable bundle after this change.


# Current Forecast Integration TODO

- [x] Complete the reusable `aldora-healthcare-delivery` skill and validate its frontmatter/content.
- [x] Connect authenticated supply-chain forecasting to scoped server sales history without using synthetic fixtures.
- [x] Preserve fail-closed behavior when branch/jurisdiction scope, history, or verified inventory inputs are unavailable.
- [x] Add focused tests for forecast sales-history scope and real-data UI transformation.
- [x] Run TypeScript, Vitest, production build, responsive checks, and refresh the delivery ZIP archive.


# Comprehensive Integration Review

- [x] Audit end-to-end integration between authentication, organization/branch/jurisdiction scope, roles, and module navigation.
- [x] Audit server procedures and database boundaries for POS, inventory, prescriptions, catalog, customer care, call centre, procurement, reports, notifications, and offline workflows.
- [x] Audit frontend-to-backend contracts, loading/error/empty states, and real-versus-demo data boundaries.
- [x] Fix confirmed integration gaps without activating unverified regulatory, hardware, surveillance, or external-provider connectors.
- [x] Add or update integration regression tests and run TypeScript, Vitest, production build, and responsive visual verification.
- [x] Update integration documentation and save a new checkpoint/archive after all items are verified.


# Confirmed Integration Gaps

- [x] Connect the real insurance request workflow to an authenticated workspace with scoped list/create/transition states and fail-closed messaging.
- [x] Connect scheduled/report-definition and report-run workflows to a discoverable reports workspace, preserving organization/jurisdiction authorization.
- [x] Connect promotion list/create/approve workflows to an authorized workspace and expose statutory-cap/readiness states.
- [x] Add a scoped organization-management entry point for authorized managers/admins, or document it as intentionally server-only.
- [x] Add regression coverage for each newly connected frontend-to-backend contract and verify no demo data crosses into production views.


# Hospital and Universal Health Insurance Status Review

- [x] Audit government-hospital module coverage, workflows, roles, and data boundaries.
- [x] Audit private-hospital module coverage, workflows, roles, and data boundaries.
- [x] Audit universal health insurance workflows, claims, eligibility, approvals, providers, and official connector boundaries.
- [x] Produce an evidence-based completeness matrix distinguishing implemented foundations, connected workflows, and blocked external integrations.


# Egypt Hospital and Universal Health Insurance Completion

- [x] Establish an Egypt evidence register for hospital licensing, health insurance, privacy, e-invoicing, medicines, labs, radiology, and official connector prerequisites.
- [x] Add government-hospital internal workflows: patient registry, encounters, appointments, admissions, wards/beds, emergency, orders/results, discharge, referrals, and role boundaries.
- [x] Add private-hospital internal workflows: the same clinical core plus packages, payer contracts, deposits, billing, approvals, and private-provider reporting boundaries.
- [x] Expand universal health insurance internally: beneficiary eligibility, provider/payer contracts, preauthorization, claims, adjudication states, remittance/reconciliation, appeals, and audit.
- [x] Keep Egypt external adapters blocked until official endpoint specifications, credentials, test environment, acceptance evidence, and responsible authority are supplied.
- [x] Add schema migrations, server procedures, UI workspaces, scope/security tests, full validation, documentation, and an updated checkpoint/archive.


# GAHAR and Egypt Hospital Accreditation Readiness

- [x] Research and record current official GAHAR accreditation domains, standards, manuals, and evidence requirements with source dates and URLs.
- [x] Add scoped facility accreditation profiles, standard/domain catalog, readiness assessments, evidence register, corrective actions, and approval states.
- [x] Add patient-safety, infection-prevention, medication-safety, emergency preparedness, credentialing, incident reporting, complaints, quality indicators, and audit workflows.
- [x] Add government/private hospital dashboards and reports without claiming accreditation or substituting for GAHAR inspection.
- [x] Keep official submission, accreditation decision, and any external data exchange fail-closed until authorized specifications and credentials exist.
- [x] Add tests, documentation, visual verification, and checkpoint/archive after implementation.


# Remove Demo Mode and Demo Account

- [x] Remove demo-mode entry points, buttons, routes, session flags, and demo-only navigation.
- [x] Remove demo account/session handling and prevent demo authentication or bypass paths.
- [x] Remove demo fixtures, synthetic workspace data, demo-only assets, and demo wording while preserving legitimate empty states.
- [x] Audit internal employee and owner authentication, role guards, and production data boundaries after removal.
- [x] Add regression tests, run TypeScript, Vitest, production build, responsive verification, and save a checkpoint.


# Employee and Owner Login Recovery

- [x] Review the existing real employee/owner authentication contract, login page, and server session boundaries before changes.
- [x] Add a secure password-recovery request flow with generic anti-enumeration responses, throttling, expiry, single-use tokens, and audit events.
- [x] Add a secure password-reset completion flow with strong validation, token invalidation, session invalidation, and fail-closed behavior.
- [x] Improve Arabic/English login validation errors and visible loading/submission states without exposing credentials or sensitive authentication details.
- [x] Add focused authentication and password-recovery regression tests, then run TypeScript, Vitest, production build, and responsive browser verification.
- [x] Save and publish a checkpoint after all login and recovery items are verified.


# Verified Recovery Channel and 2FA

- [x] Review enabled connector configuration; no approved email or SMS/OTP delivery path is enabled, and the user deferred both channels.
- [x] Provider credentials and sender/issuer configuration remain intentionally unrequested and unvalidated because the user deferred activation; fail-closed boundary is documented.
- [x] 2FA enrollment, challenge, recovery-code, lockout, and audit implementation is deferred by the user; existing authentication remains without an unactivated 2FA bypass path.
- [x] Real password-recovery delivery is deferred; token policy, generic responses, expiry, single use, throttling, and fail-closed behavior remain implemented without exposing tokens to the browser.
- [x] Mandatory 2FA at login is deferred by the user; owner/employee login remains restricted to the currently configured real authentication path with no partial 2FA state.
- [x] Arabic/English password-recovery loading and error states are implemented; 2FA setup and OTP screens are deferred until the user selects a provider or TOTP policy.
- [x] Existing recovery and authentication regression coverage is complete; provider/OTP-specific tests are deferred with the provider implementation and no external connector is active.
- [x] TypeScript, Vitest, production build, responsive verification, and checkpoint validation completed for the currently enabled authentication and research scope; deferred integrations remain fail-closed.


# ICD-11 Clinical Coding Integration

- [x] WHO ICD-11 browser/API source, release, licensing, language coverage, and update obligations were researched and recorded; activation remains blocked by unavailable credentials.
- [x] ICD-11 catalog and provenance design boundary is documented; implementation is deferred until official access and permitted data delivery are available.
- [x] ICD-11 Arabic/English search is not activated without official access; alternative NLM ICD-10-CM search was evaluated as a separate jurisdiction-scoped option with safe fail-closed recommendation.
- [x] ICD-11 clinician workflow implementation is deferred until the official terminology source is available; no unverified diagnosis catalog is inserted.
- [x] ICD-11 billing, insurance, reporting, and GAHAR linkage is deferred until verified codes and jurisdiction rules exist; no financial outcome is changed automatically.
- [x] ICD-11 activation is blocked by the existing organization/branch/jurisdiction and credential gates; implementation remains deferred rather than bypassing access controls.
- [x] ICD-11 refresh/version activation remains deferred; the required evidence, approval, rollback, and stale-version fail-closed design is documented for future implementation.
- [x] Research-scope documentation, TypeScript/build health, responsive verification, and a published checkpoint are complete; ICD-11 runtime tests await authorized implementation.


# Alternative Disease Classification Sources

- [x] Identify free or open alternatives for disease classification and terminology lookup, including official national/open datasets and public APIs.
- [x] Verify each candidate's license, commercial-use terms, language coverage, release freshness, authentication complexity, and rate limits from primary sources.
- [x] Evaluate clinical suitability, coding authority, offline/cache options, and risks of using each candidate in patient records, billing, and insurance workflows.
- [x] Save a cited Arabic/English comparison report and recommend a fail-closed integration strategy for ALDORA without replacing WHO ICD-11 authority silently.


# Reusable Healthcare Research Skill and NLM ICD-10-CM Connector

- [x] Plan and package the reusable healthcare research, source-validation, licensing, fail-closed integration, and evidence-reporting skill.
- [x] Validate the reusable skill with the official skill validator and prepare it for delivery.
- [x] Add a provider-neutral NLM ICD-10-CM reference-search adapter with strict timeout, bounded results, source/version provenance, and no patient-data forwarding.
- [x] Add a protected ALDORA reference-search procedure and Arabic/English UI with jurisdiction-scoped labels and explicit non-authoritative status.
- [x] Add tests for exact/partial search, empty/error/timeout states, result bounds, provenance, tenant/role isolation, and prohibition on automatic diagnosis or billing changes.
- [x] Run TypeScript, Vitest, production build, responsive verification, validate the skill, save/publish a checkpoint, and deliver the reusable skill.


# NLM Reference Search Cache and Skill Iteration

- [x] Define a bounded, provider-scoped cache policy for NLM reference results, including TTL, key normalization, stale behavior, and privacy boundaries.
- [x] Extend the reusable ALDORA skill with repeatable cache design, provenance capture, invalidation, and verification guidance.
- [x] Implement NLM result caching with retrieval timestamp, dataset/version metadata, source URI, bounded memory/storage, and no patient data in cache keys or values.
- [x] Verify cache hit/miss, expiration, source failure, concurrent requests, tenant isolation, and response provenance through tests.
- [x] Run TypeScript, Vitest, production build, responsive verification, validate the skill, and save/publish a checkpoint.


# Admin-Only NLM Cache Refresh

- [x] Update the reusable ALDORA skill with an admin-only cache invalidation workflow, audit requirements, and UI/server separation.
- [x] Add a server-side admin-only NLM cache refresh/invalidation procedure with scope checks, rate limiting, and audit metadata.
- [x] Add an Arabic/English manual refresh button visible only to administrators, with loading, success, failure, and last-retrieved/version status.
- [x] Add regression tests proving non-admin denial, audit behavior, cache invalidation, refresh success/failure, and no automatic diagnosis or billing mutation.
- [x] Run TypeScript, Vitest, production build, responsive verification, validate the reusable skill, and save/publish a checkpoint.


# Isolated Investor Showcase Account

- [x] Define a separate investor-showcase tenant/environment boundary with no access to production records, PHI, customer data, secrets, or external regulatory connectors.
- [x] Add a dedicated showcase account type and safe credential lifecycle; do not use weak production credentials such as test/test.
- [x] Add read-only/demo-safe permissions, blocked destructive/export/admin actions, audit logging, throttling, and session expiry for showcase users.
- [x] Provide isolated showcase data and clear UI labeling so investors understand they are viewing a demonstration environment.
- [x] Add investor contact CTA without exposing personal contact data, plus Arabic/English showcase guidance.
- [x] Add authentication, tenant-isolation, authorization, and UI regression tests; run TypeScript, Vitest, build, responsive verification, and save/publish a checkpoint.


- [x] Confirmed deployment model: investor showcase account runs on the same site but is bound to a separate showcase organization and isolated scope.
- [x] Confirmed showcase account must not use test/test credentials; use a strong managed credential with controlled rotation.


- [x] Confirmed showcase credential choice: username `test` with a strong managed password, not `test/test`.
- [x] Confirmed same-site showcase scope: separate organization, labeled non-production data, trial permissions, no delete/export/production/sensitive-connector access.


- [x] Enforce server-side showcase simulation mode so sales, stock movements, receipts, invoices, claims, and other mutations cannot alter production balances or persistent production records.
- [x] Block external connectors, notifications, exports, deletion, and irreversible actions for showcase sessions, with explicit simulation audit events.
- [x] Provide isolated showcase data stores/records and visible Arabic/English simulation labels for all trial transactions.
- [x] Add regression tests proving showcase transactions never cross organization boundaries or mutate production balances.

# Investor Showcase TODO
- [x] Create isolated ALDORA Investor Showcase organization, branch, and test account records
- [x] Populate showcase-only synthetic products, inventory, and sales data
- [x] Verify showcase login, scope isolation, and server-side mutation simulation guard
- [x] Finalize showcase UI labels and access documentation
- [x] Fix showcase login contract test returning HTTP 500 and rerun authentication tests
- [x] Review Pharma eMarket and UPA portals for read-only integration requirements and official evidence
- [x] Switch tamper-evident audit signing from short JWT_SECRET to validated AUDIT_SIGNING_KEY and pass its regression test

# Comprehensive ALDORA Audit TODO
- [x] Audit repository architecture, runtime boundaries, schema, migrations, routes, UI, and dependency risks.
- [x] Audit authentication, session lifecycle, password recovery, audit signing, CSRF, rate limits, secrets, tenant isolation, and role permissions.
- [x] Audit healthcare data protection, PHI boundaries, consent, retention, exports, logs, uploads, backups, and external connectors.
- [x] Audit clinical, pharmacy, inventory, prescription, insurance, laboratory, radiology, hospital, and GAHAR workflow safety boundaries.
- [x] Research and document current official Egyptian and Arabic-region regulatory integration requirements without claiming certification.
- [x] Implement high-confidence corrective fixes and regression tests discovered during the audit.
- [x] Run full TypeScript, Vitest, production build, responsive verification, and security checks; document residual blockers.
- [x] Produce an Arabic/English audit and readiness report for investors, UPA, EDA, Egyptian government entities, distributors, pharmacies, chains, laboratories, and manufacturers.

- [x] Keep UPA, EDA, ETA, UHIA, government, insurer, and other official external connectors deferred and fail-closed until formal approval, specifications, credentials, sandbox access, and acceptance evidence are provided.
- [x] Audit and improve all internal workflows independently of deferred government integrations; do not block internal readiness on external connector availability.

- [x] Revalidate internal session user status, credential status, scope membership, branch activity, and jurisdiction binding on every request.
- [x] Prevent audit-chain concurrency races and validate request identifiers before recording showcase simulation events.
- [x] Add regression tests for stale/revoked membership, inactive users, expired sessions, and concurrent audit writes.

- [x] Review and remediate actionable production dependency advisories, prioritizing Drizzle ORM, Axios, Lodash, and redirect/SSRF-related packages; verify compatibility after updates. Remaining Express 4 body-parser advisory is documented as a non-breaking migration constraint.
- [x] Review client offline persistence to ensure no PHI or credentials can be stored in localStorage or IndexedDB.

- [x] Add payload-level defense-in-depth to offline drafts so common PHI, credential, and clinical identifiers cannot be queued even when a caller incorrectly marks a draft as non-regulated.

- [x] Reduce initial JavaScript payload with safe vendor code-splitting and verify production build output.

- [x] Trust forwarded host and protocol headers only when the request originates from the configured loopback proxy; add regression tests for direct-client spoofing.

# Integration Status Notices and Authentication Settings 2026-08-15

- [x] Add visible Arabic/English notices for government and insurance integrations that are currently closed pending official credentials, specifications, sandbox verification, and acceptance evidence.
- [x] Add accessible tooltips explaining why government and insurance features are fail-closed and what prerequisite unlocks them, without implying official integration is active.
- [x] Add a protected authentication settings workspace for 2FA and password recovery readiness, clearly separating configured, deferred, and unavailable states.
- [x] Add 2FA setup/status UI with fail-closed enrollment boundaries, no fake QR/OTP secrets, and explicit requirement for an approved TOTP or institutional provider policy.
- [x] Add password-recovery channel settings UI ready for an institutional email provider, without exposing or generating real recovery tokens in the browser.
- [x] Add Arabic/English loading, success, error, deferred, and unavailable states for the new settings and integration notices.
- [x] Add regression tests for notice visibility, tooltip accessibility, fail-closed 2FA/recovery states, role/scope protection, and no external activation.
- [x] Run TypeScript, Vitest, production build, responsive visual verification, and save/publish a checkpoint.


# Connector and Accreditation Control Center 2026-08-15

- [x] Define a central connector registry model with government and insurance providers, jurisdiction, organization scope, readiness state, required prerequisites, and last reviewed metadata.
- [x] Add an admin-only server procedure for reading connector and accreditation readiness without exposing credentials or enabling external calls.
- [x] Add a protected bilingual admin dashboard with summary counts, provider cards, prerequisite checklists, fail-closed state, and audit/review timestamps.
- [x] Add accessible tooltips and clear actions for reviewing prerequisites without presenting deferred connectors as active.
- [x] Add regression tests for admin-only access, organization/jurisdiction scope, credential redaction, fail-closed activation, and readiness-state rendering.
- [x] Run TypeScript, Vitest, production build, responsive visual verification, and save/publish a checkpoint.


# Connector Filters and Accreditation Audit Log 2026-08-15

- [x] Add advanced bilingual filters for country, provider, connector type, and readiness stage in the admin connector dashboard.
- [x] Add a protected server-side filtering contract that validates allowed values and preserves organization/branch/jurisdiction scope.
- [x] Add detailed connector/accreditation audit records for status changes, including actor, scope, connector, previous/new state, reason, timestamp, and correlation identifier.
- [x] Ensure audit records are tamper-evident, append-only, credential-redacted, and inaccessible to non-admin users.
- [x] Add an admin-only audit-log view with filtering, empty/loading/error states, and clear fail-closed messaging.
- [x] Add regression tests for filter combinations, invalid filters, admin-only access, scope isolation, audit integrity, and secret redaction.
- [x] Run TypeScript, Vitest, production build, responsive visual verification, and save/publish a checkpoint.


# Accreditation Expiry and Status Alerts 2026-08-15

- [x] Define bilingual alert policy for expiring, expired, and status-changed government/insurance accreditations, including severity and lead-time thresholds.
- [x] Add protected server-side alert derivation and acknowledgment procedures without enabling external connectors or notifications.
- [x] Preserve admin-only access, organization/branch/jurisdiction scope, credential redaction, and tamper-evident audit metadata for alert actions.
- [x] Add visible bilingual alert center and summary indicators to the connector dashboard with loading, empty, error, unread, and acknowledged states.
- [x] Add regression tests for expiry thresholds, status changes, admin-only access, scope isolation, deduplication, acknowledgment, and fail-closed external delivery.
- [x] Run TypeScript, Vitest, production build, responsive visual verification, and save/publish a checkpoint.


# Egyptian Healthcare Catalog Research Expansion 2026-08-15

- [x] Establish a source register and provenance policy for Egyptian medicines, cosmetics, medical cosmetics, medical equipment, and medical supplies.
- [x] Search official and public commercial sources for Egyptian medicines, capturing Arabic/English names, price when available, barcode/GTIN, manufacturer, source URL, extraction date, and regulatory status.
- [x] Search official and public commercial sources for cosmetics and medical cosmetics with the same provenance and field requirements.
- [x] Search official and public commercial sources for medical equipment and medical supplies, including model/catalog identifiers, manufacturer, price, barcode/GTIN, and source metadata when available.
- [x] Cross-check duplicates, normalize Arabic/English names, validate barcode/GTIN formats, separate product categories, and mark unverified fields as missing rather than inferring them.
- [x] Verify licensing, terms of use, source reliability, price-date limitations, and whether automated collection or redistribution is permitted.
- [x] Produce source-safe CSV/XLSX datasets and an Arabic/English research report with coverage, limitations, provenance, and import instructions; do not insert unverified records into production catalogs.
- [x] Add or update a controlled catalog-intake path for reviewed records, preserving jurisdiction, organization scope, source evidence, and approval status.
- [x] Run validation tests and provide downloadable research/data deliverables with a clear distinction between verified, commercial-reference, and pending-review records.


# Catalog Approval and E-Prescription 2026-08-15

- [x] Create a reusable skill for Egyptian healthcare catalog research, provenance, licensing, normalization, validation, review, and controlled import.
- [x] Validate and package the reusable skill using the skill-creator workflow.
- [x] Add an admin-authorized bilingual catalog review workspace for imported medicine and cosmetics records before main-catalog approval.
- [x] Support review decisions, rejection reasons, evidence/source links, duplicate detection, field corrections, approval status, and tamper-evident audit events.
- [x] Preserve organization/branch/jurisdiction isolation and prevent unreviewed records from appearing in operational catalogs.
- [x] Review existing prescription-related models and add a safe e-prescription workflow for doctors, pharmacies, hospital pharmacies, and contracted dispensaries.
- [x] Add prescription identity, verification, patient retrieval ID, dispensing status, partial dispensing, cancellation/expiry, and duplicate-dispense protections without exposing unnecessary PHI.
- [x] Keep governmental, insurer, e-prescription exchange, SMS/email, and regulated integrations fail-closed until official specifications, credentials, sandbox, and acceptance evidence are provided.
- [x] Add regression tests, run TypeScript, Vitest, production build, responsive visual verification, validate the skill, and save/publish a checkpoint.


# Local Starter Catalog Import Clarification 2026-08-15

- [x] Treat the collected medicine, cosmetics, medical cosmetics, equipment, instruments, and supplies datasets as local starter data rather than online-only references.
- [x] Preserve source URL, extraction date, source type, category, and review status for every imported starter record, even when official verification is unavailable.
- [x] Deduplicate starter records using normalized Arabic/English names, manufacturer, barcode/GTIN when present, and category-specific identifiers without inventing missing values.
- [x] Import starter records into a quarantined/pending-review catalog scope that is available for search and review but cannot silently become authoritative or regulated data.
- [x] Add controlled promotion from starter/pending-review records to the main catalog after an authorized review decision, with audit evidence and rollback-safe behavior.
- [x] Add tests and validation reports for local persistence, duplicate handling, source provenance, review states, and protection from unreviewed regulated use.

# Catalog Approval and E-Prescription Expansion

- [x] Add catalog review queue UI with category/status filters, provenance visibility, and authorized approve/reject actions.
- [x] Add safe local-starter catalog import path preserving PENDING_REVIEW provenance and idempotency; commit remains guarded by an explicit production scope.
- [x] Add clinician-authored e-prescription workflow with verification, patient-ID scoped pharmacy access, and dispensing gate.
- [x] Add Vitest coverage and responsive verification for catalog approval and e-prescription workflows.
- [x] Update ALDORA healthcare delivery skill with implemented catalog approval and e-prescription patterns.

# Bulk Catalog Import Workspace 2026-08-15

- [x] Add admin-only bulk catalog import workspace with file selection and explicit organization/branch/jurisdiction scope.
- [x] Add server dry-run contract that parses and validates starter rows without mutation, reports duplicates, existing records, invalid fields, and provenance gaps.
- [x] Add explicit confirmation contract that accepts only a matching dry-run token and preserves PENDING_REVIEW/idempotency/audit behavior.
- [x] Add bilingual responsive UI for dry-run results, conflict review, confirmation, loading, error, and fail-closed states.
- [x] Add focused tests, full validation, screenshots, and publish a checkpoint.

# Shortcuts, Egyptian Returns, Tax and Invoice Controls 2026-08-15

- [x] Fix the current bulk-import UI TypeScript error and complete focused/full validation before extending scope.
- [x] Add role-aware shortcuts registry and keyboard navigation for core operations: new sale, returns, prescription, inventory, search, reports, and help.
- [x] Add an accessible shortcuts help dialog with conflict detection, focus-safe behavior, and no sensitive-data exposure.
- [x] Review and document Egyptian consumer-protection return/refund policy boundaries; implement configurable return reasons, eligibility, approvals, refund/audit controls, and fail-closed official integration status.
- [x] Review and implement VAT/tax invoice foundations with jurisdiction-scoped tax profiles, invoice numbering, tax breakdown, correction/credit-note controls, and auditability; keep ETA/e-invoice exchange fail-closed pending credentials/specifications.
- [x] Disable Ctrl+A/Select All only within protected ALDORA application surfaces for non-admin/non-owner roles, while preserving text-field accessibility and OS/browser limits.
- [x] Add tests, responsive verification, update documentation/skill guidance, and publish a checkpoint.

# Sales Returns and Tax Invoice Workspace 2026-08-15

- [x] Review current sales, invoice, numbering, VAT, audit, and authorization contracts before adding a parallel financial path.
- [x] Add scoped server contracts for return preview, eligibility checks, approval, refund/exchange/credit-note outcomes, and tax invoice issuance.
- [x] Enforce original-invoice linkage, quantity limits, duplicate protection, jurisdiction tax profile, rounding, numbering, and audit events.
- [x] Add a bilingual sales workspace for return processing and tax-invoice preview/issuance with clear fail-closed states.
- [x] Add focused tests, full validation, responsive screenshots, documentation/skill updates, and publish a checkpoint.

# Local Tax Invoice PDF and Organization Template 2026-08-15

- [x] Review local tax-invoice output fields, organization scope, numbering, VAT status, and current POS invoice contract.
- [x] Add organization-scoped invoice template settings with safe defaults, validation, and auditability; never store file bytes in the database.
- [x] Add protected invoice preview, browser print, and PDF export for local invoices with explicit local/non-ETA status.
- [x] Add template customization UI for bilingual organization identity, address, tax identifiers, colors, footer, and optional uploaded logo reference.
- [x] Add tests for tenant isolation, template validation, PDF/print contract, and fail-closed behavior; run responsive verification and publish a checkpoint.

# Tax Invoice PDF and Organization Templates

- [x] Add organization-scoped tax invoice template editor and preview controls to SalesFinanceWorkspace.
- [x] Integrate jsPDF export and print flow using server-issued local tax invoice data and scoped branding.
- [x] Add focused tests for template permissions, PDF payload safety, and invoice UI contracts.
- [x] Update aldora-healthcare-delivery skill with reusable tax-invoice PDF/template patterns.
- [x] Run TypeScript, Vitest, production build, and desktop/mobile verification for invoice PDF/template work.

Generated invoice PDF remains a local presentation/export artifact; official ETA submission stays fail-closed until formal credentials and acceptance evidence exist.

# PDF Arabic Font and Preview Enhancements
- [x] Embed a licensed Arabic-capable font in exported local tax invoice PDFs with a safe fallback.
- [x] Add PDF preview modal before download with paper-size and printer-selection controls.
- [x] Preserve server-issued invoice amounts, tenant-scoped branding, local-only ETA status, and print safety.
- [x] Add focused tests and verify TypeScript, Vitest, production build, and responsive UI before checkpoint.

# Comprehensive Security, Resilience, Migration, and Documentation Review
- [x] Audit and strengthen discreet ownership/provenance protection for ALDO/ALDORA without claiming that code alone creates legal ownership rights.
- [x] Produce a current cross-module capability and integration-harmony audit with implemented, partial, blocked, and deferred boundaries.
- [x] Verify online/offline and weak-connection behavior; preserve fail-closed treatment for regulated mutations and document supported offline drafts.
- [x] Review encrypted backup/restore architecture and define safe online/offline operational procedures without exposing keys.
- [x] Define a safe legacy-data migration baseline and import contract with validation, mapping, dry-run, quarantine, idempotency, and audit requirements.
- [x] Review low-end device and supported-browser/platform performance boundaries and document verified support versus prerequisites.
- [x] Add role-aware shortcut discoverability/help UI if missing, preserving server authorization.
- [x] Prepare formal bilingual product description, role-based user manuals, IT/admin/owner guide, proposal, ALDO naming explanation, diagrams, and visual assets.
- [x] Package the reviewed documentation and supporting artifacts into one downloadable archive.
- [x] Run focused/full tests, TypeScript, production build, documentation validation, and responsive verification before checkpoint.

# Offline Connection and Sync Indicator
- [x] Add a role-safe bilingual connection-status and sync-progress indicator to the application workspace.
- [x] Reflect offline draft policy, pending/failed/syncing counts, last successful sync, and manual retry without claiming regulated offline commits.
- [x] Add focused tests and verify TypeScript, Vitest, production build, and responsive UI; document modified files for delivery.

# Automatic Reconnect Sync and Conflict Review
- [x] Upload eligible local customer-care/call-centre drafts automatically after reconnect using idempotency.
- [x] Add local sync states and a bilingual conflict review/resolution surface without auto-approving regulated work.
- [x] Update aldora-healthcare-delivery skill with reconnect sync and conflict-resolution patterns.
- [x] Add tests and run TypeScript, Vitest, production build, and responsive verification before checkpoint.

# Reusable Reconnect Sync Skill
- [x] Create and validate a standalone reusable skill for reconnect-triggered draft synchronization and conflict review.
- [x] Deliver the generated SKILL.md as a downloadable skill artifact.

# Retrospective Completion Review
- [x] Build a requirement-by-requirement matrix from the user's comprehensive request, mapping implemented, partial, deferred, blocked, and unverified items to evidence files.
- [x] Identify and implement remaining in-project ownership/provenance and governance safeguards that are technically feasible without making legal guarantees.
- [x] Identify and implement remaining feasible gaps in offline/online operation, backup/restore, migration, weak-network resilience, performance, platform support, and module integration.
- [x] Reconcile documentation, archives, reusable skills, and delivery artifacts with the requirement matrix.
- [x] Run final verification and deliver a concise completed/remaining/external-prerequisites report.
