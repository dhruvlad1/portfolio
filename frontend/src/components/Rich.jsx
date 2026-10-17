/* eslint-disable react-refresh/only-export-components */
function stripMarkers(text) {
  return text.replace(/\[\[|\]\]|\{\{|\}\}/g, '')
}

function parseRich(text) {
  const tokens = []
  const markerPattern = /(\[\[|\{\{)/
  let remaining = text

  while (remaining) {
    const match = remaining.match(markerPattern)
    if (!match) {
      tokens.push({ text: remaining, type: 'plain' })
      break
    }
    if (match.index > 0) tokens.push({ text: remaining.slice(0, match.index), type: 'plain' })
    const opener = match[0]
    const closer = opener === '[[' ? ']]' : '}}'
    const contentStart = match.index + opener.length
    const contentEnd = remaining.indexOf(closer, contentStart)
    if (contentEnd === -1) {
      tokens.push({ text: remaining.slice(match.index), type: 'plain' })
      break
    }
    tokens.push({
      text: remaining.slice(contentStart, contentEnd),
      type: opener === '[[' ? 'hl' : 'warm',
    })
    remaining = remaining.slice(contentEnd + closer.length)
  }
  return tokens
}

function Rich({ text }) {
  return <>{parseRich(text).map((token, index) => token.type === 'plain'
    ? token.text
    : <span className={token.type === 'hl' ? 'hl' : 'hl hl-warm'} key={`${token.type}-${index}`}>{token.text}</span>)}</>
}

export { parseRich, stripMarkers }
export default Rich
