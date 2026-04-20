import React, { useState } from 'react'
import { useInView } from 'react-intersection-observer'

const CATEGORY_LABELS = {
  frontend: 'Frontend', backend: 'Backend', database: 'Database',
  devops: 'DevOps', tools: 'Tools', languages: 'Languages', other: 'Other',
}
const CATEGORY_COLORS = {
  frontend: '#00f5ff', backend: '#7c3aed', database: '#f72585',
  devops: '#39ff14',   tools: '#fbbf24',   languages: '#f97316', other: '#94a3b8',
}

const DEFAULT_SKILLS = [
  { name: 'React.js',          category: 'frontend',  proficiency: 92 },
  { name: 'JavaScript (ES6+)', category: 'frontend',  proficiency: 90 },
  { name: 'TypeScript',        category: 'frontend',  proficiency: 78 },
  { name: 'CSS / Tailwind',    category: 'frontend',  proficiency: 88 },
  { name: 'Node.js',           category: 'backend',   proficiency: 88 },
  { name: 'Express.js',        category: 'backend',   proficiency: 85 },
  { name: 'REST API Design',   category: 'backend',   proficiency: 90 },
  { name: 'GraphQL',           category: 'backend',   proficiency: 70 },
  { name: 'MongoDB',           category: 'database',  proficiency: 85 },
  { name: 'PostgreSQL',        category: 'database',  proficiency: 75 },
  { name: 'Redis',             category: 'database',  proficiency: 65 },
  { name: 'Docker',            category: 'devops',    proficiency: 72 },
  { name: 'Git / GitHub',      category: 'tools',     proficiency: 93 },
  { name: 'Postman',           category: 'tools',     proficiency: 88 },
  { name: 'Python',            category: 'languages', proficiency: 70 },
]

function SkillBar({ skill }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })
  const color = CATEGORY_COLORS[skill.category] || '#00f5ff'
  return (
    <div ref={ref} className="mb-5">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-text-primary font-medium">{skill.name}</span>
        <span className="font-mono text-xs" style={{ color }}>{skill.proficiency}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{
          width: inView ? `${skill.proficiency}%` : '0%',
          background: `linear-gradient(90deg, ${color}, ${color}99)`,
          boxShadow: inView ? `0 0 10px ${color}60` : 'none',
        }} />
      </div>
    </div>
  )
}

export default function Skills({ skills }) {
  const data = (skills?.length > 0) ? skills : DEFAULT_SKILLS
  const categories = [...new Set(data.map(s => s.category))]
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all' ? data : data.filter(s => s.category === activeCategory)
  const grouped  = filtered.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  return (
    <section id="skills" className="section-base bg-bg-secondary">
      <div className="container-base">
        <div className="text-center mb-16">
          <p className="section-subtitle">What I work with</p>
          <h2 className="section-title">Technical Skills</h2>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {['all', ...categories].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full font-mono text-[0.72rem] tracking-widest uppercase
                transition-all duration-200 cursor-pointer border
                ${activeCategory === cat
                  ? 'text-black border-transparent font-bold'
                  : 'bg-bg-card text-text-secondary border-white/10 hover:border-neon-cyan/30'}`}
              style={activeCategory === cat ? { background: 'linear-gradient(135deg,#00f5ff,#7c3aed)', border: 'none' } : {}}>
              {cat === 'all' ? 'All' : CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        {/* Skill cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(grouped).map(([category, catSkills]) => {
            const color = CATEGORY_COLORS[category]
            return (
              <div key={category} className="card-base !p-7">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
                  <h3 className="font-display font-bold text-sm tracking-widest uppercase"
                    style={{ color }}>
                    {CATEGORY_LABELS[category] || category}
                  </h3>
                </div>
                {catSkills.map(skill => <SkillBar key={skill._id || skill.name} skill={skill} />)}
              </div>
            )
          })}
        </div>

        {/* Tech badges */}
        <div className="mt-16 text-center">
          <p className="font-mono text-[0.68rem] text-text-muted tracking-[0.2em] mb-4">TECHNOLOGIES I USE</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['MongoDB','Express','React','Node.js','TypeScript','Docker','Redis','PostgreSQL','AWS','Git'].map(t => (
              <span key={t} className="badge-cyan !text-sm !px-4 !py-1.5">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
