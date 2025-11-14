import { KarunaExpandableChat } from '../src/components/KarunaExpandableChat'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Karuna - AI Medical Assistant
        </h1>
        <KarunaExpandableChat />
      </div>
    </main>
  )
}
