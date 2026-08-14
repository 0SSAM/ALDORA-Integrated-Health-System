import { describe, expect, it } from "vitest";
import { assertExternalAdapterReady, externalAdapterReadiness } from "./external-adapter-policy";

describe("external adapter readiness", () => {
  const ready = { specificationsVerified: true, credentialsConfigured: true, organizationRegistered: true, humanAccepted: true };

  it("blocks until specifications, credentials, registration, and acceptance are complete", () => {
    expect(externalAdapterReadiness({ ...ready, credentialsConfigured: false })).toBe("BLOCKED");
    expect(() => assertExternalAdapterReady({ ...ready, specificationsVerified: false })).toThrow(/not ready/);
    expect(() => assertExternalAdapterReady({ ...ready, organizationRegistered: false })).toThrow(/not ready/);
    expect(() => assertExternalAdapterReady({ ...ready, humanAccepted: false })).toThrow(/not ready/);
  });

  it("allows production submission only after all readiness gates pass", () => {
    expect(externalAdapterReadiness(ready)).toBe("READY");
    expect(assertExternalAdapterReady(ready)).toBe(true);
  });
});
