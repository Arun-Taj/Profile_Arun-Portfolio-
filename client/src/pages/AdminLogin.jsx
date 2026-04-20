import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Terminal, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.jsx'

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email:'', password:'' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]  = useState(false)
  const [error, setError]      = useState('')

  useEffect(() => { if (isAuthenticated) navigate('/admin/dashboard') }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await login(form); navigate('/admin/dashboard') }
    catch (err) { setError(err.response?.data?.error || 'Login failed. Check your credentials.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg-primary relative overflow-hidden">
      {/* BG glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background:'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background:'linear-gradient(135deg,#00f5ff,#7c3aed)' }}>
            <Terminal size={26} color="#000" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-widest">
            ADMIN <span className="text-neon-cyan">PORTAL</span>
          </h1>
          <p className="font-mono text-xs text-text-muted mt-2 tracking-widest">// AUTHENTICATED ACCESS ONLY</p>
        </div>

        <div className="card-base !p-8">
          {/* Secure badge */}
          <div className="flex items-center gap-2 mb-7 px-3 py-2.5 rounded-lg border border-neon-purple/30"
            style={{ background:'rgba(124,58,237,0.1)' }}>
            <Lock size={14} color="#7c3aed" />
            <span className="font-mono text-[0.68rem] text-purple-300 tracking-widest">SECURE LOGIN — SSL ENCRYPTED</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="form-label">Admin Email</label>
              <div className="relative">
                <Mail size={15} color="#475569" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input type="email" placeholder="admin@portfolio.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="form-input !pl-10" required />
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock size={15} color="#475569" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="form-input !pl-10 !pr-12" required />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  title={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 z-20 -translate-y-1/2 bg-transparent border-none cursor-pointer text-neon-cyan hover:text-text-primary"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-neon-pink/30"
                style={{ background:'rgba(247,37,133,0.08)' }}>
                <AlertCircle size={15} color="#f72585" className="shrink-0" />
                <p className="text-neon-pink text-sm m-0">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary justify-center mt-1"
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading
                ? <><span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Authenticating...</>
                : <><Lock size={15} /> Login to Dashboard</>
              }
            </button>
          </form>
        </div>

        <p className="text-center mt-6 font-mono text-xs text-text-muted">
          <a href="/" className="text-neon-cyan no-underline hover:underline">← Back to Portfolio</a>
        </p>
      </div>
    </div>
  )
}
