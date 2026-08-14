export type OfflineDraft = { id: string; idempotencyKey: string; module: string; payload: unknown; regulated: boolean; createdAt: number };
const KEY = "bdf-offline-drafts";

export function enqueueOfflineDraft(draft: Omit<OfflineDraft, "id" | "createdAt">): OfflineDraft {
  const idempotencyKey = crypto.randomUUID();
  const item: OfflineDraft = { ...draft, id: idempotencyKey, idempotencyKey, createdAt: Date.now() };
  const current = JSON.parse(localStorage.getItem(KEY) ?? "[]") as OfflineDraft[];
  localStorage.setItem(KEY, JSON.stringify([...current, item]));
  return item;
}

export function listOfflineDrafts(): OfflineDraft[] {
  return JSON.parse(localStorage.getItem(KEY) ?? "[]") as OfflineDraft[];
}

export function removeOfflineDraft(id: string): void {
  localStorage.setItem(KEY, JSON.stringify(listOfflineDrafts().filter(item => item.id !== id)));
}
