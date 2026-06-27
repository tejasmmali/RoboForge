export type DbErrorCode = {
  code:
    | "network"
    | "unauthorized"
    | "not_found"
    | "validation"
    | "conflict"
    | "database"
    | "storage"
    | "unknown";
  message: string;
  details?: unknown;
};

export class DbError extends Error {
  readonly code: DbErrorCode["code"];
  readonly details?: unknown;

  constructor(error: DbErrorCode) {
    super(error.message);
    this.name = "DbError";
    this.code = error.code;
    this.details = error.details;
  }

  toJSON(): DbErrorCode {
    return { code: this.code, message: this.message, details: this.details };
  }
}

export function isDbError(error: unknown): error is DbError {
  return error instanceof DbError;
}

export function parseSupabaseError(error: unknown): DbError {
  if (error instanceof DbError) return error;

  const message =
    error instanceof Error ? error.message : "An unexpected error occurred.";

  const lower = message.toLowerCase();

  if (lower.includes("jwt") || lower.includes("not authenticated")) {
    return new DbError({ code: "unauthorized", message: "Please sign in to continue." });
  }
  if (lower.includes("duplicate") || lower.includes("unique")) {
    return new DbError({ code: "conflict", message: "This record already exists." });
  }
  if (lower.includes("not found") || lower.includes("0 rows")) {
    return new DbError({ code: "not_found", message: "Resource not found." });
  }
  if (lower.includes("fetch") || lower.includes("network")) {
    return new DbError({ code: "network", message: "Network error. Check your connection." });
  }

  return new DbError({ code: "database", message, details: error });
}

export async function executeQuery<T>(
  fn: () => PromiseLike<{ data: T | null; error: unknown }>,
): Promise<T> {
  const { data, error } = await fn();
  if (error) throw parseSupabaseError(error);
  if (data === null) {
    throw new DbError({ code: "not_found", message: "No data returned." });
  }
  return data;
}

export async function executeOptionalQuery<T>(
  fn: () => PromiseLike<{ data: T | null; error: unknown }>,
): Promise<T | null> {
  const { data, error } = await fn();
  if (error) throw parseSupabaseError(error);
  return data;
}

export async function executeVoidQuery(
  fn: () => PromiseLike<{ error: unknown }>,
): Promise<void> {
  const { error } = await fn();
  if (error) throw parseSupabaseError(error);
}
