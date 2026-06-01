import PhoneFrame from '@/components/PhoneFrame'
import AppShell from '@/components/AppShell'
import { INITIAL_CARDS } from '@/data/cards'

export default function Home() {
  return (
    <PhoneFrame>
      <AppShell cards={INITIAL_CARDS} />
    </PhoneFrame>
  )
}
