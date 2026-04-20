import React, { useState, useCallback } from 'react'
import { Mail, Send, Phone, MapPin, Github, Linkedin, Twitter, CheckCircle2, AlertCircle } from 'lucide-react'
import { contactAPI } from '../utils/api'

export default function Contact({ profile }) {
  const [form, setForm]     = useState({ name:'', email:'', subject:'', message:'' })
  const [status, setStatus] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.message) {
      setStatus('error'); setErrorMsg('Please fill in all fields.'); return
    }
    setStatus('loading')
    try {
      await contactAPI.send(form)
      setStatus('success')
      setForm({ name:'', email:'', subject:'', message:'' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.response?.data?.error || 'Backend not connected. Please email me directly.')
    }
  }

  const p = profile || {}

  const inputCls = `
    block w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-3.5
    text-text-primary font-body text-[0.95rem] outline-none transition-all duration-200
    placeholder:text-text-muted focus:border-neon-cyan
    relative z-10 pointer-events-auto appearance-none
  `
  const focusStyle = {
    '--tw-ring-color': 'rgba(0,245,255,0.1)',
  }

  return (
    <section id="contact" className="section-base">
      <div className="container-base">
        <div className="text-center mb-16">
          <p className="section-subtitle">Let's work together</p>
          <h2 className="section-title">Contact Me</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 max-w-4xl mx-auto">

          {/* ── Left ── */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-4 tracking-wide">
              Let's Build Something <span className="text-neon-cyan">Amazing</span>
            </h3>
            <p className="text-text-secondary leading-relaxed mb-8 text-[0.95rem]">
              Whether you have a project in mind, want to discuss an opportunity, or just want to say hi —
              my inbox is always open. I'll get back to you within 24 hours.
            </p>

            {/* Contact info */}
            <div className="flex flex-col gap-4 mb-8">
              {[
                { Icon:Mail,   label:'Email',    value: p.email    || 'dev@example.com',  href:`mailto:${p.email||'dev@example.com'}` },
                { Icon:Phone,  label:'Phone',    value: p.phone    || '+977 9800000000' },
                { Icon:MapPin, label:'Location', value: p.location || 'Kathmandu, Nepal' },
              ].map(({ Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl shrink-0 bg-neon-cyan/8 border border-white/10 flex items-center justify-center"
                    style={{ background:'rgba(0,245,255,0.08)' }}>
                    <Icon size={18} color="#00f5ff" />
                  </div>
                  <div>
                    <p className="font-mono text-[0.65rem] text-text-muted tracking-widest mb-0.5">{label.toUpperCase()}</p>
                    {href
                      ? <a href={href} className="text-text-primary text-sm no-underline hover:text-neon-cyan transition-colors">{value}</a>
                      : <p className="text-text-primary text-sm m-0">{value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <p className="font-mono text-[0.65rem] text-text-muted tracking-[0.15em] mb-3">FIND ME ON</p>
            <div className="flex gap-3 mb-8">
              {[
                { Icon:Github,   url: p.social?.github   },
                { Icon:Linkedin, url: p.social?.linkedin },
                { Icon:Twitter,  url: p.social?.twitter  },
              ].filter(s => s.url).map(({ Icon, url }, i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer" className="social-btn">
                  <Icon size={20} />
                </a>
              ))}
            </div>

            {/* Available badge */}
            <div className="p-5 border border-neon-cyan/20 rounded-xl" style={{ background:'rgba(0,245,255,0.05)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="neon-dot" />
                <span className="font-mono text-[0.7rem] text-neon-green tracking-widest">AVAILABLE FOR PROJECTS</span>
              </div>
              <p className="text-text-muted text-xs leading-relaxed m-0">
                Currently open to freelance work, full-time roles, and interesting collaborations.
              </p>
            </div>
          </div>

          {/* ── Right: form ── */}
          <div className="bg-bg-card border border-white/[0.08] rounded-xl p-8" style={{ position:'relative', zIndex:1 }}>
            <h3 className="font-display font-bold text-xl tracking-wide mb-7 flex items-center gap-2" style={{ color:'#f0f4ff' }}>
              <Mail size={20} color="#00f5ff" /> Send a Message
            </h3>

            {status === 'success' ? (
              <div className="text-center py-12">
                <CheckCircle2 size={56} color="#39ff14" className="mx-auto mb-4" />
                <h4 className="font-display font-bold text-2xl mb-3">Message Sent!</h4>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Thanks for reaching out! I'll reply within 24–48 hours.
                  Check your inbox for a confirmation email.
                </p>
                <button className="btn-outline" onClick={() => { setStatus(null); setErrorMsg('') }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-name" className="form-label">Name</label>
                    <input id="c-name" name="name" type="text" autoComplete="name"
                      placeholder="Your name" value={form.name} onChange={handleChange}
                      className={inputCls}
                      onFocus={e => { e.target.style.borderColor='#00f5ff'; e.target.style.boxShadow='0 0 0 3px rgba(0,245,255,0.1)' }}
                      onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}
                    />
                  </div>
                  <div>
                    <label htmlFor="c-email" className="form-label">Email</label>
                    <input id="c-email" name="email" type="email" autoComplete="email"
                      placeholder="your@email.com" value={form.email} onChange={handleChange}
                      className={inputCls}
                      onFocus={e => { e.target.style.borderColor='#00f5ff'; e.target.style.boxShadow='0 0 0 3px rgba(0,245,255,0.1)' }}
                      onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="c-subject" className="form-label">Subject</label>
                  <input id="c-subject" name="subject" type="text"
                    placeholder="What's this about?" value={form.subject} onChange={handleChange}
                    className={inputCls}
                    onFocus={e => { e.target.style.borderColor='#00f5ff'; e.target.style.boxShadow='0 0 0 3px rgba(0,245,255,0.1)' }}
                    onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="c-message" className="form-label">Message</label>
                  <textarea id="c-message" name="message" rows={6}
                    placeholder="Tell me about your project, idea, or question..."
                    value={form.message} onChange={handleChange}
                    className={inputCls + ' resize-y min-h-[140px]'}
                    onFocus={e => { e.target.style.borderColor='#00f5ff'; e.target.style.boxShadow='0 0 0 3px rgba(0,245,255,0.1)' }}
                    onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}
                  />
                </div>

                {/* Error */}
                {status === 'error' && (
                  <div className="flex items-start gap-2 p-3.5 rounded-lg border border-neon-pink/30" style={{ background:'rgba(247,37,133,0.08)' }}>
                    <AlertCircle size={16} color="#f72585" className="shrink-0 mt-0.5" />
                    <p className="text-neon-pink text-sm m-0">{errorMsg}</p>
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={status === 'loading'}
                  className="btn-primary justify-center"
                  style={{ opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}
                  onMouseEnter={e => { if (status !== 'loading') e.currentTarget.style.boxShadow='0 0 20px rgba(0,245,255,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow='none' }}>
                  {status === 'loading' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </button>

                <p className="text-center text-text-muted font-mono text-xs m-0">
                  Or email directly:{' '}
                  <a href={`mailto:${p.email || 'dev@example.com'}`} className="text-neon-cyan no-underline">
                    {p.email || 'dev@example.com'}
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
