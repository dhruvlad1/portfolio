import { useCallback, useEffect, useMemo, useState } from 'react'
import ThemeContext from './themeContext'

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function readStoredTheme() {
  try {
    const storedTheme = window.localStorage.getItem('theme')
    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : null
  } catch {
    return null
  }
}

function updateThemeColor(theme) {
  const meta = document.querySelector('#theme-color')
  if (meta) meta.setAttribute('content', theme === 'light' ? '#f6f5f1' : '#0b0b0c')
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => readStoredTheme() || getSystemTheme())

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
    const applyTheme = (nextTheme) => {
      document.documentElement.dataset.theme = nextTheme
      updateThemeColor(nextTheme)
    }
    const handleSystemChange = () => {
      if (!readStoredTheme()) {
        const nextTheme = mediaQuery.matches ? 'light' : 'dark'
        setTheme(nextTheme)
        applyTheme(nextTheme)
      }
    }

    applyTheme(theme)
    mediaQuery.addEventListener('change', handleSystemChange)
    return () => mediaQuery.removeEventListener('change', handleSystemChange)
  }, [theme])

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    document.documentElement.dataset.theme = nextTheme
    updateThemeColor(nextTheme)
    document.documentElement.classList.add('theme-transition')
    window.setTimeout(() => document.documentElement.classList.remove('theme-transition'), 250)
    try {
      window.localStorage.setItem('theme', nextTheme)
    } catch {
      // Storage can be unavailable in private browsing.
    }
  }, [theme])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
