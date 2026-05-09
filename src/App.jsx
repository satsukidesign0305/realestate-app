import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Login from './pages/Login'
import Register from './pages/Register'
import Properties from './pages/Properties'

// 認証済みユーザーのみアクセスできるルートコンポーネント
function PrivateRoute({ session, children }) {
  if (!session) {
    // 未ログインの場合はログイン画面へリダイレクト
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  const [session, setSession] = useState(null)
  // 初回ロード時はセッション確認中のためローディング状態にする
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 現在のセッション情報を取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // 認証状態（ログイン・ログアウト）の変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // クリーンアップ時にリスナーを解除
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#718096' }}>読み込み中...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login session={session} />} />
        <Route path="/register" element={<Register session={session} />} />
        <Route
          path="/"
          element={
            <PrivateRoute session={session}>
              <Properties session={session} />
            </PrivateRoute>
          }
        />
        {/* 未定義のパスはトップへリダイレクト */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
