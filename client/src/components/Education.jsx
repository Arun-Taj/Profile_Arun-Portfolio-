import React from 'react'
import { GraduationCap, MapPin, Calendar, Award } from 'lucide-react'

const DEFAULT_EDUCATION = [
  { _id:'1', institution:'Tribhuvan University',
    degree:"Bachelor's in Computer Science", field:'Computer Science & Information Technology',
    grade:'3.8 / 4.0 GPA', location:'Kathmandu, Nepal',
    startDate:'2016-09-01', endDate:'2020-06-30', current:false,
    description:'Focused on software engineering, data structures, algorithms, and web technologies.',
    achievements:["Dean's List — 4 consecutive semesters","Final Year Project: AI-powered Traffic Management System","President of Computer Science Club"] },
  { _id:'2', institution:'AWS Training & Certification',
    degree:'AWS Certified Developer', field:'Cloud Computing — Associate Level',
    grade:'Score: 892/1000', location:'Online',
    startDate:'2022-03-01', endDate:'2022-04-15', current:false,
    description:'Comprehensive training in cloud architecture, serverless, and DevOps on AWS.',
    achievements:['Passed on first attempt','Top 10% globally in certification exam'] },
  { _id:'3', institution:'Meta Front-End Professional',
    degree:'Meta Front-End Developer Certificate', field:'Front-End Web Development',
    grade:'With Distinction', location:'Coursera / Online',
    startDate:'2021-06-01', endDate:'2021-11-30', current:false,
    description:'Intensive program covering React, advanced JavaScript, and UX/UI principles.',
    achievements:['Completed all 9 courses with 100% score','Capstone project featured on course homepage'] },
]

const fmt = d => d ? new Date(d).toLocaleDateString('en-US',{month:'short',year:'numeric'}) : 'Present'

export default function Education({ education }) {
  const data = (education?.length > 0) ? education : DEFAULT_EDUCATION

  return (
    <section id="education" className="section-base bg-bg-secondary">
      <div className="container-base">
        <div className="text-center mb-16">
          <p className="section-subtitle">Academic background</p>
          <h2 className="section-title">Education</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {data.map((edu, idx) => {
            const isMain = idx === 0
            return (
              <div key={edu._id} className={`card-base relative !p-8 ${isMain ? '!border-neon-cyan/35' : ''}`}>
                {isMain && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 font-mono text-[0.62rem] text-black font-bold tracking-widest px-4 py-0.5 rounded-b-lg"
                    style={{ background:'linear-gradient(135deg,#00f5ff,#7c3aed)' }}>
                    PRIMARY
                  </div>
                )}

                {/* Icon */}
                <div className={`w-13 h-13 rounded-2xl flex items-center justify-center mb-5 w-12 h-12
                  ${isMain ? '' : 'bg-neon-purple/15 border border-neon-purple/40'}`}
                  style={isMain ? { background:'linear-gradient(135deg,#00f5ff,#7c3aed)' } : {}}>
                  <GraduationCap size={24} color={isMain ? '#000' : '#7c3aed'} />
                </div>

                <h3 className="font-display font-bold text-lg tracking-wide mb-1">{edu.degree}</h3>
                <p className="text-neon-cyan font-display font-semibold text-base mb-1">{edu.institution}</p>
                <p className="text-text-muted text-sm mb-4">{edu.field}</p>

                <div className="flex flex-col gap-1.5 mb-4">
                  <div className="flex items-center gap-2 text-text-secondary text-xs">
                    <Calendar size={12} color="#00f5ff" /> {fmt(edu.startDate)} — {edu.current ? 'Present' : fmt(edu.endDate)}
                  </div>
                  {edu.location && (
                    <div className="flex items-center gap-2 text-text-secondary text-xs">
                      <MapPin size={12} color="#00f5ff" /> {edu.location}
                    </div>
                  )}
                  {edu.grade && (
                    <div className="flex items-center gap-2 text-text-secondary text-xs">
                      <Award size={12} color="#fbbf24" /> {edu.grade}
                    </div>
                  )}
                </div>

                {edu.description && (
                  <p className="text-text-muted text-xs leading-relaxed border-t border-white/[0.08] pt-4 mb-4">
                    {edu.description}
                  </p>
                )}

                {edu.achievements?.length > 0 && (
                  <ul className="list-none flex flex-col gap-1.5">
                    {edu.achievements.map((a,i) => (
                      <li key={i} className="flex gap-2 text-text-secondary text-xs">
                        <span className="text-neon-cyan shrink-0">✦</span> {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
