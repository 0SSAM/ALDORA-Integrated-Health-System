# Authentication System Audit: Username-Based Login for MEDORA

## 1. Current Status
The MEDORA system **already supports** username-based login for internal employee accounts. 

### Current Auth Paths:
- **Employee Login**: Uses `username` and `password`. The frontend (`Login.tsx`) has fields for these, and the backend (`routers.ts` -> `internalLogin`) verifies them against the `internal_credentials` table.
- **Admin/Owner Login**: Currently uses an **OAuth-based flow** (via `startLogin()` in `Login.tsx`). This flow syncs users from an external OAuth provider based on their `email` or `openId`.

## 2. Findings
- **Database Schema**: The `internal_credentials` table already has a `username` field. No schema changes are required to support usernames.
- **Backend Logic**: The `internalLogin` procedure in `routers.ts` handles username/password verification, session creation (via `medora_internal_session` cookie), and role-scoped access.
- **Frontend UI**: The login page already has a toggle between "Employee Login" (Username/Password) and "Admin Login" (OAuth).

## 3. The "Owner Username" Gap
The user's request is to allow the **Owner/Admin** to also log in using a simple `username` and `password` instead of relying on the OAuth/Email flow.

### Implementation Plan:
1. **Identify the Owner**: The `OWNER_OPEN_ID` is currently used to identify the owner in `server/db.ts`.
2. **Provision Owner Credential**: Create a script or manual database entry to add a record in `internal_credentials` for the owner, mapping a chosen username to the owner's `userId`.
3. **Adjust Login Logic**: Ensure the `internalLogin` procedure allows accounts with the `admin` role to log in via the username path.
4. **UI Adjustment**: The "Admin Login" button can be kept as a secure fallback, but the main username/password fields will now work for everyone, including the owner.

## 4. Security Considerations
- **Brute Force**: The system already has an `INTERNAL_LOCKOUT_MS` policy (5 failed attempts = 15 min lockout).
- **Password Policy**: Minimum 12 characters, including upper, lower, and numeric characters.
- **Audit Logging**: All internal login attempts (success and failure) are logged in the `authentication_events` table with tamper-evident hashes.
