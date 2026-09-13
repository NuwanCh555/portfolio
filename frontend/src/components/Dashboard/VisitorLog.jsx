import { useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'

export default function VisitorLogPanel() {
  const [visitors, setVisitors] = useState([])
  const [page,     setPage]     = useState(1)
  const [pages,    setPages]    = useState(1)
  const [total,    setTotal]    = useState(0)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => { fetchVisitors(page) }, [page])

  const fetchVisitors = async (p = 1) => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${API}/admin/visitors?page=${p}&limit=25`)
      setVisitors(data.visitors || [])
      setPages(data.pages || 1)
      setTotal(data.total || 0)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  const UA_SHORTEN = (ua) => {
    if (!ua) return 'Unknown'
    if (ua.includes('Mobile'))  return 'Mobile'
    if (ua.includes('Chrome'))  return 'Chrome'
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('Safari'))  return 'Safari'
    if (ua.includes('curl'))    return 'curl/bot'
    return ua.slice(0, 30) + '…'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Visitor Log</h2>
          <p className="text-primary font-mono text-sm">&gt; {total} total requests tracked</p>
        </div>
        <button onClick={() => fetchVisitors(page)} className="flex items-center gap-2 px-4 py-2 border border-primary/30 text-primary rounded-xl hover:bg-primary/10 transition-all text-sm font-mono">
          <i className="ph ph-arrow-clockwise" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-primary font-mono animate-pulse">&gt; Loading visitor data...</div>
      ) : (
        <>
          <div className="glass rounded-2xl border-primary/15 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-primary/15 bg-black/40">
                    {['Time','IP','Location','Browser','Path','Unique','Alert'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((v) => (
                    <tr key={v._id} className={`border-b border-primary/5 hover:bg-primary/5 transition-colors ${v.isUnique ? 'bg-primary/3' : ''}`}>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{new Date(v.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-primary text-xs">{v.ip}</td>
                      <td className="px-4 py-3 text-gray-300 text-xs whitespace-nowrap">{v.city !== 'Unknown' ? `${v.city}, ` : ''}{v.country}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{UA_SHORTEN(v.userAgent)}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{v.path}</td>
                      <td className="px-4 py-3">
                        {v.isUnique
                          ? <span className="text-xs bg-primary/20 border border-primary/40 text-primary px-2 py-0.5 rounded-full">New</span>
                          : <span className="text-gray-700 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {v.telegramAlertSent
                          ? <i className="ph-fill ph-telegram-logo text-primary" title="Alert sent" />
                          : <span className="text-gray-700 text-xs">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-4 py-2 text-sm font-mono border border-primary/30 text-primary rounded-xl disabled:opacity-40 hover:bg-primary/10 transition-all">← Prev</button>
              <span className="text-gray-500 font-mono text-sm">Page {page} / {pages}</span>
              <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="px-4 py-2 text-sm font-mono border border-primary/30 text-primary rounded-xl disabled:opacity-40 hover:bg-primary/10 transition-all">Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
