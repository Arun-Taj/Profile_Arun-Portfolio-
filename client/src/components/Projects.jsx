import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, Github, Play, Star, Code2 } from 'lucide-react'

const CATS = ['all','web','mobile','api','ml','devops']

const DEFAULT_PROJECTS = [
  { _id:'1', featured:true,  category:'web',    status:'completed',
    title:'E-Commerce Platform',
    description:'Full-featured MERN stack e-commerce with real-time inventory, Stripe payment, and admin dashboard.',
    techStack:['React','Node.js','MongoDB','Stripe','Redis','Docker'], liveUrl:'#', githubUrl:'#' },
  { _id:'2', featured:true,  category:'web',    status:'completed',
    title:'Real-Time Chat App',
    description:'WebSocket-based messaging platform supporting rooms, file uploads, and encrypted messages.',
    techStack:['React','Socket.io','Node.js','MongoDB','AWS S3'], liveUrl:'#', githubUrl:'#' },
  { _id:'3', featured:true,  category:'api',    status:'completed',
    title:'REST API Boilerplate',
    description:'Production-ready Express.js template with JWT auth, rate limiting, Swagger docs, and Docker.',
    techStack:['Node.js','Express','MongoDB','JWT','Swagger','Docker'], liveUrl:null, githubUrl:'#' },
  { _id:'4', featured:false, category:'web',    status:'completed',
    title:'Portfolio CMS',
    description:'Headless CMS for developers with drag-and-drop builder and multi-language support.',
    techStack:['React','GraphQL','PostgreSQL','Node.js'], liveUrl:'#', githubUrl:'#' },
  { _id:'5', featured:false, category:'ml',     status:'completed',
    title:'AI Image Classifier',
    description:'ML model for image classification with React frontend and Python Flask backend.',
    techStack:['Python','TensorFlow','Flask','React','Docker'], liveUrl:'#', githubUrl:'#' },
  { _id:'6', featured:false, category:'devops', status:'in-progress',
    title:'DevOps Dashboard',
    description:'Real-time infrastructure monitoring with alerts, metrics visualisation, and auto-scaling.',
    techStack:['React','Node.js','Docker','Prometheus','Grafana'], liveUrl:null, githubUrl:'#' },
]

const GRADIENTS = [
  'from-neon-cyan/10 to-neon-purple/10',
  'from-neon-purple/10 to-neon-pink/10',
  'from-neon-pink/10 to-neon-cyan/10',
  'from-green-500/10 to-neon-cyan/10',
  'from-yellow-500/10 to-neon-pink/10',
  'from-neon-cyan/10 to-green-500/10',
]

function ProjectCard({ project, idx }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const coverImage = project.thumbnail || project.images?.[0] || ''

  return (
    <div className="card-base !p-0 overflow-hidden cursor-pointer flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/project/${project._id}`)}>

      {/* Thumbnail */}
      <div className={`relative h-44 bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]} flex items-center justify-center overflow-hidden`}>
        {coverImage
          ? <img src={coverImage} alt={project.title} className="w-full h-full object-cover" />
          : <Code2 size={48} className="text-neon-cyan/20" />
        }
        {project.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full border border-yellow-400/40">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="font-mono text-[0.62rem] text-yellow-400">FEATURED</span>
          </div>
        )}
        {project.status === 'in-progress' && (
          <div className="absolute top-3 right-3"><span className="badge-purple">In Progress</span></div>
        )}
        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-black/70 flex items-center justify-center gap-3 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          {project.liveUrl && project.liveUrl !== '#' && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()} className="btn-primary !px-4 !py-2 !text-xs">
              <Play size={13} /> Live
            </a>
          )}
          {project.githubUrl && project.githubUrl !== '#' && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="btn-outline !px-4 !py-2 !text-xs !bg-black/50">
              <Github size={13} /> Code
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-display font-bold text-lg tracking-wide flex-1">{project.title}</h3>
          <span className="badge-cyan uppercase shrink-0">{project.category}</span>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed flex-1 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.techStack?.slice(0,5).map(t => (
            <span key={t} className="font-mono text-[0.62rem] text-text-muted bg-bg-secondary px-2 py-0.5 rounded border border-white/[0.08]">{t}</span>
          ))}
          {project.techStack?.length > 5 && (
            <span className="font-mono text-[0.62rem] text-text-muted">+{project.techStack.length - 5}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Projects({ projects }) {
  const data = (projects?.length > 0) ? projects : DEFAULT_PROJECTS
  const [filter, setFilter] = useState('all')
  const [showAll, setShowAll] = useState(false)

  const filtered  = filter === 'all' ? data : data.filter(p => p.category === filter)
  const displayed = showAll ? filtered : filtered.slice(0, 6)

  return (
    <section id="projects" className="section-base bg-bg-secondary">
      <div className="container-base">
        <div className="text-center mb-16">
          <p className="section-subtitle">Things I've built</p>
          <h2 className="section-title">Projects</h2>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATS.filter(c => c === 'all' || data.some(p => p.category === c)).map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full font-mono text-[0.72rem] tracking-widest uppercase
                transition-all duration-200 cursor-pointer border
                ${filter === cat ? 'text-black border-transparent font-bold' : 'bg-bg-card text-text-secondary border-white/10 hover:border-neon-cyan/30'}`}
              style={filter === cat ? { background:'linear-gradient(135deg,#00f5ff,#7c3aed)', border:'none' } : {}}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((p, i) => <ProjectCard key={p._id} project={p} idx={i} />)}
        </div>

        {filtered.length > 6 && (
          <div className="text-center mt-10">
            <button className="btn-outline" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show Less' : `View All ${filtered.length} Projects`}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
