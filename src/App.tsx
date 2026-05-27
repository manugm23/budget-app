import { useState, useMemo } from 'react'
import type { Budget, ClientData, WebConfig } from './types'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useHash } from './hooks/useHash'
import { calculateTotal } from './utils/pricing'
import { generateId } from './utils/generateId'
import servicesConfig from './config/services.json'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import ServiceCard from './components/ServiceCard/ServiceCard'
import PriceFooter from './components/PriceFooter/PriceFooter'
import ClientForm from './components/ClientForm/ClientForm'
import BudgetList from './components/BudgetList/BudgetList'
import BudgetDetail from './components/BudgetDetail/BudgetDetail'
import SuccessToast from './components/SuccessToast/SuccessToast'

const STORAGE_KEY = 'budgets_v1'

function App() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [webConfig, setWebConfig] = useState<WebConfig>({
    pages: 1,
    languages: 1,
  })
  const [budgets, setBudgets] = useLocalStorage<Budget[]>(STORAGE_KEY, [])
  const [toast, setToast] = useState<Budget | null>(null)
  const hash = useHash()

  const total = useMemo(
    () =>
      calculateTotal(
        selectedServices,
        servicesConfig.services,
        selectedServices.includes('web') ? webConfig : null
      ),
    [selectedServices, webConfig]
  )

  function handleToggleService(id: string): void {
    setSelectedServices((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    )
  }

  function handleSubmit(clientData: ClientData): void {
    const newBudget: Budget = {
      id: generateId(),
      date: Date.now(),
      client: clientData,
      services: selectedServices,
      webConfig: selectedServices.includes('web') ? webConfig : null,
      total,
    }
    setBudgets((prev) => [newBudget, ...prev])
    setToast(newBudget)
  }

  function handleDelete(id: string): void {
    setBudgets((prev) => prev.filter((b) => b.id !== id))
  }

  const budgetMatch = hash.match(/^#\/budget\/(.+)$/)

  if (budgetMatch) {
    return (
      <>
        <Header />
        <BudgetDetail
          budgetId={budgetMatch[1]}
          budgets={budgets}
        />
      </>
    )
  }

  return (
    <>
      <Header />

      <main
        id="main-content"
        style={{
          maxWidth: 700,
          margin: '0 auto',
          padding: '24px 20px 80px',
        }}
      >
        <Hero />

        <section aria-labelledby="services-heading">
          <h2
            id="services-heading"
            className="sr-only"
          >
            Select services
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {servicesConfig.services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={selectedServices.includes(service.id)}
                onToggle={handleToggleService}
                webConfig={webConfig}
                onWebConfigChange={setWebConfig}
              />
            ))}
          </div>
        </section>

        <PriceFooter total={total} />

        <ClientForm
          onSubmit={handleSubmit}
          disabled={selectedServices.length === 0}
        />

        <hr
          aria-hidden="true"
          style={{
            border: 'none',
            borderTop: '1px dashed #e5e7eb',
            margin: '40px 0',
          }}
        />

        <BudgetList
          budgets={budgets}
          onDelete={handleDelete}
        />
      </main>

      {toast !== null && (
        <SuccessToast
          budget={toast}
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  )
}

export default App