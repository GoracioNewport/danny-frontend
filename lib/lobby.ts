import { useWebSocket } from './websocket'
import { create } from 'zustand'
import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from './game'

export interface LobbyMember {
  name: string
  ready: boolean
}

export interface LobbyState {
  code: string
  members: LobbyMember[]
  host: string
}

// Separate store for player data
interface PlayerStore {
  name: string
  setName: (name: string) => void
}

const usePlayerStore = create<PlayerStore>((set) => ({
  name: '',
  setName: (name) => set({ name })
}))

export { usePlayerStore }

interface LobbyStore {
  lobbyState: LobbyState | null
  isConnected: boolean
  error: string | null
  setLobbyState: (state: LobbyState | null) => void
  setIsConnected: (connected: boolean) => void
  setError: (error: string | null) => void
}

const useLobbyStore = create<LobbyStore>((set) => ({
  lobbyState: null,
  isConnected: false,
  error: null,
  setLobbyState: (state) => set({ lobbyState: state }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  setError: (error) => set({ error })
}))

export const useLobby = () => {
  const ws = useWebSocket()
  const wsRef = useRef(ws)
  const router = useRouter()
  const { 
    lobbyState, 
    isConnected,
    error,
    setLobbyState, 
    setIsConnected,
    setError
  } = useLobbyStore()
  const { name: playerName, setName: setPlayerName } = usePlayerStore()

  // Update ref when ws changes
  useEffect(() => {
    wsRef.current = ws
  }, [ws])

  // Set up message handler with useCallback to maintain reference
  const handleMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data)
    console.log('Received message:', data)
    
    if (data.type === 'lobby_created') {
      const currentPlayerName = usePlayerStore.getState().name
      if (currentPlayerName) {
        console.log('Sending lobby_join after creation with name:', currentPlayerName)
        wsRef.current.send({
          type: 'lobby_join',
          payload: {
            code: data.payload.code,
            name: currentPlayerName
          }
        })
      } else {
        console.error('No player name set when receiving lobby_created message')
      }
    } else if (data.type === 'lobby_info') {
      console.log('Setting lobby state from info:', data.payload.state)
      // Only update if we have a state and it's different
      if (data.payload.state && JSON.stringify(data.payload.state) !== JSON.stringify(lobbyState)) {
        setLobbyState(data.payload.state)
        setError(null) // Clear any previous errors
      }
    } else if (data.type === 'lobby_kicked') {
      console.log('Player was kicked from the lobby')
      setError('You have been kicked from the lobby')
      setLobbyState(null)
      wsRef.current.disconnect()
      router.push('/')
    } else if (data.type === 'lobby_game_started') {
      console.log('Game started, waiting for game info...')
    } else if (data.type === 'game_info') {
      console.log('Received game info, setting state and navigating to game screen')
      // Set the game state before navigating
      useGameStore.getState().setGameState(data.payload)
      // Now navigate to the game screen with the lobby code as search param
      router.push(`/game?code=${lobbyState?.code}`)
    } else if (data.type === 'status_code') {
      console.error('Received status code from server:', data.payload)
      setError(data.payload.message || 'An error occurred')
      // If it's a 404 status code, we should disconnect
      if (data.payload.code === 404) {
        wsRef.current.disconnect()
        setLobbyState(null)
      }
    }
  }, [lobbyState, setLobbyState, setError, router])

  const handleConnectionChange = useCallback(() => {
    const newConnected = wsRef.current.isConnected
    if (newConnected !== isConnected) {
      setIsConnected(newConnected)
      if (!newConnected) {
        // Clear error when disconnecting normally
        setError(null)
      }
    }
  }, [isConnected, setIsConnected, setError])

  // Set up WebSocket handlers
  useEffect(() => {
    wsRef.current.setOnMessage(handleMessage)
    handleConnectionChange()

    return () => {
      wsRef.current.setOnMessage(() => {})
    }
  }, [handleMessage, handleConnectionChange])
  
  const createLobby = (playerName: string) => {
    console.log('Creating lobby for player:', playerName)
    setPlayerName(playerName)
    setError(null) // Clear any previous errors
    const wsUrl = 'ws://localhost:1337/ws'
    
    wsRef.current.connect(wsUrl, () => {
      console.log('Sending lobby_create message')
      wsRef.current.send({
        type: 'lobby_create',
        payload: {
          host: playerName
        }
      })
    })
  }
  
  const joinLobby = (code: string, playerName: string) => {
    console.log('Joining lobby:', code, 'as player:', playerName)
    setPlayerName(playerName)
    setError(null) // Clear any previous errors
    const wsUrl = 'ws://localhost:1337/ws'
    
    wsRef.current.connect(wsUrl, () => {
      console.log('Sending lobby_join message')
      wsRef.current.send({
        type: 'lobby_join',
        payload: {
          code,
          name: playerName
        }
      })
    })
  }

  const rejoinLobby = (code: string, playerName: string) => {
    if (!wsRef.current.isConnected) return

    console.log('Rejoining lobby:', code, 'as player:', playerName)
    setPlayerName(playerName)
    setError(null) // Clear any previous errors
    
    console.log('Sending lobby_join message')
    wsRef.current.send({
      type: 'lobby_join',
      payload: {
        code,
        name: playerName
      }
    })
  }
  
  const leaveLobby = useCallback(() => {
    if (!wsRef.current || !lobbyState) return
    wsRef.current.send(JSON.stringify({
      type: 'lobby_leave',
      payload: {
        code: lobbyState.code
      }
    }))
    setLobbyState(null)
  }, [lobbyState])

  const kickPlayer = useCallback((playerName: string) => {
    if (!wsRef.current || !lobbyState) return
    wsRef.current.send({
      type: 'lobby_kick',
      payload: {
        code: lobbyState.code,
        name: playerName
      }
    })
  }, [lobbyState])
  
  const toggleReady = () => {
    if (lobbyState) {
      console.log('Toggling ready state for player:', playerName)
      wsRef.current.send({
        type: 'lobby_member_update',
        payload: {
          code: lobbyState.code,
          member: {
            name: playerName,
            ready: !lobbyState.members.find((m: LobbyMember) => m.name === playerName)?.ready
          }
        }
      })
    }
  }
  
  const startGame = () => {
    if (lobbyState) {
      console.log('Starting game in lobby:', lobbyState.code)
      wsRef.current.send({
        type: 'lobby_start_game',
        payload: {
          code: lobbyState.code
        }
      })
    }
  }
  
  return {
    createLobby,
    joinLobby,
    rejoinLobby,
    leaveLobby,
    kickPlayer,
    toggleReady,
    startGame,
    isConnected,
    lobbyState,
    error
  }
} 