import type { WebConfig } from '../../types'
import styles from './WebConfigurator.module.scss'

interface WebConfiguratorProps {
  config: WebConfig
  onChange: (config: WebConfig) => void
}

function WebConfigurator({ config, onChange }: WebConfiguratorProps) {

  function handleSpin(field: keyof WebConfig, delta: number): void {
    const next = Math.max(1, config[field] + delta)
    onChange({ ...config, [field]: next })
  }

  const fields: {
    field: keyof WebConfig
    label: string
    tooltip: string
  }[] = [
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
    <div className={styles.configurator}>
      {fields.map(({ field, label, tooltip }) => (
        <div key={field} className={styles.row}>

          <button
            type="button"
            aria-label={`Info about ${label}`}
            title={tooltip}
            className={styles.infoButton}
          >
            ⓘ
          </button>

          <span className={styles.fieldLabel}>{label}</span>

          <div role="group" aria-label={label} className={styles.spinner}>
            <button
              type="button"
              aria-label={`Decrease ${label}`}
              onClick={() => handleSpin(field, -1)}
              disabled={config[field] <= 1}
              className={styles.spinnerButton}
            >
              −
            </button>

            <span
              aria-live="polite"
              aria-atomic="true"
              className={styles.spinnerValue}
            >
              {config[field]}
            </span>

            <button
              type="button"
              aria-label={`Increase ${label}`}
              onClick={() => handleSpin(field, 1)}
              className={styles.spinnerButton}
            >
              +
            </button>
          </div>
        </div>
      ))}

      <p className={styles.hint}>
        Each page or language adds 30€ to the base price.
      </p>
    </div>
  )
}

export default WebConfigurator