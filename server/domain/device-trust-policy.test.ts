import { describe, expect, it } from "vitest";
import { assertDeviceTrustReady, deviceTrustReadiness, type DeviceTrustContext } from "./device-trust-policy";

const complete: DeviceTrustContext = {
  deviceIdentityVerified: true,
  localStorageEncrypted: true,
  supportedAppVersion: true,
  screenLockAssured: true,
  deviceRevocationChecked: true,
  sessionScopeVerified: true,
};

describe("device trust readiness", () => {
  it("blocks offline healthcare access when identity, encryption, version, lock, revocation, or scope is missing", () => {
    expect(deviceTrustReadiness(null)).toBe("BLOCKED");
    expect(deviceTrustReadiness({ ...complete, deviceIdentityVerified: false })).toBe("BLOCKED");
    expect(deviceTrustReadiness({ ...complete, localStorageEncrypted: false })).toBe("BLOCKED");
    expect(() => assertDeviceTrustReady({ ...complete, sessionScopeVerified: false })).toThrow(/not ready/);
  });

  it("allows access only when every device trust gate is verified", () => {
    expect(deviceTrustReadiness(complete)).toBe("READY");
    expect(assertDeviceTrustReady(complete)).toBe(true);
  });
});
