// Generates a RFC 4122 UUID v4 using the browser's built-in crypto API
export function generateId(): string {
  return crypto.randomUUID()
}

// Returns a short 8-character display ID derived from the full UUID
// Used in the UI where the full UUID would be too long to show
export function shortId(uuid: string): string {
  return uuid.split('-')[0].toUpperCase()
}