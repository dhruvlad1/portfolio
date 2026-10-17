import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'
import About from './components/About'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="site-shell">
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Projects />
        <About />
      </main>
      <Footer />
    </div>
  )
}

export default App
