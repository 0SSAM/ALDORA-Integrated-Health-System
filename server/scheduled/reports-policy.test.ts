import { describe, expect, it } from "vitest";
import { reportExecutionSkipReason } from "./reports";

describe("report execution lifecycle policy", () => {
  const base = { id: 7, status: "active", jurisdictionId: 3, queryKey: "sales.daily.v1" };

  it("allows only active scoped allowlisted definitions", () => {
    expect(reportExecutionSkipReason(base)).toBeUndefined();
  });

  it("skips inactive and legacy unscoped definitions", () => {
    expect(reportExecutionSkipReason({ ...base, status: "draft" })).toBe("inactive");
    expect(reportExecutionSkipReason({ ...base, jurisdictionId: null })).toBe("missing_scope");
  });

  it("skips unsupported query keys", () => {
    expect(reportExecutionSkipReason({ ...base, queryKey: "select * from sales" })).toBe("unsupported_query");
  });
});
