import { create } from 'zustand'
import { useWebSocket } from './websocket'
import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface PlayerCommonInfo {
  name: string
  isActive: boolean
  isDecisive: boolean
}

interface PlayerInfo extends PlayerCommonInfo {
  role: string
  hand: string[]
}

interface CardPlacement {
  selectedCards: string[]
  arrangedCards: {
    id: string
    position_x: number
    position_y: number
    rotation: number
    flipped: boolean
    image: string
  }[]
}

interface GameState {
  players: PlayerCommonInfo[]
  player: PlayerInfo
  stage: string
  cardPlacement: CardPlacement
  wordOptions: string[]
  word: string
  scoreA: number
  scoreD: number
}

interface ScoreboardEntry {
  name: string
  won: boolean
}

interface GameStore {
  gameState: GameState | null
  finalScores: ScoreboardEntry[] | null
  setGameState: (state: GameState | null) => void
  setFinalScores: (scores: ScoreboardEntry[] | null) => void
}

const useGameStore = create<GameStore>((set) => ({
  gameState: null,
  finalScores: null,
  setGameState: (serverState) => {
    console.log('Setting game state from server:', serverState)
    const state = serverState.state || serverState
    const transformedState = {
      players: state.players?.map((p: any) => ({
        name: p.name,
        isActive: p.is_active,
        isDecisive: p.is_deciding
      })) || [],
      player: {
        name: state.player?.name || "",
        isActive: state.player?.is_active || false,
        isDecisive: state.player?.is_deciding || false,
        role: state.player?.is_danny ? "danny" : "personality",
        hand: state.player?.hand || []
      },
      stage: state.stage || "selection",
      cardPlacement: {
        selectedCards: state.card_placement?.cards || [],
        arrangedCards: state.card_placement?.cards?.map((card: any) => ({
          id: card.id?.toString() || "",
          position_x: card.position_x || 0,
          position_y: card.position_y || 0,
          rotation: card.rotation || 0,
          flipped: card.flipped || false,
          image: `/cards/${card.id}.png`
        })) || []
      },
      wordOptions: state.word_options || [],
      word: state.word || "",
      scoreA: state.score_a || 0,
      scoreD: state.score_d || 0
    }
    console.log('Transformed state:', transformedState)
    set({ gameState: transformedState })
  },
  setFinalScores: (scores) => set({ finalScores: scores })
}))

export const useGame = () => {
  const ws = useWebSocket()
  const wsRef = useRef(ws)
  const router = useRouter()
  const { gameState, finalScores, setGameState, setFinalScores } = useGameStore()

  useEffect(() => {
    wsRef.current = ws
  }, [ws])

  const handleMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data)
    console.log('Received message:', data)
    
    if (data.type === 'game_info') {
      console.log('Setting game state from info:', data.payload.state)
      setGameState(data.payload.state)
    } else if (data.type === 'game_final_scores') {
      console.log('Received final scores:', data.payload.scores)
      setFinalScores(data.payload.scores)
    }
  }, [setGameState, setFinalScores])

  useEffect(() => {
    wsRef.current.setOnMessage(handleMessage)

    return () => {
      wsRef.current.setOnMessage(() => {})
    }
  }, [handleMessage])

  const endTurn = (code: string) => {
    if (!wsRef.current) return
    wsRef.current.send({
      type: 'game_end_turn',
      payload: { code }
    })
  }

  const makeDecision = (code: string, correct: boolean) => {
    if (!wsRef.current) return
    wsRef.current.send({
      type: 'game_make_decision',
      payload: { code, correct }
    })
  }

  const nextRound = (code: string) => {
    if (!wsRef.current) return
    wsRef.current.send({
      type: 'game_next_round',
      payload: { code }
    })
  }

  const sendMessage = (message: any) => {
    if (!wsRef.current) return
    const messageObj = typeof message === 'string' ? JSON.parse(message) : message
    wsRef.current.send(messageObj)
  }

  return {
    gameState,
    finalScores,
    endTurn,
    makeDecision,
    nextRound,
    sendMessage
  }
}

export { useGameStore }
export type { GameState, PlayerCommonInfo, PlayerInfo, CardPlacement } 