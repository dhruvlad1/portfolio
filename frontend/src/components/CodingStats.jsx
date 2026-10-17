import codingStats from '../data/codingStats.json'
import { formattedAsOf } from '../data/about'
import DecryptText from './DecryptText'
import CountUp from './CountUp'
import { stripMarkers } from './Rich'
import { CodeChefIcon, CodeforcesIcon, LeetCodeIcon } from './icons'

const platformRows = [
  { key: 'leetcode', name: 'LeetCode', Icon: LeetCodeIcon },
  { key: 'codechef', name: 'CodeChef', Icon: CodeChefIcon },
  { key: 'codeforces', name: 'Codeforces', Icon: CodeforcesIcon },
]

function NumberValue({ value, suffix = '' }) {
  if (value === null || value === undefined) return null
  return <span className="coding-stat-number"><CountUp value={String(value)} />{suffix}</span>
}

function CodingStats() {
  return (
    <>
      <DecryptText className="eyebrow" text="competitive programming" />
      <ul className="coding-stats-list">
        {platformRows.map(({ key, name, Icon }) => {
          const platform = codingStats.platforms[key]
          const contestFallback = key === 'leetcode' && platform.contestSource === 'fallback'
          const cached = platform.source === 'fallback' || contestFallback
          const ratingText = platform.rating === null
            ? <>max <NumberValue value={platform.maxRating} /></>
            : <><NumberValue value={platform.rating} /> · max <NumberValue value={platform.maxRating} /></>
          const standing = key === 'leetcode'
            ? platform.badge
            : key === 'codechef'
              ? `${platform.stars} star`
              : platform.rank
          const accessibleStanding = stripMarkers(standing || '')
          const ratingLabel = platform.rating === null
            ? `maximum ${platform.maxRating}`
            : `rating ${platform.rating}, maximum ${platform.maxRating}`

          return (
            <li className="coding-stat-row" key={key}>
              <a
                className="coding-stat-platform"
                href={platform.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${name} profile ${platform.username} (opens in a new tab)`}
              >
                <Icon />
                <span>
                  <strong>{name}</strong>
                  <small>{platform.username}</small>
                </span>
              </a>
              <span className="coding-stat-rating" aria-label={ratingLabel}>
                {ratingText}
              </span>
              <span className="coding-stat-standing">
                <span className="hl">{accessibleStanding}</span>
              </span>
              <span className="coding-stat-solved">
                <NumberValue value={platform.solved} suffix={platform.solved !== null ? ' solved' : ''} />
              </span>
              {cached && (
                <span className="coding-stat-cached" title="using last known values">cached</span>
              )}
            </li>
          )
        })}
      </ul>
      <p className="coding-stats-as-of" title="refreshed daily by a GitHub Action">
        as of {formattedAsOf} · refreshed daily
      </p>
    </>
  )
}

export default CodingStats
