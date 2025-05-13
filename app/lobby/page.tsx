'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useLobby, usePlayerStore } from '@/lib/lobby'

export default function LobbyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lobbyState, isConnected, error, toggleReady, startGame, rejoinLobby, leaveLobby, kickPlayer } = useLobby()
  const { name: playerName } = usePlayerStore()

  useEffect(() => {
    console.log('Lobby page state:', { isConnected, lobbyState, error })
    
    if (!isConnected && !lobbyState && !error) {
      console.log('Redirecting to home page')
      router.push('/')
      return
    }

    const code = searchParams.get('code')
    const name = searchParams.get('name')
    if (code && name && isConnected) {
      console.log('Rejoining lobby from URL params:', { code, name })
      rejoinLobby(code, name)
    }
  }, [isConnected, router, searchParams, rejoinLobby, error])

  if (!isConnected || !lobbyState) {
    console.log('Rendering loading state')
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          {error ? (
            <>
              <h2 className="text-2xl font-semibold text-red-400 mb-4">Error</h2>
              <p className="text-lg text-gray-300 mb-6">{error}</p>
              <Button
                onClick={() => router.push('/')}
                className="bg-purple-700 hover:bg-purple-600"
              >
                Return to Home
              </Button>
            </>
          ) : (
            <h2 className="text-2xl font-semibold text-purple-300 mb-4">
              {!isConnected ? 'Connecting to server...' : 'Connecting to lobby...'}
            </h2>
          )}
        </div>
      </div>
    )
  }

  console.log('Rendering lobby UI with state:', lobbyState)
  const isHost = playerName === lobbyState.host
  const allReady = lobbyState.members.every(m => m.ready)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800/50 p-6 rounded-lg border border-purple-700/30 mb-8">
            <h2 className="text-2xl font-semibold text-purple-300 mb-2">Game Code</h2>
            <p className="text-3xl font-bold tracking-wider text-center text-white">{lobbyState.code}</p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-purple-700/30 mb-8">
            <h2 className="text-2xl font-semibold text-purple-300 mb-4">Players</h2>
            <div className="space-y-4">
              {lobbyState.members.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{member.name}</span>
                    {member.name === lobbyState.host && (
                      <span className="text-sm text-purple-300">(Host)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {member.ready ? (
                      <span className="text-green-400">Ready</span>
                    ) : (
                      <span className="text-yellow-400">Not Ready</span>
                    )}
                    {isHost && member.name !== playerName && (
                      <Button
                        onClick={() => kickPlayer(member.name)}
                        className="bg-red-700 hover:bg-red-600 text-sm px-2 py-1"
                      >
                        Kick
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={toggleReady}
              className="bg-purple-700 hover:bg-purple-600"
            >
              Toggle Ready
            </Button>
            
            {isHost && (
              <Button
                onClick={startGame}
                className="bg-green-700 hover:bg-green-600"
                disabled={!allReady || lobbyState.members.length < 1}
              >
                Start Game
              </Button>
            )}

            <Button
              onClick={() => {
                leaveLobby()
                router.push('/')
              }}
              className="bg-red-700 hover:bg-red-600"
            >
              Leave Lobby
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 