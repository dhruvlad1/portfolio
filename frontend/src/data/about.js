import codingStats from './codingStats.json'

const { totals, platforms } = codingStats
const formattedAsOf = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'Asia/Kolkata',
}).format(new Date(`${codingStats.asOf}T00:00:00Z`))

const about = {
  statement: 'i like understanding how things work, then [[building them]].',
  body: 'third-year computer engineering student at VJTI, with a minor in [[cybersecurity]]. most of my projects sit between [[machine learning]] and [[backend engineering]]: a retrieval pipeline over earnings calls, an image captioning model trained from scratch, a full-stack travel planner. i also solve algorithm problems, contributed to open source during [[Hacktoberfest]], and helped coordinate events for the college tech fest.',
  facts: [
    { label: 'based in', value: 'Mumbai, India' },
    { label: 'studying', value: 'B.Tech Computer Engineering, VJTI' },
    { label: 'minor', value: 'cybersecurity' },
    { label: 'interested in', value: 'applied ML, backend systems' },
  ],
  stats: [
    { value: `{{${totals.solved}${totals.approx ? '+' : ''}}}`, label: 'problems solved (LeetCode, CodeChef, Codeforces)' },
    { value: `{{${platforms.leetcode.maxRating}}}`, label: `LeetCode max rating · ${platforms.leetcode.badge}` },
  ],
  skills: [
    { label: 'languages', items: ['C++', 'Python', 'Java', 'JavaScript', 'SQL', 'HTML/CSS'] },
    { label: 'AI / ML', items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'RAG', 'LLM integration', 'pandas', 'NumPy'] },
    { label: 'backend + web', items: ['Spring Boot', 'FastAPI', 'REST APIs', 'React'] },
    { label: 'databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Supabase'] },
    { label: 'tools', items: ['Git', 'Docker', 'Linux', 'Postman', 'Vercel', 'Render', 'IntelliJ IDEA', 'VS Code'] },
    { label: 'fundamentals', items: ['data structures and algorithms', 'object-oriented programming'] },
  ],
}

export { formattedAsOf }
export default about
