export interface Service {
  id: string
  name: string
  description: string
  price: number
  hasExtras: boolean
}

export interface WebConfig {
  pages: number
  languages: number
}

export interface ClientData {
  name: string
  email: string
  phone: string
}

export interface Budget {
  id: string
  date: number
  client: ClientData
  services: string[]
  webConfig: WebConfig | null
  total: number
}

export interface FormErrors {
  name?: string
  email?: string
  phone?: string
}

export type SortOption =
  | 'date-desc'
  | 'date-asc'
  | 'amount-desc'
  | 'amount-asc'
  | 'name-az'