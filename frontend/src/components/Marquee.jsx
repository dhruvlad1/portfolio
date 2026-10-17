const message = 'BUILD SYSTEMS · SHIP IDEAS · SOLVE PROBLEMS · REPEAT ·'

function Marquee() {
  return (
    <div className="marquee" aria-label={message}>
      <div className="marquee-track" aria-hidden="true">
        <div className="marquee-line"><span>{message}</span><span>{message}</span></div>
        <div className="marquee-line"><span>{message}</span><span>{message}</span></div>
      </div>
    </div>
  )
}

export default Marquee
