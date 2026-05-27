import styles from './Header.module.scss'

function Header() {
  return (
    <header className={styles.header}>
      <svg
        className={styles.logo}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 3L8 12L3 21H21L16 12L21 3H3Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
      <span className={styles.appName}>Frontender.itacademy</span>
    </header>
  )
}

export default Header