/* eslint-disable react-refresh/only-export-components */
function stripMarkers(text) {
  return text.replace(/\[\[|\]\]|\{\{|\}\}/g, '')
}

function Rich({ text }) {
  const parts = []
  const markerPattern = /(\[\[|\{\{)/
  let remaining = text
  let key = 0

  while (remaining) {
    const match = remaining.match(markerPattern)
    if (!match) {
      parts.push(remaining)
      break
    }

    if (match.index > 0) {
      parts.push(remaining.slice(0, match.index))
    }

    const opener = match[0]
    const closer = opener === '[[' ? ']]' : '}}'
    const contentStart = match.index + opener.length
    const contentEnd = remaining.indexOf(closer, contentStart)
    if (contentEnd === -1) {
      parts.push(remaining.slice(match.index))
      break
    }

    parts.push(
      <span className={opener === '[[' ? 'hl' : 'hl hl-warm'} key={key}>
        {remaining.slice(contentStart, contentEnd)}
      </span>,
    )
    key += 1
    remaining = remaining.slice(contentEnd + closer.length)
  }

  return <>{parts}</>
}

export { stripMarkers }
export default Rich
