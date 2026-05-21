import { describe, it, expect } from 'vitest'
import { generateId, shortId } from '../utils/generateId'

describe('generateId', () => {
  it('generates a valid UUID v4 format', () => {
    const id = generateId()
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    expect(id).toMatch(uuidRegex)
  })

  it('generates unique IDs each time', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
  })
})

describe('shortId', () => {
  it('returns the first segment of a UUID in uppercase', () => {
    const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    expect(shortId(uuid)).toBe('F47AC10B')
  })

  it('returns 8 characters', () => {
    const uuid = generateId()
    expect(shortId(uuid)).toHaveLength(8)
  })
})