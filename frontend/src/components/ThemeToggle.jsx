import { Moon, Sun } from 'lucide-react'
import useTheme from '../hooks/useTheme'

function ThemeToggle({ mobile = false }) {
  const { theme, toggleTheme } = useTheme()
  const nextTheme = theme === 'light' ? 'dark' : 'light'

  return (
    <button
      className={mobile ? 'theme-toggle theme-toggle-mobile' : 'theme-toggle'}
      type="button"
      aria-label={`switch to ${nextTheme} theme`}
      onClick={toggleTheme}
    >
      {mobile ? (
        `theme: ${theme}`
      ) : (
        theme === 'light'
          ? <Moon aria-hidden="true" size={16} strokeWidth={1.75} />
          : <Sun aria-hidden="true" size={16} strokeWidth={1.75} />
      )}
    </button>
  )
}

export default ThemeToggle
