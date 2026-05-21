'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from 'motion/react'
import type { CardData } from '@/data/cards'

export type SwipeCardHandle = {
  swipe: (direction: 'left' | 'right' | 'up') => void
}

type Props = {
  card: CardData
  stackIndex: number
  isTop: boolean
  onSwipeStarted?: () => void
  onSwipedOff: () => void
}

const SWIPE_THRESHOLD = 80
const SWIPE_THRESHOLD_Y = 100
const FLY_OUT_X = 500
const FLY_OUT_Y = 800

const SwipeCard = forwardRef<SwipeCardHandle, Props>(
  ({ card, stackIndex, isTop, onSwipeStarted, onSwipedOff }, ref) => {
    const x = useMotionValue(0)
    // y は animate prop でも制御するため MotionValue として明示的に宣言し style に渡す
    const y = useMotionValue(stackIndex * 12)
    const isDragging = useRef(false)

    const rotate = useTransform(x, [-200, 0, 200], [-22, 0, 22])

    // ブラー・インジケーターの表示もすべて判定閾値(SWIPE_THRESHOLD*)から計算する
    // → 閾値に達した時点でオーバーレイが最大になり「この位置で離すとこの判定」を示す
    const half = SWIPE_THRESHOLD / 2
    const halfY = SWIPE_THRESHOLD_Y / 2

    // y < -halfY に入ったらSUPERゾーン: LIKE/NOPEの表示・判定を両方無効にする
    // テキストインジケーター: 閾値の半分から出始め、閾値で最大
    const likeOpacity = useTransform([x, y], ([cx, cy]: number[]) =>
      cy < -halfY ? 0 : Math.max(0, Math.min(1, (cx - half) / half))
    )
    const nopeOpacity = useTransform([x, y], ([cx, cy]: number[]) =>
      cy < -halfY ? 0 : Math.max(0, Math.min(1, (-cx - half) / half))
    )
    // SUPERは -halfY から出始め、-SWIPE_THRESHOLD_Y で最大
    const superLikeOpacity = useTransform(y, [-SWIPE_THRESHOLD_Y, -halfY, 0], [1, 0, 0])

    // 色ブラーオーバーレイ
    const likeOverlay = useTransform([x, y], ([cx, cy]: number[]) =>
      cy < -halfY ? 0 : Math.max(0, Math.min(0.55, cx / SWIPE_THRESHOLD * 0.55))
    )
    const nopeOverlay = useTransform([x, y], ([cx, cy]: number[]) =>
      cy < -halfY ? 0 : Math.max(0, Math.min(0.55, -cx / SWIPE_THRESHOLD * 0.55))
    )
    // SUPERオーバーレイも -halfY から出始める
    const superOverlay = useTransform(y, [-SWIPE_THRESHOLD_Y, -halfY, 0], [0.55, 0, 0])

    const baseScale = 1 - stackIndex * 0.05
    const baseY = stackIndex * 12

    const flyOff = async (direction: 'left' | 'right' | 'up') => {
      onSwipeStarted?.()
      if (direction === 'up') {
        await animate(y, -FLY_OUT_Y, { type: 'spring', stiffness: 400, damping: 35 })
      } else {
        const targetX = direction === 'right' ? FLY_OUT_X : -FLY_OUT_X
        await animate(x, targetX, { type: 'spring', stiffness: 400, damping: 35 })
      }
      onSwipedOff()
    }

    useImperativeHandle(ref, () => ({
      swipe: (direction) => flyOff(direction),
    }))

    const handleDragEnd = () => {
      isDragging.current = false
      const cx = x.get()
      const cy = y.get()

      // 上スワイプ判定を優先 (スーパーLIKE)
      if (cy < -SWIPE_THRESHOLD_Y) {
        flyOff('up')
        return
      }

      // SUPERゾーン(cy < -halfY)ではLIKE/NOPE判定を無効にする
      if (cy >= -halfY) {
        if (cx > SWIPE_THRESHOLD) { flyOff('right'); return }
        if (cx < -SWIPE_THRESHOLD) { flyOff('left'); return }
      }

      // スナップバック
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 })
      animate(y, 0, { type: 'spring', stiffness: 500, damping: 30 })
    }

    return (
      <motion.div
        className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg cursor-grab active:cursor-grabbing select-none"
        style={{ x, y, rotate, zIndex: 10 - stackIndex, originX: 0.5, originY: 0.9, touchAction: 'none' }}
        initial={{ scale: baseScale }}
        animate={{ scale: isTop ? 1 : baseScale, y: isTop ? 0 : baseY }}
        transition={{ type: 'spring', stiffness: 100, damping: 16 }}
        drag={isTop ? true : false}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={1}
        onDragStart={() => { isDragging.current = true }}
        onDragEnd={handleDragEnd}
        whileTap={isTop ? { scale: 1.02 } : undefined}
      >
        {/* カード背景画像 */}
        <img src={card.imageSrc} alt={card.name} className="w-full h-full object-cover" draggable={false} />

        {/* 色ブラーオーバーレイ: ドラッグ方向に応じて色が乗る */}
        <motion.div className="absolute inset-0 rounded-2xl bg-pink-400 backdrop-blur-sm"  style={{ opacity: likeOverlay }} />
        <motion.div className="absolute inset-0 rounded-2xl bg-purple-400 backdrop-blur-sm"    style={{ opacity: nopeOverlay }} />
        <motion.div className="absolute inset-0 rounded-2xl bg-yellow-400 backdrop-blur-sm" style={{ opacity: superOverlay }} />

        {/* カード情報オーバーレイ */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/70 to-transparent">
          <h2 className="text-white text-2xl font-bold">{card.name}</h2>
          <p className="text-white/80 text-sm mt-0.5">{card.bio}</p>
        </div>

        {isTop && (
          <>
            {/* LIKE インジケーター */}
            <motion.div
              className="absolute top-6 left-5 border-4 border-pink-400 rounded-xl px-3 py-1 -rotate-12"
              style={{ opacity: likeOpacity }}
            >
              <span className="text-pink-400 text-3xl font-black tracking-widest">LIKE</span>
            </motion.div>

            {/* NOPE インジケーター */}
            <motion.div
              className="absolute top-6 right-5 border-4 border-purple-400 rounded-xl px-3 py-1 rotate-12"
              style={{ opacity: nopeOpacity }}
            >
              <span className="text-purple-400 text-3xl font-black tracking-widest">NOPE</span>
            </motion.div>

            {/* SUPER LIKE インジケーター (上スワイプ) */}
            <motion.div
              className="absolute bottom-20 inset-x-0 flex justify-center"
              style={{ opacity: superLikeOpacity }}
            >
              <div className="border-4 border-yellow-400 rounded-xl px-4 py-1">
                <span className="text-yellow-400 text-3xl font-black tracking-widest">SUPER</span>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    )
  }
)

SwipeCard.displayName = 'SwipeCard'
export default SwipeCard
