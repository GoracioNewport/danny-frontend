import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-purple-300">Danny: Voices in the Head</h1>
          <p className="text-xl mb-8 text-gray-300">
            An associative board game with hidden roles, where one player secretly becomes Danny while others are his
            alternate personalities.
          </p>

          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-purple-700/30">
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">Alternate Personalities</h2>
              <p className="text-gray-300">
                Use abstract memory cards to convey ideas and guess the right words together.
              </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-purple-700/30">
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">Danny</h2>
              <p className="text-gray-300">
                Discreetly sabotage the communication process without revealing your identity.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create-game">
              <Button size="lg" className="w-full sm:w-auto bg-purple-700 hover:bg-purple-600">
                Create Game
              </Button>
            </Link>
            <Link href="/join-game">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-purple-700 text-purple-300 hover:bg-purple-900/20"
              >
                Join Game
              </Button>
            </Link>
            <Link href="/rules">
              <Button size="lg" variant="ghost" className="w-full sm:w-auto text-purple-300 hover:bg-purple-900/20">
                Game Rules
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
