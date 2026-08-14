export type AdapterReadiness = "BLOCKED" | "READY";

export function externalAdapterReadiness(input: { specificationsVerified: boolean; credentialsConfigured: boolean; organizationRegistered: boolean; humanAccepted: boolean }): AdapterReadiness {
  return input.specificationsVerified && input.credentialsConfigured && input.organizationRegistered && input.humanAccepted ? "READY" : "BLOCKED";
}

export function assertExternalAdapterReady(input: Parameters<typeof externalAdapterReadiness>[0]) {
  if (externalAdapterReadiness(input) !== "READY") throw new Error("External adapter is not ready for production submission");
  return true as const;
}
