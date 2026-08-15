import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("showcase scope reconciliation", () => {
  it("repairs scope only for an active user in an isolated showcase organization", async () => {
    const source = await readFile(
      resolve(process.cwd(), "server/db.ts"),
      "utf8"
    );
    expect(source).toContain("export async function reconcileShowcaseScope");
    expect(source).toContain('eq(internalCredentials.accountType, "showcase")');
    expect(source).toContain('eq(organizations.environment, "showcase")');
    expect(source).toContain('eq(organizations.status, "active")');
    expect(source).toContain('countryCode: "XS"');
    expect(source).toContain("active: 0");
    expect(source).toContain("onDuplicateKeyUpdate");
    expect(source).toContain(
      "export async function reconcileManagedShowcaseAccount"
    );
    expect(source).toContain("process.env.SHOWCASE_TEST_PASSWORD");
    expect(source).toContain('eq(internalCredentials.username, "test")');
    expect(source).toContain('eq(internalCredentials.accountType, "showcase")');
  });

  it("reconciles only after password verification and before the scope-backed session is created", async () => {
    const source = await readFile(
      resolve(process.cwd(), "server/routers.ts"),
      "utf8"
    );
    const verifiedPassword = source.indexOf(
      "verifyInternalPassword(input.password, credential.passwordHash)"
    );
    const reconciliation = source.indexOf(
      "await reconcileShowcaseScope(credential.userId)"
    );
    const scopeLookup = source.indexOf(
      "const scope = await getInternalScopeForUser(credential.userId)"
    );
    expect(verifiedPassword).toBeGreaterThanOrEqual(0);
    expect(reconciliation).toBeGreaterThan(verifiedPassword);
    expect(scopeLookup).toBeGreaterThan(reconciliation);
  });

  it("runs managed reconciliation once during server startup without blocking the service", async () => {
    const source = await readFile(
      resolve(process.cwd(), "server/_core/index.ts"),
      "utf8"
    );
    expect(source).toContain("await reconcileManagedShowcaseAccount()");
    expect(source).toContain(
      "the isolated showcase account remains unavailable"
    );
  });
});
