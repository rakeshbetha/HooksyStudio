'use client'
import { supabaseBrowser } from '@/lib/supabase-browser'
import styles from './LogoutButton.module.css'

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      const { error } = await supabaseBrowser.auth.signOut()
      if (error) {
        console.error('Error logging out:', error.message)
      } else {
        // Redirect to login page after logout
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Unexpected error during logout:', error)
    }
  }

  return (
    <button onClick={handleLogout} className={styles.logoutButton}>
      Logout
    </button>
  )
} 