# Operations Runbook

## Initial setup

Create the first owner/admin through the managed authentication flow, then create branches and assign users through the database-backed administration workflow. Do not place credentials, taxpayer certificates, gateway keys, or provider secrets in source control. Each branch manager must be mapped to the branch whose alerts they are allowed to read.

## Daily inventory alerts

The callback is `POST /api/scheduled/inventory-alerts`. It accepts only a platform-authenticated cron session, resolves the durable `taskUid` from `scheduled_jobs`, scans batch quantities and expiry windows, and inserts deduplicated rows into `branch_alerts` for active users whose role is `manager`. It is designed to return a 2xx response for orphaned tasks so platform retries do not create noise.

The production schedule must be created only after the project is deployed and the callback is reachable from the production URL. Use a six-field UTC cron expression such as `0 0 6 * * *` for a daily 06:00 UTC run. The current implementation queues branch-scoped alerts; a push provider or approved notification channel must be connected before `queued` records can be marked `sent`.

## Regulated operations

Sales, inventory deduction, insurance submission, fiscal submission, payroll approval, and prescription dispensing must be treated as server-confirmed operations. A browser draft or PWA cache must never be interpreted as a completed regulated transaction. Prescription extraction is an assistant: a pharmacist must review and confirm each item before the dispensing workflow can proceed.

## Release gate

Before production use, configure official integrations, verify certificates and provider contracts, test with each branch, run `pnpm check`, `pnpm test`, and `pnpm build`, verify browser flows on Windows and mobile Safari/Chrome, and review audit records for every critical mutation. Regulatory approval and payment success must be verified from the relevant external system, not inferred from a local status.
