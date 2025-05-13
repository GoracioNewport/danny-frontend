"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLobby } from "@/lib/lobby"

export default function JoinGamePage() {
  const [playerName, setPlayerName] = useState("")
  const [gameCode, setGameCode] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { joinLobby, isConnected, lobbyState, error: lobbyError } = useLobby()

  useEffect(() => {
    if (isConnected && lobbyState) {
      router.push("/lobby")
    }
  }, [isConnected, lobbyState, router])

  useEffect(() => {
    if (lobbyError) {
      setError(lobbyError)
    }
  }, [lobbyError])

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!playerName.trim()) {
      setError("Please enter your name")
      return
    }
    
    if (!gameCode.trim()) {
      setError("Please enter the game code")
      return
    }
    
    try {
      joinLobby(gameCode, playerName)
    } catch (err) {
      setError("Failed to join game. Please check the code and try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-purple-300">Join Game</h1>
          
          <form onSubmit={handleJoinGame} className="space-y-6">
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
          </div>
            
            <div>
              <label htmlFor="gameCode" className="block text-sm font-medium text-gray-300 mb-2">
              Game Code
              </label>
            <Input
                id="gameCode"
                type="text"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter game code"
            />
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
            
          <Button
              type="submit"
            className="w-full bg-purple-700 hover:bg-purple-600"
              disabled={isConnected && !lobbyState}
          >
              {isConnected && !lobbyState ? "Connecting..." : "Join Game"}
          </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
