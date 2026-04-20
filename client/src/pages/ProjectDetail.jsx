import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Github, Play, Tag, Calendar, CheckCircle2 } from 'lucide-react'
import { projectsAPI } from '../utils/api'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    projectsAPI.getOne(id)
      .then(res => setProject(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-transparent border-t-neon-cyan animate-spin" />
    </div>
  )
  if (!project) return null

  const isEmbedVideo = /youtube\.com|youtu\.be|vimeo\.com/.test(project.demoVideoUrl || '')
  const coverImage = project.thumbnail || project.images?.[0] || ''

  return (
    <div className="pt-[70px] min-h-screen">
      <div className="container-base py-12 pb-24">
        <button onClick={() => navigate(-1)} className="btn-ghost !px-4 !py-2 !text-sm mb-8">
          <ArrowLeft size={15} /> Back to Projects
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
          {/* Main */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge-cyan uppercase">{project.category}</span>
              {project.featured && <span className="badge-purple">Featured</span>}
              <span className={project.status === 'completed' ? 'badge-cyan' : 'badge-pink'}>
                {project.status}
              </span>
            </div>

            <h1 className="font-display font-bold uppercase tracking-wide mb-4"
              style={{ fontSize:'clamp(2rem,4vw,3rem)' }}>
              {project.title}
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed mb-8">
              {project.longDescription || project.description}
            </p>

            {coverImage && (
              <div className="rounded-2xl overflow-hidden border border-white/10 mb-8 aspect-video bg-bg-card">
                <img src={coverImage} alt={project.title} className="w-full h-full object-cover" />
              </div>
            )}

            {project.demoVideoUrl && (
              <div className="mb-8">
                <h3 className="font-display font-bold text-lg tracking-wide mb-4 flex items-center gap-2">
                  <Play size={18} color="#00f5ff" /> Demo Video
                </h3>
                <div className="rounded-xl overflow-hidden border border-white/10 aspect-video">
                  {isEmbedVideo ? (
                    <iframe src={project.demoVideoUrl} title="Demo" className="w-full h-full border-none" allowFullScreen />
                  ) : (
                    <video src={project.demoVideoUrl} controls className="w-full h-full" />
                  )}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-display font-bold text-lg tracking-wide mb-4 flex items-center gap-2">
                <Tag size={18} color="#00f5ff" /> Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map(t => (
                  <span key={t} className="badge-cyan !text-sm !px-4 !py-1.5">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="card-base !p-6">
              <h4 className="font-display font-bold text-sm tracking-widest uppercase text-text-muted mb-4">Project Links</h4>
              <div className="flex flex-col gap-3">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary justify-center">
                    <ExternalLink size={15} /> Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-outline justify-center">
                    <Github size={15} /> View Code
                  </a>
                )}
              </div>
            </div>

            <div className="card-base !p-6">
              <h4 className="font-display font-bold text-sm tracking-widest uppercase text-text-muted mb-4">Project Info</h4>
              <div className="flex flex-col gap-3">
                {[
                  { label:'Status',   value: project.status?.charAt(0).toUpperCase() + project.status?.slice(1), Icon:CheckCircle2 },
                  { label:'Category', value: project.category?.toUpperCase(), Icon:Tag },
                  { label:'Created',  value: new Date(project.createdAt).toLocaleDateString('en-US',{month:'long',year:'numeric'}), Icon:Calendar },
                ].map(({ label, value, Icon }) => (
                  <div key={label} className="flex justify-between items-center pb-3 border-b border-white/[0.08] last:border-0 last:pb-0">
                    <div className="flex items-center gap-1.5 text-text-muted text-xs">
                      <Icon size={12} color="#00f5ff" /> {label}
                    </div>
                    <span className="font-mono text-xs text-text-primary">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
