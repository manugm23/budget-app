import styles from './ConfirmModal.module.scss'

interface ConfirmModalProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className={styles.overlay}
    >
      <div className={styles.modal}>
        <div className={styles.icon} aria-hidden="true">🗑️</div>

        <h2 id="modal-title" className={styles.title}>
          Delete budget
        </h2>

        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.buttonCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={styles.buttonConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal