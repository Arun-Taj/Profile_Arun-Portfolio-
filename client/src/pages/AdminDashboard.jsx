import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import {
  LayoutDashboard, FolderKanban, Wrench, Briefcase, GraduationCap,
  Mail, Star, User, LogOut, Plus, Pencil, Trash2, ChevronRight,
  Eye, X, Check, Terminal, AlertCircle,
} from 'lucide-react'
import {
  projectsAPI, skillsAPI, experiencesAPI, educationAPI,
  testimonialsAPI, contactAPI, profileAPI, uploadAPI,
} from '../utils/api'

/* ── Shared field components ─────────────────────────────────────────────── */
const FL = ({ label, children }) => (
  <div>
    <label className="block font-mono text-[0.68rem] text-neon-cyan tracking-widest uppercase mb-1.5">{label}</label>
    {children}
  </div>
)

const inputCls = "w-full bg-bg-secondary border border-white/10 rounded-lg px-3.5 py-2.5 text-text-primary text-sm outline-none placeholder:text-text-muted transition-colors duration-200 focus:border-neon-cyan"

const FInput = ({ label, value, onChange, type='text', placeholder, required }) => (
  <FL label={label}>
    <input type={type} value={value||''} placeholder={placeholder||label} required={required}
      onChange={e => onChange(e.target.value)} className={inputCls} />
  </FL>
)

const FFile = ({ label, accept, onChange, helperText }) => (
  <FL label={label}>
    <input
      type="file"
      accept={accept}
      onChange={(e) => onChange(e.target.files?.[0] || null)}
      className={inputCls}
    />
    {helperText && <p className="text-text-muted text-[0.62rem] mt-1 font-mono">{helperText}</p>}
  </FL>
)

const FTextarea = ({ label, value, onChange, placeholder, rows=3 }) => (
  <FL label={label}>
    <textarea value={value||''} placeholder={placeholder||label} rows={rows}
      onChange={e => onChange(e.target.value)} className={inputCls + ' resize-y'} />
  </FL>
)

