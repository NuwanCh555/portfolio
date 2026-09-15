import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '/api';

export function AboutManager() {
  const [data, setData] = useState({ about: '', stats: [], coreObjectives: [] });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Forms for new items
  const [newStat, setNewStat] = useState({ val: '', label: '' });
  const [editStatIndex, setEditStatIndex] = useState(null);

  const [newObj, setNewObj]   = useState({ title: '', desc: '', icon: '' });
  const [editObjIndex, setEditObjIndex] = useState(null);

  useEffect(() => {
    axios.get(`${API}/portfolio`).then(({ data: resData }) => {
      setData({
        about:          resData.data?.about          || '',
        stats:          resData.data?.stats          || [],
        coreObjectives: resData.data?.coreObjectives || [],
      });
    });
  }, []);

  const handleSave = async (updatedData = data) => {
    setLoading(true); setMsg('');
    try {
      await axios.put(`${API}/portfolio`, updatedData);
      setData(updatedData);
      setMsg('✅ About section updated.');
    } catch {
      setMsg('❌ Failed to update.');
    } finally { setLoading(false); }
  };

  // ── Stats ─────────────────────────────────────────────────────────────
  const saveStat = (e) => {
    e.preventDefault();
    if (!newStat.val.trim() || !newStat.label.trim()) return;
    
    let updatedStats = [...data.stats];
    if (editStatIndex !== null) {
      updatedStats[editStatIndex] = newStat;
    } else {
      updatedStats.push(newStat);
    }
    
    handleSave({ ...data, stats: updatedStats });
    setNewStat({ val: '', label: '' });
    setEditStatIndex(null);
  };
  const removeStat = (index) => handleSave({ ...data, stats: data.stats.filter((_, i) => i !== index) });
  const startEditStat = (index) => {
    setNewStat(data.stats[index]);
    setEditStatIndex(index);
  };
  const cancelEditStat = () => {
    setNewStat({ val: '', label: '' });
    setEditStatIndex(null);
  };

  // ── Core Objectives ────────────────────────────────────────────────────
  const saveObj = (e) => {
    e.preventDefault();
    if (!newObj.title.trim() || !newObj.desc.trim()) return;
    
    let updatedObjs = [...data.coreObjectives];
    if (editObjIndex !== null) {
      updatedObjs[editObjIndex] = newObj;
    } else {
      updatedObjs.push(newObj);
    }
    
    handleSave({ ...data, coreObjectives: updatedObjs });
    setNewObj({ title: '', desc: '', icon: '' });
    setEditObjIndex(null);
  };
  const removeObj = (index) => handleSave({ ...data, coreObjectives: data.coreObjectives.filter((_, i) => i !== index) });
  const startEditObj = (index) => {
    setNewObj(data.coreObjectives[index]);
    setEditObjIndex(index);
  };
  const cancelEditObj = () => {
    setNewObj({ title: '', desc: '', icon: '' });
    setEditObjIndex(null);
  };

  return (
    <div className="space-y-12 max-w-3xl">
      {/* ── Main Bio ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">About Me</h2>
          <button onClick={() => handleSave(data)} disabled={loading} className="px-5 py-2 bg-primary text-black font-bold rounded-xl hover:bg-white transition-all text-sm shadow-[0_0_10px_rgba(0,255,65,0.2)]">
            {loading ? 'Saving...' : 'Save Bio'}
          </button>
        </div>
        {msg && <div className={`p-3 rounded-xl text-sm font-mono border ${msg.startsWith('✅') ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-red-950/60 border-red-500/40 text-red-400'}`}>{msg}</div>}
        <textarea
          value={data.about}
          onChange={(e) => setData({ ...data, about: e.target.value })}
          className="w-full h-48 bg-black/80 border border-primary/30 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-primary transition-all"
          placeholder="Write your bio..."
        />
      </div>

      {/* ── Stats ── */}
      <div className="glass p-6 rounded-2xl border-primary/20 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><i className="ph ph-chart-bar text-primary" /> Stats</h3>
        
        <form onSubmit={saveStat} className="flex flex-wrap gap-3">
          <input type="text" placeholder="Value (e.g. 2+)" value={newStat.val} onChange={e => setNewStat({...newStat, val: e.target.value})} className="w-1/3 min-w-[100px] bg-black/80 border border-primary/30 rounded-xl px-4 py-2 text-white font-mono text-sm focus:border-primary outline-none" required />
          <input type="text" placeholder="Label (e.g. Years Coding)" value={newStat.label} onChange={e => setNewStat({...newStat, label: e.target.value})} className="flex-1 min-w-[150px] bg-black/80 border border-primary/30 rounded-xl px-4 py-2 text-white font-mono text-sm focus:border-primary outline-none" required />
          {editStatIndex !== null ? (
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-xl hover:bg-white transition-all text-sm">Update</button>
              <button type="button" onClick={cancelEditStat} className="px-4 py-2 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-all text-sm">Cancel</button>
            </div>
          ) : (
            <button type="submit" className="px-5 py-2 bg-primary text-black font-bold rounded-xl hover:bg-white transition-all text-sm">Add</button>
          )}
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.stats.map((s, i) => (
            <div key={i} className="bg-black/40 border border-primary/20 rounded-xl p-4 flex justify-between items-center group">
              <div>
                <div className="text-primary font-bold text-lg">{s.val}</div>
                <div className="text-gray-400 text-sm font-mono">{s.label}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEditStat(i)} className="text-gray-400 hover:text-yellow-400 p-2 bg-gray-900/50 rounded-lg transition-all"><i className="ph ph-pencil-simple" /></button>
                <button onClick={() => removeStat(i)} className="text-gray-400 hover:text-red-400 p-2 bg-gray-900/50 rounded-lg transition-all"><i className="ph ph-trash" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Core Objectives ── */}
      <div className="glass p-6 rounded-2xl border-primary/20 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><i className="ph ph-target text-primary" /> Core Objectives</h3>
        
        <form onSubmit={saveObj} className="space-y-4 bg-black/40 p-4 rounded-xl border border-dashed border-gray-700">
          <div className="flex gap-3">
            <input type="text" placeholder="Title" value={newObj.title} onChange={e => setNewObj({...newObj, title: e.target.value})} className="flex-1 bg-black/80 border border-primary/30 rounded-xl px-4 py-2 text-white font-mono text-sm focus:border-primary outline-none" required />
            <input type="text" placeholder="Icon (e.g. ph-code)" value={newObj.icon} onChange={e => setNewObj({...newObj, icon: e.target.value})} className="w-1/3 bg-black/80 border border-primary/30 rounded-xl px-4 py-2 text-white font-mono text-sm focus:border-primary outline-none" />
          </div>
          <div className="flex gap-3">
            <input type="text" placeholder="Description" value={newObj.desc} onChange={e => setNewObj({...newObj, desc: e.target.value})} className="flex-1 bg-black/80 border border-primary/30 rounded-xl px-4 py-2 text-white font-mono text-sm focus:border-primary outline-none" required />
            {editObjIndex !== null ? (
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-xl hover:bg-white transition-all text-sm">Update</button>
                <button type="button" onClick={cancelEditObj} className="px-4 py-2 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-all text-sm">Cancel</button>
              </div>
            ) : (
              <button type="submit" className="px-5 py-2 bg-primary text-black font-bold rounded-xl hover:bg-white transition-all text-sm">Add</button>
            )}
          </div>
        </form>

        <div className="space-y-4">
          {data.coreObjectives.map((obj, i) => (
            <div key={i} className="bg-black/40 border border-primary/20 rounded-xl p-5 flex gap-4 items-start group">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 text-primary mt-1">
                <i className={`ph ${obj.icon || 'ph-target'} text-xl`} />
              </div>
              <div className="flex-1">
                <div className="text-white font-bold">{obj.title}</div>
                <div className="text-gray-400 text-sm font-mono mt-2 leading-relaxed">{obj.desc}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => startEditObj(i)} className="text-gray-400 hover:text-yellow-400 p-2 bg-gray-900/50 rounded-lg transition-all"><i className="ph ph-pencil-simple" /></button>
                <button onClick={() => removeObj(i)} className="text-gray-400 hover:text-red-400 p-2 bg-gray-900/50 rounded-lg transition-all"><i className="ph ph-trash" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get(`${API}/portfolio`).then(({ data }) => setSkills(data.data?.skills || []));
  }, []);

  const saveSkills = async (updatedSkills) => {
    setMsg('');
    try {
      await axios.put(`${API}/portfolio`, { skills: updatedSkills });
      setSkills(updatedSkills);
      setMsg('✅ Skills updated.');
    } catch {
      setMsg('Failed to update.');
    }
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim() || skills.includes(newSkill.trim())) return;
    saveSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const removeSkill = (s) => {
    saveSkills(skills.filter(skill => skill !== s));
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-white">Skills</h2>
      {msg && <div className="text-sm font-mono text-primary">{msg}</div>}
      
      <form onSubmit={addSkill} className="flex gap-3">
        <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="E.g. React" className="flex-1 bg-black/80 border border-primary/30 rounded-xl px-4 py-2 text-white font-mono text-sm" />
        <button type="submit" className="px-6 py-2 bg-primary text-black font-bold rounded-xl">Add</button>
      </form>

      <div className="flex flex-wrap gap-3">
        {skills.map(s => (
          <div key={s} className="flex items-center gap-2 bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-lg">
            <span className="text-primary font-mono text-sm">{s}</span>
            <button onClick={() => removeSkill(s)} className="text-red-400 hover:text-red-300"><i className="ph ph-x" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExperienceManager() {
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState({ title: '', company: '', duration: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get(`${API}/portfolio`).then(({ data }) => setExperiences(data.data?.experience || []));
  }, []);

  const saveExperience = async (updatedExp) => {
    try {
      await axios.put(`${API}/portfolio`, { experience: updatedExp });
      setExperiences(updatedExp);
      setMsg('✅ Experience updated.');
      setShowForm(false);
      setForm({ title: '', company: '', duration: '', description: '' });
    } catch {
      setMsg('Failed to update.');
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    saveExperience([...experiences, form]);
  };

  const handleRemove = (index) => {
    if(!window.confirm('Delete this experience?')) return;
    saveExperience(experiences.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Experience</h2>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary text-black font-bold rounded-xl text-sm">Add New</button>
      </div>
      {msg && <div className="text-sm font-mono text-primary mb-4">{msg}</div>}

      {showForm && (
        <form onSubmit={handleAdd} className="glass p-6 rounded-2xl mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Job Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="bg-black/80 border border-primary/30 rounded-xl px-3 py-2 text-white font-mono text-sm" />
            <input type="text" placeholder="Company" required value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="bg-black/80 border border-primary/30 rounded-xl px-3 py-2 text-white font-mono text-sm" />
            <input type="text" placeholder="Duration (e.g. 2021 - Present)" required value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="bg-black/80 border border-primary/30 rounded-xl px-3 py-2 text-white font-mono text-sm" />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-black/80 border border-primary/30 rounded-xl px-3 py-2 text-white font-mono text-sm h-24" />
          <button type="submit" className="px-6 py-2 bg-primary text-black font-bold rounded-xl text-sm">Save</button>
        </form>
      )}

      <div className="space-y-4">
        {experiences.map((exp, i) => (
          <div key={i} className="glass p-4 rounded-xl flex justify-between items-start border-primary/20">
            <div>
              <h4 className="text-white font-bold">{exp.title} <span className="text-primary font-mono text-sm">@ {exp.company}</span></h4>
              <div className="text-gray-400 text-xs font-mono mb-2">{exp.duration}</div>
              <p className="text-gray-300 text-sm">{exp.description}</p>
            </div>
            <button onClick={() => handleRemove(i)} className="text-red-400 p-2"><i className="ph ph-trash" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TechManager() {
  const [tech, setTech] = useState([]);
  const [form, setForm] = useState({ name: '', icon: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get(`${API}/portfolio`).then(({ data }) => setTech(data.data?.technicalArsenal || []));
  }, []);

  const saveTech = async (updatedTech) => {
    try {
      await axios.put(`${API}/portfolio`, { technicalArsenal: updatedTech });
      setTech(updatedTech);
      setMsg('✅ Arsenal updated.');
      setForm({ name: '', icon: '' });
    } catch { setMsg('Failed to update.'); }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    saveTech([...tech, form]);
  };

  const handleRemove = (index) => {
    saveTech(tech.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold text-white">Technical Arsenal</h2>
      {msg && <div className="text-sm font-mono text-primary">{msg}</div>}

      <form onSubmit={handleAdd} className="flex gap-3">
        <input type="text" placeholder="Name (e.g. React)" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="flex-1 bg-black/80 border border-primary/30 rounded-xl px-4 py-2 text-white font-mono text-sm" />
        <input type="text" placeholder="Icon URL or class (e.g. ph-react)" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="flex-1 bg-black/80 border border-primary/30 rounded-xl px-4 py-2 text-white font-mono text-sm" />
        <button type="submit" className="px-6 py-2 bg-primary text-black font-bold rounded-xl">Add</button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {tech.map((t, i) => (
          <div key={i} className="glass p-3 rounded-xl flex items-center justify-between border-primary/20">
            <div className="flex items-center gap-2">
              {t.icon?.startsWith('http') ? <img src={t.icon} alt={t.name} className="w-6 h-6 object-contain" /> : <i className={`ph ${t.icon || 'ph-code'} text-xl text-primary`} />}
              <span className="text-white text-sm">{t.name}</span>
            </div>
            <button onClick={() => handleRemove(i)} className="text-red-400"><i className="ph ph-trash" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MediaManager() {
  const [media,   setMedia]   = useState({ cvUrl: '', profilePhotoUrl: '' });
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState('');

  useEffect(() => {
    axios.get(`${API}/portfolio`)
      .then(({ data }) => setMedia({
        cvUrl:           data.data?.cvUrl           || '',
        profilePhotoUrl: data.data?.profilePhotoUrl || '',
      }));
  }, []);

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 4000); };

  // ── Upload ────────────────────────────────────────────────────────────────
  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true); flash('⏳ Uploading…');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${API}/upload`, formData);
      const url = res.data.url;
      await axios.put(`${API}/portfolio`, { [field]: url });
      setMedia(prev => ({ ...prev, [field]: url }));
      flash('✅ Uploaded & saved successfully.');
    } catch (err) {
      // Show the EXACT error message from the server (Cloudinary / multer)
      const serverMsg = err?.response?.data?.message || err?.message || 'Unknown error';
      flash(`❌ ${serverMsg}`);
    } finally {
      setLoading(false);
      // Reset file input so same file can be re-selected
      e.target.value = '';
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (field) => {
    const endpoint = field === 'profilePhotoUrl' ? 'profile-photo' : 'cv';
    const label    = field === 'profilePhotoUrl' ? 'profile photo' : 'CV';
    if (!window.confirm(`Remove current ${label} permanently?`)) return;
    setLoading(true); flash(`⏳ Removing ${label}…`);
    try {
      await axios.delete(`${API}/upload/${endpoint}`);
      setMedia(prev => ({ ...prev, [field]: '' }));
      flash(`✅ ${label.charAt(0).toUpperCase() + label.slice(1)} removed.`);
    } catch {
      flash(`❌ Failed to remove ${label}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-2xl font-bold text-white">CV &amp; Profile Photo</h2>

      {/* Status message */}
      {msg && (
        <div className={`p-3 rounded-xl text-sm font-mono border ${
          msg.startsWith('✅') ? 'bg-primary/10 border-primary/30 text-primary'
          : msg.startsWith('❌') ? 'bg-red-950/60 border-red-500/40 text-red-400'
          : 'bg-yellow-950/40 border-yellow-600/30 text-yellow-400'
        }`}>{msg}</div>
      )}

      {/* ── Profile Photo ── */}
      <div className="glass p-6 rounded-2xl border-primary/20 space-y-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <i className="ph ph-user-circle text-primary" /> Profile Photo
        </h3>

        {media.profilePhotoUrl ? (
          <div className="flex items-center gap-4">
            <img
              src={media.profilePhotoUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-primary shadow-[0_0_12px_rgba(0,255,65,0.3)]"
            />
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-500 font-mono">Current photo on file</span>
              <button
                onClick={() => handleDelete('profilePhotoUrl')}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-red-950/60 border border-red-500/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 rounded-xl text-sm font-mono transition-all disabled:opacity-50"
              >
                <i className="ph ph-trash" /> Remove Photo
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-dashed border-gray-700">
            <i className="ph ph-image-broken text-gray-600 text-3xl" />
            <span className="text-gray-500 font-mono text-sm">No profile photo uploaded yet.</span>
          </div>
        )}

        <div>
          <label className="block text-primary font-mono text-xs mb-2">
            {media.profilePhotoUrl ? 'Replace Photo' : 'Upload Photo'} (JPG, PNG, WEBP)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleUpload(e, 'profilePhotoUrl')}
            disabled={loading}
            className="text-gray-400 font-mono text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 file:cursor-pointer file:transition-all"
          />
        </div>
      </div>

      {/* ── CV (PDF) ── */}
      <div className="glass p-6 rounded-2xl border-primary/20 space-y-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <i className="ph ph-file-pdf text-primary" /> CV / Resume
        </h3>

        {media.cvUrl ? (
          <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-primary/20">
            <div className="flex items-center gap-3">
              <i className="ph ph-file-pdf text-red-400 text-3xl" />
              <div>
                <a
                  href={media.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:text-white font-mono text-sm transition-colors flex items-center gap-1"
                >
                  View Current CV <i className="ph ph-arrow-square-out text-xs" />
                </a>
                <span className="text-xs text-gray-600 font-mono">Hosted on Cloudinary</span>
              </div>
            </div>
            <button
              onClick={() => handleDelete('cvUrl')}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-red-950/60 border border-red-500/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 rounded-xl text-sm font-mono transition-all disabled:opacity-50"
            >
              <i className="ph ph-trash" /> Remove CV
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-dashed border-gray-700">
            <i className="ph ph-file-dashed text-gray-600 text-3xl" />
            <span className="text-gray-500 font-mono text-sm">No CV uploaded yet.</span>
          </div>
        )}

        <div>
          <label className="block text-primary font-mono text-xs mb-2">
            {media.cvUrl ? 'Replace CV' : 'Upload CV'} (PDF only, max 10 MB)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleUpload(e, 'cvUrl')}
            disabled={loading}
            className="text-gray-400 font-mono text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 file:cursor-pointer file:transition-all"
          />
        </div>
      </div>
    </div>
  );
}

