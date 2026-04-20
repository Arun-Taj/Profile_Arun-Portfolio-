import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Hero         from '../components/Hero.jsx'
import About        from '../components/About.jsx'
import Skills       from '../components/Skills.jsx'
import Experience   from '../components/Experience.jsx'
import Projects     from '../components/Projects.jsx'
import Education    from '../components/Education.jsx'
import Testimonials from '../components/Testimonials.jsx'
import Contact      from '../components/Contact.jsx'
import { profileAPI, projectsAPI, skillsAPI, experiencesAPI, educationAPI, testimonialsAPI } from '../utils/api'

export default function Home() {
  const location = useLocation()
  const [data, setData] = useState({
    profile:null, projects:[], skills:[], experiences:[], education:[], testimonials:[],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      profileAPI.get(), projectsAPI.getAll(), skillsAPI.getAll(),
      experiencesAPI.getAll(), educationAPI.getAll(), testimonialsAPI.getAll(),
    ]).then(([profile, projects, skills, experiences, education, testimonials]) => {
      setData({
        profile:      profile.status      === 'fulfilled' ? profile.value.data      : null,
        projects:     projects.status     === 'fulfilled' ? projects.value.data     : [],
        skills:       skills.status       === 'fulfilled' ? skills.value.data       : [],
        experiences:  experiences.status  === 'fulfilled' ? experiences.value.data  : [],
        education:    education.status    === 'fulfilled' ? education.value.data    : [],
        testimonials: testimonials.status === 'fulfilled' ? testimonials.value.data : [],
      })
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading || !location.hash) return
    const id = location.hash.replace('#', '')
    const el = document.getElementById(id)
    if (!el) return

    const timer = window.setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loading, location.hash])

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-cyan animate-spin" />
        <div className="absolute inset-1.5 rounded-full border-2 border-transparent border-t-neon-purple animate-spin"
          style={{ animationDirection:'reverse', animationDuration:'0.8s' }} />
      </div>
      <p className="font-mono text-xs text-text-muted tracking-[0.15em]">LOADING PORTFOLIO...</p>
    </div>
  )

  return (
    <>
      <Hero         profile={data.profile} />
      <About        profile={data.profile} />
      <Skills       skills={data.skills} />
      <Experience   experiences={data.experiences} />
      <Projects     projects={data.projects} />
      <Education    education={data.education} />
      <Testimonials testimonials={data.testimonials} />
      <Contact      profile={data.profile} />
    </>
  )
}
