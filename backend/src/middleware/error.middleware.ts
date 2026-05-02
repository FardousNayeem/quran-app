import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
}

export function notFound(c: Context) {
  return c.json({ status: 404, message: "Route not found" }, 404);
}

export function onError(err: ErrorWithStatus, c: Context) {
  const rawStatus =
    err instanceof HTTPException
      ? err.status
      : err.statusCode ?? err.status ?? 500;

  const safeStatus = (
    rawStatus >= 400 && rawStatus <= 599 ? rawStatus : 500
  ) as ContentfulStatusCode;

  const isServerError = safeStatus >= 500;

  const message =
    isServerError && Bun.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  console.error(`[Error] ${safeStatus}: ${err.stack ?? err.message}`);

  return c.json({ status: safeStatus, message }, safeStatus);
}