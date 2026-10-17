import useCursor from '../hooks/useCursor'

function CursorToggle() {
  const cursor = useCursor()
  if (!cursor?.eligible) return null

  const isTarget = cursor.mode === 'target'
  return (
    <button
      className="cursor-toggle"
      type="button"
      aria-label="toggle target cursor"
      aria-pressed={isTarget}
      onClick={cursor.toggle}
    >
      cursor: {isTarget ? 'target' : 'default'}
    </button>
  )
}

export default CursorToggle
