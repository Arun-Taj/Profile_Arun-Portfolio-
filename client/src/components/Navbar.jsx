import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Terminal } from 'lucide-react'

const NAV_LINKS = [
  { label: 'About',        href: '#about' },
  { label: 'Skills',       href: '#skills' },
  { label: 'Experience',   href: '#experience' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Education',    href: '#education' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact',      href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [active, setActive]       = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      const sections = NAV_LINKS.map(l => l.href.slice(1))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive('#' + sections[i])
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href) => {
    setMenuOpen(false)
    if (location.pathname === '/') {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      window.history.replaceState(null, '', href)
      return
    }

    navigate(`/${href}`)
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-[70px] flex items-center transition-all duration-300
        ${scrolled ? 'bg-bg-primary/90 backdrop-blur-xl border-b border-white/[0.08]' : 'bg-transparent border-b border-transparent'}`}>
        <div className="container-base w-full flex items-center justify-between">

          {/* Logo */}
          <button onClick={() => scrollTo('#hero')}
            className="flex items-center gap-2 no-underline bg-transparent border-none cursor-pointer">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#00f5ff,#7c3aed)' }}>
              <Terminal size={18} color="#000" />
            </div>
            <span className="font-display text-xl font-bold tracking-widest text-text-primary">
              DEV<span className="text-neon-cyan">FOLIO</span>
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button key={link.href} onClick={() => scrollTo(link.href)}
                className={`relative px-3.5 py-2 font-mono text-[0.72rem] tracking-widest uppercase rounded-md
                  transition-colors duration-200 bg-transparent border-none cursor-pointer
                  ${active === link.href ? 'text-neon-cyan' : 'text-text-secondary hover:text-text-primary'}`}>
                <span className="text-neon-cyan/50">/</span>{link.label}
                {active === link.href && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-neon-cyan"
                    style={{ boxShadow: '0 0 8px #00f5ff' }} />
                )}
              </button>
            ))}
            <button onClick={() => scrollTo('#contact')} className="btn-outline ml-2 !px-5 !py-2 !text-xs">
              Hire Me
            </button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg
              border border-white/10 bg-bg-card text-text-primary">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-bg-primary/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
          <button onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 bg-transparent border-none text-text-primary cursor-pointer">
            <X size={28} />
          </button>
          {NAV_LINKS.map(link => (
            <button key={link.href} onClick={() => scrollTo(link.href)}
              className={`font-display text-4xl font-bold tracking-widest uppercase bg-transparent border-none cursor-pointer transition-colors
                ${active === link.href ? 'text-neon-cyan' : 'text-text-primary'}`}>
              {link.label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
