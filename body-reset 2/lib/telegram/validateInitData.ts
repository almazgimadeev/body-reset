import crypto from "crypto";

// Validates Telegram WebApp `initData` per the official algorithm:
// https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
//
// SECURITY: this must only ever run server-side (API routes / server
// actions). Never trust a telegram user id that arrives from the client
// without having been validated here first — see spec section 40/87 (no
// IDOR, don't trust client-supplied user_id).

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface ValidatedInitData {
  user: TelegramUser;
  authDate: number;
}

/**
 * Returns the parsed, validated user on success, or null if the signature
 * is invalid / expired / malformed. `maxAgeSeconds` guards against replay
 * of an old initData string (default 24h, matching common Mini App practice).
 */
export function validateTelegramInitData(
  initData: string,
  botToken: string,
  maxAgeSeconds = 60 * 60 * 24
): ValidatedInitData | null {
  if (!initData || !botToken) return null;

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const computedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  const validSignature =
    computedHash.length === hash.length &&
    crypto.timingSafeEqual(Buffer.from(computedHash, "hex"), Buffer.from(hash, "hex"));

  if (!validSignature) return null;

  const authDate = Number(params.get("auth_date") ?? 0);
  if (!authDate || Date.now() / 1000 - authDate > maxAgeSeconds) return null;

  const userRaw = params.get("user");
  if (!userRaw) return null;

  try {
    const user = JSON.parse(userRaw) as TelegramUser;
    return { user, authDate };
  } catch {
    return null;
  }
}
