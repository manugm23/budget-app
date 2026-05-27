import { useEffect } from 'react'
import type { Budget } from '../../types'
import { shortId } from '../../utils/generateId'
import styles from './SuccessToast.module.scss'

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
      className={styles.toast}
    >
      <span aria-hidden="true">✓</span>
      <span>
        Budget #{shortId(budget.id)} created for {budget.client.name}!
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className={styles.dismiss}
      >
        ×
      </button>
    </div>
  )
}

export default SuccessToast