import { motion, useScroll } from 'motion/react'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: scrollYProgress }}
      aria-hidden="true"
    />
  )
}

export default ScrollProgress
