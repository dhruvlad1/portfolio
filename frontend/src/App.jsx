import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Timeline from './components/Timeline'
import About from './components/About'
import CodingSection from './components/CodingSection'
import Footer from './components/Footer'
import SmoothScroll from './components/SmoothScroll'
import ScrollProgress from './components/ScrollProgress'
import CursorProvider from './components/CursorProvider'
import TargetCursor from './components/TargetCursor'
import ThemeProvider from './components/ThemeProvider'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <CursorProvider>
        <TargetCursor />
        <SmoothScroll>
          <div className="site-shell">
            <ScrollProgress />
            <Navbar />
            <main id="main-content" tabIndex={-1}>
              <Hero />
              <Timeline />
              <Projects />
              <CodingSection />
              <About />
            </main>
            <Footer />
          </div>
        </SmoothScroll>
      </CursorProvider>
    </ThemeProvider>
  )
}

export default App
