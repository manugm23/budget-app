import { useState } from 'react'
import type { ClientData, FormErrors } from '../../types'

interface ClientFormProps {
  onSubmit: (client: ClientData) => void
  disabled: boolean
}

function validateForm(data: ClientData): FormErrors {
  const errors: FormErrors = {}

  if (!data.name.trim()) {
    errors.name = 'Name is required'
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!data.phone.trim()) {
    errors.phone = 'Phone is required'
  } else if (!/^\+?[\d\s\-()]{6,}$/.test(data.phone)) {
    errors.phone = 'Enter a valid phone number'
  }

  return errors
}

function ClientForm({ onSubmit, disabled }: ClientFormProps) {
  const [form, setForm] = useState<ClientData>({
    name: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    setHasSubmitted(true)

    const validationErrors = validateForm(form)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    onSubmit(form)
    setForm({ name: '', email: '', phone: '' })
    setErrors({})
    setHasSubmitted(false)
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 4,
    display: 'block',
  }

  function inputStyle(field: keyof FormErrors): React.CSSProperties {
    return {
      width: '100%',
      padding: '10px 14px',
      border: errors[field]
        ? '1.5px solid #ef4444'
        : '1px solid #e5e7eb',
      borderRadius: 10,
      fontSize: 15,
      outline: 'none',
      color: '#111',
      background: '#fff',
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Request a budget"
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 16,
        padding: '24px',
      }}
    >
      <h2
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#111',
          margin: '0 0 20px',
        }}
      >
        Request a budget
      </h2>

      {hasSubmitted && Object.keys(errors).length > 0 && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            marginBottom: 16,
            padding: '10px 14px',
            background: '#fef2f2',
            borderRadius: 8,
            fontSize: 13,
            color: '#991b1b',
          }}
        >
          Please fix the errors below before submitting.
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="budget-name" style={labelStyle}>
            Full name
          </label>
          <input
            id="budget-name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Smith"
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'err-name' : undefined}
            style={inputStyle('name')}
          />
          {errors.name && (
            <span
              id="err-name"
              role="alert"
              style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}
            >
              {errors.name}
            </span>
          )}
        </div>

        <div style={{ flex: '1 1 140px', display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="budget-phone" style={labelStyle}>
            Phone
          </label>
          <input
            id="budget-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="666 666 666"
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'err-phone' : undefined}
            style={inputStyle('phone')}
          />
          {errors.phone && (
            <span
              id="err-phone"
              role="alert"
              style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}
            >
              {errors.phone}
            </span>
          )}
        </div>

        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="budget-email" style={labelStyle}>
            Email
          </label>
          <input
            id="budget-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="hello@example.com"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'err-email' : undefined}
            style={inputStyle('email')}
          />
          {errors.email && (
            <span
              id="err-email"
              role="alert"
              style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}
            >
              {errors.email}
            </span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled}
        aria-disabled={disabled}
        style={{
          background: disabled ? '#d1d5db' : '#2db887',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          padding: '12px 28px',
          fontSize: 15,
          fontWeight: 600,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background 0.15s',
        }}
      >
        Request budget →
      </button>

      {disabled && (
        <p style={{ fontSize: 12, color: '#9ca3af', margin: '8px 0 0' }}>
          Select at least one service above to proceed.
        </p>
      )}
    </form>
  )
}

export default ClientForm