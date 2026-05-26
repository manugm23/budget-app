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
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: 20,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '32px 28px',
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Icon */}
        <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>

        {/* Title */}
        <h2
          id="modal-title"
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#111',
            margin: '0 0 8px',
          }}
        >
          Delete budget
        </h2>

        {/* Message */}
        <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 24px' }}>
          {message}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '11px 0',
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              background: '#fff',
              color: '#374151',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '11px 0',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              background: '#dc2626',
              color: '#fff',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal