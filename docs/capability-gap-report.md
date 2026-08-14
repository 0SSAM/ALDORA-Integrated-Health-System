# ALDO Health Care Eco System — Capability and Gap Report

**Audit basis.** This report is based on the current repository routes, schema, client pages, domain policies, tests, scheduled handlers, and deployment checks. It is not a claim of feature parity with Odoo, Microsoft Dynamics, SAP, Oracle, or any other enterprise suite.

## Executive assessment

ALDO is currently a **secure healthcare pharmacy/branch ERP foundation with multi-organization and jurisdiction controls**, not a complete all-industry ERP suite. The implemented core is strongest in organization and branch access, pharmacy POS, inventory, catalog compliance evidence, prescription intake workflow, customer care/call centre, notifications, demo mode, offline drafts, and scheduled inventory alerts. Several requested domains exist only as permissions, policy vocabulary, UI placeholders, or future extension points and must not be represented as production modules until they have database models, server procedures, user interfaces, integration contracts, and tests.

| Capability area | Current evidence | Status | Safe conclusion |
|---|---|---|---|
| ERP pharmacy/POS | `erp` router, products, inventory batches, sales, sale items, FEFO planning, sale preparation/commit, offline drafts | **Implemented and tested for current scope** | Operational pharmacy/branch ERP foundation exists; accounting, procurement, manufacturing, and full finance are not present. |
| CRM / customer care | Customer profiles, care interactions, call tickets, branch and organization checks | **Partially implemented** | Customer-care and call-centre workflows exist; leads, opportunities, pipeline, campaigns, SLA analytics, and full CRM automation are absent. |
| HR / payroll | Permission vocabulary and regional rule vocabulary mention staff/payroll | **Policy-only / missing module** | No HR master data, attendance, leave, payroll ledger, payslips, benefits, or statutory payroll integration is evidenced. |
| Promotion / pricing | Discount validation and catalog/pricing policy functions | **Partially implemented** | Discount validation exists; promotion campaigns, coupons, segmentation, approval workflow, and campaign analytics are not established. |
| Development / project management | No dedicated project, issue, release, or engineering router/page was found in the audited surface | **Missing** | Must be designed as a separate module if required. |
| AI | AI chat component and built-in LLM/voice infrastructure references | **Partially implemented** | AI interaction infrastructure exists; a governed clinical decision-support, agentic operations, evaluation, audit, and human-approval layer is not complete. |
| Smart notifications | Notification tables/router/policies, read state, organization scope, scheduled inventory-alert handler | **Partially implemented** | In-app notifications and inventory alerts exist; generalized event rules, delivery channels, retries, templates, escalation, and delivery audit are not complete. |
| Periodic intelligent reports | Heartbeat scheduling, inventory-alert callback, server-owned report-definition policy, recipient-role policy, scope checks, and deterministic idempotency-key helper | **Policy foundation implemented / persisted report module missing** | Testable safety boundaries now exist for report definitions and runs, but no report tables, run history, delivery worker, sender, retry/dead-letter queue, or LLM narrative pipeline is active. |
| Multi-organization and country isolation | Organizations, memberships, branches, composite scope policy, organizationId columns, jurisdiction policies, protected current ERP paths | **Implemented for audited current paths; broader coverage pending** | Strong current boundary foundation; future tables and database-backed router lifecycle still require integration coverage. |
| Sensitive clinical data controls | Sensitive-data policy, demo/export denial, role and scope tests | **Policy and current-path controls implemented** | Reusable controls exist; full diagnostics/imaging/clinical persistence modules do not. |
| Government integration | Regulatory prerequisite documents and country source notes | **Documentation only** | No certified government API, certificate, national identifier, tax/e-invoicing, pharmacovigilance, or regulator credential integration is active. |
| Insurer integration | Insurance aging/classification helpers, scoped eligibility/preauthorization policy, lifecycle-transition policy, and readiness gate | **Policy foundation implemented / persisted integration module missing** | Eligibility and preauthorization boundaries are explicit and tested, including scope and credential gates. No payer transport, claims, adjudication, remittance, or live API workflow is active. |
| Offline operation | Offline drafts, branch binding, replay checks | **Partially implemented** | Protected offline draft/replay foundation exists; complete conflict resolution, durable sync queue, attachment handling, and offline coverage of every module are not proven. |
| Enterprise-suite parity | No evidence of complete cross-domain equivalents | **Not established** | ALDO should not be marketed as functionally equivalent to Odoo, Dynamics, SAP, Oracle, or Omip without a separate requirements and acceptance program. |

## Automated reporting and notifications

The current code supports a scheduled inventory-alert path authenticated by the Heartbeat/cron identity and restricted schedule creation. This is not the same as a general intelligent reporting platform. Before enabling automatic reports, each report needs a server-owned query, organization/jurisdiction scope, recipient authorization, timezone policy, delivery channel, retry/dead-letter behavior, idempotency key, execution history, and a user-visible audit trail. Clinical and financial reports should additionally require explicit role and export policy checks.

## Government and insurer integration prerequisites

The new insurance policy layer is deliberately non-networked. It validates request identity, composite jurisdiction/organization scope, explicit lifecycle transitions, and credential readiness; it does not call a payer or infer approval. The reporting policy layer accepts only server-owned query keys and requires recipient authorization, scope, idempotency, and sensitive-data role checks. These are safe foundations, not a substitute for persisted workflows or external certification.

Government and payer integration cannot be confirmed from UI or policy names. Each country and organization type requires an official API or approved channel, current documentation, credentials, certificates or signing keys, identity and facility registration, test and production endpoints, data-processing permissions, incident contacts, and a local compliance owner. The existing regulatory documents are activation checklists and source notes, not proof that any integration is licensed or operational.

## Recommended implementation order

The safest next product increments are: first, complete a real report definition and scheduled-delivery module using the existing heartbeat infrastructure; second, create an insurer integration boundary with eligibility and preauthorization interfaces but no live connector until credentials are supplied; third, add HR master data and payroll only after country-specific statutory requirements are verified; fourth, add promotion campaigns on top of the existing catalog and discount policies; and fifth, create government connector adapters behind explicit country and credential feature gates.

## Explicit limitations

The current project does not contain every feature requested in the comparison-suite list. It contains a tested and security-focused healthcare ERP foundation with several adjacent modules and reusable policies. A claim that it is a complete ERP/CRM/HR/government/insurance replacement would be inaccurate until the missing database schemas, procedures, screens, integrations, acceptance tests, and credentials are implemented.
