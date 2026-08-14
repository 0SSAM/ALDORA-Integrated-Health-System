export type CountryPackDomain = "pharmacyLicensing" | "medicines" | "cosmetics" | "medicalSupplies" | "controlledSubstances" | "prescriptions" | "dispensing" | "pricing" | "tax" | "eInvoicing" | "insurance" | "payroll" | "privacy" | "retention" | "localization" | "audit";

export type CountryPackEvidence = { domain: CountryPackDomain; sourceUrl: string; effectiveDate: string; localLicenseVerified: boolean; credentialsConfigured: boolean; acceptanceCriteriaVerified: boolean };

export function countryPackReadiness(evidence: CountryPackEvidence[], requiredDomains: CountryPackDomain[]) {
  const byDomain = new Map(evidence.map(item => [item.domain, item]));
  return requiredDomains.every(domain => {
    const item = byDomain.get(domain);
    return Boolean(item?.sourceUrl && item.effectiveDate && item.localLicenseVerified && item.credentialsConfigured && item.acceptanceCriteriaVerified);
  }) ? "READY" as const : "BLOCKED" as const;
}

export function assertCountryPackReady(evidence: CountryPackEvidence[], requiredDomains: CountryPackDomain[]) {
  if (countryPackReadiness(evidence, requiredDomains) !== "READY") throw new Error("Country compliance pack is not ready for activation");
  return true as const;
}
