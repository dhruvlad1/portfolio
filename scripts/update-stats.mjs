import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = path.join(root, 'frontend', 'src', 'data', 'codingStats.json')
const userAgent = 'Mozilla/5.0 (compatible; portfolio-stats-bot)'
const leetCodeQuery = `
  query userStats($username: String!) {
    matchedUser(username: $username) {
      submitStatsGlobal {
        acSubmissionNum { difficulty count }
      }
    }
    userContestRanking(username: $username) {
      rating
      attendedContestsCount
      topPercentage
      badge { name }
    }
    userContestRankingHistory(username: $username) {
      attended
      rating
    }
  }
`

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

function todayInMumbai() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function warn(platform, reason) {
  const message = `${platform}: ${reason}`
  console.warn(`Warning: ${message}`)
  if (process.env.GITHUB_ACTIONS) console.warn(`::warning::${message}`)
}

async function fetchWithRetries(url, options = {}) {
  let lastError
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': userAgent,
          ...(options.headers || {}),
        },
        signal: AbortSignal.timeout(15000),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return response
    } catch (error) {
      lastError = error
      if (attempt < 2) await delay(500 * (attempt + 1))
    }
  }
  throw lastError
}

function setIfValid(target, key, value, isValid = (item) => (
  typeof item === 'number'
    ? Number.isFinite(item) && item !== 0
    : item !== null && item !== undefined && item !== ''
)) {
  if (isValid(value)) target[key] = value
}

function extractNumber(text) {
  const match = text.replace(/,/g, '').match(/\d+(?:\.\d+)?/)
  return match ? Number(match[0]) : null
}

function parseCodeChef(html, previous) {
  const next = { ...previous }
  const ratingMatch = html.match(/class=["'][^"']*rating-number[^"']*["'][^>]*>\s*([\d,]+)/i)
  const highestMatch = html.match(/Highest\s+Rating[\s\S]{0,200}?([\d,]{3,})/i)
  const starsMatch = html.match(/(\d+)\s*★|rating-star[^>]*>\s*(\d+)/i)
  const solvedMatch = html.match(/Total\s+Problems\s+Solved\s*:?\s*(?:<\/?[^>]*>\s*)*([\d,]+)/i)
  const contestsMatch = html.match(/No\.\s*of\s*Contests\s*Participated[\s\S]{0,300}?(\d[\d,]*)/i)
  setIfValid(next, 'rating', ratingMatch ? Number(ratingMatch[1].replace(/,/g, '')) : null)
  setIfValid(next, 'maxRating', highestMatch ? extractNumber(highestMatch[1]) : null)
  setIfValid(next, 'stars', starsMatch ? Number(starsMatch[1] || starsMatch[2]) : null)
  setIfValid(next, 'solved', solvedMatch ? extractNumber(solvedMatch[1]) : null)
  setIfValid(next, 'contests', contestsMatch ? extractNumber(contestsMatch[1]) : null)
  return next
}

async function updateLeetCode(previous) {
  const response = await fetchWithRetries('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://leetcode.com',
    },
    body: JSON.stringify({
      query: leetCodeQuery,
      variables: { username: previous.username },
    }),
  })
  const payload = await response.json()
  if (payload.errors?.length || !payload.data?.matchedUser) throw new Error('GraphQL response did not contain matched user data')
  const user = payload.data.matchedUser
  const contestRanking = payload.data.userContestRanking
  const contestHistory = Array.isArray(payload.data.userContestRankingHistory)
    ? payload.data.userContestRankingHistory
    : []
  if (process.env.DEBUG_LEETCODE === '1') {
    console.log('LeetCode contest debug:', JSON.stringify({
      userContestRanking: contestRanking,
      userContestRankingHistoryLength: contestHistory.length,
      userContestRankingHistoryLast3: contestHistory.slice(-3),
    }, null, 2))
  }
  const next = { ...previous }
  const allSolved = user.submitStatsGlobal?.acSubmissionNum?.find((item) => item.difficulty === 'All')?.count
  const attendedHistory = contestHistory.filter((item) => item.attended && Number.isFinite(Number(item.rating)))
  const latestHistoryRating = attendedHistory.length ? Number(attendedHistory.at(-1).rating) : null
  const rating = Number.isFinite(Number(contestRanking?.rating))
    ? Math.round(Number(contestRanking.rating))
    : latestHistoryRating
  const maxRating = attendedHistory.length
    ? Math.round(Math.max(...attendedHistory.map((item) => Number(item.rating))))
    : null
  const badge = contestRanking?.badge?.name
  const contestFields = {
    rating: Number.isFinite(rating) && rating !== 0,
    maxRating: Number.isFinite(maxRating) && maxRating !== 0,
    badge: typeof badge === 'string' && badge.length > 0,
  }
  const attendedContests = Number(contestRanking?.attendedContestsCount)
  const historyContestCount = contestHistory.filter((item) => item.attended).length
  const contests = Number.isFinite(attendedContests) && attendedContests !== 0
    ? attendedContests
    : historyContestCount
  setIfValid(next, 'solved', Number(allSolved))
  setIfValid(next, 'rating', rating)
  setIfValid(next, 'maxRating', maxRating)
  if (contestFields.badge) next.badge = badge
  setIfValid(next, 'contests', contests)
  return { data: next, contestFields }
}

