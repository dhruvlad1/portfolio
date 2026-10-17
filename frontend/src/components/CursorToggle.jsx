import useCursor from '../hooks/useCursor'

function CursorToggle() {
  const cursor = useCursor()
  if (!cursor?.eligible) return null

  const isCrosshair = cursor.mode === 'crosshair'
  return (
    <button
      className="cursor-toggle"
      type="button"
      aria-label="toggle crosshair cursor"
      aria-pressed={isCrosshair}
      onClick={cursor.toggle}
    >
      cursor: {isCrosshair ? 'crosshair' : 'default'}
    </button>
  )
}

export default CursorToggle
