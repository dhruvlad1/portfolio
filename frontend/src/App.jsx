import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Projects from './components/Projects'
import About from './components/About'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Projects />
        <About />
      </main>
      <Footer />
    </div>
  )
}

export default App
