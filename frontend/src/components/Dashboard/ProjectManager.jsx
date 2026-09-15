import { useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'
const CATS = ['web', 'security', 'design']
const ICONS = ['ph-terminal-window','ph-shield-check','ph-chart-line-up','ph-lock-key','ph-bug','ph-car','ph-paint-brush','ph-shield-warning','ph-code','ph-database']
const EMPTY = { title:'', description:'', category:'web', tech:'', icon:'ph-terminal-window', order:0, liveUrl:'', repoUrl:'', isPublished:true }

export default function ProjectManager({ onRefresh }) {
  const [projects, setProjects] = useState([])
  const [form,     setForm]     = useState(EMPTY)
  const [editing,  setEditing]  = useState(null)  // project id being edited
  const [loading,  setLoading]  = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [msg,      setMsg]      = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => { fetchProjects() }, [])

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get(`${API}/projects`)
      setProjects(data.projects || [])
    } catch { setMsg('Failed to load projects.') }
  }

  const openNew  = ()        => { setForm(EMPTY); setEditing(null); setShowForm(true); setMsg('') }
  const openEdit = (project) => {
    setForm({ ...project, tech: project.tech.join(', ') })
    setEditing(project._id)
    setShowForm(true)
    setMsg('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    const payload = { ...form, tech: form.tech.split(',').map((t) => t.trim()).filter(Boolean) }
    try {
      if (editing) {
        await axios.put(`${API}/projects/${editing}`, payload)
        setMsg('✅ Project updated.')
      } else {
        await axios.post(`${API}/projects`, payload)
        setMsg('✅ Project created.')
      }
      setShowForm(false); setEditing(null); setForm(EMPTY)
      fetchProjects(); onRefresh?.()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Save failed.')
    } finally { setLoading(false) }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    try {
      await axios.delete(`${API}/projects/${id}`)
      fetchProjects(); onRefresh?.()
    } catch { setMsg('Delete failed.') }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true); setMsg('Uploading image...');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await axios.post(`${API}/upload`, formData);
      setForm({ ...form, image: data.url });
      setMsg('✅ Image uploaded.');
    } catch {
      setMsg('Image upload failed.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Project Manager</h2>
          <p className="text-primary font-mono text-sm">&gt; {projects.length} projects in database</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-bold rounded-xl hover:bg-white transition-all text-sm">
          <i className="ph ph-plus" /> New Project
        </button>
      </div>

      {msg && <div className={`mb-4 p-3 rounded-xl text-sm font-mono border ${msg.startsWith('✅') ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-red-950/60 border-red-500/40 text-red-400'}`}>{msg}</div>}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="glass w-full max-w-lg rounded-3xl p-6 border-primary/25 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">{editing ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><i className="ph ph-x text-xl" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[['title','Title','text'],['description','Description','text'],['liveUrl','Live URL (optional)','url'],['repoUrl','Repo URL (optional)','url']].map(([name,label,type]) => (
                <div key={name}>
                  <label className="block text-primary font-mono text-xs mb-1">{label}</label>
                  <input type={type} name={name} value={form[name]} onChange={(e) => setForm({...form,[e.target.name]:e.target.value})}
                    className="w-full bg-black/80 border border-primary/30 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-primary transition-all" />
                </div>
              ))}
              <div>
                <label className="block text-primary font-mono text-xs mb-1">Tech Stack (comma-separated)</label>
                <input type="text" name="tech" value={form.tech} onChange={(e) => setForm({...form, tech: e.target.value})}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full bg-black/80 border border-primary/30 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-primary transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-primary font-mono text-xs mb-1">Category</label>
                  <select name="category" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
                    className="w-full bg-black/80 border border-primary/30 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-primary transition-all">
                    {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-primary font-mono text-xs mb-1">Icon</label>
                  <select name="icon" value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})}
                    className="w-full bg-black/80 border border-primary/30 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-primary transition-all">
                    {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-primary font-mono text-xs mb-1">Project Screenshot</label>
                <div className="flex items-center gap-3">
                  {form.image && <img src={form.image} alt="Preview" className="w-12 h-12 rounded object-cover border border-primary/30" />}
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="text-gray-400 font-mono text-sm w-full" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="published" checked={form.isPublished} onChange={(e) => setForm({...form, isPublished: e.target.checked})} className="accent-primary" />
                <label htmlFor="published" className="text-gray-300 font-mono text-sm">Published (visible on portfolio)</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 border border-primary/30 text-primary rounded-xl hover:bg-primary/10 transition-all font-mono text-sm">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 bg-primary text-black font-bold rounded-xl hover:bg-white transition-all text-sm disabled:opacity-60">
                  {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects list */}
      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p._id} className="glass p-4 rounded-2xl border-primary/15 flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className={`ph ${p.icon} text-primary text-lg`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-medium">{p.title}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary capitalize">{p.category}</span>
                {!p.isPublished && <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400">Hidden</span>}
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {p.tech.slice(0,4).map((t) => <span key={t} className="text-xs font-mono text-gray-500 bg-black/40 px-2 py-0.5 rounded">{t}</span>)}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                <i className="ph ph-pencil-simple text-lg" />
              </button>
              <button onClick={() => handleDelete(p._id, p.title)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-all">
                <i className="ph ph-trash text-lg" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
