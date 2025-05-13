"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLobby } from "@/lib/lobby"

export default function CreateGamePage() {
  const [playerName, setPlayerName] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const lobby = useLobby()

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!playerName.trim()) {
      setError("Please enter your name")
      return
    }
    
    try {
      lobby.createLobby(playerName)
      router.push("/lobby")
    } catch (err) {
      setError("Failed to create game. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-purple-300">Create Game</h1>
          
          <form onSubmit={handleCreateGame} className="space-y-6">
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
              </label>
            <Input
                id="playerName"
                type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter your name"
              />
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-600"
            >
              Create Game
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
