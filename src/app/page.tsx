import LifeRemainingCalculator from '@/components/LifeRemainingCalculator'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-75">
      <LifeRemainingCalculator />
    </main>
  )
}