"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useDrag, useDrop } from 'react-dnd'
import { RotateCw, FlipHorizontal } from 'lucide-react'

interface CardData {
  id: string
  image: string
}

interface CardProps {
  id: string
  content: CardData
  position: { x: number; y: number }
  rotation: number
  isFlipped: boolean
  onMove: (id: string, x: number, y: number) => void
  onRotate: (id: string, rotation: number) => void
  onFlip: (id: string) => void
}

const DraggableCard = ({ id, content, position, rotation, isFlipped, onMove, onRotate, onFlip }: CardProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const [isRotating, setIsRotating] = useState(false)
  const lastMousePosition = useRef({ x: 0, y: 0 })

  const handleRotateStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsRotating(true)
    lastMousePosition.current = { x: e.clientX, y: e.clientY }
  }

  const handleRotateMove = (e: MouseEvent) => {
    if (!isRotating) return

    const dx = e.clientX - lastMousePosition.current.x
    const dy = e.clientY - lastMousePosition.current.y
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) * 0.2
    
    onRotate(id, rotation + angle)
    lastMousePosition.current = { x: e.clientX, y: e.clientY }
  }

  const handleRotateEnd = () => {
    setIsRotating(false)
  }

  useEffect(() => {
    if (isRotating) {
      window.addEventListener('mousemove', handleRotateMove)
      window.addEventListener('mouseup', handleRotateEnd)
    }
    return () => {
      window.removeEventListener('mousemove', handleRotateMove)
      window.removeEventListener('mouseup', handleRotateEnd)
    }
  }, [isRotating, rotation])

  return (
    <div
      ref={drag as any}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: `rotate(${rotation}deg)`,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        zIndex: isDragging ? 1000 : 1,
      }}
      className="w-32 h-48"
    >
      <Card
        className={`w-full h-full transition-transform duration-300 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        <div className="w-full h-full flex items-center justify-center p-4 text-center relative">
          <img src={content.image} alt={`Card ${id}`} className="w-full h-full object-cover" />
          
          {/* Rotation button */}
          <button
            className="absolute -top-2 -left-2 w-6 h-6 bg-purple-700 rounded-full flex items-center justify-center text-white hover:bg-purple-600 transition-colors"
            onMouseDown={handleRotateStart}
            onClick={(e) => e.stopPropagation()}
          >
            <RotateCw size={14} />
          </button>

          {/* Flip button */}
          <button
            className="absolute -top-2 -right-2 w-6 h-6 bg-purple-700 rounded-full flex items-center justify-center text-white hover:bg-purple-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onFlip(id)
            }}
          >
            <FlipHorizontal size={14} />
          </button>
        </div>
      </Card>
    </div>
  )
}

interface CardPlacementProps {
  isActivePlayer: boolean
  hand: (string | CardData)[]
  onConfirm: (placement: { cards: string[]; positions: { [key: string]: { x: number; y: number; rotation: number; isFlipped: boolean } } }) => void
}

export default function CardPlacement({ isActivePlayer, hand, onConfirm }: CardPlacementProps) {
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [cardPositions, setCardPositions] = useState<{ [key: string]: { x: number; y: number; rotation: number; isFlipped: boolean } }>({})
  const tableRef = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item: { id: string }, monitor) => {
      const offset = monitor.getClientOffset()
      if (offset && tableRef.current) {
        const tableRect = tableRef.current.getBoundingClientRect()
        const x = offset.x - tableRect.left
        const y = offset.y - tableRect.y
        onMove(item.id, x, y)
      }
    },
  }))

  const onMove = (id: string, x: number, y: number) => {
    setCardPositions(prev => ({
      ...prev,
      [id]: { ...prev[id], x, y }
    }))
  }

  const onRotate = (id: string, rotation: number) => {
    setCardPositions(prev => ({
      ...prev,
      [id]: { ...prev[id], rotation }
    }))
  }

  const onFlip = (id: string) => {
    setCardPositions(prev => ({
      ...prev,
      [id]: { ...prev[id], isFlipped: !prev[id].isFlipped }
    }))
  }

  const getCardId = (card: string | CardData): string => {
    return typeof card === 'string' ? card : card.id
  }

  const getCardImage = (card: string | CardData): string => {
    const cardId = typeof card === 'string' ? card : card.id;
    return `/cards/${cardId}.png`;
  }

  const toggleCardSelection = (card: string | CardData) => {
    const cardId = getCardId(card)
    setSelectedCards(prev => {
      if (prev.includes(cardId)) {
        return prev.filter(c => c !== cardId)
      } else {
        return [...prev, cardId]
      }
    })
  }

  const handleConfirm = () => {
    onConfirm({
      cards: selectedCards,
      positions: cardPositions
    })
  }

  if (!isActivePlayer) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-800/50 rounded-lg border border-purple-700/30">
        <p className="text-xl text-gray-300">Waiting for active person to select cards</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {hand.map((card) => {
          const cardId = getCardId(card)
          return (
            <Card
              key={`hand-${cardId}`}
              className={`w-32 h-48 cursor-pointer transition-all ${
                selectedCards.includes(cardId)
                  ? 'ring-2 ring-purple-500'
                  : 'hover:ring-2 hover:ring-purple-500/50'
              }`}
              onClick={() => toggleCardSelection(card)}
            >
              <div className="w-full h-full flex items-center justify-center p-4 text-center">
                <img src={getCardImage(card)} alt={`Card ${getCardId(card)}`} className="w-full h-full object-cover" />
              </div>
            </Card>
          )
        })}
      </div>

      <div
        ref={(node) => {
          drop(node)
          if (tableRef) {
            tableRef.current = node
          }
        }}
        className="relative w-full h-96 bg-gray-800/50 rounded-lg border border-purple-700/30"
      >
        {selectedCards.map((cardId) => (
          <DraggableCard
            key={`table-${cardId}`}
            id={cardId}
            content={{ id: cardId, image: `/cards/${cardId}.png` }}
            position={cardPositions[cardId] || { x: 0, y: 0 }}
            rotation={cardPositions[cardId]?.rotation || 0}
            isFlipped={cardPositions[cardId]?.isFlipped || false}
            onMove={onMove}
            onRotate={onRotate}
            onFlip={onFlip}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleConfirm}
          className="bg-purple-700 hover:bg-purple-600"
          disabled={selectedCards.length === 0}
        >
          Confirm Arrangement
        </Button>
      </div>
    </div>
  )
} 