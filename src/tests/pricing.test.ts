import { describe, it, expect } from 'vitest'
import { calculateTotal } from '../utils/pricing'
import servicesConfig from '../config/services.json'

const services = servicesConfig.services

describe('calculateTotal', () => {
  it('returns 0 when no services are selected', () => {
    expect(calculateTotal([], services, null)).toBe(0)
  })

  it('calculates SEO only correctly', () => {
    expect(calculateTotal(['seo'], services, null)).toBe(300)
  })

  it('calculates Ads only correctly', () => {
    expect(calculateTotal(['ads'], services, null)).toBe(400)
  })

  it('calculates Web base price without extras', () => {
    expect(calculateTotal(['web'], services, null)).toBe(500)
  })

  it('calculates Web with pages and languages correctly', () => {
    expect(
      calculateTotal(['web'], services, { pages: 2, languages: 3 })
    ).toBe(650)
  })

  it('calculates multiple services correctly', () => {
    expect(calculateTotal(['seo', 'ads'], services, null)).toBe(700)
  })

  it('calculates all services with web extras correctly', () => {
    expect(
      calculateTotal(['seo', 'ads', 'web'], services, { pages: 1, languages: 1 })
    ).toBe(1260)
  })

  it('ignores webConfig when web service is not selected', () => {
    expect(
      calculateTotal(['seo'], services, { pages: 5, languages: 5 })
    ).toBe(300)
  })
})