import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import styles from './Auth.module.css'

export default function Login({ session }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // 既にログイン済みの場合は物件一覧へリダイレクト
  if (session) {
    return <Navigate to="/" replace />
  }

  // ログイン処理
  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>ログイン</h1>
        <p className={styles.subtitle}>不動産管理システム</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label>メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>
          <div className={styles.field}>
            <label>パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              required
            />
          </div>

          {/* エラー表示 */}
          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <p className={styles.link}>
          アカウントをお持ちでない方は <Link to="/register">会員登録</Link>
        </p>
      </div>
    </div>
  )
}
