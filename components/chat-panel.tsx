"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendHorizontal } from "lucide-react"

type Message = {
  id: number
  sender: string
  text: string
  timestamp: Date
}

export default function ChatPanel() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "System",
      text: "Game has started. Good luck!",
      timestamp: new Date(),
    },
    {
      id: 2,
      sender: "Alice",
      text: "I think I know what Bob is trying to show us...",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: 3,
      sender: "Charlie",
      text: "The middle card seems to represent something from the past",
      timestamp: new Date(Date.now() - 30000),
    },
  ])

  const sendMessage = () => {
    if (!message.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "You",
      text: message,
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="h-[250px] pr-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[80%] px-3 py-2 rounded-lg ${
                  msg.sender === "You"
                    ? "bg-purple-900/40 text-purple-100"
                    : msg.sender === "System"
                      ? "bg-gray-700/70 text-gray-300 italic"
                      : "bg-gray-700/40 text-gray-200"
                }`}
              >
                {msg.sender !== "You" && msg.sender !== "System" && (
                  <div className="text-xs font-medium text-purple-300 mb-1">{msg.sender}</div>
                )}
                <p className="text-sm">{msg.text}</p>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-4 flex gap-2">
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-gray-700 border-gray-600 text-white"
        />
        <Button size="icon" onClick={sendMessage} className="bg-purple-700 hover:bg-purple-600">
          <SendHorizontal size={16} />
        </Button>
      </div>
    </div>
  )
}
