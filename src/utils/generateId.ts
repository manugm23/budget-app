export function generateId(): string {
  return crypto.randomUUID()
}

export function shortId(uuid: string): string {
  return uuid.split('-')[0].toUpperCase()
}