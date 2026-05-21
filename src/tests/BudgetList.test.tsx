import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BudgetList from '../components/BudgetList'
import type { Budget } from '../types'

const mockBudgets: Budget[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    date: Date.now(),
    client: {
      name: 'Ona Costa',
      email: 'ona@example.com',
      phone: '611111111',
    },
    services: ['seo'],
    webConfig: null,
    total: 300,
  },
  {
    id: 'a1b2c3d4-0000-4000-8000-000000000001',
    date: Date.now(),
    client: {
      name: 'Joan Farrés',
      email: 'joan@example.com',
      phone: '622222222',
    },
    services: ['ads', 'web'],
    webConfig: { pages: 2, languages: 1 },
    total: 990,
  },
]

describe('BudgetList', () => {
  it('renders all budgets', () => {
    render(<BudgetList budgets={mockBudgets} onDelete={vi.fn()} />)

    expect(screen.getByText('Ona Costa')).toBeInTheDocument()
    expect(screen.getByText('Joan Farrés')).toBeInTheDocument()
  })

  it('shows empty state when no budgets exist', () => {
    render(<BudgetList budgets={[]} onDelete={vi.fn()} />)

    expect(
      screen.getByText('No budgets yet. Create your first one above!')
    ).toBeInTheDocument()
  })

  it('filters budgets by name search', async () => {
    const user = userEvent.setup()
    render(<BudgetList budgets={mockBudgets} onDelete={vi.fn()} />)

    await user.type(screen.getByPlaceholderText('Search by name…'), 'Ona')

    expect(screen.getByText('Ona Costa')).toBeInTheDocument()
    expect(screen.queryByText('Joan Farrés')).not.toBeInTheDocument()
  })

  it('shows no results message when search finds nothing', async () => {
    const user = userEvent.setup()
    render(<BudgetList budgets={mockBudgets} onDelete={vi.fn()} />)

    await user.type(
      screen.getByPlaceholderText('Search by name…'),
      'nobody'
    )

    expect(
      screen.getByText('No budgets match your search.')
    ).toBeInTheDocument()
  })

  it('shows the delete modal when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(<BudgetList budgets={mockBudgets} onDelete={vi.fn()} />)

    const deleteButtons = screen.getAllByText('Delete')
    await user.click(deleteButtons[0])

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Delete budget')).toBeInTheDocument()
  })

  it('calls onDelete when confirm delete is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<BudgetList budgets={mockBudgets} onDelete={onDelete} />)

    const deleteButtons = screen.getAllByText('Delete')
    await user.click(deleteButtons[0])
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(onDelete).toHaveBeenCalledWith(mockBudgets[0].id)
  })

  it('closes modal when cancel is clicked', async () => {
    const user = userEvent.setup()
    render(<BudgetList budgets={mockBudgets} onDelete={vi.fn()} />)

    const deleteButtons = screen.getAllByText('Delete')
    await user.click(deleteButtons[0])
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})