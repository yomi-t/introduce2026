'use client'

import { useState, useRef } from 'react'
import { Menu, Bell, X, Heart, Star } from 'lucide-react'
import SwipeCard, { type SwipeCardHandle } from './SwipeCard'
import type { CardData } from '@/data/cards'

type CardInstance = CardData & { instanceKey: number }

type Props = { cards: CardData[] }

export default function SwipeCardStack({ cards }: Props) {
  const [deck, setDeck] = useState<CardInstance[]>(() =>
    cards.map((c, i) => ({ ...c, instanceKey: i }))
  )
  const [isSwiping, setIsSwiping] = useState(false)
  const nextKey = useRef(cards.length)
  const topCardRef = useRef<SwipeCardHandle>(null)

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
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-5 py-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-pink-500">About Taiga</h1>
        <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* カードスタック */}
      <div className="flex-1 flex flex-col items-center justify-center px-6" style={{ touchAction: 'none' }}>
        <div className="relative w-full h-full my-5 aspect-3/4" style={{ touchAction: 'none' }}>
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
    <div className="flex items-center justify-center gap-8 pb-8 pt-4">
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

