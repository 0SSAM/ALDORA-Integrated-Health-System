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
- [ ] Implement branch geolocation capture with explicit admin confirmation and a manual override; never infer legal jurisdiction from IP alone.
- [x] Separate shared ERP rules from versioned country compliance packs with activation date, source URL, owner, status, and expiry/review date.
- [x] Add country-aware tax, invoicing, pricing, prescription, controlled-medicine, labeling, insurance, payroll, and reporting rule interfaces.
- [ ] Add Arabic localization architecture with RTL, country-specific terminology, currencies, calendars, numerals, and fallback translations.
- [ ] Add country-aware offline policy, sync conflict rules, and safeguards against using stale regulatory rules.
- [ ] Add admin workflow for legal-pack review, approval, rollback, and audit history.
- [x] Research and document authoritative regulatory sources for the initial Arabic-country coverage; do not fabricate legal rules or claim legal certification.
- [ ] Add country, jurisdiction, rule-version, stale-rule, and geolocation override tests.
- [x] Run TypeScript, Vitest, and production build for the multi-country changes; responsive verification remains a final release check.
- [ ] Save a multi-country checkpoint and report supported scope and legal prerequisites.

# Per-country Data Isolation Clarification

- [ ] Create a country data-boundary model so every medicine, cosmetic, medical-supply, authority, tax, invoice, price, prescription, insurance, payroll, and label record belongs to a jurisdiction profile.
- [x] Add explicit per-country catalog provenance and refresh metadata; never merge records across countries without a controlled mapping.
- [ ] Add per-country regulatory pack lifecycle with approval, effective dates, stale detection, rollback, and audit history.
- [ ] Add branch-to-country assignment with admin confirmation/manual override and deny transactions when jurisdiction is missing or stale.
- [ ] Add cross-country isolation tests for catalog search, pricing, tax, prescription, and compliance procedures.

# Comprehensive Country Compliance Requirement

- [ ] Verify each enabled country has an independent, source-linked compliance pack covering pharmacy licensing, medicines, cosmetics, medical supplies, controlled substances, prescriptions, dispensing, pricing, tax, e-invoicing, insurance, payroll, privacy, retention, localization, timezone, and audit requirements.
- [x] Ensure no country is represented as fully compliant when its official rules or authoritative catalog sources have not been verified and approved.
- [ ] Add stale-pack blocking and mandatory human/regulatory approval before regulated transactions use a new country rule set.
- [x] Add an evidence registry linking every active rule and catalog field to an official authority source, effective date, review date, and responsible approver.

# Remaining Compliance Hardening

- [x] Add explicit language and legal-authority-profile fields to jurisdiction configuration and enforce them in Regional Engine validation.
- [x] Update regional registry readiness so a country is only configured with an approved, non-stale pack and verified evidence for enabled rule keys.
- [ ] Enforce evidence linkage for every active catalog field before catalog approval and regulated use.
- [x] Add unit coverage for country code normalization, profile completeness, approval, stale-pack blocking, missing evidence, and cross-country access denial.
- [x] Block stale or unapproved packs in the Regional Engine before regulated operations.

# Enforcement Coverage Follow-up

- [ ] Apply branch-jurisdiction and compliance-pack gating to prescription upload/dispensing, invoice, insurance, payroll, reporting, and inventory mutation entry points, not only POS preparation and catalog approval.
- [ ] Require catalog evidence validation again at downstream regulated use when a product is loaded for sale, prescription, dispensing, or invoice generation.
- [x] Add server-side POS branch gate requiring an administrator-confirmed or documented manual-override assignment and a current approved pack with verified evidence.
- [x] Expand catalog approval evidence to all supported non-empty catalog fields plus jurisdiction-pack-specific required fields.

# Prescription Jurisdiction Enforcement

- [x] Add nullable branchId and jurisdictionId to prescription_intakes through non-destructive migration 0009.
- [x] Require a branch identifier and approved current prescription compliance pack before prescription upload.
- [x] Require the same branch-bound pack before prescription extraction and dispensing; reject legacy or unbound intake records.
- [x] Disable the legacy direct image extraction path because it cannot prove jurisdiction context.
- [ ] Apply equivalent gates to any future invoice, insurance, payroll, reporting, and inventory mutation procedures as those entry points are wired to the database.

# Core Operational Data Boundary

- [x] Add nullable jurisdictionId to inventory_batches and sales schema; apply non-destructive migration 0010 for inventory batches.
- [ ] Populate jurisdictionId from the confirmed branch assignment in every inventory and sale write path before allowing regulated persistence.
- [ ] Add database/query tests proving products, batches, sales, prescriptions, and catalog records cannot cross jurisdiction boundaries.

# Jurisdiction Record Policy

- [x] Add reusable server policy for product, inventory batch, sale, prescription, and catalog jurisdiction-bound records.
- [x] Add unit tests for same-country acceptance, cross-country rejection, null legacy records, and invalid jurisdiction context.
- [ ] Integrate the record policy into every database read/write query rather than relying only on isolated policy tests.
