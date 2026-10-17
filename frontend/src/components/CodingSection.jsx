import codingStats from '../data/codingStats.json'
import CountUp from './CountUp'
import DecryptText from './DecryptText'
import Reveal from './Reveal'
import CodingStats from './CodingStats'
import Rich, { stripMarkers } from './Rich'

function CodingSection() {
  const solved = `${codingStats.totals.solved}${codingStats.totals.approx ? '+' : ''}`

  return (
    <section className="section coding-section" id="dsa" tabIndex={-1} aria-labelledby="coding-title">
      <div className="container">
        <Reveal>
          <DecryptText className="eyebrow" text="competitive programming" />
          <h2 className="section-title" id="coding-title">problem solving.</h2>
        </Reveal>
        <Reveal className="coding-section-content" delay={0.05}>
          <div className="coding-headline-stats">
            <div>
              <strong><CountUp value={solved} /></strong>
              <span aria-label={stripMarkers('[[problems solved]] · LeetCode, CodeChef, Codeforces')}>
                <Rich text="[[problems solved]] · LeetCode, CodeChef, Codeforces" />
              </span>
            </div>
            {codingStats.totals.contests !== null && (
              <div>
                <strong><CountUp value={String(codingStats.totals.contests)} /></strong>
                <span aria-label={stripMarkers('[[contests attended]] · across all three')}>
                  <Rich text="[[contests attended]] · across all three" />
                </span>
              </div>
            )}
          </div>
          <CodingStats />
        </Reveal>
      </div>
    </section>
  )
}

export default CodingSection
