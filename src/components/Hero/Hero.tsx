import styles from './Hero.module.scss'

function Hero() {
  return (
    <div
      role="banner"
      aria-label="Budget calculator header"
      className={styles.hero}
    >
      <div aria-hidden="true">
        <svg
          className={`${styles.shape} ${styles['shape--orange']}`}
          width="60" height="60" viewBox="0 0 60 60"
        >
          <ellipse cx="30" cy="20" rx="22" ry="14" fill="#f4a261" transform="rotate(-20 30 20)" />
          <ellipse cx="38" cy="35" rx="10" ry="16" fill="#e76f51" transform="rotate(10 38 35)" />
        </svg>

        <svg
          className={`${styles.shape} ${styles['shape--yellow']}`}
          width="50" height="50" viewBox="0 0 50 50"
        >
          <ellipse cx="20" cy="30" rx="16" ry="10" fill="#f9c74f" transform="rotate(20 20 30)" />
        </svg>

        <svg
          className={`${styles.shape} ${styles['shape--teal']}`}
          width="40" height="40" viewBox="0 0 40 40"
        >
          <polygon points="20,4 36,36 4,36" fill="#2a9d8f" />
        </svg>

        <svg
          className={`${styles.shape} ${styles['shape--bolt']}`}
          width="14" height="40" viewBox="0 0 14 40"
        >
          <path d="M7 0 L14 20 L7 40 L0 20Z" fill="#e9c46a" />
        </svg>
      </div>

      <h1 className={styles.title}>Get the best quality</h1>
      <p className={styles.subtitle}>
        Configure your services and get an instant budget estimate
      </p>
    </div>
  )
}

export default Hero