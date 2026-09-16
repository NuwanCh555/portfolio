import { useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'

export default function MessageInbox({ onRefresh }) {
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => { fetchMessages() }, [])

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/contacts`)
      setMessages(data.messages || [])
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  const markRead = async (id) => {
    await axios.patch(`${API}/admin/contacts/${id}/read`)
    fetchMessages(); onRefresh?.()
  }

  const deleteMsg = async (id) => {
    if (!window.confirm('Delete this message?')) return
    await axios.delete(`${API}/admin/contacts/${id}`)
    setSelected(null); fetchMessages(); onRefresh?.()
  }

  if (loading) return <div className="text-primary font-mono animate-pulse">&gt; Loading messages...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Contact Inbox</h2>
      <p className="text-primary font-mono text-sm mb-6">&gt; {messages.filter(m => !m.isRead).length} unread of {messages.length} messages</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-220px)]">
        {/* Message list */}
        <div className="lg:col-span-1 space-y-2 overflow-y-auto pr-1">
          {messages.length === 0 && <div className="text-gray-500 font-mono text-sm p-4 glass rounded-2xl">No messages yet.</div>}
          {messages.map((m) => (
            <button key={m._id} onClick={() => { setSelected(m); if (!m.isRead) markRead(m._id) }}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                selected?._id === m._id
                  ? 'bg-primary/15 border-primary/40'
                  : m.isRead
                    ? 'glass border-primary/10 hover:border-primary/30'
                    : 'glass border-primary/30 shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.1)]'
              }`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`font-medium text-sm ${m.isRead ? 'text-gray-300' : 'text-white'}`}>{m.name}</span>
                {!m.isRead && <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />}
              </div>
              <div className="text-gray-500 text-xs font-mono truncate">{m.email}</div>
              <div className="text-gray-400 text-xs mt-1 truncate">{m.message}</div>
              <div className="text-gray-600 text-[10px] font-mono mt-2">{new Date(m.createdAt).toLocaleString()}</div>
            </button>
          ))}
        </div>

        {/* Message detail */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="glass h-full rounded-2xl border-primary/10 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <i className="ph ph-envelope-open text-5xl mb-3 block" />
                <p className="font-mono text-sm">Select a message to read</p>
              </div>
            </div>
          ) : (
            <div className="glass h-full rounded-2xl border-primary/20 p-6 flex flex-col overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                  <a href={`mailto:${selected.email}`} className="text-primary font-mono text-sm hover:underline">{selected.email}</a>
                  <div className="text-gray-500 text-xs font-mono mt-1">{new Date(selected.createdAt).toLocaleString()}</div>
                </div>
                <button onClick={() => deleteMsg(selected._id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-all">
                  <i className="ph ph-trash text-lg" />
                </button>
              </div>
              <div className="bg-black/40 rounded-xl p-5 border border-primary/10 flex-1">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-mono text-sm">{selected.message}</p>
              </div>
              <div className="mt-4 flex gap-2 text-xs font-mono text-gray-600">
                <span>IP: {selected.ip || 'N/A'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
