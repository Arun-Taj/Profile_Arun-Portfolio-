import React, { useState } from 'react'
import { Briefcase, MapPin, Calendar, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

const DEFAULT_EXPERIENCES = [
  {
    _id: '1', company: 'TechCorp Solutions', position: 'Senior Full Stack Developer',
    location: 'Remote', type: 'full-time', current: true,
    startDate: '2022-01-01', endDate: null,
    description: 'Leading development of enterprise SaaS platform serving 50k+ users.',
    achievements: [
      'Architected microservices backend reducing API response time by 60%',
      'Built real-time dashboard with WebSockets serving 10k concurrent users',
      'Mentored 4 junior developers and conducted weekly code reviews',
      'Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes',
    ],
    techUsed: ['React', 'Node.js', 'MongoDB', 'Redis', 'Docker', 'AWS'],
    companyUrl: '#',
  },
  {
    _id: '2', company: 'StartupXYZ', position: 'Full Stack Developer',
    location: 'Kathmandu, Nepal', type: 'full-time', current: false,
    startDate: '2020-06-01', endDate: '2021-12-31',
    description: 'Developed and maintained multiple client-facing web applications.',
    achievements: [
      'Built e-commerce platform with Stripe & eSewa payment integration',
      'Developed REST APIs consumed by mobile and web clients',
      'Improved application load time by 45% through code splitting',
    ],
    techUsed: ['React', 'Express', 'PostgreSQL', 'Stripe'],
  },
  {
    _id: '3', company: 'FreelanceHub', position: 'Freelance Web Developer',
    location: 'Remote', type: 'freelance', current: false,
    startDate: '2019-01-01', endDate: '2020-05-31',
    description: 'Delivered 20+ web projects for international clients.',
    achievements: [
      'Developed custom React websites for 20+ clients',
      'Maintained 5-star rating on Upwork with 100% job success',
      'Specialised in performance optimisation and responsive design',
    ],
    techUsed: ['React', 'WordPress', 'JavaScript', 'PHP', 'MySQL'],
  },
]

const TYPE_LABELS = {
  'full-time': 'Full Time', 'part-time': 'Part Time',
  freelance: 'Freelance', contract: 'Contract', internship: 'Internship',
}

const fmt = d => d ? new Date(d).toLocaleDateString('en-US',{month:'short',year:'numeric'}) : 'Present'

export default function Experience({ experiences }) {
  const data = (experiences?.length > 0) ? experiences : DEFAULT_EXPERIENCES
  const [expanded, setExpanded] = useState(data[0]?._id)

  return (
    <section id="experience" className="section-base">
      <div className="container-base">
        <div className="text-center mb-16">
          <p className="section-subtitle">My professional journey</p>
          <h2 className="section-title">Experience</h2>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-7 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(180deg,#00f5ff,#7c3aed,transparent)' }} />

          {data.map(exp => {
            const isOpen = expanded === exp._id
            return (
              <div key={exp._id} className="flex gap-6 mb-6">
                {/* Dot */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center z-10 relative border-2
                    ${exp.current
                      ? 'border-transparent'
                      : 'border-white/10 bg-bg-card'}`}
                    style={exp.current
                      ? { background: 'linear-gradient(135deg,#00f5ff,#7c3aed)', boxShadow: '0 0 20px rgba(0,245,255,0.3)' }
                      : {}}>
                    <Briefcase size={22} color={exp.current ? '#000' : '#475569'} />
                  </div>
                </div>

                {/* Card */}
                <div className="card-base flex-1 cursor-pointer" onClick={() => setExpanded(isOpen ? null : exp._id)}>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-display font-bold text-xl tracking-wide">{exp.position}</h3>
                        {exp.current && <span className="badge-cyan">Current</span>}
                        <span className="badge-purple">{TYPE_LABELS[exp.type] || exp.type}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 items-center">
                        <span className="font-display text-base font-semibold text-neon-cyan flex items-center gap-1.5">
                          {exp.company}
                          {exp.companyUrl && exp.companyUrl !== '#' && (
                            <a href={exp.companyUrl} target="_blank" rel="noreferrer"
                              onClick={e => e.stopPropagation()} className="text-text-muted">
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </span>
                        <span className="flex items-center gap-1 text-text-muted text-xs">
                          <MapPin size={12} /> {exp.location}
                        </span>
                        <span className="flex items-center gap-1 text-text-muted text-xs">
                          <Calendar size={12} /> {fmt(exp.startDate)} — {fmt(exp.endDate)}
                        </span>
                      </div>
                    </div>
                    <span className="text-text-muted shrink-0">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </div>

                  {isOpen && (
                    <div className="mt-5 pt-5 border-t border-white/[0.08]">
                      {exp.description && (
                        <p className="text-text-secondary text-sm leading-relaxed mb-4">{exp.description}</p>
                      )}
                      {exp.achievements?.length > 0 && (
                        <ul className="flex flex-col gap-2 mb-4 list-none p-0">
                          {exp.achievements.map((a, i) => (
                            <li key={i} className="flex gap-3 text-text-secondary text-sm leading-relaxed">
                              <span className="text-neon-cyan shrink-0 mt-0.5">▸</span> {a}
                            </li>
                          ))}
                        </ul>
                      )}
                      {exp.techUsed?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.techUsed.map(t => <span key={t} className="badge-cyan">{t}</span>)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
