'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Send } from 'lucide-react'

type Message = {
  role: 'user' | 'model'
  text: string
}

type Props = {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

export default function ChatView({ messages, setMessages }: Props) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const next: Message[] = [...messages, { role: 'user', text }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      if (data.text) {
        const chunks = (data.text as string).split(/\n\n+/).map((s: string) => s.trim()).filter(Boolean)
        setMessages((prev) => [...prev, ...chunks.map((text: string) => ({ role: 'model' as const, text }))])
      } else {
        const errText = res.status === 429
          ? 'ちょっと混んでるみたい、少し待ってからもう一回送ってみて！'
          : 'ごめん、うまく返せなかった〜'
        setMessages((prev) => [...prev, { role: 'model', text: errText }])
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'model', text: 'ごめん、うまく返せなかった〜' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 shrink-0 bg-white">
        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
          <Image src="/cards/self.jpg" alt="汰海" fill className="object-cover" />
        </div>
        <p className="text-sm font-bold text-gray-800 leading-none">たいが</p>
      </div>

      {/* メッセージリスト */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
            <div className="relative w-16 h-16 rounded-full overflow-hidden opacity-60">
              <Image src="/cards/self.jpg" alt="汰海" fill className="object-cover" />
            </div>
            <p className="text-xs text-center leading-relaxed">
              たいがさんとマッチしました！<br />
              相手にメッセージを送りましょう！
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {msg.role === 'model' && (
              <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 mb-0.5">
                <Image src="/cards/self.jpg" alt="汰海" fill className="object-cover" />
              </div>
            )}
            <div
              className={`max-w-[72%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                msg.role === 'user'
                  ? 'bg-gray-200 text-gray-800 rounded-br-sm'
                  : 'bg-pink-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-end gap-2">
            <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 mb-0.5">
              <Image src="/cards/self.jpg" alt="汰海" fill className="object-cover" />
            </div>
            <div className="bg-pink-100 px-4 py-3 rounded-2xl rounded-bl-sm">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 入力エリア */}
      <div className="flex items-center gap-2 px-3 pb-4 pt-2 shrink-0 border-t border-gray-100 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && e.metaKey && send()}
          placeholder="メッセージを送る..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-base outline-none placeholder:text-gray-400 text-black"
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity active:scale-95"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}
