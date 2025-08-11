'use client'
import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import styles from './Login.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login'|'signup'>('login')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    
    try {
      if (mode === 'signup') {
        const { error } = await supabaseBrowser.auth.signUp({ email, password })
        if (error) {
          setMsg(error.message)
        } else {
          setMsg('Check your email to verify your account.')
        }
      } else {
        const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password })
        if (error) {
          setMsg(error.message)
        } else {
          setMsg('Logged in successfully!')
          // Redirect to home page after successful login
          setTimeout(() => {
            window.location.href = '/'
          }, 1000)
        }
      }
    } catch (error) {
      setMsg('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
        <p className={styles.subtitle}>
          {mode === 'login' ? 'Sign in to your Hooksy account' : 'Join Hooksy to start generating viral hooks'}
        </p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input 
              className={styles.input}
              placeholder="Email" 
              type="email"
              value={email} 
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <input 
              className={styles.input}
              placeholder="Password" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Loading...' : (mode === 'login' ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
        
        <button 
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className={styles.toggleButton}
        >
          {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
        </button>
        
        {msg && (
          <div className={`${styles.message} ${msg.includes('successfully') ? styles.success : styles.error}`}>
            {msg}
          </div>
        )}
      </div>
    </div>
  )
} 