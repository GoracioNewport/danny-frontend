"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDrag, useDrop, DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useToast } from "@/hooks/use-toast"

// Mock memory cards with abstract images
const memoryCards = [
  { id: 1, image: "/placeholder.svg?height=120&width=80" },
  { id: 2, image: "/placeholder.svg?height=120&width=80" },
  { id: 3, image: "/placeholder.svg?height=120&width=80" },
  { id: 4, image: "/placeholder.svg?height=120&width=80" },
  { id: 5, image: "/placeholder.svg?height=120&width=80" },
  { id: 6, image: "/placeholder.svg?height=120&width=80" },
  { id: 7, image: "/placeholder.svg?height=120&width=80" },
]

type MemoryCardProps = {
  id: number
  image: string
  index?: number
  moveCard?: (dragIndex: number, hoverIndex: number) => void
  onSelect?: () => void
  selected?: boolean
  inHand?: boolean
}

const MemoryCard = ({ id, image, index, moveCard, onSelect, selected, inHand }: MemoryCardProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const [, drop] = useDrop(() => ({
    accept: "CARD",
    hover: (item: { id: number; index: number }, monitor) => {
      if (!moveCard) return
      if (item.index === index) return
      moveCard(item.index, index!)
      item.index = index!
    },
  }))

  return (
    <div
      ref={(node) => {
        if (inHand) {
          return
        }
        drag(drop(node))
      }}
      className={`relative ${isDragging ? "opacity-50" : "opacity-100"} transition-all duration-200`}
      onClick={onSelect}
    >
      <Card
        className={`w-20 h-28 overflow-hidden cursor-pointer transition-all duration-200 ${
          selected ? "ring-2 ring-purple-500" : ""
        }`}
      >
        <img src={image || "/placeholder.svg"} alt={`Memory card ${id}`} className="w-full h-full object-cover" />
      </Card>
    </div>
  )
}

type GameBoardProps = {
  phase: string
  isActivePlayer: boolean
  isDecisivePlayer: boolean
  selectedCards: string[]
  arrangedCards: {
    id: string
    position_x: number
    position_y: number
    rotation: number
    flipped: boolean
    image: string
  }[]
  wordOptions: string[]
}

export default function GameBoard({ phase, isActivePlayer, isDecisivePlayer, selectedCards, arrangedCards, wordOptions }: GameBoardProps) {
  const { toast } = useToast()
  const [boardCards, setBoardCards] = useState<{ id: number; image: string; x: number; y: number }[]>([])
  const [guess, setGuess] = useState("")

  const handleSelectCard = (id: number) => {
    toast({
      title: "Card selection",
      description: "Card selection is handled by the server.",
    })
  }

  const handleConfirmSelection = () => {
    toast({
      title: "Card arrangement",
      description: "Card arrangement is handled by the server.",
    })
  }

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    toast({
      title: "Card movement",
      description: "Card movement is handled by the server.",
    })
  }

  const renderPhaseContent = () => {
    switch (phase) {
      case "selection":
        return isActivePlayer ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-purple-300">Select Memory Cards (up to 7)</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {memoryCards.map((card) => (
                <MemoryCard
                  key={card.id}
                  id={card.id}
                  image={card.image}
                  onSelect={() => handleSelectCard(card.id)}
                  selected={selectedCards.includes(card.id.toString())}
                  inHand={true}
                />
              ))}
            </div>

            {selectedCards.length > 0 && (
              <div className="mt-6 text-center">
                <Button className="bg-purple-700 hover:bg-purple-600" onClick={handleConfirmSelection}>
                  Confirm Selection ({selectedCards.length}/7)
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-400">Waiting for the active player to select memory cards...</p>
          </div>
        )

      case "arrangement":
        return isActivePlayer ? (
          <DndProvider backend={HTML5Backend}>
            <div className="relative h-64 border border-dashed border-gray-600 rounded-md bg-gray-800/50">
              {arrangedCards.map((card) => {
                const cardData = memoryCards.find(c => c.id.toString() === card.id)
                if (!cardData) return null
                return (
                  <div
                    key={card.id}
                    style={{
                      position: "absolute",
                      left: card.position_x,
                      top: card.position_y,
                      transform: `rotate(${card.rotation}deg)`,
                    }}
                  >
                    <MemoryCard id={cardData.id} image={cardData.image} index={0} moveCard={moveCard} />
                  </div>
                )
              })}
            </div>
          </DndProvider>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-400">Waiting for the active player to arrange memory cards...</p>
          </div>
        )

      case "discussion":
        return (
          <div className="space-y-4">
            <div className="relative h-64 border border-gray-600 rounded-md bg-gray-800/50">
              {arrangedCards.map((card) => {
                const cardData = memoryCards.find(c => c.id.toString() === card.id)
                if (!cardData) return null
                return (
                  <div
                    key={card.id}
                    style={{
                      position: "absolute",
                      left: card.position_x,
                      top: card.position_y,
                      transform: `rotate(${card.rotation}deg)`,
                    }}
                  >
                    <Card className={`w-full h-full transition-transform duration-300 ${card.flipped ? 'rotate-y-180' : ''}`}>
                      <div className="w-full h-full flex items-center justify-center p-4 text-center">
                        {cardData.image}
                      </div>
                    </Card>
                  </div>
                )
              })}
            </div>
            {isDecisivePlayer && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-purple-300 mb-2">Make your guess</h3>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Type your guess..."
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button className="bg-purple-700 hover:bg-purple-600">Submit Guess</Button>
                </div>
              </div>
            )}
          </div>
        )

      case "decision":
        return (
          <div className="space-y-4">
            <div className="relative h-64 border border-gray-600 rounded-md bg-gray-800/50">
              {arrangedCards.map((card) => {
                const cardData = memoryCards.find(c => c.id.toString() === card.id)
                if (!cardData) return null
                return (
                  <div
                    key={card.id}
                    style={{
                      position: "absolute",
                      left: card.position_x,
                      top: card.position_y,
                      transform: `rotate(${card.rotation}deg)`,
                    }}
                  >
                    <Card className={`w-full h-full transition-transform duration-300 ${card.flipped ? 'rotate-y-180' : ''}`}>
                      <div className="w-full h-full flex items-center justify-center p-4 text-center">
                        {cardData.image}
                      </div>
                    </Card>
                  </div>
                )
              })}
            </div>
            {isDecisivePlayer && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-purple-300 mb-2">Make your decision</h3>
                <div className="flex gap-4 justify-center">
                  <Button className="bg-green-700 hover:bg-green-600">Correct</Button>
                  <Button className="bg-red-700 hover:bg-red-600">Incorrect</Button>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-400">Waiting for the game to start...</p>
          </div>
        )
    }
  }

  return (
    <div className="p-4">
      {renderPhaseContent()}
    </div>
  )
}
