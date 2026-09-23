import { useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'

export default function UsersTable() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/users`)
      if (data.success) setUsers(data.users)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  if (loading) return <div className="text-primary font-mono animate-pulse">&gt; Loading users...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <i className="ph ph-users" /> Registered Users
      </h2>
      <div className="glass rounded-2xl border-primary/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/60 border-b border-primary/20">
                <th className="p-4 text-xs font-mono text-gray-400 uppercase tracking-wider">Name</th>
                <th className="p-4 text-xs font-mono text-gray-400 uppercase tracking-wider">Email</th>
                <th className="p-4 text-xs font-mono text-gray-400 uppercase tracking-wider">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-primary/5 transition-colors">
                  <td className="p-4">
                    <div className="text-white font-medium text-sm">{user.name}</div>
                    <div className="text-primary text-[10px] font-mono mt-0.5 uppercase tracking-wider">{user.role}</div>
                  </td>
                  <td className="p-4 text-gray-300 text-sm font-mono">{user.email}</td>
                  <td className="p-4 text-gray-400 text-sm">{new Date(user.createdAt).toLocaleDateString()} {new Date(user.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-500 font-mono text-sm">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
