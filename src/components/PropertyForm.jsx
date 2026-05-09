import { useState } from 'react'
import styles from './PropertyForm.module.css'

// 間取りの選択肢
const ROOM_OPTIONS = ['Studio', '1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3LDK', '4LDK以上']

export default function PropertyForm({ initialData, onSubmit, onCancel }) {
  // initialDataがあれば編集モード、なければ新規登録モード
  const isEditing = initialData !== null

  const [formData, setFormData] = useState({
    name:  initialData?.name  ?? '',
    rent:  initialData?.rent  ?? '',
    area:  initialData?.area  ?? '',
    rooms: initialData?.rooms ?? '',
  })
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(false)

  // フォーム入力の汎用ハンドラ
  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // フォーム送信（INSERT または UPDATE）
  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // 家賃は整数に変換して送信
    const data = { ...formData, rent: Number(formData.rent) }
    const errorMsg = await onSubmit(data)

    // 失敗時はエラーを表示してフォームを維持
    if (errorMsg) {
      setError(errorMsg)
      setLoading(false)
    }
    // 成功時は親コンポーネントがフォームを閉じるためsetLoadingは不要
  }

  // オーバーレイ背景クリックでモーダルを閉じる
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onCancel()
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          {isEditing ? '物件を編集' : '物件を登録'}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* 物件名 */}
          <div className={styles.field}>
            <label>物件名</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="例: ラ・シャンブル渋谷"
              required
            />
          </div>

          {/* エリア */}
          <div className={styles.field}>
            <label>エリア</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="例: 東京都渋谷区道玄坂"
              required
            />
          </div>

          {/* 家賃・間取りを横並びに配置 */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label>家賃（円）</label>
              <input
                type="number"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
                placeholder="例: 120000"
                min={0}
                required
              />
            </div>
            <div className={styles.field}>
              <label>間取り</label>
              <select
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
                required
              >
                <option value="">選択してください</option>
                {ROOM_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* エラーメッセージ */}
          {error && <p className={styles.error}>{error}</p>}

          {/* アクションボタン */}
          <div className={styles.actions}>
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? '保存中...' : isEditing ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
