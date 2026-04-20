import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, Linkedin } from 'lucide-react'

const DEFAULT_TESTIMONIALS = [
  { _id:'1', name:'Sarah Johnson', position:'CTO', company:'TechVenture Inc.', rating:5, featured:true,
    content:"Working with this developer was an absolute pleasure. They delivered our e-commerce platform 2 weeks ahead of schedule with exceptional code quality. Their MERN stack expertise is top-notch, and they proactively suggested optimizations that improved our site's performance by 40%." },
  { _id:'2', name:'Marcus Chen', position:'Product Manager', company:'StartupXYZ', rating:5, featured:true,
    content:"One of the most talented full-stack developers I've worked with. They understood our business requirements immediately and translated them into a robust technical solution. The real-time dashboard they built handles thousands of concurrent users flawlessly." },
  { _id:'3', name:'Priya Sharma', position:'CEO', company:'DigitalEdge Solutions', rating:5, featured:true,
    content:"Exceptional technical skills combined with great communication. The API they built has been running in production for 18 months without a single critical issue." },
  { _id:'4', name:'Alex Rivera', position:'Lead Developer', company:'Open Source Community', rating:5,
    content:"I reviewed their open-source contributions and the code quality is consistently excellent. Clean architecture, comprehensive tests, and great documentation." },
]

const AVATAR_COLORS = ['#00f5ff','#7c3aed','#f72585','#fbbf24']

export default function Testimonials({ testimonials }) {
  const data = (testimonials?.length > 0) ? testimonials : DEFAULT_TESTIMONIALS
  const [current, setCurrent] = useState(0)
  const t = data[current]
  const prev = () => setCurrent(c => (c - 1 + data.length) % data.length)
  const next = () => setCurrent(c => (c + 1) % data.length)
  const initials = name => name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
  const color = AVATAR_COLORS[current % AVATAR_COLORS.length]

  return (
    <section id="testimonials" className="section-base">
      <div className="container-base">
        <div className="text-center mb-16">
          <p className="section-subtitle">What others say</p>
          <h2 className="section-title">Testimonials</h2>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Main card */}
          <div className="card-base !p-12 relative text-center">
            {/* Quote icon */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background:'linear-gradient(135deg,#00f5ff,#7c3aed)' }}>
              <Quote size={18} color="#000" />
            </div>

            {/* Stars */}
            <div className="text-yellow-400 text-xl tracking-widest mb-6 mt-2">
              {'★'.repeat(t.rating || 5)}
            </div>

            {/* Quote text */}
            <blockquote className="text-text-secondary text-base leading-relaxed italic mb-8">
              "{t.content}"
            </blockquote>

            {/* Author */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-lg border-2"
                style={{ background:`${color}22`, borderColor:`${color}55`, color }}>
                {initials(t.name)}
              </div>
              <p className="font-display font-bold text-base tracking-wide">{t.name}</p>
              <p className="font-mono text-text-muted text-xs">
                {t.position}{t.company && ` @ ${t.company}`}
              </p>
              {t.linkedinUrl && (
                <a href={t.linkedinUrl} target="_blank" rel="noreferrer" className="text-neon-cyan">
                  <Linkedin size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button onClick={prev}
              className="w-11 h-11 rounded-full border border-white/10 bg-bg-card flex items-center justify-center
                text-text-secondary cursor-pointer transition-all hover:border-neon-cyan hover:text-neon-cyan">
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {data.map((_,i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className="h-2 rounded-full border-none cursor-pointer transition-all duration-300"
                  style={{
                    width: i === current ? 24 : 8,
                    background: i === current ? '#00f5ff' : 'rgba(255,255,255,0.1)',
                    boxShadow: i === current ? '0 0 8px #00f5ff' : 'none',
                  }} />
              ))}
            </div>

            <button onClick={next}
              className="w-11 h-11 rounded-full border border-white/10 bg-bg-card flex items-center justify-center
                text-text-secondary cursor-pointer transition-all hover:border-neon-cyan hover:text-neon-cyan">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Mini previews */}
          <div className="flex gap-3 mt-8 overflow-x-auto pb-2">
            {data.map((item, i) => (
              <div key={item._id} onClick={() => setCurrent(i)}
                className="flex-none w-44 p-3 rounded-xl cursor-pointer transition-all duration-200 border"
                style={{
                  background: i === current ? 'rgba(0,245,255,0.08)' : '#0f0f1e',
                  borderColor: i === current ? 'rgba(0,245,255,0.4)' : 'rgba(255,255,255,0.08)',
                }}>
                <p className="font-display font-bold text-sm mb-0.5 truncate">{item.name}</p>
                <p className="text-text-muted font-mono text-[0.68rem] truncate">{item.position}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
