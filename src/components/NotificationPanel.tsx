'use client'

import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { TIMELINE } from '@/data/timeline'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationPanel({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景オーバーレイ */}
          <motion.div
            className="absolute inset-0 bg-black/40 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* パネル本体 */}
          <motion.div
            className="absolute top-0 right-0 left-0 bg-white z-30 rounded-b-3xl shadow-2xl overflow-hidden flex flex-col max-h-[75%]"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
              <h2 className="text-sm font-bold text-gray-800">年表</h2>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* タイムライン */}
            <div className="flex-1 overflow-y-auto px-5 pb-6">
              <div className="relative">
                {/* 縦線 */}
                <div className="absolute left-3 top-2 bottom-2 w-px bg-pink-200" />
                <ul className="space-y-5">
                  {TIMELINE.map((item, i) => (
                    <li key={i} className="flex gap-3 relative">
                      {/* ドット */}
                      <div className="w-7 h-7 shrink-0 flex items-center justify-center z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-pink-400 ring-2 ring-white" />
                      </div>
                      {/* 内容 */}
                      <div className="pt-0.5 min-w-0">
                        <span className="block text-xs font-bold text-pink-500 leading-none mb-0.5">
                          {item.year}
                        </span>
                        <span className="block text-xs font-semibold text-gray-800 leading-snug">
                          {item.label}
                        </span>
                        <span className="block text-[10px] text-gray-500 leading-snug mt-0.5 break-words">
                          {item.description}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
