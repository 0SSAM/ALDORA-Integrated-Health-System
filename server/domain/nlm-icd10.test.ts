import { afterEach, describe, expect, it, vi } from "vitest";
import { searchNlmIcd10Cm } from "./nlm-icd10";

describe("NLM ICD-10-CM reference adapter", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("bounds results and preserves source provenance", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([12, ["code", "name"], null, [["J10", "Influenza due to other identified influenza virus"]]]), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const results = await searchNlmIcd10Cm("influenza", { count: 500 });
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ code: "J10", jurisdiction: "US", version: "2026" });
    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get("count")).toBe("50");
    expect(requestUrl.searchParams.get("terms")).toBe("influenza");
  });

  it("rejects short terms before making a remote request", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(searchNlmIcd10Cm("x")).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails closed on malformed or unavailable source responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ invalid: true }), { status: 200 })));
    await expect(searchNlmIcd10Cm("diabetes")).rejects.toMatchObject({ code: "SERVICE_UNAVAILABLE" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 503 })));
    await expect(searchNlmIcd10Cm("diabetes")).rejects.toMatchObject({ code: "SERVICE_UNAVAILABLE" });
  });
});
