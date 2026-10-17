import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Timeline from './components/Timeline'
import About from './components/About'
import Footer from './components/Footer'
import SmoothScroll from './components/SmoothScroll'
import ScrollProgress from './components/ScrollProgress'
import CursorProvider from './components/CursorProvider'
import Crosshair from './components/Crosshair'
import './App.css'

function App() {
  return (
    <CursorProvider>
      <Crosshair />
      <SmoothScroll>
        <div className="site-shell">
          <ScrollProgress />
          <Navbar />
          <main id="main-content" tabIndex={-1}>
            <Hero />
            <Projects />
            <Timeline />
            <About />
          </main>
          <Footer />
        </div>
      </SmoothScroll>
    </CursorProvider>
  )
}

export default App
