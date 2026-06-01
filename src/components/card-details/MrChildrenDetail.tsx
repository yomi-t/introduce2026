import Image from "next/image"
import Link from "next/link"

export default function MrChildrenDetail() {
  return (
    <div className="p-5 text-black">
      <h2 className="text-xl font-bold mb-2">おすすめ曲</h2>
      <div className="border border-gray-300 rounded-2xl p-2">
        <p className="font-bold">Starting Over</p>
        <p className="text-gray-500 text-xs leading-4">映画「バケモノの子」の主題歌<br />セルフプロデュースとして新たな一歩を踏み出したMr.Childrenの決意が表れている。</p>
        <Link href='https://music.apple.com/jp/album/starting-over/1680906323?i=1680906330' target="_blank" className="flex items-center">
          <Image src="/icons/apple-music.png" alt="Apple Music Logo" width={24} height={24} className="inline-block mr-1" />
          <p className="text-red-400 text-xs">Apple Musicで聴く</p>
        </Link>
      </div>
    </div>
  )
}
