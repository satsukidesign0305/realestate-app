import styles from './PropertyCard.module.css'

// 家賃を日本円形式にフォーマット（例: 120000 → "120,000円"）
function formatRent(rent) {
  return rent.toLocaleString('ja-JP') + '円'
}

export default function PropertyCard({ property }) {
  const { name, rent, area, rooms, size } = property

  return (
    <div className={styles.card}>
      {/* 物件サムネイル（画像未設定時のプレースホルダー） */}
      <div className={styles.imagePlaceholder}>
        <span className={styles.icon}>🏢</span>
      </div>

      <div className={styles.body}>
        {/* 物件名 */}
        <h3 className={styles.name}>{name}</h3>

        {/* エリア */}
        <p className={styles.area}>📍 {area}</p>

        {/* 間取り・面積バッジ */}
        <div className={styles.badges}>
          <span className={styles.badge}>{rooms}</span>
          <span className={styles.badge}>{size}㎡</span>
        </div>

        {/* 家賃 */}
        <div className={styles.rent}>
          <span className={styles.rentLabel}>月額賃料</span>
          <span className={styles.rentValue}>{formatRent(rent)}</span>
        </div>
      </div>
    </div>
  )
}
