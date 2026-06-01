'use client'

import { useState } from 'react'
import { Layers, MessageCircle, Share2, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import SwipeCardStack from './SwipeCardStack'
import ChatView from './ChatView'
import { SOCIALS } from '@/data/socials'
import type { CardData } from '@/data/cards'

type TabId = 'home' | 'chat' | 'socials'

const TABS: { id: TabId; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'カード', Icon: Layers },
  { id: 'chat', label: 'チャット', Icon: MessageCircle },
  { id: 'socials', label: 'SNS', Icon: Share2 },
]

type Message = { role: 'user' | 'model'; text: string }

export default function AppShell({ cards }: { cards: CardData[] }) {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [chatMessages, setChatMessages] = useState<Message[]>([])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-hidden">
        {activeTab === 'home' && <SwipeCardStack cards={cards} />}
        {activeTab === 'chat' && <ChatView messages={chatMessages} setMessages={setChatMessages} />}
        {activeTab === 'socials' && <SocialsView />}
      </div>

      {/* ボトムタブバー */}
      <div
        className="flex items-center bg-gray-200 border-t border-gray-300 shrink-0 rounded-full mb-4 mx-4"
      >
        {TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors rounded-full ${active ? 'bg-gray-300' : ''}`}
            >
              <Icon className={`w-5 h-5 transition-colors ${active ? 'text-pink-500' : 'text-gray-400'}`} />
              <span className={`text-[10px] font-medium transition-colors ${active ? 'text-pink-500' : 'text-gray-400'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}


function SocialsView() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-5 py-3 shrink-0">
        <h1 className="text-xl font-bold text-pink-500">SNS</h1>
      </div>
      <div className="mx-4 mb-4 rounded-2xl bg-linear-to-r from-pink-50 to-rose-50 border border-pink-100 px-4 py-3 shrink-0">
        <p className="text-xs font-bold text-pink-500 mb-0.5">SNS アカウント</p>
        <p className="text-xs text-gray-600 leading-relaxed">たいがとつながるにはこちらから！</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <ul className="space-y-2">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
              >
                <Image src={s.icon} alt={`${s.label} icon`} width={20} height={20} className="w-5 h-5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{s.label}</p>
                  <p className="text-xs text-gray-400 truncate">{s.handle}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
