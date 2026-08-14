# ALDO Health Care Eco System — Open Prerequisites Index

**Date:** 2026-08-15  
**Purpose:** Separate implementable engineering work from dependencies that must remain blocked until authoritative evidence, isolated infrastructure, or explicit credentials are available.

## Engineering work completed and verified

The current codebase has strict organization, branch, and jurisdiction guards; readiness policies for regulated mutation, privacy, controlled substances, inventory, tax, invoice preparation, localization, audit, notifications, clinical access, patient identity, data export, offline sync, and device trust; country-pack domain coverage enforcement; fail-closed offline replay; a production-safe database test harness; all current connection-opening database tests aligned with that fail-closed guard; and source-level regulated-entrypoint coverage for the implemented POS and prescription procedures. The latest regression passed 70 test files and 220 tests, with 5 optional database tests skipped because an isolated `TEST_DATABASE_URL` is unavailable. The production build passed.

## Blocked by isolated infrastructure

| Dependency | Current state | Safe next action |
|---|---|---|
| `TEST_DATABASE_URL` | Not supplied as an isolated test database | Provide a disposable MySQL/MariaDB URL and set `TEST_DATABASE_ISOLATED=true`; run lifecycle tests only after safety validation. |
| Full tRPC/database lifecycle | Contract and schema-boundary tests exist; live persistence lifecycle is not executed | Run against isolated infrastructure, verify organization/jurisdiction isolation, then clean up test data. |

## Blocked by authoritative regulatory sources or credentials

| Dependency | Current state | Safe next action |
|---|---|---|
| Egypt medicine catalog | Source-safe workbook and methodology delivered; EDA pages did not expose a reproducible bulk/API source in this environment | Import only an authorized, reproducible EDA source with provenance and review metadata. |
| Jordan country pack | Official data portal access was refused by the hosting layer | Re-check through an authorized accessible source; do not enable the pack from snippets. |
| Qatar country pack | MoPH page is protected by anti-bot controls | Obtain an authorized source or manually verified regulatory package; do not bypass anti-bot controls. |
| Morocco country pack | AMMPS source was recorded, but complete legal, privacy, tax, and operational coverage is not verified | Complete the source-linked domain matrix and approval evidence before enabling. |
| ETA, EDA, insurance, government, payroll, and payer transports | Adapters remain readiness-gated without official API specifications, credentials, or sandbox contracts | Add adapters only after the authority or provider supplies endpoint, authentication, schema, submission, rejection, retry, and audit requirements. |

## Blocked by trusted client infrastructure

| Dependency | Current state | Safe next action |
|---|---|---|
| Trusted-device attestation | Server policy, fail-closed replay gate, UI blocked state, and contract documentation are complete; browser capabilities are intentionally not accepted as proof | Select and configure an approved native/device-attestation provider, then add verification and revocation tests. |

## Deliberately absent workflows

Standalone invoice persistence/submission, product matching from prescription extraction, clinical-trials archive generation, and unverified country activation are not represented as completed functionality. This is intentional: the platform must not claim a regulated workflow that has no verified persistence contract, source evidence, or user instruction to activate it.

## Integrity rule

> No production URL, personal data, fabricated medicine records, guessed regulatory rule, bypassed anti-bot challenge, or placeholder credential may be used to close any item in this index.
