import { useState, useMemo } from 'react'
import type { Budget, SortOption } from '../../types'
import servicesConfig from '../../config/services.json'
import { shortId } from '../../utils/generateId'
import { getBudgetUrl } from '../../utils/shareUrl'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import styles from './BudgetList.module.scss'

interface BudgetListProps {
  budgets: Budget[]
  onDelete: (id: string) => void
}

function filterAndSort(
  budgets: Budget[],
  search: string,
  sort: SortOption
): Budget[] {
  const query = search.toLowerCase()
  const filtered = budgets.filter(
    (b) =>
      b.client.name.toLowerCase().includes(query) ||
      b.client.email.toLowerCase().includes(query) ||
      b.client.phone.includes(query)
  )
  const sorted = [...filtered]
  switch (sort) {
    case 'date-desc':   sorted.sort((a, b) => b.date - a.date); break
    case 'date-asc':    sorted.sort((a, b) => a.date - b.date); break
    case 'amount-desc': sorted.sort((a, b) => b.total - a.total); break
    case 'amount-asc':  sorted.sort((a, b) => a.total - b.total); break
    case 'name-az':     sorted.sort((a, b) => a.client.name.localeCompare(b.client.name)); break
  }
  return sorted
}

function BudgetList({ budgets, onDelete }: BudgetListProps) {
  const [search, setSearch]       = useState<string>('')
  const [sort, setSort]           = useState<SortOption>('date-desc')
  const [copiedId, setCopiedId]   = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const visible = useMemo(
    () => filterAndSort(budgets, search, sort),
    [budgets, search, sort]
  )

  function handleCopyUrl(budget: Budget): void {
    navigator.clipboard.writeText(getBudgetUrl(budget.id)).then(() => {
      setCopiedId(budget.id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  function handleView(id: string): void {
    window.location.assign(`#/budget/${id}`)
  }

  function handleConfirmDelete(): void {
    if (deletingId) {
      onDelete(deletingId)
      setDeletingId(null)
    }
  }

  function sortClass(option: string): string {
    return [
      styles.sortButton,
      sort.startsWith(option) ? styles['sortButton--active'] : '',
    ].join(' ')
  }

  const deletingBudget = budgets.find((b) => b.id === deletingId)

  return (
    <section aria-labelledby="history-heading" className={styles.section}>

      {deletingId && deletingBudget && (
        <ConfirmModal
          message={`Are you sure you want to delete the budget for ${deletingBudget.client.name}? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}

      <h2 id="history-heading" className={styles.heading}>
        Current budgets:
      </h2>

      <div
        role="toolbar"
        aria-label="Filter and sort budgets"
        className={styles.toolbar}
      >
        <div className={styles.searchWrapper}>
          <span aria-hidden="true" className={styles.searchIcon}>🔍</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            aria-label="Search budgets"
            className={styles.searchInput}
          />
        </div>

        <button
          type="button"
          aria-pressed={sort.startsWith('date')}
          onClick={() => setSort(sort === 'date-desc' ? 'date-asc' : 'date-desc')}
          className={sortClass('date')}
        >
          Date {sort === 'date-desc' ? '↓' : sort === 'date-asc' ? '↑' : ''}
        </button>

        <button
          type="button"
          aria-pressed={sort.startsWith('amount')}
          onClick={() => setSort(sort === 'amount-desc' ? 'amount-asc' : 'amount-desc')}
          className={sortClass('amount')}
        >
          Amount {sort === 'amount-desc' ? '↓' : sort === 'amount-asc' ? '↑' : ''}
        </button>

        <button
          type="button"
          aria-pressed={sort === 'name-az'}
          onClick={() => setSort('name-az')}
          className={sortClass('name')}
        >
          Name
        </button>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {visible.length} budget{visible.length !== 1 ? 's' : ''} found
      </div>

      {visible.length === 0 && (
        <div className={styles.empty}>
          {search
            ? 'No budgets match your search.'
            : 'No budgets yet. Create your first one above!'}
        </div>
      )}

      <ul className={styles.list}>
        {visible.map((budget) => {
          const copyClass = [
            styles.actionButton,
            styles['actionButton--copy'],
            copiedId === budget.id ? styles['actionButton--copy--copied'] : '',
          ].join(' ')

          return (
            <li key={budget.id}>
              <article
                aria-label={`Budget for ${budget.client.name}, ${budget.total}€`}
                className={styles.card}
              >
                <div className={styles.clientInfo}>
                  <div className={styles.clientName}>{budget.client.name}</div>
                  <div className={styles.clientContact}>{budget.client.email}</div>
                  <div className={styles.clientContact}>{budget.client.phone}</div>
                </div>

                <div className={styles.services}>
                  <div className={styles.servicesLabel}>Contracted services:</div>
                  <ul className={styles.servicesList}>
                    {budget.services.map((serviceId) => {
                      const svc = servicesConfig.services.find((s) => s.id === serviceId)
                      return (
                        <li key={serviceId} className={styles.serviceItem}>
                          • {svc?.name}
                          {svc?.hasExtras && budget.webConfig && (
                            <span className={styles.serviceExtras}>
                              {' '}({budget.webConfig.pages} pages,{' '}
                              {budget.webConfig.languages} languages)
                            </span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div className={styles.total}>
                  <div className={styles.totalLabel}>Total:</div>
                  <div className={styles.totalAmount}>
                    {budget.total}{' '}
                    <span className={styles.totalCurrency}>€</span>
                  </div>
                  <div className={styles.totalMeta}>
                    #{shortId(budget.id)} · {new Date(budget.date).toLocaleDateString()}
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    onClick={() => handleView(budget.id)}
                    aria-label={`View budget ${shortId(budget.id)}`}
                    className={`${styles.actionButton} ${styles['actionButton--view']}`}
                  >
                    View →
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(budget)}
                    aria-label={`Copy link for budget ${shortId(budget.id)}`}
                    className={copyClass}
                  >
                    {copiedId === budget.id ? 'Copied!' : 'Copy link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingId(budget.id)}
                    aria-label={`Delete budget ${shortId(budget.id)}`}
                    className={`${styles.actionButton} ${styles['actionButton--delete']}`}
                  >
                    Delete
                  </button>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default BudgetList