'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, X, Heart, Star } from 'lucide-react'
import SwipeCard, { type SwipeCardHandle } from './SwipeCard'
import NotificationPanel from './NotificationPanel'
import type { CardData } from '@/data/cards'
import Image from 'next/image'

type CardInstance = CardData & { instanceKey: number }

type Props = { cards: CardData[] }

const CARD_ASPECT_RATIO = 3 / 4
const STACK_VERTICAL_OVERHANG = 24

export default function SwipeCardStack({ cards }: Props) {
  const [deck, setDeck] = useState<CardInstance[]>(() =>
    cards.map((c, i) => ({ ...c, instanceKey: i }))
  )
  const [isSwiping, setIsSwiping] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const nextKey = useRef(cards.length)
  const topCardRef = useRef<SwipeCardHandle>(null)
  const cardAreaRef = useRef<HTMLDivElement>(null)
  const [cardWidth, setCardWidth] = useState<number | null>(null)

  useEffect(() => {
    const el = cardAreaRef.current
    if (!el) return

    let frameId: number | null = null

    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width <= 0 || height <= 0) return

      const styles = getComputedStyle(el)
      const horizontalPadding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight)
      const verticalPadding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom)
      const availableWidth = Math.max(0, width - horizontalPadding)
      const availableHeight = Math.max(0, height - verticalPadding - STACK_VERTICAL_OVERHANG)

      const nextWidth = Math.min(availableWidth, availableHeight * CARD_ASPECT_RATIO)
      setCardWidth(prev => prev === nextWidth ? prev : nextWidth)
    }

    const scheduleMeasure = () => {
      if (frameId != null) cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(measure)
    }

    const observer = new ResizeObserver(scheduleMeasure)

    observer.observe(el)
    window.addEventListener('resize', scheduleMeasure)
    window.visualViewport?.addEventListener('resize', scheduleMeasure)
    scheduleMeasure()

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', scheduleMeasure)
      window.visualViewport?.removeEventListener('resize', scheduleMeasure)
      if (frameId != null) cancelAnimationFrame(frameId)
    }
  }, [])

  // フリック開始時: 後続カードをすぐに前進アニメーション開始させる
  const handleSwipeStarted = () => setIsSwiping(true)

  // フライアウト完了後: デッキを整理してループ
  const handleSwipedOff = () => {
    setIsSwiping(false)
    setDeck(prev => {
      const [top, ...rest] = prev
      return [...rest, { ...top, instanceKey: nextKey.current++ }]
    })
  }

  const triggerSwipe = (direction: 'left' | 'right' | 'up') => {
    topCardRef.current?.swipe(direction)
  }

  return (
    <div className="flex h-full flex-col flex-1 overflow-hidden relative">
      <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

      {/* ヘッダー */}
      <div className="flex shrink-0 items-center justify-between px-5 py-3">
        <div className='flex'>
          <Image src='/logo.png' alt='Tinger logo' width={24} height={24} className='w-6 h-6 mr-2' />
          <h1 className="text-xl font-bold text-pink-500">Tinger</h1>
        </div>
        <button
          onClick={() => setIsNotifOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* カードスタック */}
      <div ref={cardAreaRef} className="flex-1 min-h-0 w-full flex flex-col items-center justify-center px-6 py-5" style={{ touchAction: 'none' }}>
        <div className="relative aspect-3/4" style={{ touchAction: 'none', width: cardWidth != null ? `${cardWidth}px` : '0px' }}>
          {deck.slice(0, 3).map((card, index) => {
            // isSwiping中は後続カードを1段前に進める（トップカードは飛んでいる最中）
            const adjustedIndex = isSwiping && index > 0 ? index - 1 : index
            return (
              <SwipeCard
                key={card.instanceKey}
                card={card}
                stackIndex={adjustedIndex}
                isTop={index === 0}
                ref={index === 0 ? topCardRef : null}
                onSwipeStarted={index === 0 ? handleSwipeStarted : undefined}
                onSwipedOff={handleSwipedOff}
              />
            )
          })}
        </div>
      </div>

      {/* アクションボタン */}
      <ActionButtons
        onDislike={() => triggerSwipe('left')}
        onSuperLike={() => triggerSwipe('up')}
        onLike={() => triggerSwipe('right')}
      />
    </div>
  )
}

function ActionButtons({
  onDislike,
  onSuperLike,
  onLike,
}: {
  onDislike: () => void
  onSuperLike: () => void
  onLike: () => void
}) {
  return (
    <div className="flex shrink-0 items-center justify-center gap-8 pb-3 pt-4">
      <button
        onClick={onDislike}
        className="w-16 h-16 rounded-full bg-white shadow-lg shadow-red-100 flex items-center justify-center text-red-400 hover:scale-110 hover:shadow-red-200 active:scale-95 transition-all"
        aria-label="Nope"
      >
        <X className="w-7 h-7" strokeWidth={2.5} />
      </button>
      <button
        onClick={onLike}
        className="w-20 h-20 rounded-full bg-linear-to-br from-pink-400 to-rose-500 shadow-lg shadow-pink-200 flex items-center justify-center text-white hover:scale-110 hover:shadow-pink-300 active:scale-95 transition-all"
        aria-label="Like"
      >
        <Heart className="w-8 h-8" fill="currentColor" />
      </button>
      <button
        onClick={onSuperLike}
        className="w-16 h-16 rounded-full bg-white shadow-lg shadow-yellow-100 flex items-center justify-center text-yellow-400 hover:scale-110 hover:shadow-yellow-200 active:scale-95 transition-all"
        aria-label="Super Like"
      >
        <Star className="w-7 h-7" fill="currentColor" />
      </button>
    </div>
  )
}
