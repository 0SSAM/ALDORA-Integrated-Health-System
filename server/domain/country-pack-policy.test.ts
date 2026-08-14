import { describe, expect, it } from "vitest";
import { assertCountryPackReady, countryPackReadiness, type CountryPackEvidence } from "./country-pack-policy";

const complete = (domain: CountryPackEvidence["domain"]): CountryPackEvidence => ({ domain, sourceUrl: "https://official.example/rule", effectiveDate: "2026-01-01", localLicenseVerified: true, credentialsConfigured: true, acceptanceCriteriaVerified: true });

describe("country pack activation policy", () => {
  it("blocks incomplete or missing required domains", () => {
    const evidence = [complete("medicines"), { ...complete("pricing"), credentialsConfigured: false }];
    expect(countryPackReadiness(evidence, ["medicines", "pricing", "tax"])).toBe("BLOCKED");
    expect(() => assertCountryPackReady(evidence, ["medicines", "pricing"])).toThrow(/not ready/);
  });

  it("allows activation only when every required domain is evidenced", () => {
    const evidence = [complete("medicines"), complete("pricing"), complete("tax")];
    expect(countryPackReadiness(evidence, ["medicines", "pricing", "tax"])).toBe("READY");
    expect(assertCountryPackReady(evidence, ["medicines", "pricing", "tax"])).toBe(true);
  });
});
