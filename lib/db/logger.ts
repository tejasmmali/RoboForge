type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = {
  scope?: string;
  userId?: string;
  meta?: Record<string, unknown>;
};

const isDev = process.env.NODE_ENV === "development";

function formatMessage(level: LogLevel, message: string, context?: LogContext) {
  const prefix = context?.scope ? `[${context.scope}]` : "[RoboForge]";
  return { level, prefix, message, ...context };
}

function emit(level: LogLevel, message: string, context?: LogContext) {
  const payload = formatMessage(level, message, context);
  if (!isDev && level === "debug") return;

  const fn =
    level === "error"
      ? console.error
      : level === "warn"
        ? console.warn
        : console.log;

  fn(payload.prefix, payload.message, payload.meta ?? "");
}

export const logger = {
  debug: (message: string, context?: LogContext) => emit("debug", message, context),
  info: (message: string, context?: LogContext) => emit("info", message, context),
  warn: (message: string, context?: LogContext) => emit("warn", message, context),
  error: (message: string, context?: LogContext) => emit("error", message, context),
  api: (message: string, meta?: Record<string, unknown>) =>
    emit("error", message, { scope: "api", meta }),
  auth: (message: string, meta?: Record<string, unknown>) =>
    emit("warn", message, { scope: "auth", meta }),
  db: (message: string, meta?: Record<string, unknown>) => {
    const code = (meta?.error as { code?: string })?.code;
    const isMissing =
      code === "PGRST205" ||
      code === "42P01" ||
      message.includes("may not exist");
    emit(isMissing ? "warn" : "error", message, { scope: "database", meta });
  },
};
