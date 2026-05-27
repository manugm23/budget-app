import styles from './PriceFooter.module.scss'

interface PriceFooterProps {
  total: number
}

function PriceFooter({ total }: PriceFooterProps) {
  return (
    <div
      className={styles.footer}
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Estimated price: ${total} euros`}
    >
      <span className={styles.label}>Estimated price:</span>
      <span className={styles.amount}>
        {total} <span className={styles.currency}>€</span>
      </span>
    </div>
  )
}

export default PriceFooter