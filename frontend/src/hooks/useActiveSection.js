import { useEffect, useState } from 'react'

function useActiveSection(ids) {
  const [activeSection, setActiveSection] = useState(null)

  useEffect(() => {
    const visibleSections = new Set()
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.add(entry.target.id)
        } else {
          visibleSections.delete(entry.target.id)
        }
      })

      const viewportCenter = window.innerHeight / 2
      const current = sections
        .filter((section) => visibleSections.has(section.id))
        .sort((a, b) => (
          Math.abs(a.getBoundingClientRect().top + a.offsetHeight / 2 - viewportCenter)
          - Math.abs(b.getBoundingClientRect().top + b.offsetHeight / 2 - viewportCenter)
        ))[0]

      setActiveSection(current?.id ?? null)
    }, {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    })

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [ids])

  return activeSection
}

export default useActiveSection
