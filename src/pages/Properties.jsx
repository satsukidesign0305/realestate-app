import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import PropertyCard from '../components/PropertyCard'
import PropertyForm from '../components/PropertyForm'
import styles from './Properties.module.css'

export default function Properties({ session }) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [showForm, setShowForm]     = useState(false)
  // null: 新規登録モード / object: 編集対象の物件
  const [editingProperty, setEditingProperty] = useState(null)
  const [logoutLoading, setLogoutLoading]     = useState(false)

  // 初回マウント時に物件一覧を取得
  useEffect(() => {
    fetchProperties()
  }, [])

  // Supabaseから自分の物件一覧を取得（SELECT）
  async function fetchProperties() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false }) // 新しい順に表示
    if (error) {
      setError('物件の取得に失敗しました: ' + error.message)
    } else {
      setProperties(data)
    }
    setLoading(false)
  }

  // 物件の登録（INSERT）または更新（UPDATE）
  // 成功時は null、失敗時はエラーメッセージ文字列を返す
  async function handleSubmit(formData) {
    if (editingProperty) {
      // 既存物件の更新（user_idと作成日時は変更しない）
      const { error } = await supabase
        .from('properties')
        .update({
          name:  formData.name,
          rent:  formData.rent,
          area:  formData.area,
          rooms: formData.rooms,
        })
        .eq('id', editingProperty.id)
      if (error) return error.message
    } else {
      // 新規物件の登録（user_idをセットすることでRLSポリシーが適用される）
      const { error } = await supabase
        .from('properties')
        .insert({
          name:    formData.name,
          rent:    formData.rent,
          area:    formData.area,
          rooms:   formData.rooms,
          user_id: session.user.id,
        })
      if (error) return error.message
    }
    // 成功したらフォームを閉じて一覧を再取得
    setShowForm(false)
    setEditingProperty(null)
    fetchProperties()
    return null
  }

  // 物件の削除（DELETE）
  async function handleDelete(id) {
    if (!window.confirm('この物件を削除しますか？')) return
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
    if (error) {
      setError('削除に失敗しました: ' + error.message)
    } else {
      // 再取得せず、ローカルのstateから即時削除して表示を更新
      setProperties(prev => prev.filter(p => p.id !== id))
    }
  }

  // 編集ボタン押下: 対象物件をセットしてフォームを開く
  function handleEdit(property) {
    setEditingProperty(property)
    setShowForm(true)
  }

  // フォームを閉じる（新規・編集の両方で使用）
  function handleCloseForm() {
    setShowForm(false)
    setEditingProperty(null)
  }

  // ログアウト処理
  async function handleLogout() {
    setLogoutLoading(true)
    await supabase.auth.signOut()
    setLogoutLoading(false)
  }

  return (
    <div className={styles.wrapper}>
      {/* ヘッダー */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.logo}>不動産管理システム</h1>
          <div className={styles.userInfo}>
            <span className={styles.email}>{session.user.email}</span>
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className={styles.logoutButton}
            >
              {logoutLoading ? 'ログアウト中...' : 'ログアウト'}
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.pageTitleGroup}>
            <h2 className={styles.pageTitle}>物件一覧</h2>
            {!loading && (
              <span className={styles.count}>{properties.length}件</span>
            )}
          </div>
          <button onClick={() => setShowForm(true)} className={styles.addButton}>
            ＋ 物件を登録
          </button>
        </div>

        {/* エラーメッセージ */}
        {error && <p className={styles.error}>{error}</p>}

        {/* ローディング / 空状態 / 物件グリッド */}
        {loading ? (
          <p className={styles.empty}>読み込み中...</p>
        ) : properties.length === 0 ? (
          <p className={styles.empty}>
            物件が登録されていません。「物件を登録」ボタンから追加してください。
          </p>
        ) : (
          <div className={styles.grid}>
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* 登録・編集モーダル（showFormがtrueのときのみ表示） */}
      {showForm && (
        <PropertyForm
          initialData={editingProperty}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  )
}
