import { useContext } from 'react'
import ThemeContext from '../components/themeContext'

function useTheme() {
  return useContext(ThemeContext)
}

export default useTheme
