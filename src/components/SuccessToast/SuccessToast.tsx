import { useEffect } from 'react'
import type { Budget } from '../types'
import { shortId } from '../utils/generateId'

interface SuccessToastProps {
  budget: Budget
  onDismiss: () => void
}

function SuccessToast({ budget, onDismiss }: SuccessToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#2db887',
        color: '#fff',
        padding: '14px 24px',
        borderRadius: 14,
        fontSize: 15,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        zIndex: 9999,
        maxWidth: 'calc(100vw - 40px)',
      }}
    >
      <span aria-hidden="true">✓</span>
      <span>
        Budget #{shortId(budget.id)} created for {budget.client.name}!
      </span>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          marginLeft: 8,
          fontSize: 18,
          lineHeight: 1,
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  )
}

export default SuccessToast