const FSelect = ({ label, value, onChange, options }) => (
  <FL label={label}>
    <select value={value||''} onChange={e => onChange(e.target.value)}
      className={inputCls + ' cursor-pointer'} style={{ appearance:'none' }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </FL>
)

const FToggle = ({ label, value, onChange }) => (
  <FL label={label}>
    <div className="flex items-center gap-3 mt-1">
      <button type="button" onClick={() => onChange(!value)}
        className="relative w-12 h-6 rounded-full border-none cursor-pointer transition-all duration-300"
        style={{ background: value ? 'linear-gradient(135deg,#00f5ff,#7c3aed)' : '#1e2035' }}>
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${value ? 'left-7' : 'left-1'}`} />
      </button>
      <span className={`text-sm ${value ? 'text-neon-cyan' : 'text-text-muted'}`}>{value ? 'Yes' : 'No'}</span>
    </div>
  </FL>
)

const FTags = ({ label, values=[], onChange, placeholder }) => {
  const [input, setInput] = useState('')
  const add = () => {
    const t = input.trim().replace(/,$/,'')
    if (t && !values.includes(t)) onChange([...values, t])
    setInput('')
  }
  return (
    <FL label={label}>
      <div className="bg-bg-secondary border border-white/10 rounded-lg p-2 flex flex-wrap gap-1.5 min-h-[44px]">
        {values.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan rounded-full px-2.5 py-0.5 text-xs font-mono">
            {tag}
            <button type="button" onClick={() => onChange(values.filter(v=>v!==tag))} className="bg-transparent border-none cursor-pointer text-neon-cyan/60 hover:text-neon-cyan leading-none">×</button>
          </span>
        ))}
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e => { if(e.key==='Enter'||e.key===','){e.preventDefault();add()} }}
          onBlur={add}
          placeholder={values.length===0 ? placeholder : '+ add more...'}
          className="bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-muted flex-1 min-w-[120px]" />
      </div>
      <p className="text-text-muted text-[0.62rem] mt-1 font-mono">Press Enter or comma after each item</p>
    </FL>
  )
}

const FBullets = ({ label, values=[], onChange }) => {
  const [input, setInput] = useState('')
  const add = () => { if(input.trim()){onChange([...values,input.trim()]);setInput('')} }
  return (
    <FL label={label}>
      <div className="space-y-2 mb-2">
        {values.map((v,i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="text-neon-cyan text-sm shrink-0">▸</span>
            <input value={v} onChange={e=>{const n=[...values];n[i]=e.target.value;onChange(n)}}
              className={inputCls + ' flex-1'} />
            <button type="button" onClick={()=>onChange(values.filter((_,idx)=>idx!==i))} className="text-neon-pink bg-transparent border-none cursor-pointer shrink-0"><X size={14}/></button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();add()}}}
          placeholder="Type and press Enter to add..." className={inputCls+' flex-1'} />
        <button type="button" onClick={add} className="btn-outline !px-3 !py-2 !text-xs shrink-0"><Plus size={13}/> Add</button>
      </div>
    </FL>
  )
}

const ErrBox = ({ msg }) => msg ? (
  <div className="flex items-center gap-2 mb-5 px-4 py-3 bg-neon-pink/10 border border-neon-pink/30 rounded-lg text-neon-pink text-sm">
    <AlertCircle size={15}/> {msg}
  </div>
) : null

const SaveBar = ({ saving, success, onSave, onCancel, isNew }) => (
  <div className="flex items-center gap-3 pt-4 border-t border-white/[0.08] mt-6">
    <button type="button" onClick={onSave} disabled={saving} className="btn-primary !px-6 !py-2.5" style={{opacity:saving?0.7:1}}>
      {saving ? <><span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/>&nbsp;Saving...</> : (isNew ? '✦ Create' : '✦ Save Changes')}
    </button>
    <button type="button" onClick={onCancel} className="btn-ghost !px-5 !py-2.5">Cancel</button>
    {success && <span className="flex items-center gap-1.5 text-neon-green text-sm"><Check size={15}/> Saved!</span>}
  </div>
)

/* ── Reusable list shell ──────────────────────────────────────────────────── */
function ListShell({ items, api, onRefresh, FormComponent, renderRow }) {
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [err, setErr] = useState('')

  const handleDelete = async id => {
    if (!window.confirm('Delete this item?')) return
    setDeleting(id)
    try { await api.delete(id); await onRefresh() }
    catch { setErr('Delete failed.') }
    finally { setDeleting(null) }
  }

  if (editing !== null)
    return <FormComponent item={editing} api={api} onSave={async()=>{await onRefresh();setEditing(null)}} onCancel={()=>setEditing(null)} />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="font-mono text-xs text-text-muted">{items.length} items</p>
        <button className="btn-primary !px-4 !py-2 !text-xs" onClick={()=>setEditing({})}><Plus size={14}/> Add New</button>
      </div>
      <ErrBox msg={err} />
      <div className="card-base !p-0 overflow-hidden">
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-text-muted font-mono text-xs mb-3">No items yet</p>
            <button className="btn-outline !px-5 !py-2 !text-xs" onClick={()=>setEditing({})}><Plus size={13}/> Add your first one</button>
          </div>
        ) : items.map(item => (
          <div key={item._id} className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] hover:bg-bg-card-hover transition-colors">
            <div className="flex-1 min-w-0">{renderRow(item)}</div>
            <div className="flex gap-2 ml-4 shrink-0">
              <button onClick={()=>setEditing(item)} className="w-8 h-8 rounded-lg border border-white/10 bg-transparent cursor-pointer text-neon-cyan flex items-center justify-center hover:border-neon-cyan/50"><Pencil size={13}/></button>
              <button onClick={()=>handleDelete(item._id)} disabled={deleting===item._id}
                className="w-8 h-8 rounded-lg border border-neon-pink/30 bg-transparent cursor-pointer text-neon-pink flex items-center justify-center hover:bg-neon-pink/10"
                style={{opacity:deleting===item._id?0.5:1}}><Trash2 size={13}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── PROJECTS ─────────────────────────────────────────────────────────────── */
const EMPTY_PROJECT = { title:'', description:'', longDescription:'', category:'web', status:'completed', featured:false, techStack:[], liveUrl:'', githubUrl:'', demoVideoUrl:'', thumbnail:'', order:0 }

function ProjectForm({ item, api, onSave, onCancel }) {
  const isNew = !item._id
  const [form, setForm] = useState({...EMPTY_PROJECT,...item})
  const [saving, setSaving] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const set = (f,v) => setForm(p=>({...p,[f]:v}))

  const uploadAndSetField = async (file, field, setUploading) => {
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const res = await uploadAPI.single(file)
      set(field, res.data.file.url)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Project title is required'); return }
    if (!form.description.trim()) { setError('Short description is required'); return }
    setError(''); setSaving(true)
    try {
      isNew ? await api.create(form) : await api.update(item._id, form)
      setSuccess(true); setTimeout(()=>onSave(), 800)
    } catch(e) { setError(e.response?.data?.error||e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="btn-ghost !px-3 !py-2 !text-xs">← Back</button>
        <h2 className="font-display font-bold text-xl tracking-wide">{isNew ? 'Add New Project' : `Edit: ${item.title}`}</h2>
      </div>
      <ErrBox msg={error}/>
      <div className="card-base !p-6 space-y-5">
        <FInput label="Project Title *" value={form.title} onChange={v=>set('title',v)} placeholder="e.g. E-Commerce Platform" required/>
        <div className="grid grid-cols-2 gap-4">
          <FSelect label="Category" value={form.category} onChange={v=>set('category',v)} options={[
            {value:'web',label:'🌐 Web App'},{value:'mobile',label:'📱 Mobile App'},
            {value:'api',label:'⚙️ API / Backend'},{value:'ml',label:'🤖 ML / AI'},
            {value:'devops',label:'🚀 DevOps'},{value:'other',label:'📦 Other'},
          ]}/>
          <FSelect label="Status" value={form.status} onChange={v=>set('status',v)} options={[
            {value:'completed',label:'✅ Completed'},
            {value:'in-progress',label:'🔄 In Progress'},
            {value:'planned',label:'📋 Planned'},
          ]}/>
        </div>
        <FTextarea label="Short Description * (shown on card)" value={form.description} onChange={v=>set('description',v)}
          placeholder="A 1–2 sentence summary shown on the project card. Keep it concise." rows={2}/>
        <FTextarea label="Detailed Description (shown on project detail page)" value={form.longDescription} onChange={v=>set('longDescription',v)}
          placeholder="Full explanation of the project, your role, challenges, results, etc." rows={4}/>
        <FTags label="Tech Stack — press Enter after each technology" values={form.techStack} onChange={v=>set('techStack',v)} placeholder="React, Node.js, MongoDB, Docker..."/>
        <div className="grid grid-cols-2 gap-4">
          <FInput label="Live Demo URL" value={form.liveUrl} onChange={v=>set('liveUrl',v)} type="url" placeholder="https://yourapp.com"/>
          <FInput label="GitHub Repository URL" value={form.githubUrl} onChange={v=>set('githubUrl',v)} type="url" placeholder="https://github.com/you/repo"/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FFile
            label="Upload Thumbnail Image"
            accept="image/*"
            onChange={(file) => uploadAndSetField(file, 'thumbnail', setUploadingThumbnail)}
            helperText={uploadingThumbnail ? 'Uploading image to Cloudinary...' : 'Choose an image from your local machine'}
          />
          <FFile
            label="Upload Demo Video"
            accept="video/*"
            onChange={(file) => uploadAndSetField(file, 'demoVideoUrl', setUploadingVideo)}
            helperText={uploadingVideo ? 'Uploading video to Cloudinary...' : 'Choose a video from your local machine'}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FInput label="Thumbnail URL (Cloudinary)" value={form.thumbnail} onChange={v=>set('thumbnail',v)} type="url" placeholder="auto-filled after upload"/>
          <FInput label="Demo Video URL (Cloudinary)" value={form.demoVideoUrl} onChange={v=>set('demoVideoUrl',v)} type="url" placeholder="auto-filled after upload"/>
        </div>
        <div className="grid grid-cols-2 gap-4 items-start">
          <FToggle label="Featured Project (appears first + star badge)" value={form.featured} onChange={v=>set('featured',v)}/>
          <FInput label="Display Order (0 = first)" value={String(form.order)} onChange={v=>set('order',parseInt(v)||0)} type="number" placeholder="0"/>
        </div>
        <div className="bg-neon-purple/5 border border-neon-purple/20 rounded-lg p-4 text-xs text-text-muted space-y-1">
          <p className="font-mono text-[0.65rem] text-purple-300 tracking-widest mb-2">💡 TIPS</p>
          <p>• <strong className="text-text-secondary">Tech Stack</strong> — type each technology and press Enter, e.g. "React" → Enter → "Node.js" → Enter.</p>
          <p>• <strong className="text-text-secondary">Media Uploads</strong> — choose an image or video from your device and the Cloudinary URL is saved automatically.</p>
          <p>• <strong className="text-text-secondary">Featured</strong> — mark your best 2–3 projects as featured so they appear at the top.</p>
          <p>• <strong className="text-text-secondary">Live/GitHub URL</strong> — leave blank if unavailable; those buttons simply won't show on the card.</p>
        </div>
      </div>
      <SaveBar saving={saving} success={success} onSave={handleSave} onCancel={onCancel} isNew={isNew}/>
    </div>
  )
}

function ProjectsPanel({ items, onRefresh }) {
  return (
    <ListShell items={items} api={projectsAPI} onRefresh={onRefresh} FormComponent={ProjectForm}
      renderRow={item=>(
        <div>
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="font-medium text-sm">{item.title}</span>
            {item.featured && <span className="badge-cyan text-[0.58rem]">featured</span>}
            {item.status==='in-progress' && <span className="badge-purple text-[0.58rem]">in progress</span>}
          </div>
          <div className="flex gap-3 text-xs text-text-muted flex-wrap">
            <span className="capitalize">{item.category}</span>
            {item.techStack?.length>0 && <span>· {item.techStack.slice(0,3).join(', ')}{item.techStack.length>3?'...':''}</span>}
          </div>
        </div>
      )}
    />
  )
}

/* ── SKILLS ───────────────────────────────────────────────────────────────── */
const EMPTY_SKILL = { name:'', category:'frontend', proficiency:80, featured:false, order:0 }

function SkillForm({ item, api, onSave, onCancel }) {
  const isNew = !item._id
  const [form, setForm] = useState({...EMPTY_SKILL,...item})
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const set = (f,v) => setForm(p=>({...p,[f]:v}))

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Skill name is required'); return }
    setError(''); setSaving(true)
    try {
      isNew ? await api.create(form) : await api.update(item._id, form)
      setSuccess(true); setTimeout(()=>onSave(), 800)
    } catch(e) { setError(e.response?.data?.error||e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="btn-ghost !px-3 !py-2 !text-xs">← Back</button>
        <h2 className="font-display font-bold text-xl tracking-wide">{isNew ? 'Add Skill' : `Edit: ${item.name}`}</h2>
      </div>
      <ErrBox msg={error}/>
      <div className="card-base !p-6 space-y-5">
        <FInput label="Skill Name *" value={form.name} onChange={v=>set('name',v)} placeholder="e.g. React.js" required/>
        <FSelect label="Category" value={form.category} onChange={v=>set('category',v)} options={[
          {value:'frontend',label:'🎨 Frontend'},{value:'backend',label:'⚙️ Backend'},
          {value:'database',label:'🗄️ Database'},{value:'devops',label:'🚀 DevOps'},
          {value:'tools',label:'🔧 Tools'},{value:'languages',label:'💻 Languages'},{value:'other',label:'📦 Other'},
        ]}/>
        <FL label={`Proficiency — ${form.proficiency}%`}>
          <input type="range" min="0" max="100" value={form.proficiency}
            onChange={e=>set('proficiency',Number(e.target.value))} className="w-full accent-neon-cyan cursor-pointer mt-1"/>
          <div className="mt-2 h-1.5 bg-bg-secondary rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{width:`${form.proficiency}%`,background:'linear-gradient(90deg,#00f5ff,#7c3aed)'}}/>
          </div>
        </FL>
        <div className="flex items-start gap-8">
          <FToggle label="Featured" value={form.featured} onChange={v=>set('featured',v)}/>
          <FInput label="Display Order" value={String(form.order)} onChange={v=>set('order',parseInt(v)||0)} type="number" placeholder="0"/>
        </div>
      </div>
      <SaveBar saving={saving} success={success} onSave={handleSave} onCancel={onCancel} isNew={isNew}/>
    </div>
  )
}

function SkillsPanel({ items, onRefresh }) {
  return (
    <ListShell items={items} api={skillsAPI} onRefresh={onRefresh} FormComponent={SkillForm}
      renderRow={item=>(
        <div className="flex items-center gap-4">
          <div className="flex-1"><span className="font-medium text-sm">{item.name}</span><span className="ml-2 text-text-muted text-xs capitalize">({item.category})</span></div>
          <div className="w-24 h-1.5 bg-bg-secondary rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{width:`${item.proficiency}%`,background:'linear-gradient(90deg,#00f5ff,#7c3aed)'}}/>
          </div>
          <span className="font-mono text-xs text-neon-cyan w-10 text-right">{item.proficiency}%</span>
        </div>
      )}
    />
  )
}

/* ── EXPERIENCE ───────────────────────────────────────────────────────────── */
const EMPTY_EXP = { company:'', position:'', location:'', type:'full-time', current:false, startDate:'', endDate:'', description:'', achievements:[], techUsed:[], companyUrl:'' }
const toD = d => d ? new Date(d).toISOString().split('T')[0] : ''

function ExperienceForm({ item, api, onSave, onCancel }) {
  const isNew = !item._id
  const [form, setForm] = useState({...EMPTY_EXP,...item, startDate:toD(item.startDate), endDate:toD(item.endDate)})
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const set = (f,v) => setForm(p=>({...p,[f]:v}))

  const handleSave = async () => {
    if (!form.company.trim()||!form.position.trim()) { setError('Company and position are required'); return }
    if (!form.startDate) { setError('Start date is required'); return }
    setError(''); setSaving(true)
    try {
      const payload = {...form, endDate: form.current ? null : form.endDate||null}
      isNew ? await api.create(payload) : await api.update(item._id, payload)
      setSuccess(true); setTimeout(()=>onSave(), 800)
    } catch(e) { setError(e.response?.data?.error||e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="btn-ghost !px-3 !py-2 !text-xs">← Back</button>
        <h2 className="font-display font-bold text-xl tracking-wide">{isNew ? 'Add Experience' : `Edit: ${item.position}`}</h2>
      </div>
      <ErrBox msg={error}/>
      <div className="card-base !p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FInput label="Job Title / Position *" value={form.position} onChange={v=>set('position',v)} placeholder="Senior Full Stack Developer" required/>
          <FInput label="Company Name *" value={form.company} onChange={v=>set('company',v)} placeholder="Google" required/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FInput label="Location" value={form.location} onChange={v=>set('location',v)} placeholder="Remote / Kathmandu, Nepal"/>
          <FSelect label="Employment Type" value={form.type} onChange={v=>set('type',v)} options={[
            {value:'full-time',label:'Full Time'},{value:'part-time',label:'Part Time'},
            {value:'freelance',label:'Freelance'},{value:'contract',label:'Contract'},{value:'internship',label:'Internship'},
          ]}/>
        </div>
        <div className="grid grid-cols-2 gap-4 items-start">
          <FInput label="Start Date *" value={form.startDate} onChange={v=>set('startDate',v)} type="date" required/>
          <div className="space-y-3">
            {!form.current && <FInput label="End Date" value={form.endDate} onChange={v=>set('endDate',v)} type="date"/>}
            <FToggle label="I currently work here" value={form.current} onChange={v=>set('current',v)}/>
          </div>
        </div>
        <FTextarea label="Role Description" value={form.description} onChange={v=>set('description',v)} placeholder="Brief overview of your responsibilities and impact." rows={3}/>
        <FBullets label="Key Achievements (one per line)" values={form.achievements} onChange={v=>set('achievements',v)}/>
        <FTags label="Technologies Used" values={form.techUsed} onChange={v=>set('techUsed',v)} placeholder="React, Node.js, AWS..."/>
        <FInput label="Company Website" value={form.companyUrl} onChange={v=>set('companyUrl',v)} type="url" placeholder="https://company.com"/>
      </div>
      <SaveBar saving={saving} success={success} onSave={handleSave} onCancel={onCancel} isNew={isNew}/>
    </div>
  )
}

function ExperiencePanel({ items, onRefresh }) {
  const fy = d => d ? new Date(d).getFullYear() : 'Present'
  return (
    <ListShell items={items} api={experiencesAPI} onRefresh={onRefresh} FormComponent={ExperienceForm}
      renderRow={item=>(
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-medium text-sm">{item.position}</span>
            {item.current && <span className="badge-cyan text-[0.58rem]">current</span>}
          </div>
          <span className="text-text-muted text-xs">{item.company} · {fy(item.startDate)} – {item.current?'Present':fy(item.endDate)}</span>
        </div>
      )}
    />
  )
}

/* ── EDUCATION ────────────────────────────────────────────────────────────── */
const EMPTY_EDU = { institution:'', degree:'', field:'', grade:'', location:'', current:false, startDate:'', endDate:'', description:'', achievements:[] }

function EducationForm({ item, api, onSave, onCancel }) {
  const isNew = !item._id
  const [form, setForm] = useState({...EMPTY_EDU,...item, startDate:toD(item.startDate), endDate:toD(item.endDate)})
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const set = (f,v) => setForm(p=>({...p,[f]:v}))

  const handleSave = async () => {
    if (!form.institution.trim()||!form.degree.trim()) { setError('Institution and degree are required'); return }
    if (!form.startDate) { setError('Start date is required'); return }
    setError(''); setSaving(true)
    try {
      const payload = {...form, endDate: form.current ? null : form.endDate||null}
      isNew ? await api.create(payload) : await api.update(item._id, payload)
      setSuccess(true); setTimeout(()=>onSave(), 800)
    } catch(e) { setError(e.response?.data?.error||e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="btn-ghost !px-3 !py-2 !text-xs">← Back</button>
        <h2 className="font-display font-bold text-xl tracking-wide">{isNew ? 'Add Education' : `Edit: ${item.degree}`}</h2>
      </div>
      <ErrBox msg={error}/>
      <div className="card-base !p-6 space-y-5">
        <FInput label="Institution / University *" value={form.institution} onChange={v=>set('institution',v)} placeholder="Tribhuvan University" required/>
        <div className="grid grid-cols-2 gap-4">
          <FInput label="Degree / Certificate *" value={form.degree} onChange={v=>set('degree',v)} placeholder="Bachelor of Computer Science" required/>
          <FInput label="Field of Study" value={form.field} onChange={v=>set('field',v)} placeholder="Computer Science & IT"/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FInput label="Grade / GPA" value={form.grade} onChange={v=>set('grade',v)} placeholder="3.8 / 4.0 GPA"/>
          <FInput label="Location" value={form.location} onChange={v=>set('location',v)} placeholder="Kathmandu, Nepal"/>
        </div>
        <div className="grid grid-cols-2 gap-4 items-start">
          <FInput label="Start Date *" value={form.startDate} onChange={v=>set('startDate',v)} type="date" required/>
          <div className="space-y-3">
            {!form.current && <FInput label="End Date" value={form.endDate} onChange={v=>set('endDate',v)} type="date"/>}
            <FToggle label="Currently studying here" value={form.current} onChange={v=>set('current',v)}/>
          </div>
        </div>
        <FTextarea label="Description" value={form.description} onChange={v=>set('description',v)} placeholder="What you studied, specialisations, notable coursework." rows={3}/>
        <FBullets label="Achievements & Honours" values={form.achievements} onChange={v=>set('achievements',v)}/>
      </div>
      <SaveBar saving={saving} success={success} onSave={handleSave} onCancel={onCancel} isNew={isNew}/>
    </div>
  )
}

function EducationPanel({ items, onRefresh }) {
  const fy = d => d ? new Date(d).getFullYear() : 'Present'
  return (
    <ListShell items={items} api={educationAPI} onRefresh={onRefresh} FormComponent={EducationForm}
      renderRow={item=>(
        <div>
          <span className="font-medium text-sm block">{item.degree}</span>
          <span className="text-text-muted text-xs">{item.institution} · {fy(item.startDate)} – {item.current?'Present':fy(item.endDate)}</span>
        </div>
      )}
    />
  )
}

/* ── TESTIMONIALS ─────────────────────────────────────────────────────────── */
const EMPTY_TEST = { name:'', position:'', company:'', content:'', rating:5, featured:false, approved:true, linkedinUrl:'' }

function TestimonialForm({ item, api, onSave, onCancel }) {
  const isNew = !item._id
  const [form, setForm] = useState({...EMPTY_TEST,...item})
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const set = (f,v) => setForm(p=>({...p,[f]:v}))

  const handleSave = async () => {
    if (!form.name.trim()||!form.content.trim()) { setError('Name and testimonial text are required'); return }
    setError(''); setSaving(true)
    try {
      isNew ? await api.create(form) : await api.update(item._id, form)
      setSuccess(true); setTimeout(()=>onSave(), 800)
    } catch(e) { setError(e.response?.data?.error||e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="btn-ghost !px-3 !py-2 !text-xs">← Back</button>
        <h2 className="font-display font-bold text-xl tracking-wide">{isNew ? 'Add Testimonial' : `Edit: ${item.name}`}</h2>
      </div>
      <ErrBox msg={error}/>
      <div className="card-base !p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FInput label="Client Full Name *" value={form.name} onChange={v=>set('name',v)} placeholder="Sarah Johnson" required/>
          <FInput label="Job Title / Position" value={form.position} onChange={v=>set('position',v)} placeholder="CTO"/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FInput label="Company" value={form.company} onChange={v=>set('company',v)} placeholder="TechCorp Inc."/>
          <FInput label="LinkedIn Profile URL" value={form.linkedinUrl} onChange={v=>set('linkedinUrl',v)} type="url" placeholder="https://linkedin.com/in/..."/>
        </div>
        <FTextarea label="Testimonial Text *" value={form.content} onChange={v=>set('content',v)}
          placeholder="What did they say about working with you? Paste their feedback here." rows={5}/>
        <FL label={`Star Rating — ${form.rating} out of 5`}>
          <div className="flex gap-2 mt-1">
            {[1,2,3,4,5].map(n=>(
              <button key={n} type="button" onClick={()=>set('rating',n)}
                className="text-2xl bg-transparent border-none cursor-pointer hover:scale-110 transition-transform"
                style={{color: n<=form.rating ? '#fbbf24' : '#334155'}}>★</button>
            ))}
          </div>
        </FL>
        <div className="flex gap-10">
          <FToggle label="Approved (visible on site)" value={form.approved} onChange={v=>set('approved',v)}/>
          <FToggle label="Featured (shown first)" value={form.featured} onChange={v=>set('featured',v)}/>
        </div>
        <div className="bg-neon-purple/5 border border-neon-purple/20 rounded-lg p-4 text-xs text-text-muted">
          <p className="font-mono text-[0.65rem] text-purple-300 tracking-widest mb-1">💡 NOTE</p>
          <p>Only <strong className="text-text-secondary">Approved</strong> testimonials are visible to visitors. Toggle off to hide without deleting.</p>
        </div>
      </div>
      <SaveBar saving={saving} success={success} onSave={handleSave} onCancel={onCancel} isNew={isNew}/>
    </div>
  )
}

function TestimonialsPanel({ items, onRefresh }) {
  return (
    <ListShell items={items} api={testimonialsAPI} onRefresh={onRefresh} FormComponent={TestimonialForm}
      renderRow={item=>(
        <div>
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="font-medium text-sm">{item.name}</span>
            {!item.approved && <span className="badge-pink text-[0.58rem]">hidden</span>}
            {item.featured  && <span className="badge-cyan text-[0.58rem]">featured</span>}
          </div>
          <span className="text-text-muted text-xs">{item.position}{item.company&&` @ ${item.company}`} · {'★'.repeat(item.rating||5)}</span>
        </div>
      )}
    />
  )
}

/* ── MESSAGES ─────────────────────────────────────────────────────────────── */
function MessagesPanel({ messages, onRefresh }) {
  const [selected, setSelected] = useState(null)
  const upd = async (id,s) => { await contactAPI.updateStatus(id,s); await onRefresh() }
  const del = async id => {
    if (!window.confirm('Delete this message?')) return
    await contactAPI.delete(id); await onRefresh(); setSelected(null)
  }
  return (
    <div className={`grid gap-6 ${selected ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
      <div className="card-base !p-0 overflow-hidden">
        {messages.length===0
          ? <p className="py-12 text-center text-text-muted font-mono text-xs">No messages yet.</p>
          : messages.map(msg=>(
            <div key={msg._id} onClick={()=>{setSelected(msg);if(msg.status==='unread')upd(msg._id,'read')}}
              className={`px-5 py-4 border-b border-white/[0.08] cursor-pointer transition-colors ${selected?._id===msg._id?'bg-neon-cyan/5':'hover:bg-bg-card-hover'}`}>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-sm">{msg.name}</span>
                <div className="flex items-center gap-2">
                  {msg.status==='unread' && <span className="w-2 h-2 rounded-full bg-neon-green" style={{boxShadow:'0 0 6px #39ff14'}}/>}
                  <span className="font-mono text-[0.65rem] text-text-muted">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-text-secondary text-xs truncate">{msg.subject}</p>
            </div>
          ))}
      </div>
      {selected && (
        <div className="card-base !p-6">
          <div className="flex justify-between mb-5">
            <h3 className="font-display font-bold text-base">{selected.subject}</h3>
            <button onClick={()=>setSelected(null)} className="bg-transparent border-none cursor-pointer text-text-muted"><X size={16}/></button>
          </div>
          <div className="bg-bg-secondary rounded-lg p-3 mb-4 text-sm text-text-secondary space-y-1">
            <p><strong>From:</strong> {selected.name}</p>
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Date:</strong> {new Date(selected.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> <span className="capitalize text-neon-cyan">{selected.status}</span></p>
          </div>
          <p className="text-text-secondary leading-relaxed text-sm whitespace-pre-wrap mb-5">{selected.message}</p>
          <div className="flex flex-wrap gap-3">
            <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn-primary !px-4 !py-2 !text-xs"><Mail size={13}/> Reply</a>
            <button onClick={()=>upd(selected._id,'replied')} className="btn-outline !px-4 !py-2 !text-xs"><Check size={13}/> Mark Replied</button>
            <button onClick={()=>del(selected._id)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-display font-semibold uppercase border border-neon-pink/30 text-neon-pink cursor-pointer hover:bg-neon-pink/10 transition-colors"><Trash2 size={13}/> Delete</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── PROFILE ──────────────────────────────────────────────────────────────── */
function ProfilePanel({ profile, onRefresh }) {
  const [form, setForm] = useState(profile||{})
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  useEffect(()=>{ if(profile) setForm(profile) },[profile])
  const set = (f,v) => setForm(p=>({...p,[f]:v}))
  const setSocial = (k,v) => setForm(p=>({...p,social:{...(p.social||{}),[k]:v}}))
  const setStats  = (k,v) => setForm(p=>({...p,stats: {...(p.stats ||{}),[k]:Number(v)}}))

  const uploadAvatar = async (file) => {
    if (!file) return
    setError('')
    setUploadingAvatar(true)
    try {
      const res = await uploadAPI.single(file)
      set('avatar', res.data.file.url)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const save = async () => {
    setError(''); setSaving(true)
    try { await profileAPI.update(form); setSuccess(true); setTimeout(()=>setSuccess(false),3000); await onRefresh() }
    catch(e) { setError(e.response?.data?.error||e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <ErrBox msg={error}/>
      <div className="card-base !p-6 space-y-4">
        <p className="font-mono text-[0.68rem] text-neon-cyan tracking-widest uppercase">Personal Info</p>
        <div className="grid grid-cols-2 gap-4">
          <FInput label="Full Name"  value={form.name}      onChange={v=>set('name',v)}      placeholder="Alex Morgan"/>
          <FInput label="Job Title"  value={form.title}     onChange={v=>set('title',v)}     placeholder="Full Stack Developer"/>
          <FInput label="Email"      value={form.email}     onChange={v=>set('email',v)}     type="email" placeholder="you@example.com"/>
          <FInput label="Phone"      value={form.phone}     onChange={v=>set('phone',v)}     placeholder="+977 98..."/>
          <FInput label="Location"   value={form.location}  onChange={v=>set('location',v)}  placeholder="Kathmandu, Nepal"/>
          <FInput label="Resume URL" value={form.resumeUrl} onChange={v=>set('resumeUrl',v)} type="url" placeholder="https://drive.google.com/..."/>
          <FInput label="Avatar URL" value={form.avatar} onChange={v=>set('avatar',v)} type="url" placeholder="https://res.cloudinary.com/.../image/upload/...jpg"/>
        </div>
        <FFile
          label="Upload Avatar"
          accept="image/*"
          onChange={uploadAvatar}
          helperText={uploadingAvatar ? 'Uploading avatar...' : 'Upload profile image to Cloudinary'}
        />
        <FInput label="Tagline (shown in footer)" value={form.tagline} onChange={v=>set('tagline',v)} placeholder="Building the future, one commit at a time."/>
        <FTextarea label="Bio (About section)" value={form.bio} onChange={v=>set('bio',v)} placeholder="2–3 sentences about yourself, your expertise, and what drives you." rows={4}/>
      </div>
      <div className="card-base !p-6 space-y-4">
        <p className="font-mono text-[0.68rem] text-neon-cyan tracking-widest uppercase">Social Links</p>
        <div className="grid grid-cols-2 gap-4">
          {[['github','https://github.com/you'],['linkedin','https://linkedin.com/in/you'],['twitter','https://twitter.com/you'],['instagram','https://instagram.com/you']].map(([k,ph])=>(
            <FInput key={k} label={k.charAt(0).toUpperCase()+k.slice(1)} value={form.social?.[k]||''} onChange={v=>setSocial(k,v)} type="url" placeholder={ph}/>
          ))}
        </div>
      </div>
      <div className="card-base !p-6 space-y-4">
        <p className="font-mono text-[0.68rem] text-neon-cyan tracking-widest uppercase">Hero Stats</p>
        <div className="grid grid-cols-2 gap-4">
          <FInput label="Years of Experience" value={String(form.stats?.yearsExperience||'')} onChange={v=>setStats('yearsExperience',v)} type="number" placeholder="3"/>
          <FInput label="Projects Completed"  value={String(form.stats?.projectsCompleted||'')} onChange={v=>setStats('projectsCompleted',v)} type="number" placeholder="40"/>
          <FInput label="Clients Satisfied"   value={String(form.stats?.clientsSatisfied||'')} onChange={v=>setStats('clientsSatisfied',v)} type="number" placeholder="25"/>
          <FInput label="Coffees Consumed 😄" value={String(form.stats?.coffeeConsumed||'')} onChange={v=>setStats('coffeeConsumed',v)} type="number" placeholder="999"/>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="btn-primary" onClick={save} disabled={saving} style={{opacity:saving?0.7:1}}>
          {saving?<><span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/>&nbsp;Saving...</>:'✦ Save Profile'}
        </button>
        {success && <span className="flex items-center gap-1.5 text-neon-green text-sm"><Check size={15}/> Saved!</span>}
      </div>
    </div>
  )
}

/* ── OVERVIEW ─────────────────────────────────────────────────────────────── */
function OverviewPanel({ data, unread }) {
  const stats = [
    {label:'Projects',       value:data.projects.length,     color:'#00f5ff'},
    {label:'Skills',         value:data.skills.length,       color:'#7c3aed'},
    {label:'Experiences',    value:data.experiences.length,  color:'#f72585'},
    {label:'Testimonials',   value:data.testimonials.length, color:'#fbbf24'},
    {label:'Unread Msgs',    value:unread,                   color:'#39ff14'},
  ]
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map(s=>(
          <div key={s.label} className="card-base text-center !p-6">
            <div className="font-display font-bold text-4xl mb-1" style={{color:s.color,textShadow:`0 0 20px ${s.color}40`}}>{s.value}</div>
            <div className="font-mono text-[0.62rem] text-text-muted tracking-widest uppercase leading-tight mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-base !p-6">
          <h3 className="font-display font-bold text-sm tracking-widest text-neon-cyan mb-4">RECENT PROJECTS</h3>
          {data.projects.length===0 ? <p className="text-text-muted text-sm">No projects yet</p>
            : data.projects.slice(0,5).map(p=>(
              <div key={p._id} className="flex justify-between items-center py-2 border-b border-white/[0.08] text-sm">
                <span className="truncate mr-2">{p.title}</span>
                <span className="badge-cyan shrink-0 text-[0.6rem]">{p.category}</span>
              </div>
            ))}
        </div>
        <div className="card-base !p-6">
          <h3 className="font-display font-bold text-sm tracking-widest text-neon-pink mb-4">LATEST MESSAGES</h3>
          {data.messages.length===0 ? <p className="text-text-muted text-sm">No messages yet</p>
            : data.messages.slice(0,5).map(m=>(
              <div key={m._id} className="py-2 border-b border-white/[0.08]">
                <div className="flex justify-between mb-0.5">
                  <span className="text-sm font-medium">{m.name}</span>
                  <span className={`font-mono text-[0.62rem] ${m.status==='unread'?'text-neon-green':'text-text-muted'}`}>{m.status}</span>
                </div>
                <p className="text-text-muted text-xs truncate">{m.subject}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

/* ── SHELL ────────────────────────────────────────────────────────────────── */
const SECTIONS = [
  {key:'overview',    label:'Overview',    icon:LayoutDashboard},
  {key:'projects',    label:'Projects',    icon:FolderKanban},
  {key:'skills',      label:'Skills',      icon:Wrench},
  {key:'experience',  label:'Experience',  icon:Briefcase},
  {key:'education',   label:'Education',   icon:GraduationCap},
  {key:'testimonials',label:'Testimonials',icon:Star},
  {key:'messages',    label:'Messages',    icon:Mail},
  {key:'profile',     label:'Profile',     icon:User},
]

export default function AdminDashboard() {
  const { admin, logout, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [active, setActive]   = useState('overview')
  const [sidebar, setSidebar] = useState(true)
  const [data, setData]       = useState({projects:[],skills:[],experiences:[],education:[],testimonials:[],messages:[],profile:null})

  useEffect(()=>{ if(!loading&&!isAuthenticated) navigate('/admin') },[loading,isAuthenticated,navigate])
  useEffect(()=>{ if(isAuthenticated) fetchAll() },[isAuthenticated])

  const fetchAll = async () => {
    const [projects,skills,experiences,education,testimonials,messages,profile] = await Promise.allSettled([
      projectsAPI.getAll(),skillsAPI.getAll(),experiencesAPI.getAll(),
      educationAPI.getAll(),testimonialsAPI.getAll(),contactAPI.getAll(),profileAPI.get(),
    ])
    setData({
      projects:     projects.value?.data||[],
      skills:       skills.value?.data||[],
      experiences:  experiences.value?.data||[],
      education:    education.value?.data||[],
      testimonials: testimonials.value?.data||[],
      messages:     messages.value?.data?.messages||[],
      profile:      profile.value?.data||null,
    })
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-bg-primary"><div className="w-10 h-10 rounded-full border-2 border-transparent border-t-neon-cyan animate-spin"/></div>

  const unread = data.messages.filter(m=>m.status==='unread').length

  return (
    <div className="min-h-screen flex bg-bg-primary">
      <aside className={`${sidebar?'w-60':'w-[70px]'} shrink-0 bg-bg-secondary border-r border-white/[0.08] flex flex-col transition-all duration-300 sticky top-0 h-screen overflow-hidden`}>
        <div className="px-4 py-5 border-b border-white/[0.08] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{background:'linear-gradient(135deg,#00f5ff,#7c3aed)'}}>
            <Terminal size={17} color="#000"/>
          </div>
          {sidebar && <span className="font-display font-bold text-sm tracking-widest whitespace-nowrap">CMS PANEL</span>}
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          {SECTIONS.map(({key,label,icon:Icon})=>{
            const isAct=active===key; const badge=key==='messages'?unread:0
            return (
              <button key={key} onClick={()=>setActive(key)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg mb-1 border-none cursor-pointer transition-all
                  ${isAct?'text-neon-cyan bg-neon-cyan/10 border-l-2 border-neon-cyan':'text-text-secondary bg-transparent hover:text-text-primary border-l-2 border-transparent'}`}>
                <Icon size={17} className="shrink-0"/>
                {sidebar && <span className="font-mono text-[0.75rem] tracking-wide whitespace-nowrap">{label}</span>}
                {badge>0&&sidebar && <span className="ml-auto bg-neon-pink text-white rounded-full text-[0.62rem] font-bold px-1.5 py-0.5 min-w-[18px] text-center">{badge}</span>}
              </button>
            )
          })}
        </nav>
        <div className="p-3 border-t border-white/[0.08]">
          {sidebar && <p className="font-mono text-[0.65rem] text-text-muted px-3.5 mb-1 truncate">{admin?.email}</p>}
          <button onClick={()=>{logout();navigate('/admin')}}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-transparent border-none cursor-pointer text-neon-pink hover:bg-neon-pink/10 transition-all">
            <LogOut size={17}/>
            {sidebar && <span className="font-mono text-[0.75rem]">Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <button onClick={()=>setSidebar(!sidebar)} className="w-9 h-9 flex items-center justify-center bg-bg-card border border-white/10 rounded-lg cursor-pointer text-text-secondary">
              <ChevronRight size={17} style={{transform:sidebar?'rotate(180deg)':'none',transition:'transform 0.3s'}}/>
            </button>
            <div>
              <h1 className="font-display font-bold text-2xl tracking-wide">{SECTIONS.find(s=>s.key===active)?.label}</h1>
              <p className="font-mono text-[0.68rem] text-text-muted">Portfolio CMS</p>
            </div>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2 !text-xs"><Eye size={13}/> View Site</a>
        </div>

        {active==='overview'     && <OverviewPanel     data={data} unread={unread}/>}
        {active==='projects'     && <ProjectsPanel     items={data.projects}      onRefresh={fetchAll}/>}
        {active==='skills'       && <SkillsPanel       items={data.skills}        onRefresh={fetchAll}/>}
        {active==='experience'   && <ExperiencePanel   items={data.experiences}   onRefresh={fetchAll}/>}
        {active==='education'    && <EducationPanel    items={data.education}     onRefresh={fetchAll}/>}
        {active==='testimonials' && <TestimonialsPanel items={data.testimonials}  onRefresh={fetchAll}/>}
        {active==='messages'     && <MessagesPanel     messages={data.messages}   onRefresh={fetchAll}/>}
        {active==='profile'      && <ProfilePanel      profile={data.profile}     onRefresh={fetchAll}/>}
      </main>
    </div>
  )
}
