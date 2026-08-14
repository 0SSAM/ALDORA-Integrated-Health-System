export type DeviceTrustContext = {
  deviceIdentityVerified: boolean;
  localStorageEncrypted: boolean;
  supportedAppVersion: boolean;
  screenLockAssured: boolean;
  deviceRevocationChecked: boolean;
  sessionScopeVerified: boolean;
};

export function deviceTrustReadiness(context: DeviceTrustContext | null) {
  if (!context) return "BLOCKED" as const;
  return Object.values(context).every(Boolean) ? "READY" as const : "BLOCKED" as const;
}

export function assertDeviceTrustReady(context: DeviceTrustContext | null) {
  if (deviceTrustReadiness(context) !== "READY") throw new Error("Device trust is not ready");
  return true as const;
}
