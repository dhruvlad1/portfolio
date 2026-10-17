import { useEffect, useMemo, useState } from 'react'
import CursorContext from './cursorContext'

function readMode() {
  try {
    const storedMode = window.localStorage.getItem('cursor-mode')
    if (storedMode === 'crosshair') {
      window.localStorage.setItem('cursor-mode', 'target')
    }
    return storedMode === 'default' ? 'default' : 'target'
  } catch {
    return 'target'
  }
}

function CursorProvider({ children }) {
  const [eligible, setEligible] = useState(() => (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ))
  const [mode, setMode] = useState(readMode)

  useEffect(() => {
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateEligibility = () => setEligible(pointerQuery.matches && !motionQuery.matches)

    pointerQuery.addEventListener('change', updateEligibility)
    motionQuery.addEventListener('change', updateEligibility)

    return () => {
      pointerQuery.removeEventListener('change', updateEligibility)
      motionQuery.removeEventListener('change', updateEligibility)
    }
  }, [])

  const setCursorMode = (nextMode) => {
    setMode(nextMode)
    try {
      window.localStorage.setItem('cursor-mode', nextMode)
    } catch {
      // Storage can be unavailable in private browsing.
    }
  }

  const value = useMemo(() => ({
    eligible,
    enabled: eligible && mode === 'target',
    mode,
    toggle: () => setCursorMode(mode === 'target' ? 'default' : 'target'),
  }), [eligible, mode])

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
}

export default CursorProvider
