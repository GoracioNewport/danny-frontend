import { create } from 'zustand'

interface WebSocketState {
  ws: WebSocket | null
  isConnected: boolean
  connect: (url: string, onOpen?: () => void) => void
  disconnect: () => void
  send: (message: any) => void
  onMessage: ((event: MessageEvent) => void) | null
  setOnMessage: (handler: (event: MessageEvent) => void) => void
}

type SetState = (partial: Partial<WebSocketState> | ((state: WebSocketState) => Partial<WebSocketState>)) => void
type GetState = () => WebSocketState

export const useWebSocket = create<WebSocketState>((set: SetState, get: GetState) => ({
  ws: null,
  isConnected: false,
  onMessage: null,
  setOnMessage: (handler) => {
    const { ws, onMessage } = get()
    if (ws) {
      if (onMessage) {
        ws.removeEventListener('message', onMessage)
      }
      ws.addEventListener('message', handler)
    }
    // Store the handler without triggering a state update
    get().onMessage = handler
  },
  connect: (url: string, onOpen?: () => void) => {
    const ws = new WebSocket(url)
    
    ws.onopen = () => {
      console.log('WebSocket connected')
      set({ isConnected: true })
      if (onOpen) {
        onOpen()
      }
    }
    
    ws.onclose = () => {
      console.log('WebSocket disconnected')
      set({ isConnected: false, ws: null })
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    // Set up message handler if one exists
    const { onMessage } = get()
    if (onMessage) {
      ws.addEventListener('message', onMessage)
    }
    
    set({ ws })
  },
  disconnect: () => {
    const { ws, onMessage } = get()
    if (ws) {
      if (onMessage) {
        ws.removeEventListener('message', onMessage)
      }
      ws.close()
      set({ ws: null, isConnected: false })
    }
  },
  send: (message: any) => {
    const { ws, isConnected } = get()
    if (ws && isConnected) {
      console.log('Sending message:', message)
      ws.send(JSON.stringify(message))
    } else {
      console.error('Cannot send message: WebSocket is not connected')
    }
  }
})) 