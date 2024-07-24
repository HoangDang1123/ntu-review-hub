export async function hashPassword(passwordValue) {
  const encoder = new TextEncoder();
  const data = encoder.encode(passwordValue);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
