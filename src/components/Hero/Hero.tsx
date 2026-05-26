function Hero() {
  return (
    <div
      role="banner"
      aria-label="Budget calculator header"
      style={{
        background: '#f5f4ef',
        borderRadius: 20,
        padding: '48px 32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 32,
      }}
    >
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', top: 10, right: 40, opacity: 0.7 }}
        width="60"
        height="60"
        viewBox="0 0 60 60"
      >
        <ellipse
          cx="30" cy="20" rx="22" ry="14"
          fill="#f4a261"
          transform="rotate(-20 30 20)"
        />
        <ellipse
          cx="38" cy="35" rx="10" ry="16"
          fill="#e76f51"
          transform="rotate(10 38 35)"
        />
      </svg>

      <svg
        aria-hidden="true"
        style={{ position: 'absolute', bottom: 10, left: 20, opacity: 0.6 }}
        width="50"
        height="50"
        viewBox="0 0 50 50"
      >
        <ellipse
          cx="20" cy="30" rx="16" ry="10"
          fill="#f9c74f"
          transform="rotate(20 20 30)"
        />
      </svg>

      <svg
        aria-hidden="true"
        style={{ position: 'absolute', bottom: 20, right: 100, opacity: 0.5 }}
        width="40"
        height="40"
        viewBox="0 0 40 40"
      >
        <polygon points="20,4 36,36 4,36" fill="#2a9d8f" />
      </svg>

      <svg
        aria-hidden="true"
        style={{ position: 'absolute', top: 20, left: 60, opacity: 0.4 }}
        width="14"
        height="40"
        viewBox="0 0 14 40"
      >
        <path d="M7 0 L14 20 L7 40 L0 20Z" fill="#e9c46a" />
      </svg>

      <h1
        style={{
          fontSize: 'clamp(22px, 5vw, 36px)',
          fontWeight: 800,
          color: '#111',
          margin: 0,
          position: 'relative',
        }}
      >
        Get the best quality
      </h1>

      <p
        style={{
          color: '#6b7280',
          fontSize: 16,
          marginTop: 8,
          position: 'relative',
        }}
      >
        Configure your services and get an instant budget estimate
      </p>
    </div>
  )
}

export default Hero