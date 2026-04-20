import React from 'react'
import { MapPin, Mail, Phone, Calendar, Code2, Cpu, Globe } from 'lucide-react'

export default function About({ profile }) {
  const p = profile || {}
  const highlights = [
    { icon: Code2, label: 'Clean Code',  desc: 'Writing maintainable, scalable code is my craft' },
    { icon: Cpu,   label: 'Performance', desc: 'Optimizing every layer for maximum efficiency' },
    { icon: Globe, label: 'Full Stack',  desc: 'End-to-end development from DB to UI' },
  ]

  return (
    <section id="about" className="section-base">
      <div className="container-base">
        <div className="section-header text-center mb-16">
          <p className="section-subtitle">Get to know me</p>
          <h2 className="section-title">About Me</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: avatar ── */}
          <div>
            <div className="relative inline-block mb-8">
              <div className="w-[280px] h-[280px] rounded-2xl border-2 border-white/10 flex items-center justify-center overflow-hidden relative"
                style={{ background: 'linear-gradient(135deg,rgba(0,245,255,0.05),rgba(124,58,237,0.05))' }}>
                {p.avatar
                  ? <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                  : <span className="font-display font-bold text-neon-cyan/30"
                      style={{ fontSize: '6rem' }}>
                      {(p.name || 'YN').split(' ').map(n => n[0]).join('')}
                    </span>
                }
                {/* Corner accents */}
                {[
                  'top-0 left-0 border-t-2 border-l-2',
                  'top-0 right-0 border-t-2 border-r-2',
                  'bottom-0 left-0 border-b-2 border-l-2',
                  'bottom-0 right-0 border-b-2 border-r-2',
                ].map((cls, i) => (
                  <span key={i} className={`absolute w-5 h-5 border-neon-cyan ${cls}`} />
                ))}
              </div>
              {/* Open to work badge */}
              <div className="absolute -bottom-4 -right-4 bg-bg-card border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
                <span className="neon-dot w-2 h-2" />
                <span className="font-mono text-[0.68rem] text-text-secondary">Open to Work</span>
              </div>
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-3 mt-6">
              {[
                { Icon: Mail,     value: p.email,    href: `mailto:${p.email}` },
                { Icon: Phone,    value: p.phone },
                { Icon: MapPin,   value: p.location },
                { Icon: Calendar, value: `${p.stats?.yearsExperience || 3}+ Years Experience` },
              ].filter(i => i.value).map(({ Icon, value, href }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 border border-white/10 flex items-center justify-center shrink-0">
                    <Icon size={15} color="#00f5ff" />
                  </div>
                  {href
                    ? <a href={href} className="text-text-secondary text-sm no-underline hover:text-neon-cyan transition-colors">{value}</a>
                    : <span className="text-text-secondary text-sm">{value}</span>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: bio ── */}
          <div>
            <h3 className="font-display text-3xl font-bold mb-4 tracking-wide">
              I build things for the <span className="text-neon-cyan">web</span>
            </h3>
            <p className="text-text-secondary leading-relaxed mb-4 text-[0.97rem]">
              {p.bio || `I'm a passionate Full Stack Developer with ${p.stats?.yearsExperience || 3}+ years of experience building modern web applications. I specialize in the MERN stack and love crafting seamless user experiences backed by robust, scalable architectures.`}
            </p>
            <p className="text-text-secondary leading-relaxed mb-8 text-[0.97rem]">
              When I'm not coding, I'm exploring new technologies, contributing to open source, and continuously leveling up my skills. I believe great software is built at the intersection of clean code and thoughtful design.
            </p>

            {/* Highlight cards */}
            <div className="flex flex-col gap-4">
              {highlights.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="card-base flex items-start gap-4 !p-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg,#00f5ff,#7c3aed)' }}>
                    <Icon size={20} color="#000" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold tracking-wide mb-1">{label}</h4>
                    <p className="text-text-muted text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
