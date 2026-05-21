import PhoneFrame from '@/components/PhoneFrame'
import SwipeCardStack from '@/components/SwipeCardStack'
import { INITIAL_CARDS } from '@/data/cards'

export default function Home() {
  return (
    <PhoneFrame>
      <SwipeCardStack cards={INITIAL_CARDS} />
    </PhoneFrame>
  )
}
