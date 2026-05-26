function Header() {
  return (
    <header
      style={{
        padding: '16px 24px',
        borderBottom: '1px solid #f3f4f6',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: '#fff',
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 3L8 12L3 21H21L16 12L21 3H3Z"
          fill="#2db887"
          opacity="0.9"
        />
      </svg>

      <span
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: '#111',
        }}
      >
        Frontender.itacademy
      </span>
    </header>
  )
}

export default Header