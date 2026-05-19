import { useState } from 'react'
import type { Budget } from '../types'
import servicesConfig from '../config/services.json'
import { shortId } from '../utils/generateId'
import { getBudgetUrl } from '../utils/shareUrl'

interface BudgetDetailProps {
  budgetId: string
  budgets: Budget[]
}

function BudgetDetail({ budgetId, budgets }: BudgetDetailProps) {
  const [copied, setCopied] = useState<boolean>(false)

  const budget = budgets.find((b) => b.id === budgetId)

  function handleCopyUrl(): void {
    navigator.clipboard.writeText(getBudgetUrl(budgetId)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  function handleGoHome(): void {
    window.location.hash = ''
  }

  if (!budget) {
    return (
      <main
        style={{
          maxWidth: 600,
          margin: '0 auto',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 48 }}>🔍</div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: '#111',
            marginBottom: 8,
          }}
        >
          Budget not found
        </h1>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>
          This budget may have been deleted or the link is incorrect.
        </p>
        <button
          type="button"
          onClick={handleGoHome}
          style={{
            background: '#2db887',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '12px 28px',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ← Back to calculator
        </button>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px' }}>
      <button
        type="button"
        onClick={handleGoHome}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#2db887',
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 24,
          padding: 0,
        }}
      >
        ← Back to calculator
      </button>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 20,
          padding: '32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#2db887',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 4,
              }}
            >
              Budget #{shortId(budget.id)}
            </div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: '#111',
                margin: 0,
              }}
            >
              {budget.client.name}
            </h1>
            <p style={{ color: '#6b7280', fontSize: 14, margin: '4px 0 0' }}>
              {new Date(budget.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyUrl}
            aria-label="Copy shareable link"
            style={{
              background: copied ? '#f0fdf9' : '#fff',
              border: `1.5px solid ${copied ? '#2db887' : '#e5e7eb'}`,
              borderRadius: 10,
              padding: '10px 18px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              color: copied ? '#2db887' : '#374151',
              transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Link copied!' : '🔗 Share link'}
          </button>
        </div>

        <section aria-labelledby="client-heading" style={{ marginBottom: 24 }}>
          <h2
            id="client-heading"
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#374151',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 12,
            }}
          >
            Client
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {[
              { label: 'Email', value: budget.client.email },
              { label: 'Phone', value: budget.client.phone },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  background: '#f9fafb',
                  borderRadius: 10,
                  padding: '12px 16px',
                  flex: '1 1 180px',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: '#9ca3af',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginBottom: 2,
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: 15, color: '#111' }}>{value}</div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="services-heading" style={{ marginBottom: 24 }}>
          <h2
            id="services-heading"
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#374151',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 12,
            }}
          >
            Services
          </h2>
          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {budget.services.map((serviceId, index) => {
              const service = servicesConfig.services.find(
                (s) => s.id === serviceId
              )
              const extrasTotal =
                service?.hasExtras && budget.webConfig
                  ? (budget.webConfig.pages + budget.webConfig.languages) *
                    servicesConfig.pageLanguageRate
                  : 0
              const serviceTotal = (service?.price ?? 0) + extrasTotal

              return (
                <div
                  key={serviceId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 20px',
                    borderBottom:
                      index < budget.services.length - 1
                        ? '1px solid #f3f4f6'
                        : 'none',
                  }}
                >
                  <div>
                    <div
                      style={{ fontWeight: 600, fontSize: 16, color: '#111' }}
                    >
                      {service?.name}
                    </div>
                    {service?.hasExtras && budget.webConfig && (
                      <div style={{ fontSize: 13, color: '#6b7280' }}>
                        {budget.webConfig.pages} pages +{' '}
                        {budget.webConfig.languages} languages ×{' '}
                        {servicesConfig.pageLanguageRate}€
                      </div>
                    )}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 17, color: '#111' }}>
                    {serviceTotal}€
                  </div>
                </div>
              )
            })}
          </div>
        </section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'baseline',
            gap: 12,
            paddingTop: 16,
            borderTop: '2px solid #f3f4f6',
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, color: '#374151' }}>
            Total:
          </span>
          <span style={{ fontSize: 36, fontWeight: 800, color: '#111' }}>
            {budget.total}{' '}
            <span style={{ fontSize: 22 }}>€</span>
          </span>
        </div>
      </div>
    </main>
  )
}

export default BudgetDetail