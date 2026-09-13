import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export const AuthContext = createContext(null)

export const API = import.meta.env.VITE_API_URL || '/api'

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // Sync axios auth header + localStorage whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem('token', token)
    } else {
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
    }
  }, [token])

  // Define logout before the verify effect so it's available in the closure
  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  // Verify token and restore session on app start
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) { setLoading(false); return }
      try {
        const { data } = await axios.get(`${API}/auth/me`)
        if (data.success) setUser(data.user)
        else { setToken(null); setUser(null) }
      } catch {
        setToken(null); setUser(null)
      } finally {
        setLoading(false)
      }
    }
    verifyToken()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password })
    if (data.success) { setToken(data.token); setUser(data.user) }
    return data
  }, [])

  const register = useCallback(async (name, email, password) => {
    const { data } = await axios.post(`${API}/auth/register`, { name, email, password })
    if (data.success) { setToken(data.token); setUser(data.user) }
    return data
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, API }}>
      {children}
    </AuthContext.Provider>
  )
}
