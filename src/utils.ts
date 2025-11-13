import { DEFAULT_TOPIC } from "./config.ts";

export function sanitizeTopic(topic: string): string {
  // Only allow alphabetic characters
  const isAlpha = /^[a-zA-Z]+$/.test(topic);
  return isAlpha ? topic : DEFAULT_TOPIC;
}

export function getClientIp(req: Request): string {
  // Try to get the real IP from headers (for proxy/load balancer scenarios)
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}
