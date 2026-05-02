import type { Context } from "hono";

export function notFound(c: Context) {
  return c.json({ status: 404, message: "Route not found" }, 404);
}

export function onError(err: Error, c: Context) {
  console.error(`[Error] ${err.message}`);
  const status = 500;
  return c.json({ status, message: err.message ?? "Internal Server Error" }, status);
}