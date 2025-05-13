"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, EyeOff, HelpCircle, Trophy } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import GameBoard from "@/components/game-board"
import ChatPanel from "@/components/chat-panel"
import RulesPanel from "@/components/rules-panel"
import { usePlayerStore } from "@/lib/lobby"
import { useGame } from "@/lib/game"
import CardPlacement from "@/components/card-placement"

export default function GamePage() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { name: playerName } = usePlayerStore()
  const { gameState, finalScores, endTurn, makeDecision, nextRound, sendMessage } = useGame()
  const [showRole, setShowRole] = useState(false)
  const code = searchParams.get('code')

  useEffect(() => {
    if (!code) {
      router.push('/')
    }
  }, [code, router])

  useEffect(() => {
    console.log('Game page current state:', gameState)
  }, [gameState])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {finalScores && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="bg-gray-800/90 border-purple-700/30 text-white max-w-md w-full mx-4">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-purple-300 mb-2">Game Over!</h2>
                <p className="text-gray-400">Final Results</p>
              </div>

              <div className="space-y-4 mb-6">
                {finalScores.map((score, index) => (
                  <div
                    key={score.name}
                    className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-purple-700 text-white">
                          {score.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-lg">{score.name}</span>
                    </div>
                    <Badge
                      className={
                        score.won
                          ? "bg-green-900/50 text-green-300 hover:bg-green-900/70"
                          : "bg-red-900/50 text-red-300 hover:bg-red-900/70"
                      }
                    >
                      {score.won ? "Winner" : "Lost"}
                    </Badge>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => router.push('/')}
                className="w-full bg-purple-700 hover:bg-purple-600"
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-gray-800/70 border-purple-700/30 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-purple-300">Game Info</h2>
                  <Badge variant="outline" className="border-purple-500 text-purple-300">
                    Round {(gameState?.scoreA || 0) + (gameState?.scoreD || 0) + 1}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Personalities Score:</span>
                    <span className="text-green-400">{gameState?.scoreA || 0}/6</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Danny's Score:</span>
                    <span className="text-red-400">{gameState?.scoreD || 0}/3</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-green-500"
                      style={{ width: `${((gameState?.scoreA || 0) / 6) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {gameState?.players?.map((player) => (
                    <div key={player.name} className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-purple-700 text-white text-xs">
                          {player.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-300">{player.name}</span>
                      {player.isActive && (
                        <Badge className="bg-purple-900/50 text-purple-300 hover:bg-purple-900/70">Active</Badge>
                      )}
                      {player.isDecisive && (
                        <Badge className="bg-blue-900/50 text-blue-300 hover:bg-blue-900/70">Decisive</Badge>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-3 bg-purple-900/30 rounded-md border border-purple-700/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Your Role:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-purple-300 hover:text-purple-200 hover:bg-purple-900/20"
                      onClick={() => setShowRole(!showRole)}
                    >
                      {showRole ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  {showRole ? (
                    <div className="text-center py-1">
                      <Badge
                        className={
                          gameState?.player?.role === "danny"
                            ? "bg-red-900/50 text-red-300 hover:bg-red-900/70"
                            : "bg-green-900/50 text-green-300 hover:bg-green-900/70"
                        }
                      >
                        {gameState?.player?.role === "danny" ? "You are Danny" : "You are an Alternate Personality"}
                      </Badge>
                    </div>
                  ) : (
                    <div className="text-center py-1">
                      <Badge variant="outline" className="border-purple-500 text-purple-300">
                        Click to reveal
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-purple-700/50 text-purple-300 hover:bg-purple-900/20"
                      >
                        <HelpCircle size={16} className="mr-2" />
                        Game Rules
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 text-white border-purple-700/50 max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl text-purple-300">Game Rules</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          "Danny: Voices in the Head" - Game Rules and Instructions
                        </DialogDescription>
                      </DialogHeader>
                      <RulesPanel />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/70 border-purple-700/30 text-white">
              <CardContent className="p-4">
                <Tabs defaultValue="players">
                  <TabsList className="bg-gray-700 text-gray-400">
                    <TabsTrigger
                      value="players"
                      className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300"
                    >
                      Players
                    </TabsTrigger>
                    <TabsTrigger
                      value="chat"
                      className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300"
                    >
                      Chat
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="players" className="mt-4">
                    <div className="space-y-2">
                      {gameState?.players?.map((player) => (
                        <div key={player.name} className="flex items-center gap-3 p-2 rounded-md bg-gray-700/30">
                          <Avatar>
                            <AvatarFallback className="bg-purple-700 text-white">{player.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-gray-200">{player.name}</div>
                            {player.isActive && (
                              <Badge className="bg-purple-900/50 text-purple-300 hover:bg-purple-900/70">Active</Badge>
                            )}
                            {player.isDecisive && (
                              <Badge className="bg-blue-900/50 text-blue-300 hover:bg-blue-900/70">Decisive</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="chat" className="mt-4 h-[300px]">
                    <ChatPanel />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="bg-gray-800/70 border-purple-700/30 text-white">
              <CardContent className="p-4">
                <div className="mb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-purple-300">Game Board</h2>
                    <p className="text-gray-400">
                      {gameState?.stage === "selection" && "Select and arrange memory cards to convey the idea."}
                      {gameState?.stage === "arrangement" && "Arrange your selected cards on the board."}
                      {gameState?.stage === "discussion" && "Discuss what the active player is trying to convey."}
                      {gameState?.stage === "decision" && "The decisive player must make a decision."}
                      {gameState?.stage === "reveal" && "Revealing the correct answer."}
                    </p>
                  </div>
                  <Badge className="bg-purple-900/50 text-purple-300">
                    {gameState?.stage?.charAt(0)?.toUpperCase() + gameState?.stage?.slice(1)} Phase
                  </Badge>
                </div>

                <div className="mb-4 space-y-3">
                  {gameState?.player?.isActive && (
                    <div className="p-3 bg-purple-900/30 rounded-md border border-purple-700/50 text-center">
                      <span className="text-gray-300 mr-2">Main Idea Card:</span>
                      <span className="text-xl font-medium text-purple-300">{gameState?.word || ""}</span>
                    </div>
                  )}

                  <div className="p-3 bg-gray-800/50 rounded-md border border-purple-700/30">
                    <div className="text-gray-300 mb-2">Available Idea Cards:</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {gameState?.wordOptions?.map((word, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-md text-center ${
                            gameState?.stage === "voting_word" && gameState?.player?.isDecisive
                              ? "bg-purple-700/30 border-purple-500/50 cursor-pointer hover:bg-purple-700/50 transition-colors"
                              : "bg-gray-700/30 border-gray-600/30"
                          }`}
                          onClick={() => {
                            if (gameState?.stage === "voting_word" && gameState?.player?.isDecisive && code) {
                              sendMessage({
                                type: 'game_vote_word',
                                payload: {
                                  code,
                                  name: playerName,
                                  word
                                }
                              })
                            }
                          }}
                        >
                          <span className="text-gray-300">{word}</span>
                        </div>
                      ))}
                    </div>
                    {gameState?.stage === "voting_word" && !gameState?.player?.isDecisive && (
                      <div className="mt-4 text-center text-gray-400">
                        Waiting for decisive person to make a decision...
                      </div>
                    )}
                  </div>
                </div>

                {gameState?.stage === "card_placement" ? (
                  <CardPlacement
                    isActivePlayer={gameState?.player?.isActive || false}
                    hand={gameState?.player?.hand || []}
                    onConfirm={(placement) => {
                      if (!code) return
                      sendMessage({
                        type: 'game_card_placement',
                        payload: {
                          code,
                          name: playerName,
                          placement: {
                            cards: placement.cards.map(cardId => ({
                              id: parseInt(cardId),
                              position_x: Math.round(placement.positions[cardId].x) || 0,
                              position_y: Math.round(placement.positions[cardId].y) || 0,
                              rotation: Math.round(placement.positions[cardId].rotation) || 0,
                              flipped: placement.positions[cardId].isFlipped || false
                            }))
                          }
                        }
                      })
                    }}
                  />
                ) : gameState?.cardPlacement?.arrangedCards?.length > 0 ? (
                  <div className="relative w-full h-96 bg-gray-800/50 rounded-lg border border-purple-700/30">
                    {gameState.cardPlacement.arrangedCards.map((card, index) => (
                      <div
                        key={`display-${card.id}`}
                        style={{
                          position: 'absolute',
                          left: card.position_x,
                          top: card.position_y,
                          transform: `rotate(${card.rotation}deg)`,
                        }}
                        className="w-32 h-48"
                      >
                        <Card className={`w-full h-full transition-transform duration-300 ${card.flipped ? 'rotate-y-180' : ''}`}>
                          <div className="w-full h-full flex items-center justify-center p-4 text-center">
                            <img src={card.image} alt={`Card ${card.id}`} className="w-full h-full object-cover" />
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                ) : (
                  <GameBoard
                    phase={gameState?.stage || "selection"}
                    isActivePlayer={gameState?.player?.isActive || false}
                    isDecisivePlayer={gameState?.player?.isDecisive || false}
                    selectedCards={gameState?.cardPlacement?.selectedCards || []}
                    arrangedCards={gameState?.cardPlacement?.arrangedCards || []}
                    wordOptions={gameState?.wordOptions || []}
                  />
                )}

                <div className="mt-6 flex justify-between">
                  {gameState?.stage === "selection" && gameState?.player?.isActive && (
                    <Button className="bg-purple-700 hover:bg-purple-600" onClick={() => endTurn(code!)}>
                      Confirm Arrangement
                    </Button>
                  )}

                  {gameState?.stage === "discussion" && gameState?.player?.isDecisive && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="border-red-700/50 text-red-300 hover:bg-red-900/20"
                        onClick={() => makeDecision(code!, false)}
                      >
                        Incorrect
                      </Button>
                      <Button className="bg-green-700 hover:bg-green-600" onClick={() => makeDecision(code!, true)}>
                        Correct
                      </Button>
                    </div>
                  )}

                  {gameState?.stage === "reveal" && (
                    <Button className="bg-purple-700 hover:bg-purple-600" onClick={() => nextRound(code!)}>
                      Next Round
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
