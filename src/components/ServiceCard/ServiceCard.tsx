import type { Service, WebConfig } from '../../types'
import WebConfigurator from '../WebConfigurator/WebConfigurator'
import styles from './ServiceCard.module.scss'

interface ServiceCardProps {
  service: Service
  isSelected: boolean
  onToggle: (id: string) => void
  webConfig: WebConfig
  onWebConfigChange: (config: WebConfig) => void
}

function ServiceCard({
  service,
  isSelected,
  onToggle,
  webConfig,
  onWebConfigChange,
}: ServiceCardProps) {
  const showExtras = service.hasExtras && isSelected

  // Combine the base class with the --selected modifier, if applicable
  const cardClass = [
    styles.card,
    isSelected ? styles['card--selected'] : '',
  ].join(' ')

  const checkboxClass = [
    styles.checkboxBox,
    isSelected ? styles['checkboxBox--checked'] : '',
  ].join(' ')

  return (
    <div
      role="group"
      aria-labelledby={`service-name-${service.id}`}
      className={cardClass}
      onClick={() => onToggle(service.id)}
    >
      <div className={styles.header}>

        <div className={styles.info}>
          <div
            id={`service-name-${service.id}`}
            className={styles.name}
          >
            {service.name}
          </div>
          <div className={styles.description}>{service.description}</div>
        </div>

        <div
          className={styles.price}
          aria-label={`${service.price} euros`}
        >
          {service.price}{' '}
          <span className={styles.currency}>€</span>
        </div>

        <label
          className={styles.checkboxLabel}
          aria-label={`Add ${service.name}`}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggle(service.id)}
            aria-checked={isSelected}
          />
          <span className={checkboxClass} aria-hidden="true">
            {isSelected && (
              <svg
                width="13"
                height="10"
                viewBox="0 0 13 10"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 5L5 9L12 1"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <span className={styles.checkboxText}>Add</span>
        </label>
      </div>

      {showExtras && (
        <div
          className={styles.extras}
          onClick={(e) => e.stopPropagation()}
        >
          <WebConfigurator
            config={webConfig}
            onChange={onWebConfigChange}
          />
        </div>
      )}
    </div>
  )
}

export default ServiceCard