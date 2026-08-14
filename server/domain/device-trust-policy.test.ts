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
  it("blocks offline healthcare access when any individual trust signal is missing", () => {
    expect(deviceTrustReadiness(null)).toBe("BLOCKED");
    const gates: Array<keyof DeviceTrustContext> = [
      "deviceIdentityVerified",
      "localStorageEncrypted",
      "supportedAppVersion",
      "screenLockAssured",
      "deviceRevocationChecked",
      "sessionScopeVerified",
    ];
    for (const gate of gates) {
      expect(deviceTrustReadiness({ ...complete, [gate]: false })).toBe("BLOCKED");
      expect(() => assertDeviceTrustReady({ ...complete, [gate]: false })).toThrow(/not ready/);
    }
  });

  it("allows access only when every device trust gate is verified", () => {
    expect(deviceTrustReadiness(complete)).toBe("READY");
    expect(assertDeviceTrustReady(complete)).toBe(true);
  });
});
