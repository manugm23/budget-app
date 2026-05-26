import type { Service, WebConfig } from '../types'
import WebConfigurator from './WebConfigurator'

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

  return (
    <div
      role="group"
      aria-labelledby={`service-name-${service.id}`}
      onClick={() => onToggle(service.id)}
      style={{
        border: isSelected
          ? '1.5px solid #2db887'
          : '1px solid #e5e7eb',
        borderRadius: 16,
        padding: '20px 24px',
        background: isSelected ? '#f0fdf9' : '#fff',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

        <div style={{ flex: 1 }}>
          <div
            id={`service-name-${service.id}`}
            style={{ fontWeight: 700, fontSize: 18, color: '#111' }}
          >
            {service.name}
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
            {service.description}
          </div>
        </div>

        <div
          aria-label={`${service.price} euros`}
          style={{
            fontWeight: 800,
            fontSize: 22,
            color: '#111',
            minWidth: 80,
            textAlign: 'right',
          }}
        >
          {service.price}{' '}
          <span style={{ fontSize: 16, fontWeight: 500 }}>€</span>
        </div>

        <label
          aria-label={`Add ${service.name}`}
          onClick={(e) => e.stopPropagation()}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggle(service.id)}
            aria-checked={isSelected}
            style={{ display: 'none' }}
          />

          <span
            aria-hidden="true"
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              border: isSelected ? 'none' : '1.5px solid #d1d5db',
              background: isSelected ? '#2db887' : '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
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

          <span style={{ marginLeft: 8, fontSize: 14, color: '#374151' }}>
            Add
          </span>
        </label>
      </div>

      {showExtras && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            marginTop: 20,
            borderTop: '1px solid #d1fae5',
            paddingTop: 16,
          }}
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