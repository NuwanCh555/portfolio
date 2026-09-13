import { useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'

const STATUS_COLORS = {
  open:       'bg-red-950/60  border-red-500/40  text-red-400',
  'in-review':'bg-yellow-950/60 border-yellow-500/40 text-yellow-400',
  resolved:   'bg-primary/10 border-primary/30  text-primary',
  closed:     'bg-gray-800   border-gray-700     text-gray-400',
}
const SEV_COLORS = {
  low:      'text-green-400',
  medium:   'text-yellow-400',
  high:     'text-orange-400',
  critical: 'text-red-400',
}

export default function FeedbackInbox({ onRefresh }) {
  const [feedbacks, setFeedbacks] = useState([])
  const [selected,  setSelected]  = useState(null)
  const [notes,     setNotes]     = useState('')
  const [loading,   setLoading]   = useState(true)

  useEffect(() => { fetchFeedbacks() }, [])

  const fetchFeedbacks = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/feedbacks`)
      setFeedbacks(data.feedbacks || [])
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  const selectItem = (fb) => { setSelected(fb); setNotes(fb.adminNotes || '') }

  const updateStatus = async (id, status) => {
    await axios.patch(`${API}/admin/feedbacks/${id}/status`, { status, adminNotes: notes })
    fetchFeedbacks(); onRefresh?.()
    setSelected((prev) => prev?._id === id ? { ...prev, status, adminNotes: notes } : prev)
  }

  if (loading) return <div className="text-primary font-mono animate-pulse">&gt; Loading reports...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Feedback & Bug Reports</h2>
      <p className="text-primary font-mono text-sm mb-6">&gt; {feedbacks.filter(f => f.status === 'open').length} open reports</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-220px)]">
        {/* List */}
        <div className="lg:col-span-2 space-y-2 overflow-y-auto pr-1">
          {feedbacks.length === 0 && <div className="text-gray-500 font-mono text-sm p-4 glass rounded-2xl">No reports yet.</div>}
          {feedbacks.map((fb) => (
            <button key={fb._id} onClick={() => selectItem(fb)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${selected?._id === fb._id ? 'bg-primary/15 border-primary/40' : 'glass border-primary/10 hover:border-primary/30'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${STATUS_COLORS[fb.status]}`}>{fb.status}</span>
                <span className={`text-xs font-mono capitalize ${SEV_COLORS[fb.severity]}`}>{fb.severity}</span>
              </div>
              <div className="text-white font-medium text-sm mt-1.5 truncate">{fb.title}</div>
              <div className="text-gray-500 text-xs font-mono mt-1">
                {fb.user?.name || 'Unknown'} · {fb.type}
              </div>
              <div className="text-gray-600 text-[10px] font-mono mt-1">{new Date(fb.createdAt).toLocaleString()}</div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {!selected ? (
            <div className="glass h-full rounded-2xl border-primary/10 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <i className="ph ph-bug text-5xl mb-3 block" />
                <p className="font-mono text-sm">Select a report to review</p>
              </div>
            </div>
          ) : (
            <div className="glass h-full rounded-2xl border-primary/20 p-6 overflow-y-auto flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{selected.title}</h3>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
                    <span className={`text-xs font-mono capitalize ${SEV_COLORS[selected.severity]}`}>⚡ {selected.severity}</span>
                    <span className="text-xs font-mono text-gray-500 capitalize">{selected.type}</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 rounded-xl p-4 border border-primary/10">
                <div className="text-gray-500 text-xs font-mono mb-2">Submitted by: {selected.user?.name} ({selected.user?.email})</div>
                <p className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">{selected.description}</p>
              </div>

              {/* Admin notes */}
              <div>
                <label className="block text-primary font-mono text-xs mb-2">Admin Notes</label>
                <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  className="w-full bg-black/80 border border-primary/30 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-primary resize-none transition-all" />
              </div>

              {/* Status actions */}
              <div>
                <div className="text-primary font-mono text-xs mb-2">Update Status</div>
                <div className="flex gap-2 flex-wrap">
                  {['open','in-review','resolved','closed'].map((s) => (
                    <button key={s} onClick={() => updateStatus(selected._id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize border transition-all ${
                        selected.status === s ? STATUS_COLORS[s] : 'border-primary/20 text-gray-500 hover:border-primary/40'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
