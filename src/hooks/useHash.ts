import { useState, useEffect } from 'react'

export function useHash(): string {
  const [hash, setHash] = useState<string>(window.location.hash)

  useEffect(() => {
    const handleHashChange = (): void => {
      setHash(window.location.hash)
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return hash
}