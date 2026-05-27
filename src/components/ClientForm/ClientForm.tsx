import { useState } from 'react'
import type { ClientData, FormErrors } from '../../types'
import styles from './ClientForm.module.scss'

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

  function inputClass(field: keyof FormErrors): string {
    return [
      styles.input,
      errors[field] ? styles['input--error'] : '',
    ].join(' ')
  }

  const fields = [
    { name: 'name',  id: 'budget-name',  type: 'text',  label: 'Full name',  placeholder: 'John Smith',        autoComplete: 'name',  modifier: 'name'  },
    { name: 'phone', id: 'budget-phone', type: 'tel',   label: 'Phone',      placeholder: '666 666 666',        autoComplete: 'tel',   modifier: 'phone' },
    { name: 'email', id: 'budget-email', type: 'email', label: 'Email',      placeholder: 'hello@example.com',  autoComplete: 'email', modifier: 'email' },
  ] as const

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Request a budget"
      className={styles.form}
    >
      <h2 className={styles.title}>Request a budget</h2>

      {hasSubmitted && Object.keys(errors).length > 0 && (
        <div
          role="alert"
          aria-live="assertive"
          className={styles.errorAlert}
        >
          Please fix the errors below before submitting.
        </div>
      )}

      <div className={styles.fields}>
        {fields.map(({ name, id, type, label, placeholder, autoComplete, modifier }) => (
          <div
            key={name}
            className={`${styles.field} ${styles[`field--${modifier}`]}`}
          >
            <label htmlFor={id} className={styles.label}>
              {label}
            </label>
            <input
              id={id}
              name={name}
              type={type}
              autoComplete={autoComplete}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              aria-required="true"
              aria-invalid={!!errors[name]}
              aria-describedby={errors[name] ? `err-${name}` : undefined}
              className={inputClass(name)}
            />
            {errors[name] && (
              <span
                id={`err-${name}`}
                role="alert"
                className={styles.errorMessage}
              >
                {errors[name]}
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={disabled}
        aria-disabled={disabled}
        className={styles.submitButton}
      >
        Request budget →
      </button>

      {disabled && (
        <p className={styles.hint}>
          Select at least one service above to proceed.
        </p>
      )}
    </form>
  )
}

export default ClientForm