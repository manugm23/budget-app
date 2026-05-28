import { useState } from 'react'
import type { Budget } from '../../types'
import servicesConfig from '../../config/services.json'
import { shortId } from '../../utils/generateId'
import { getBudgetUrl } from '../../utils/shareUrl'
import styles from './BudgetDetail.module.scss'

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
    window.location.assign('#')
  }

  if (!budget) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundIcon}>🔍</div>
        <h1 className={styles.notFoundTitle}>Budget not found</h1>
        <p className={styles.notFoundText}>
          This budget may have been deleted or the link is incorrect.
        </p>
        <button
          type="button"
          onClick={handleGoHome}
          className={styles.homeButton}
        >
          ← Back to calculator
        </button>
      </div>
    )
  }

  const shareBtnClass = [
    styles.shareButton,
    copied ? styles['shareButton--copied'] : '',
  ].join(' ')

  return (
    <main className={styles.main}>
      <button
        type="button"
        onClick={handleGoHome}
        className={styles.backButton}
      >
        ← Back to calculator
      </button>

      <div className={styles.card}>

        <div className={styles.cardHeader}>
          <div>
            <div className={styles.budgetId}>
              Budget #{shortId(budget.id)}
            </div>
            <h1 className={styles.clientName}>{budget.client.name}</h1>
            <p className={styles.date}>
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
            className={shareBtnClass}
          >
            {copied ? '✓ Link copied!' : '🔗 Share link'}
          </button>
        </div>

        <section aria-labelledby="client-heading" className={styles.section}>
          <h2 id="client-heading" className={styles.sectionTitle}>Client</h2>
          <div className={styles.clientGrid}>
            {[
              { label: 'Email', value: budget.client.email },
              { label: 'Phone', value: budget.client.phone },
            ].map(({ label, value }) => (
              <div key={label} className={styles.clientField}>
                <div className={styles.fieldLabel}>{label}</div>
                <div className={styles.fieldValue}>{value}</div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="services-heading" className={styles.section}>
          <h2 id="services-heading" className={styles.sectionTitle}>Services</h2>
          <div className={styles.servicesTable}>
            {budget.services.map((serviceId) => {
              const svc = servicesConfig.services.find((s) => s.id === serviceId)
              const extrasTotal =
                svc?.hasExtras && budget.webConfig
                  ? (budget.webConfig.pages + budget.webConfig.languages) *
                    servicesConfig.pageLanguageRate
                  : 0
              const serviceTotal = (svc?.price ?? 0) + extrasTotal

              return (
                <div key={serviceId} className={styles.serviceRow}>
                  <div>
                    <div className={styles.serviceName}>{svc?.name}</div>
                    {svc?.hasExtras && budget.webConfig && (
                      <div className={styles.serviceExtras}>
                        {budget.webConfig.pages} pages +{' '}
                        {budget.webConfig.languages} languages ×{' '}
                        {servicesConfig.pageLanguageRate}€
                      </div>
                    )}
                  </div>
                  <div className={styles.servicePrice}>{serviceTotal}€</div>
                </div>
              )
            })}
          </div>
        </section>

        <div className={styles.grandTotal}>
          <span className={styles.totalLabel}>Total:</span>
          <span className={styles.totalAmount}>
            {budget.total}{' '}
            <span className={styles.totalCurrency}>€</span>
          </span>
        </div>
      </div>
    </main>
  )
}

export default BudgetDetail