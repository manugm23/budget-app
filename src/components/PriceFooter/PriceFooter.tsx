interface PriceFooterProps {
  total: number
}

function PriceFooter({ total }: PriceFooterProps) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Estimated price: ${total} euros`}
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'baseline',
        gap: 16,
        padding: '20px 0',
        borderTop: '1px solid #f3f4f6',
        marginTop: 8,
      }}
    >
      <span
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#374151',
        }}
      >
        Estimated price:
      </span>

      <span
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: '#111',
        }}
      >
        {total}{' '}
        <span style={{ fontSize: 18, fontWeight: 500 }}>€</span>
      </span>
    </div>
  )
}

export default PriceFooter