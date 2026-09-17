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
          <button onClick={() => handleSave(data)} disabled={loading} className="px-5 py-2 bg-primary text-black font-bold rounded-xl hover:bg-white transition-all text-sm shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.2)]">
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

export function SkillCategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Forms
  const [newCat, setNewCat] = useState({ title: '', icon: '', skills: [], tags: [] });
  const [editCatIndex, setEditCatIndex] = useState(null);
  
  // Local state for adding skills/tags to the category being edited/added
  const [tempSkill, setTempSkill] = useState({ name: '', percentage: '' });
  const [tempTag, setTempTag] = useState('');

  useEffect(() => {
    axios.get(`${API}/portfolio`).then(({ data }) => {
      setCategories(data.data?.skillCategories || []);
    });
  }, []);

  const handleSave = async (updatedCategories = categories) => {
    setLoading(true); setMsg('');
    try {
      await axios.put(`${API}/portfolio`, { skillCategories: updatedCategories });
      setCategories(updatedCategories);
      setMsg('✅ Skills updated.');
    } catch {
      setMsg('❌ Failed to update.');
    } finally { setLoading(false); }
  };

  const saveCategory = (e) => {
    e.preventDefault();
    if (!newCat.title.trim() || !newCat.icon.trim()) return;
    
    let updated = [...categories];
    if (editCatIndex !== null) {
      updated[editCatIndex] = newCat;
    } else {
      updated.push(newCat);
    }
    
    handleSave(updated);
    setNewCat({ title: '', icon: '', skills: [], tags: [] });
    setEditCatIndex(null);
  };

  const removeCategory = (index) => handleSave(categories.filter((_, i) => i !== index));

  const startEditCategory = (index) => {
    setNewCat(categories[index]);
    setEditCatIndex(index);
  };
  const cancelEditCategory = () => {
    setNewCat({ title: '', icon: '', skills: [], tags: [] });
    setEditCatIndex(null);
  };

  // Add/Remove Skills within the form
  const addTempSkill = (e) => {
    e.preventDefault();
    if (!tempSkill.name || !tempSkill.percentage) return;
    setNewCat({ ...newCat, skills: [...newCat.skills, tempSkill] });
    setTempSkill({ name: '', percentage: '' });
  };
  const removeTempSkill = (index) => {
    setNewCat({ ...newCat, skills: newCat.skills.filter((_, i) => i !== index) });
  };

  // Add/Remove Tags within the form
  const addTempTag = (e) => {
    e.preventDefault();
    if (!tempTag.trim() || newCat.tags.includes(tempTag.trim())) return;
    setNewCat({ ...newCat, tags: [...newCat.tags, tempTag.trim()] });
    setTempTag('');
  };
  const removeTempTag = (tag) => {
    setNewCat({ ...newCat, tags: newCat.tags.filter(t => t !== tag) });
  };

  return (
    <div className="space-y-12 max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Skills & Arsenal</h2>
      </div>
      {msg && <div className={`p-3 rounded-xl text-sm font-mono border ${msg.startsWith('✅') ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-red-950/60 border-red-500/40 text-red-400'}`}>{msg}</div>}
      
      {/* ── Category Form ── */}
      <div className="glass p-6 rounded-2xl border-primary/20 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <i className="ph ph-folder-open text-primary" /> {editCatIndex !== null ? 'Edit Category' : 'Add New Category'}
        </h3>
        
        <form onSubmit={saveCategory} className="space-y-6">
          <div className="flex gap-3">
            <input type="text" placeholder="Category Title (e.g. Frontend)" value={newCat.title} onChange={e => setNewCat({...newCat, title: e.target.value})} className="flex-1 bg-black/80 border border-primary/30 rounded-xl px-4 py-2 text-white font-mono text-sm focus:border-primary outline-none" required />
            <input type="text" placeholder="Icon (e.g. ph-terminal-window)" value={newCat.icon} onChange={e => setNewCat({...newCat, icon: e.target.value})} className="w-1/3 bg-black/80 border border-primary/30 rounded-xl px-4 py-2 text-white font-mono text-sm focus:border-primary outline-none" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl border border-dashed border-gray-700 bg-black/40">
            {/* Skills Sub-Form */}
            <div className="space-y-3">
              <label className="text-primary font-bold text-sm">Skills (Progress Bars)</label>
              <div className="flex gap-2">
                <input type="text" placeholder="Name" value={tempSkill.name} onChange={e => setTempSkill({...tempSkill, name: e.target.value})} className="flex-1 bg-black/80 border border-primary/30 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:border-primary outline-none" />
                <input type="number" placeholder="%" value={tempSkill.percentage} onChange={e => setTempSkill({...tempSkill, percentage: e.target.value})} className="w-16 bg-black/80 border border-primary/30 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:border-primary outline-none" />
                <button type="button" onClick={addTempSkill} className="px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-black font-bold text-xs transition-all">Add</button>
              </div>
              <div className="space-y-2">
                {newCat.skills.map((s, i) => (
                  <div key={i} className="flex justify-between items-center bg-black/60 px-3 py-1.5 rounded-lg border border-primary/10">
                    <span className="text-white text-xs font-mono">{s.name} <span className="text-primary ml-2">{s.percentage}%</span></span>
                    <button type="button" onClick={() => removeTempSkill(i)} className="text-red-400 hover:text-red-300"><i className="ph ph-x" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Sub-Form */}
            <div className="space-y-3">
              <label className="text-primary font-bold text-sm">Tags (Badges)</label>
              <div className="flex gap-2">
                <input type="text" placeholder="Tag Name" value={tempTag} onChange={e => setTempTag(e.target.value)} onKeyDown={e => {if(e.key==='Enter'){e.preventDefault(); addTempTag(e);}}} className="flex-1 bg-black/80 border border-primary/30 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:border-primary outline-none" />
                <button type="button" onClick={addTempTag} className="px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-black font-bold text-xs transition-all">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newCat.tags.map(t => (
                  <div key={t} className="flex items-center gap-1 bg-primary/10 border border-primary/30 px-2 py-1 rounded text-primary font-mono text-xs">
                    {t} <button type="button" onClick={() => removeTempTag(t)} className="text-red-400 hover:text-red-300 ml-1"><i className="ph ph-x" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            {editCatIndex !== null ? (
              <>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-xl hover:bg-white transition-all text-sm shadow-[0_0_10px_rgba(234,179,8,0.2)]">Update Category</button>
                <button type="button" onClick={cancelEditCategory} className="px-6 py-2 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-all text-sm">Cancel</button>
              </>
            ) : (
              <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-black font-bold rounded-xl hover:bg-white transition-all text-sm shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.2)]">Save Category</button>
            )}
          </div>
        </form>
      </div>

      {/* ── Existing Categories ── */}
      <div className="grid grid-cols-1 gap-6">
        {categories.map((cat, i) => (
          <div key={i} className="glass p-5 rounded-xl border border-primary/20 space-y-4">
            <div className="flex justify-between items-center border-b border-primary/10 pb-3">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <i className={`ph ${cat.icon || 'ph-code'} text-primary text-xl`} /> {cat.title}
              </h4>
              <div className="flex gap-2">
                <button onClick={() => startEditCategory(i)} className="text-gray-400 hover:text-yellow-400 p-2 bg-gray-900/50 rounded-lg transition-all"><i className="ph ph-pencil-simple" /></button>
                <button onClick={() => {if(window.confirm('Delete category?')) removeCategory(i);}} className="text-gray-400 hover:text-red-400 p-2 bg-gray-900/50 rounded-lg transition-all"><i className="ph ph-trash" /></button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Render Skills */}
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-mono mb-2 uppercase tracking-wider">Progress Bars</div>
                {cat.skills.map((s, idx) => (
                  <div key={idx} className="flex justify-between text-sm font-mono bg-black/40 px-3 py-1.5 rounded border border-primary/10">
                    <span className="text-gray-300">{s.name}</span>
                    <span className="text-primary font-bold">{s.percentage}%</span>
                  </div>
                ))}
                {cat.skills.length === 0 && <span className="text-gray-600 text-xs font-mono">None</span>}
              </div>
              
              {/* Render Tags */}
              <div>
                <div className="text-xs text-gray-500 font-mono mb-2 uppercase tracking-wider">Tags / Badges</div>
                <div className="flex flex-wrap gap-2">
                  {cat.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-1 bg-primary/10 border border-primary/30 text-primary rounded font-mono text-xs">
                      {t}
                    </span>
                  ))}
                  {cat.tags.length === 0 && <span className="text-gray-600 text-xs font-mono">None</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExperienceManager() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Form for new/edit item
  const [form, setForm] = useState({ duration: '', role: '', company: '', description: '', tags: [] });
  const [editIndex, setEditIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Local state for tags
  const [tempTag, setTempTag] = useState('');

  useEffect(() => {
    axios.get(`${API}/portfolio`).then(({ data }) => setExperiences(data.data?.experience || []));
  }, []);

  const handleSave = async (updatedExp = experiences) => {
    setLoading(true); setMsg('');
    try {
      await axios.put(`${API}/portfolio`, { experience: updatedExp });
      setExperiences(updatedExp);
      setMsg('✅ Experience updated.');
    } catch {
      setMsg('❌ Failed to update.');
    } finally { setLoading(false); }
  };

  const saveExperience = (e) => {
    e.preventDefault();
    if (!form.role.trim() || !form.company.trim() || !form.duration.trim()) return;

    let updated = [...experiences];
    if (editIndex !== null) {
      updated[editIndex] = form;
    } else {
      updated.push(form);
    }

    handleSave(updated);
    setForm({ duration: '', role: '', company: '', description: '', tags: [] });
    setEditIndex(null);
    setShowForm(false);
  };

  const removeExperience = (index) => {
    if(!window.confirm('Delete this experience?')) return;
    handleSave(experiences.filter((_, i) => i !== index));
  };

  const startEdit = (index) => {
    setForm(experiences[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const cancelEdit = () => {
    setForm({ duration: '', role: '', company: '', description: '', tags: [] });
    setEditIndex(null);
    setShowForm(false);
  };

  // Add/Remove Tags
  const addTempTag = (e) => {
    e.preventDefault();
    if (!tempTag.trim() || form.tags.includes(tempTag.trim())) return;
    setForm({ ...form, tags: [...form.tags, tempTag.trim()] });
    setTempTag('');
  };
  const removeTempTag = (tag) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Experience & Education</h2>
        <button onClick={() => {setShowForm(!showForm); if(showForm) cancelEdit();}} className="px-4 py-2 bg-primary text-black font-bold rounded-xl text-sm transition-all shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.2)] hover:bg-white">{showForm ? 'Close Form' : 'Add New'}</button>
      </div>
      {msg && <div className={`p-3 rounded-xl text-sm font-mono border ${msg.startsWith('✅') ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-red-950/60 border-red-500/40 text-red-400'}`}>{msg}</div>}

      {showForm && (
        <div className="glass p-6 rounded-2xl mb-6 space-y-6 border-primary/20">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="ph ph-briefcase text-primary" /> {editIndex !== null ? 'Edit Experience' : 'Add Experience'}
          </h3>
          <form onSubmit={saveExperience} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Duration (e.g. [ 2024 - 2026 Expected ])" required value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="bg-black/80 border border-primary/30 rounded-xl px-4 py-2 text-white font-mono text-sm focus:border-primary outline-none" />
              <input type="text" placeholder="Role (e.g. HNDIT Candidate)" required value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="bg-black/80 border border-primary/30 rounded-xl px-4 py-2 text-white font-mono text-sm focus:border-primary outline-none" />
              <input type="text" placeholder="Company/Org" required value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="bg-black/80 border border-primary/30 rounded-xl px-4 py-2 text-white font-mono text-sm focus:border-primary outline-none" />
            </div>
            
            <textarea placeholder="Description (Supports multi-line)" required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-black/80 border border-primary/30 rounded-xl px-4 py-3 text-white font-mono text-sm h-28 focus:border-primary outline-none" />
            
            {/* Tags Sub-Form */}
            <div className="bg-black/40 p-4 rounded-xl border border-dashed border-gray-700 space-y-3">
              <label className="text-primary font-bold text-sm">Tags (Skills/Badges used)</label>
              <div className="flex gap-2">
                <input type="text" placeholder="Tag Name (e.g. OOP, DBMS)" value={tempTag} onChange={e => setTempTag(e.target.value)} onKeyDown={e => {if(e.key==='Enter'){e.preventDefault(); addTempTag(e);}}} className="max-w-sm bg-black/80 border border-primary/30 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:border-primary outline-none" />
                <button type="button" onClick={addTempTag} className="px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-black font-bold text-xs transition-all">Add Tag</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.tags.map(t => (
                  <div key={t} className="flex items-center gap-1 bg-primary/10 border border-primary/30 px-2 py-1 rounded text-primary font-mono text-xs">
                    {t} <button type="button" onClick={() => removeTempTag(t)} className="text-red-400 hover:text-red-300 ml-1"><i className="ph ph-x" /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              {editIndex !== null ? (
                <>
                  <button type="submit" disabled={loading} className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-xl hover:bg-white transition-all text-sm shadow-[0_0_10px_rgba(234,179,8,0.2)]">Update</button>
                  <button type="button" onClick={cancelEdit} className="px-6 py-2 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-all text-sm">Cancel</button>
                </>
              ) : (
                <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-black font-bold rounded-xl hover:bg-white transition-all text-sm shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.2)]">Save Experience</button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {experiences.map((exp, i) => (
          <div key={i} className="glass p-5 rounded-xl flex justify-between items-start border-primary/20 space-x-4">
            <div className="flex-1 space-y-2">
              <div className="text-gray-400 text-xs font-mono mb-1 bg-black/40 inline-block px-2 py-1 rounded border border-gray-800">{exp.duration}</div>
              <h4 className="text-white text-lg font-bold">{exp.role} <span className="text-primary font-mono text-sm font-normal">@ {exp.company}</span></h4>
              <p className="text-gray-300 text-sm whitespace-pre-wrap">{exp.description}</p>
              
              {exp.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {exp.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-1 bg-primary/5 border border-primary/20 text-primary/80 rounded font-mono text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => startEdit(i)} className="text-gray-400 hover:text-yellow-400 p-2 bg-gray-900/50 rounded-lg transition-all"><i className="ph ph-pencil-simple" /></button>
              <button onClick={() => removeExperience(i)} className="text-gray-400 hover:text-red-400 p-2 bg-gray-900/50 rounded-lg transition-all"><i className="ph ph-trash" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MediaManager() {
  const [media,   setMedia]   = useState({ cvUrl: '', profilePhotoUrl: '', hackerProfileImage: '' });
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState('');

  useEffect(() => {
    axios.get(`${API}/portfolio`)
      .then(({ data }) => setMedia({
        cvUrl:           data.data?.cvUrl           || '',
        profilePhotoUrl: data.data?.profilePhotoUrl || '',
        hackerProfileImage: data.data?.hackerProfileImage || '',
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
    const endpoint = field === 'profilePhotoUrl' ? 'profile-photo' 
                   : field === 'hackerProfileImage' ? 'hacker-profile-photo'
                   : 'cv';
    const label    = field === 'profilePhotoUrl' ? 'profile photo'
                   : field === 'hackerProfileImage' ? 'hacker mode profile photo'
                   : 'CV';
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
          <i className="ph ph-user-circle text-primary" /> Default Profile Picture (Green Theme)
        </h3>

        {media.profilePhotoUrl ? (
          <div className="flex items-center gap-4">
            <img
              src={media.profilePhotoUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-primary shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.3)]"
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

      {/* ── Hacker Profile Photo ── */}
      <div className="glass p-6 rounded-2xl border-red-500/20 space-y-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <i className="ph ph-user-circle text-red-500" /> Hacker Mode Profile Picture (Red Theme)
        </h3>

        {media.hackerProfileImage ? (
          <div className="flex items-center gap-4">
            <img
              src={media.hackerProfileImage}
              alt="Hacker Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)] filter sepia hue-rotate-[300deg] saturate-200"
            />
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-500 font-mono">Current hacker photo on file</span>
              <button
                onClick={() => handleDelete('hackerProfileImage')}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-red-950/60 border border-red-500/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 rounded-xl text-sm font-mono transition-all disabled:opacity-50"
              >
                <i className="ph ph-trash" /> Remove Hacker Photo
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-dashed border-gray-700">
            <i className="ph ph-image-broken text-gray-600 text-3xl" />
            <span className="text-gray-500 font-mono text-sm">No hacker profile photo uploaded yet.</span>
          </div>
        )}

        <div>
          <label className="block text-red-500 font-mono text-xs mb-2">
            {media.hackerProfileImage ? 'Replace Hacker Photo' : 'Upload Hacker Photo'} (JPG, PNG, WEBP)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleUpload(e, 'hackerProfileImage')}
            disabled={loading}
            className="text-gray-400 font-mono text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-red-500/20 file:text-red-500 hover:file:bg-red-500/30 file:cursor-pointer file:transition-all"
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