async function updateCodeChef(previous) {
  const response = await fetchWithRetries(previous.url)
  return parseCodeChef(await response.text(), previous)
}

async function updateCodeforces(previous) {
  const infoResponse = await fetchWithRetries('https://codeforces.com/api/user.info?handles=laddhruv495')
  const info = await infoResponse.json()
  if (info.status !== 'OK' || !info.result?.[0]) throw new Error('user.info response did not contain user data')
  const statusResponse = await fetchWithRetries('https://codeforces.com/api/user.status?handle=laddhruv495')
  const status = await statusResponse.json()
  if (status.status !== 'OK' || !Array.isArray(status.result)) throw new Error('user.status response did not contain submissions')
  const ratingResponse = await fetchWithRetries('https://codeforces.com/api/user.rating?handle=laddhruv495')
  const ratingHistory = await ratingResponse.json()
  if (ratingHistory.status !== 'OK' || !Array.isArray(ratingHistory.result)) throw new Error('user.rating response did not contain contest history')
  const solved = new Set()
  for (const submission of status.result) {
    if (submission.verdict === 'OK' && submission.problem?.contestId && submission.problem?.index) {
      solved.add(`${submission.problem.contestId}:${submission.problem.index}`)
    }
  }
  const user = info.result[0]
  const next = { ...previous }
  setIfValid(next, 'rating', Number(user.rating))
  setIfValid(next, 'maxRating', Number(user.maxRating))
  if (typeof user.rank === 'string' && user.rank) next.rank = user.rank
  setIfValid(next, 'solved', solved.size)
  setIfValid(next, 'contests', ratingHistory.result.length)
  return next
}

function dataChanged(before, after) {
  const withoutDate = (data) => {
    const copy = structuredClone(data)
    delete copy.asOf
    return copy
  }
  return JSON.stringify(withoutDate(before)) !== JSON.stringify(withoutDate(after))
}

async function main() {
  const original = JSON.parse(await readFile(dataPath, 'utf8'))
  const next = structuredClone(original)
  const updates = [
    ['leetcode', updateLeetCode],
    ['codechef', updateCodeChef],
    ['codeforces', updateCodeforces],
  ]
  const liveContestFields = {}

  for (const [platform, update] of updates) {
    try {
      const result = await update(next.platforms[platform])
      if (platform === 'leetcode') {
        next.platforms[platform] = {
          ...result.data,
          source: Object.values(result.contestFields).some(Boolean) ? 'live' : 'fallback',
          contestSource: Object.values(result.contestFields).some(Boolean) ? 'live' : 'fallback',
        }
        liveContestFields[platform] = result.contestFields
      } else {
        next.platforms[platform] = {
          ...result,
          source: 'live',
        }
      }
    } catch (error) {
      warn(platform, error instanceof Error ? error.message : String(error))
    }
  }

  const solved = Object.values(next.platforms).map((platform) => platform.solved)
  if (solved.every((value) => typeof value === 'number' && Number.isFinite(value))) {
    next.totals = { ...next.totals, solved: solved.reduce((sum, value) => sum + value, 0), approx: false }
  }
  const contests = Object.values(next.platforms).map((platform) => platform.contests)
  if (contests.every((value) => typeof value === 'number' && Number.isFinite(value))) {
    next.totals.contests = contests.reduce((sum, value) => sum + value, 0)
  }

  if (dataChanged(original, next)) {
    next.asOf = todayInMumbai()
    await writeFile(dataPath, `${JSON.stringify(next, null, 2)}\n`)
  }

  console.table([
    ...Object.entries(next.platforms).map(([platform, values]) => ({
    platform,
    rating: values.rating,
    maxRating: values.maxRating,
    badge: values.badge,
    solved: values.solved,
    contests: values.contests,
    source: values.source,
    contestSource: values.contestSource || '-',
    liveContestFields: liveContestFields[platform]
      ? Object.entries(liveContestFields[platform]).filter(([, live]) => live).map(([field]) => field).join(', ') || '-'
      : '-',
    })),
    {
      platform: 'total',
      rating: '-',
      maxRating: '-',
      badge: '-',
      solved: next.totals.solved,
      contests: next.totals.contests,
      source: next.totals.approx ? 'fallback' : 'live',
      contestSource: '-',
      liveContestFields: '-',
    },
  ])
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
