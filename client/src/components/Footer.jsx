import React from 'react'
import { Terminal, Heart, Github, Linkedin, Twitter, ArrowUp } from 'lucide-react'

export default function Footer({ profile }) {
  const p = profile || {}
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-bg-secondary border-t border-white/[0.08] pt-12 pb-8 relative z-10">
      <div className="container-base">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background:'linear-gradient(135deg,#00f5ff,#7c3aed)' }}>
                <Terminal size={16} color="#000" />
              </div>
              <span className="font-display font-bold text-lg tracking-widest">
                DEV<span className="text-neon-cyan">FOLIO</span>
              </span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed max-w-[280px]">
              {p.tagline || 'Building the future, one commit at a time.'}
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-col items-center gap-2">
            {['About','Skills','Projects','Experience','Contact'].map(item => (
              <button key={item}
                onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior:'smooth' })}
                className="bg-transparent border-none cursor-pointer text-text-muted text-sm font-mono tracking-wide
                  transition-colors duration-200 hover:text-neon-cyan">
                {item}
              </button>
            ))}
          </div>

          {/* Socials + scroll top */}
          <div className="flex flex-col items-end gap-4">
            <div className="flex gap-2">
              {[
                { Icon:Github,   url: p.social?.github   },
                { Icon:Linkedin, url: p.social?.linkedin },
                { Icon:Twitter,  url: p.social?.twitter  },
              ].filter(s => s.url).map(({ Icon, url }, i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer" className="social-btn !w-9 !h-9">
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <button onClick={scrollTop}
              className="w-10 h-10 rounded-full flex items-center justify-center border-none cursor-pointer"
              style={{ background:'linear-gradient(135deg,#00f5ff,#7c3aed)' }}>
              <ArrowUp size={18} color="#000" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.08] my-6" />

        {/* Bottom */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <p className="text-text-muted text-xs font-mono">
            © {new Date().getFullYear()} {p.name || 'Full Stack Developer'}. All rights reserved.
          </p>
          <p className="text-text-muted text-xs font-mono flex items-center gap-1">
            Built with <Heart size={11} color="#f72585" className="fill-neon-pink" /> React + Vite + Tailwind
          </p>
          <p className="text-text-muted text-xs font-mono">
            <span className="text-neon-cyan">v2.0.0</span> — Production
          </p>
        </div>
      </div>
    </footer>
  )
}
