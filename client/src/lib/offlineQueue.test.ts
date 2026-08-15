import { describe, expect, it } from "vitest";
import { canQueueOfflineDraft, enqueueOfflineDraft } from "./offlineQueue";

describe("limited offline mode", () => {
  it("allows only non-regulated drafts", () => {
    expect(canQueueOfflineDraft({ regulated: false })).toBe(true);
    expect(canQueueOfflineDraft({ regulated: true })).toBe(false);
  });

  it("fails closed before writing a regulated draft", () => {
    expect(() => enqueueOfflineDraft({
      idempotencyKey: "regulated-1",
      module: "sales",
      payload: { total: 10 },
      regulated: true,
    })).toThrow("regulated-offline-draft-blocked");
  });
});
