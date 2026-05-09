import { useState } from 'react'
import { supabase } from '../supabaseClient'
import PropertyCard from '../components/PropertyCard'
import styles from './Properties.module.css'

// ダミー物件データ（実際はSupabaseのDBから取得する）
const DUMMY_PROPERTIES = [
  {
    id: 1,
    name: 'ラ・シャンブル渋谷',
    rent: 120000,
    area: '東京都渋谷区道玄坂',
    rooms: '1LDK',
    size: 42.5,
  },
  {
    id: 2,
    name: 'グランドール新宿',
    rent: 98000,
    area: '東京都新宿区西新宿',
    rooms: '1K',
    size: 28.0,
  },
  {
    id: 3,
    name: 'サンライズ恵比寿',
    rent: 185000,
    area: '東京都渋谷区恵比寿',
    rooms: '2LDK',
    size: 65.0,
  },
  {
    id: 4,
    name: 'パークビュー池袋',
    rent: 75000,
    area: '東京都豊島区池袋',
    rooms: '1K',
    size: 22.3,
  },
  {
    id: 5,
    name: 'ブルーム中目黒',
    rent: 145000,
    area: '東京都目黒区中目黒',
    rooms: '2LDK',
    size: 55.8,
  },
  {
    id: 6,
    name: 'ヴィラ浅草',
    rent: 68000,
    area: '東京都台東区浅草',
    rooms: 'Studio',
    size: 19.5,
  },
]

export default function Properties({ session }) {
  const [loading, setLoading] = useState(false)

  // ログアウト処理
  async function handleLogout() {
    setLoading(true)
    await supabase.auth.signOut()
    setLoading(false)
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
              disabled={loading}
              className={styles.logoutButton}
            >
              {loading ? 'ログアウト中...' : 'ログアウト'}
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>物件一覧</h2>
          <span className={styles.count}>{DUMMY_PROPERTIES.length}件</span>
        </div>

        {/* 物件カードグリッド */}
        <div className={styles.grid}>
          {DUMMY_PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </main>
    </div>
  )
}
