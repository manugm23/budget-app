import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ClientForm from '../components/ClientForm/ClientForm'

describe('ClientForm', () => {
  it('renders all form fields', () => {
    render(<ClientForm onSubmit={vi.fn()} disabled={false} />)

    expect(screen.getByLabelText('Full name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Phone')).toBeInTheDocument()
  })

  it('shows error messages when submitted empty', async () => {
    const user = userEvent.setup()
    render(<ClientForm onSubmit={vi.fn()} disabled={false} />)

    await user.click(screen.getByRole('button', { name: /request budget/i }))

    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Phone is required')).toBeInTheDocument()
  })

  it('shows error when email format is invalid', async () => {
    const user = userEvent.setup()
    render(<ClientForm onSubmit={vi.fn()} disabled={false} />)

    await user.type(screen.getByLabelText('Full name'), 'John Smith')
    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.type(screen.getByLabelText('Phone'), '666666666')
    await user.click(screen.getByRole('button', { name: /request budget/i }))

    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
  })

  it('calls onSubmit with correct data when form is valid', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ClientForm onSubmit={onSubmit} disabled={false} />)

    await user.type(screen.getByLabelText('Full name'), 'John Smith')
    await user.type(screen.getByLabelText('Email'), 'john@example.com')
    await user.type(screen.getByLabelText('Phone'), '666666666')
    await user.click(screen.getByRole('button', { name: /request budget/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Smith',
      email: 'john@example.com',
      phone: '666666666',
    })
  })

  it('does not call onSubmit when form is disabled', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ClientForm onSubmit={onSubmit} disabled={true} />)

    await user.click(screen.getByRole('button', { name: /request budget/i }))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('clears errors when user starts typing', async () => {
    const user = userEvent.setup()
    render(<ClientForm onSubmit={vi.fn()} disabled={false} />)

    await user.click(screen.getByRole('button', { name: /request budget/i }))
    expect(screen.getByText('Name is required')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Full name'), 'J')
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument()
  })
})