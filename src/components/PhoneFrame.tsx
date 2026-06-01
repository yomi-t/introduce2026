import type { ReactNode } from 'react'
import { Wifi, Battery } from 'lucide-react'

type Props = {
  children: ReactNode
  frameImageSrc?: string
}

export default function PhoneFrame({ children, frameImageSrc }: Props) {
  return (
    // スマホ: fixed inset-0 でビューポート全体を占有しスクロール不可
    // PC (sm以上): スレート背景の中央にスマホフレームとして表示
    <div className="fixed inset-0 overflow-hidden sm:relative sm:inset-auto sm:overflow-auto sm:h-screen sm:bg-slate-300 sm:flex sm:items-center sm:justify-center sm:p-8" style={{ touchAction: 'none' }}>
      <div className="relative w-full h-full flex flex-col  sm:max-w-97.5">

        {/* スクリーン領域 */}
        <div
          className="h-full relative flex-1 flex flex-col overflow-hidden bg-gray-100 sm:flex-none sm:rounded-[3rem] sm:aspect-390/844"
          style={{
            // スマホのノッチ・ダイナミックアイランド・ホームバーを考慮
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {/* 偽ステータスバー: PCのフレーム内のみ表示 */}
          <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1 bg-gray-100 z-10 shrink-0">
            <span className="text-xs font-semibold text-gray-800">9:41</span>
            <div className="flex items-center gap-1 text-gray-800">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* アプリコンテンツ */}
          {/* スマホ: flex-1 で残り全高を占有 / PC: absolute で偽ステータスバー下に配置 */}
          <div className="flex-1 flex flex-col overflow-hidden sm:absolute sm:inset-0 sm:top-8">
            {children}
          </div>
        </div>

        {/* フレーム画像 (後で追加予定) */}
        {frameImageSrc && (
          <img
            src={frameImageSrc}
            alt="Phone frame"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />
        )}

        {/* フレーム装飾: PCのみ表示 */}
        {!frameImageSrc && (
          <div className="absolute inset-0 sm:rounded-[3rem] sm:ring-12 sm:ring-gray-900 pointer-events-none hidden sm:block" />
        )}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-800/40 rounded-full hidden sm:block" />
      </div>
    </div>
  )
}
