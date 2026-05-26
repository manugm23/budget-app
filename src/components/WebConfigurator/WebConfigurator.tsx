import type { WebConfig } from '../types'

interface WebConfiguratorProps {
  config: WebConfig
  onChange: (config: WebConfig) => void
}

function WebConfigurator({ config, onChange }: WebConfiguratorProps) {

  function handleSpin(field: keyof WebConfig, delta: number): void {
    const next = Math.max(1, config[field] + delta)
    onChange({ ...config, [field]: next })
  }

  const fields: { field: keyof WebConfig; label: string; tooltip: string }[] = [
    {
      field: 'pages',
      label: 'Number of pages',
      tooltip: 'Each page adds 30€ to the total price.',
    },
    {
      field: 'languages',
      label: 'Number of languages',
      tooltip: 'Each language adds 30€ to the total price.',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {fields.map(({ field, label, tooltip }) => (
        <div
          key={field}
          style={{ display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <button
            type="button"
            aria-label={`Info about ${label}`}
            title={tooltip}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'help',
              padding: 0,
              color: '#9ca3af',
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            ⓘ
          </button>

          <span
            style={{ flex: 1, fontSize: 14, color: '#374151' }}
          >
            {label}
          </span>

          <div
            role="group"
            aria-label={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              aria-label={`Decrease ${label}`}
              onClick={() => handleSpin(field, -1)}
              disabled={config[field] <= 1}
              style={{
                width: 34,
                height: 34,
                border: 'none',
                background: '#f9fafb',
                fontSize: 18,
                color: config[field] <= 1 ? '#d1d5db' : '#374151',
                cursor: config[field] <= 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              −
            </button>

            <span
              aria-live="polite"
              aria-atomic="true"
              style={{
                width: 40,
                textAlign: 'center',
                fontSize: 15,
                fontWeight: 600,
                color: '#111',
              }}
            >
              {config[field]}
            </span>

            <button
              type="button"
              aria-label={`Increase ${label}`}
              onClick={() => handleSpin(field, 1)}
              style={{
                width: 34,
                height: 34,
                border: 'none',
                background: '#f9fafb',
                fontSize: 18,
                color: '#374151',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              +
            </button>
          </div>
        </div>
      ))}

      <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
        Each page or language adds 30€ to the base price.
      </p>
    </div>
  )
}

export default WebConfigurator