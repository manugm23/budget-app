import { useState, useMemo } from 'react'
import type { Budget, SortOption } from '../types'
import servicesConfig from '../config/services.json'
import { shortId } from '../utils/generateId'
import { getBudgetUrl } from '../utils/shareUrl'
import ConfirmModal from './ConfirmModal'

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
    case 'name-az':     sorted.sort((a, b) =>
      a.client.name.localeCompare(b.client.name)
    ); break
  }

  return sorted
}

function BudgetList({ budgets, onDelete }: BudgetListProps) {
  const [search, setSearch] = useState<string>('')
  const [sort, setSort] = useState<SortOption>('date-desc')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const visible = useMemo(
    () => filterAndSort(budgets, search, sort),
    [budgets, search, sort]
  )

  function handleCopyUrl(budget: Budget): void {
    const url = getBudgetUrl(budget.id)
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(budget.id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  function handleView(id: string): void {
    window.location.assign(`#/budget/${id}`)
  }

  function handleDeleteClick(id: string): void {
    setDeletingId(id)
  }

  function handleConfirmDelete(): void {
    if (deletingId) {
      onDelete(deletingId)
      setDeletingId(null)
    }
  }

  function handleCancelDelete(): void {
    setDeletingId(null)
  }

  function sortButtonStyle(option: string): React.CSSProperties {
    const isActive = sort.startsWith(option)
    return {
      background: isActive ? '#f0fdf9' : 'transparent',
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      padding: '8px 14px',
      fontSize: 13,
      fontWeight: isActive ? 700 : 400,
      cursor: 'pointer',
      color: isActive ? '#2db887' : '#374151',
    }
  }

  const deletingBudget = budgets.find((b) => b.id === deletingId)

  return (
    <section aria-labelledby="history-heading">
      {deletingId && deletingBudget && (
        <ConfirmModal
          message={`Are you sure you want to delete the budget for ${deletingBudget.client.name}? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      <h2
        id="history-heading"
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: '#111',
          marginBottom: 20,
        }}
      >
        Current budgets:
      </h2>

      <div
        role="toolbar"
        aria-label="Filter and sort budgets"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 20,
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 160px' }}>
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              fontSize: 16,
            }}
          >
            🔍
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            aria-label="Search budgets"
            style={{
              width: '100%',
              padding: '9px 14px 9px 36px',
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              fontSize: 14,
              outline: 'none',
              background: '#fff',
              color: '#111',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="button"
          aria-pressed={sort.startsWith('date')}
          onClick={() =>
            setSort(sort === 'date-desc' ? 'date-asc' : 'date-desc')
          }
          style={sortButtonStyle('date')}
        >
          Date {sort === 'date-desc' ? '↓' : sort === 'date-asc' ? '↑' : ''}
        </button>

        <button
          type="button"
          aria-pressed={sort.startsWith('amount')}
          onClick={() =>
            setSort(sort === 'amount-desc' ? 'amount-asc' : 'amount-desc')
          }
          style={sortButtonStyle('amount')}
        >
          Amount {sort === 'amount-desc' ? '↓' : sort === 'amount-asc' ? '↑' : ''}
        </button>

        <button
          type="button"
          aria-pressed={sort === 'name-az'}
          onClick={() => setSort('name-az')}
          style={sortButtonStyle('name')}
        >
          Name
        </button>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {visible.length} budget{visible.length !== 1 ? 's' : ''} found
      </div>

      {visible.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 0',
            color: '#9ca3af',
            fontSize: 15,
          }}
        >
          {search
            ? 'No budgets match your search.'
            : 'No budgets yet. Create your first one above!'}
        </div>
      )}

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {visible.map((budget) => {
          const budgetServices = budget.services.map((serviceId) =>
            servicesConfig.services.find((s) => s.id === serviceId)
          )

          return (
            <li key={budget.id}>
              <article
                aria-label={`Budget for ${budget.client.name}, ${budget.total}€`}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 16,
                  padding: '20px 24px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr auto auto',
                  gap: 16,
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17, color: '#111' }}>
                    {budget.client.name}
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                    {budget.client.email}
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>
                    {budget.client.phone}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#374151',
                      marginBottom: 6,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Contracted services:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {budgetServices.map((service) =>
                      service ? (
                        <li
                          key={service.id}
                          style={{ fontSize: 13, color: '#374151' }}
                        >
                          • {service.name}
                          {service.hasExtras && budget.webConfig && (
                            <span style={{ color: '#6b7280' }}>
                              {' '}({budget.webConfig.pages} pages,{' '}
                              {budget.webConfig.languages} languages)
                            </span>
                          )}
                        </li>
                      ) : null
                    )}
                  </ul>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: '#9ca3af',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Total:
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#111' }}>
                    {budget.total}{' '}
                    <span style={{ fontSize: 16 }}>€</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>
                    #{shortId(budget.id)} ·{' '}
                    {new Date(budget.date).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => handleView(budget.id)}
                    aria-label={`View budget ${shortId(budget.id)}`}
                    style={{
                      background: '#f0fdf9',
                      border: '1px solid #bbf7d0',
                      borderRadius: 8,
                      padding: '6px 14px',
                      fontSize: 13,
                      cursor: 'pointer',
                      color: '#065f46',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    View →
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyUrl(budget)}
                    aria-label={`Copy link for budget ${shortId(budget.id)}`}
                    style={{
                      background: copiedId === budget.id ? '#f0fdf9' : '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: 8,
                      padding: '6px 14px',
                      fontSize: 13,
                      cursor: 'pointer',
                      color: copiedId === budget.id ? '#2db887' : '#374151',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {copiedId === budget.id ? 'Copied!' : 'Copy link'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteClick(budget.id)}
                    aria-label={`Delete budget ${shortId(budget.id)}`}
                    style={{
                      background: '#fff',
                      border: '1px solid #fecaca',
                      borderRadius: 8,
                      padding: '6px 14px',
                      fontSize: 13,
                      cursor: 'pointer',
                      color: '#dc2626',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}
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