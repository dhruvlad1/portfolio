import { useEffect, useState } from 'react'

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

function MumbaiClock() {
  const [time, setTime] = useState(null)

  useEffect(() => {
    let timer

    const update = () => {
      setTime(formatter.format(new Date()))
    }

    const schedule = () => {
      window.clearTimeout(timer)
      if (document.hidden) return
      const delay = 60000 - (Date.now() % 60000) + 20
      timer = window.setTimeout(() => {
        update()
        schedule()
      }, delay)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        window.clearTimeout(timer)
      } else {
        update()
        schedule()
      }
    }

    update()
    schedule()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  if (!time) return null

  const [hours, minutes] = time.split(':')
  return (
    <span className="mumbai-clock" title="India Standard Time (UTC+5:30)">
      Mumbai · {hours}:<span className="mumbai-clock-minutes">{minutes}</span> IST
    </span>
  )
}

export default MumbaiClock
