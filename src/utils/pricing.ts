import type { Service, WebConfig } from '../types'
import servicesConfig from '../config/services.json'

export function calculateTotal(
  selectedServiceIds: string[],
  services: Service[],
  webConfig: WebConfig | null
): number {
  let total = 0

  for (const service of services) {
    if (selectedServiceIds.includes(service.id)) {
      total += service.price

      if (service.hasExtras && webConfig !== null) {
        total += (webConfig.pages + webConfig.languages) * servicesConfig.pageLanguageRate
      }
    }
  }

  return total
}