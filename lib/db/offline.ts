import type { OfflineQueueItem } from "@/lib/db/rls";

const QUEUE_KEY = "roboforge:offline-queue";

function readQueue(): OfflineQueueItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as OfflineQueueItem[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(items: OfflineQueueItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}

export const offlineQueue = {
  enqueue(type: string, payload: Record<string, unknown>) {
    const item: OfflineQueueItem = {
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      payload,
      createdAt: new Date().toISOString(),
      retries: 0,
    };
    writeQueue([...readQueue(), item]);
    return item;
  },

  list() {
    return readQueue();
  },

  remove(id: string) {
    writeQueue(readQueue().filter((item) => item.id !== id));
  },

  clear() {
    writeQueue([]);
  },

  incrementRetry(id: string) {
    writeQueue(
      readQueue().map((item) =>
        item.id === id ? { ...item, retries: item.retries + 1 } : item,
      ),
    );
  },
};

export const offlineCache = {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(`roboforge:cache:${key}`);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T) {
    if (typeof window === "undefined") return;
    localStorage.setItem(`roboforge:cache:${key}`, JSON.stringify(value));
  },

  remove(key: string) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`roboforge:cache:${key}`);
  },
};
