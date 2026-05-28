import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ServiceCard from '../components/ServiceCard/ServiceCard'

const mockService = {
  id: 'seo',
  name: 'SEO',
  description: 'Full responsive web programming',
  price: 300,
  hasExtras: false,
}

const mockWebService = {
  id: 'web',
  name: 'Web',
  description: 'Full responsive web programming',
  price: 500,
  hasExtras: true,
}

const mockWebConfig = { pages: 1, languages: 1 }

describe('ServiceCard', () => {
  it('renders service name and price', () => {
    render(
      <ServiceCard
        service={mockService}
        isSelected={false}
        onToggle={vi.fn()}
        webConfig={mockWebConfig}
        onWebConfigChange={vi.fn()}
      />
    )

    expect(screen.getByText('SEO')).toBeInTheDocument()
    expect(screen.getByText('300')).toBeInTheDocument()
  })

  it('calls onToggle when card is clicked', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()

    render(
      <ServiceCard
        service={mockService}
        isSelected={false}
        onToggle={onToggle}
        webConfig={mockWebConfig}
        onWebConfigChange={vi.fn()}
      />
    )

    await user.click(screen.getByRole('group'))
    expect(onToggle).toHaveBeenCalledWith('seo')
  })

  it('does not show web configurator for non-web services', () => {
    render(
      <ServiceCard
        service={mockService}
        isSelected={true}
        onToggle={vi.fn()}
        webConfig={mockWebConfig}
        onWebConfigChange={vi.fn()}
      />
    )

    expect(screen.queryByText('Number of pages')).not.toBeInTheDocument()
  })

  it('shows web configurator when web service is selected', () => {
    render(
      <ServiceCard
        service={mockWebService}
        isSelected={true}
        onToggle={vi.fn()}
        webConfig={mockWebConfig}
        onWebConfigChange={vi.fn()}
      />
    )

    expect(screen.getByText('Number of pages')).toBeInTheDocument()
    expect(screen.getByText('Number of languages')).toBeInTheDocument()
  })

  it('does not show web configurator when web service is not selected', () => {
    render(
      <ServiceCard
        service={mockWebService}
        isSelected={false}
        onToggle={vi.fn()}
        webConfig={mockWebConfig}
        onWebConfigChange={vi.fn()}
      />
    )

    expect(screen.queryByText('Number of pages')).not.toBeInTheDocument()
  })
})