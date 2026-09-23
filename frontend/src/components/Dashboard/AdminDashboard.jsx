import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/useAuth'
import ProjectManager from './ProjectManager'
import MessageInbox   from './MessageInbox'
import FeedbackInbox  from './FeedbackInbox'
import VisitorLogPanel from './VisitorLog'
import UsersTable from './UsersTable'
import { AboutManager, SkillCategoriesManager, ExperienceManager, MediaManager } from './PortfolioSections'

const API = import.meta.env.VITE_API_URL || '/api'

const NAV_ITEMS = [
  { key: 'overview',  label: 'Overview',       icon: 'ph-squares-four'      },
  { key: 'users',     label: 'Registered Users', icon: 'ph-users'             },
  { key: 'about',     label: 'About Me',       icon: 'ph-identification-card' },
  { key: 'skills',    label: 'Skills',         icon: 'ph-star'                },
  { key: 'experience',label: 'Experience',     icon: 'ph-briefcase'           },
  { key: 'projects',  label: 'Projects',        icon: 'ph-stack'             },
  { key: 'media',     label: 'CV & Photo',     icon: 'ph-image'               },
  { key: 'contacts',  label: 'Contact Inbox',   icon: 'ph-envelope-simple'   },
  { key: 'feedbacks', label: 'Feedback Reports',icon: 'ph-bug'               },
  { key: 'visitors',  label: 'Visitor Log',     icon: 'ph-globe'             },
]

function StatCard({ label, value, icon, sub, color = 'primary' }) {
  const colors = {
    primary:  'border-primary/30 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.08)]',
    yellow:   'border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.08)]',
    blue:     'border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.08)]',
    red:      'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.08)]',
  }
  const textColors = { primary: 'text-primary', yellow: 'text-yellow-400', blue: 'text-blue-400', red: 'text-red-400' }
  return (
    <div className={`glass p-6 rounded-2xl border ${colors[color]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-current/10 border border-current/20 ${textColors[color]}`} style={{background:'rgba(var(--color-primary-rgb),0.07)'}}>
          <i className={`ph ${icon} text-xl ${textColors[color]}`} />
        </div>
        <span className={`text-3xl font-extrabold ${textColors[color]}`}>{value}</span>
      </div>
      <div className="text-white font-medium">{label}</div>
      {sub && <div className="text-gray-500 text-xs font-mono mt-1">{sub}</div>}
    </div>
  )
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [active,  setActive]  = useState('overview')
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/auth/login'); return }
    fetchStats()
  }, [user])

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/stats`)
      if (data.success) setStats(data.stats)
    } catch { /* handle silently */ }
    finally { setLoading(false) }
  }

  const handleLogout = () => { logout(); navigate('/') }

  if (loading) return (
    <div className="min-h-screen bg-bgDark flex items-center justify-center">
      <div className="text-primary font-mono animate-pulse">&gt; Loading dashboard...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-bgDark flex">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/90 backdrop-blur-md shadow-2xl transition-transform duration-300 md:relative md:translate-x-0 glass border-r border-primary/15 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-primary/15 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-black font-bold shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.4)]">N</div>
            <div>
              <div className="text-white font-bold text-sm">Nuwan MC</div>
              <div className="text-primary text-xs font-mono">Admin Panel</div>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-primary p-2 border border-primary/30 rounded-lg hover:bg-primary/10">
            <i className="ph ph-x text-xl" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ key, label, icon }) => (
            <button key={key} onClick={() => { setActive(key); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active === key
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'text-gray-400 hover:text-primary hover:bg-primary/5'
              }`}>
              <i className={`ph ${icon} text-lg`} />
              {label}
              {key === 'contacts'  && stats?.unreadContacts > 0  && <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{stats.unreadContacts}</span>}
              {key === 'feedbacks' && stats?.openFeedbacks > 0   && <span className="ml-auto bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">{stats.openFeedbacks}</span>}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-primary/15">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <i className="ph ph-user text-primary text-sm" />
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-medium truncate">{user?.name}</div>
              <div className="text-gray-500 text-xs font-mono truncate">{user?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/40 transition-all text-sm font-mono">
            <i className="ph ph-sign-out" /> Logout
          </button>
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-primary transition-all text-sm font-mono mt-1">
            <i className="ph ph-house" /> View Portfolio
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        {/* Fixed ambient background */}
        <div className="fixed inset-0 bg-grid pointer-events-none z-0 opacity-40" />

        <div className="relative z-10">
          {/* Mobile Header Toggle */}
          <div className="md:hidden flex items-center mb-6">
            <button onClick={() => setIsSidebarOpen(true)} className="text-primary p-2 border border-primary/30 rounded-lg bg-black/40 hover:bg-primary/10">
              <i className="ph ph-list text-2xl" />
            </button>
            <span className="ml-4 font-bold text-white text-lg tracking-wider">Admin Panel</span>
          </div>

          {active === 'overview' && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h1>
              <p className="text-primary font-mono text-sm mb-8">&gt; System status nominal_</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                <StatCard label="Total Visitors"   value={stats?.totalVisitors  ?? '—'} icon="ph-globe"            sub={`${stats?.uniqueVisitors ?? 0} unique IPs`}    color="primary" />
                <StatCard label="Contact Messages" value={stats?.totalContacts  ?? '—'} icon="ph-envelope-simple" sub={`${stats?.unreadContacts ?? 0} unread`}         color="yellow"  />
                <StatCard label="Feedback Reports" value={stats?.totalFeedbacks ?? '—'} icon="ph-bug"             sub={`${stats?.openFeedbacks ?? 0} open`}            color="red"     />
                <StatCard label="Unique Visitors"  value={stats?.uniqueVisitors ?? '—'} icon="ph-users"           sub="Distinct IPs tracked"                           color="blue"    />
                <StatCard label="Registered Users" value={stats?.totalUsers     ?? '—'} icon="ph-user-circle"     sub="All roles"                                      color="primary" />
                <StatCard label="Open Issues"      value={stats?.openFeedbacks  ?? '—'} icon="ph-warning-circle"  sub="Awaiting review"                                color="red"     />
              </div>

              {/* Visitor chart (simple bar chart) */}
              {stats?.visitorsByDay?.length > 0 && (
                <div className="glass p-6 rounded-2xl border-primary/20">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2"><i className="ph ph-chart-bar text-primary" /> Unique Visitors — Last 7 Days</h3>
                  <div className="flex items-end gap-2 h-28">
                    {stats.visitorsByDay.map(({ _id, count }) => {
                      const max = Math.max(...stats.visitorsByDay.map((d) => d.count), 1)
                      const pct = Math.round((count / max) * 100)
                      return (
                        <div key={_id} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-primary text-xs font-mono">{count}</span>
                          <div className="w-full bg-primary/20 rounded-t" style={{ height: `${Math.max(pct, 4)}%` }} />
                          <span className="text-gray-600 text-[10px] font-mono">{_id.slice(5)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {active === 'users'     && <UsersTable />}
          {active === 'projects'  && <ProjectManager  onRefresh={fetchStats} />}
          {active === 'about'     && <AboutManager />}
          {active === 'skills'    && <SkillCategoriesManager />}
          {active === 'experience'&& <ExperienceManager />}
          {active === 'media'     && <MediaManager />}
          {active === 'contacts'  && <MessageInbox    onRefresh={fetchStats} />}
          {active === 'feedbacks' && <FeedbackInbox   onRefresh={fetchStats} />}
          {active === 'visitors'  && <VisitorLogPanel />}
        </div>
      </main>
    </div>
  )
}
