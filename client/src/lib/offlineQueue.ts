export type OfflineDraft = {
  id: string;
  idempotencyKey: string;
  module: string;
  payload: unknown;
  regulated: boolean;
  createdAt: number;
  status?: "queued" | "conflict" | "failed";
  conflictReason?: string;
};

const KEY = "bdf-offline-drafts";
const DB_NAME = "bdf-pharma-offline";
const STORE_NAME = "drafts";

function makeKey() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") return reject(new Error("indexeddb-unavailable"));
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("indexeddb-open-failed"));
  });
}

export function canQueueOfflineDraft(draft: Pick<OfflineDraft, "regulated">): boolean {
  return draft.regulated === false;
}

export function enqueueOfflineDraft(draft: Omit<OfflineDraft, "id" | "createdAt">): OfflineDraft {
  if (!canQueueOfflineDraft(draft)) throw new Error("regulated-offline-draft-blocked");
  const idempotencyKey = draft.idempotencyKey || makeKey();
  const item: OfflineDraft = { ...draft, id: idempotencyKey, idempotencyKey, createdAt: Date.now(), status: "queued" };
  const current = JSON.parse(localStorage.getItem(KEY) ?? "[]") as OfflineDraft[];
  localStorage.setItem(KEY, JSON.stringify([...current, item]));
  void persistDraft(item);
  return item;
}

export function listOfflineDrafts(): OfflineDraft[] {
  return JSON.parse(localStorage.getItem(KEY) ?? "[]") as OfflineDraft[];
}

export function removeOfflineDraft(id: string): void {
  localStorage.setItem(KEY, JSON.stringify(listOfflineDrafts().filter(item => item.id !== id)));
  void deleteDraft(id);
}

export async function listDurableOfflineDrafts(): Promise<OfflineDraft[]> {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
      request.onsuccess = () => { db.close(); resolve((request.result as OfflineDraft[]).sort((a, b) => a.createdAt - b.createdAt)); };
      request.onerror = () => { db.close(); reject(request.error ?? new Error("draft-list-failed")); };
    });
  } catch {
    return listOfflineDrafts();
  }
}

export async function markOfflineDraftConflict(id: string, reason: string): Promise<void> {
  const drafts = listOfflineDrafts().map(item => item.id === id ? { ...item, status: "conflict" as const, conflictReason: reason } : item);
  localStorage.setItem(KEY, JSON.stringify(drafts));
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const get = store.get(id);
      get.onsuccess = () => { if (get.result) store.put({ ...get.result, status: "conflict", conflictReason: reason }); };
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("draft-conflict-failed"));
    });
    db.close();
  } catch {
    // localStorage fallback already contains the auditable conflict state
  }
}

async function persistDraft(item: OfflineDraft) {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error ?? new Error("draft-persist-failed"));
    });
    db.close();
  } catch {
    // localStorage remains the supported synchronous fallback
  }
}

async function deleteDraft(id: string) {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error ?? new Error("draft-remove-failed"));
    });
    db.close();
  } catch {
    // localStorage fallback already removed the draft
  }
}
