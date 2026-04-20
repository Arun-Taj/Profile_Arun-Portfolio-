import React, { useEffect, useRef, useState } from 'react'
import { Download, Github, Linkedin, Mail, ChevronDown, ExternalLink } from 'lucide-react'

const TYPING_STRINGS = [
  'Full Stack Developer',
  'MERN Stack Engineer',
  'REST API Architect',
  'React Specialist',
  'Node.js Developer',
  'Problem Solver',
]

export default function Hero({ profile }) {
  const canvasRef = useRef(null)
  const [displayText, setDisplayText] = useState('')
  const [stringIdx, setStringIdx]     = useState(0)
  const [charIdx, setCharIdx]         = useState(0)
  const [deleting, setDeleting]       = useState(false)

  /* Typewriter */
  useEffect(() => {
    const current = TYPING_STRINGS[stringIdx]
    const speed   = deleting ? 40 : 80
    const timer   = setTimeout(() => {
      if (!deleting) {
        setDisplayText(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) setTimeout(() => setDeleting(true), 1800)
        else setCharIdx(c => c + 1)
      } else {
        setDisplayText(current.slice(0, charIdx - 1))
        if (charIdx === 0) { setDeleting(false); setStringIdx(i => (i + 1) % TYPING_STRINGS.length) }
        else setCharIdx(c => c - 1)
      }
    }, speed)
    return () => clearTimeout(timer)
  }, [charIdx, deleting, stringIdx])

  /* Particle canvas */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,  y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.5,  opacity: Math.random() * 0.5 + 0.1,
    }))
    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width;  if (p.x > canvas.width)  p.x = 0
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,245,255,${p.opacity})`; ctx.fill()
      })
      particles.forEach((a, i) => particles.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y)
        if (dist < 120) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(0,245,255,${0.15 * (1 - dist / 120)})`
          ctx.lineWidth = 0.5; ctx.stroke()
        }
      }))
      animId = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  const stats = profile?.stats || { yearsExperience: 3, projectsCompleted: 40, clientsSatisfied: 25 }
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-[70px]">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)' }} />

      <div className="container-base relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-center">

          {/* ── Left ── */}
          <div>
            {/* Available badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-neon-cyan/25 bg-neon-cyan/8"
              style={{ background: 'rgba(0,245,255,0.08)' }}>
              <span className="neon-dot w-1.5 h-1.5" />
              <span className="font-mono text-[0.72rem] text-neon-cyan tracking-widest">AVAILABLE FOR HIRE</span>
            </div>

            {/* Greeting */}
            <p className="font-mono text-sm text-text-muted mb-2 tracking-wide">
              <span className="text-neon-cyan">{'>'}</span> Hello, World! I'm
            </p>

            {/* Name */}
            <h1 className="font-display font-bold uppercase tracking-wide leading-none mb-4"
              style={{ fontSize: 'clamp(2.8rem,7vw,5.5rem)' }}>
              {profile?.name || 'Your Name'}
            </h1>

            {/* Typewriter */}
            <div className="mb-6 min-h-[2.5rem]">
              <span className="font-display font-semibold text-neon-cyan tracking-widest"
                style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>
                {displayText}
                <span className="border-r-2 border-neon-cyan ml-0.5 animate-blink" />
              </span>
            </div>

            {/* Bio */}
            <p className="text-text-secondary text-lg leading-relaxed max-w-xl mb-10">
              {profile?.bio || 'Passionate full-stack developer crafting high-performance web applications with modern technologies. I turn complex problems into elegant, scalable solutions.'}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <button className="btn-primary" onClick={() => scrollTo('projects')}>
                View Projects <ExternalLink size={16} />
              </button>
              {profile?.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn-outline">
                  <Download size={16} /> Download CV
                </a>
              )}
              <button className="btn-ghost" onClick={() => scrollTo('contact')}>
                <Mail size={16} /> Contact Me
              </button>
            </div>

            {/* Socials */}
            <div className="flex gap-3">
              {[
                { Icon: Github,   url: profile?.social?.github,              label: 'GitHub' },
                { Icon: Linkedin, url: profile?.social?.linkedin,            label: 'LinkedIn' },
                { Icon: Mail,     url: `mailto:${profile?.email || ''}`,     label: 'Email' },
              ].filter(s => s.url && s.url !== 'mailto:').map(({ Icon, url, label }) => (
                <a key={label} href={url} target="_blank" rel="noreferrer" title={label} className="social-btn">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Right: stats ── */}
          <div className="hidden lg:grid grid-cols-2 gap-4 min-w-[280px]">
            {[
              { label: 'Years\nExperience',   value: (stats.yearsExperience || 3) + '+',   color: '#00f5ff' },
              { label: 'Projects\nCompleted', value: (stats.projectsCompleted || 40) + '+', color: '#7c3aed' },
              { label: 'Clients\nSatisfied',  value: (stats.clientsSatisfied || 25) + '+',  color: '#f72585' },
              { label: 'Cups of\nCoffee',     value: '∞',                                   color: '#39ff14' },
            ].map(stat => (
              <div key={stat.label} className="card-base text-center !p-6">
                <div className="font-display font-bold text-4xl leading-none mb-2"
                  style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}` }}>
                  {stat.value}
                </div>
                <div className="font-mono text-[0.62rem] text-text-muted tracking-widest uppercase whitespace-pre-line">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
        <span className="font-mono text-[0.62rem] text-text-muted tracking-[0.15em]">SCROLL</span>
        <ChevronDown size={18} color="#00f5ff" className="animate-float" />
      </div>
    </section>
  )
}
