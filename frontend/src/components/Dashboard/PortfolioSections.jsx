import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '/api';

export function AboutManager() {
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get(`${API}/portfolio`).then(({ data }) => setAbout(data.data?.about || ''));
  }, []);

  const handleSave = async () => {
    setLoading(true); setMsg('');
    try {
      await axios.put(`${API}/portfolio`, { about });
      setMsg('✅ About section updated.');
    } catch {
      setMsg('Failed to update.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">About Me</h2>
      {msg && <div className="text-sm font-mono text-primary mb-4">{msg}</div>}
      <textarea
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        className="w-full h-48 bg-black/80 border border-primary/30 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-primary transition-all"
        placeholder="Write your bio..."
      />
      <button onClick={handleSave} disabled={loading} className="px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-white transition-all text-sm">
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
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
  const [media, setMedia] = useState({ cvUrl: '', profilePhotoUrl: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get(`${API}/portfolio`).then(({ data }) => setMedia({ cvUrl: data.data?.cvUrl || '', profilePhotoUrl: data.data?.profilePhotoUrl || '' }));
  }, []);

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true); setMsg('Uploading...');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${API}/upload`, formData);
      const url = res.data.url;
      await axios.put(`${API}/portfolio`, { [field]: url });
      setMedia(prev => ({ ...prev, [field]: url }));
      setMsg('✅ Uploaded & saved successfully.');
    } catch {
      setMsg('Upload failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-2xl font-bold text-white">CV & Profile Photo</h2>
      {msg && <div className="text-sm font-mono text-primary">{msg}</div>}

      <div className="glass p-6 rounded-2xl border-primary/20">
        <h3 className="text-white font-bold mb-4">Profile Photo</h3>
        {media.profilePhotoUrl && <img src={media.profilePhotoUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-primary" />}
        <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'profilePhotoUrl')} disabled={loading} className="text-gray-400 font-mono text-sm" />
      </div>

      <div className="glass p-6 rounded-2xl border-primary/20">
        <h3 className="text-white font-bold mb-4">CV (PDF)</h3>
        {media.cvUrl && <a href={media.cvUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline block mb-4 font-mono text-sm">View Current CV</a>}
        <input type="file" accept=".pdf" onChange={(e) => handleUpload(e, 'cvUrl')} disabled={loading} className="text-gray-400 font-mono text-sm" />
      </div>
    </div>
  );
}
