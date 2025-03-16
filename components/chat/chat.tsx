"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"
import { FlightResults } from "./chat-results/flight-results"
import { HotelResults } from "./chat-results/hotel-results"
import { EntertainmentResults } from "./chat-results/entertainment-results"
import { useChatState } from "@/hooks/use-chat-state"

export function Chat() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { activeTab, setActiveTab } = useChatState()

  // Ensure theme toggle only renders client-side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card className="flex-1 flex flex-col h-full shadow-lg border-border">
      <CardHeader className="border-b border-border px-6 py-4">
        <div className="flex items-center">
          <div className="bg-primary/10 p-2 rounded-full mr-3">
            <Plane className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="tracking-tight">Las Vegas Trip Planner</CardTitle>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="ml-auto"
            >
              {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-6 pt-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="chat" className="rounded-md">
              Chat
            </TabsTrigger>
            <TabsTrigger value="flights" className="rounded-md">
              Flights
            </TabsTrigger>
            <TabsTrigger value="hotel" className="rounded-md">
              Hotel
            </TabsTrigger>
            <TabsTrigger value="entertainment" className="rounded-md">
              Entertainment
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 flex flex-col px-0 mt-0">
          <ChatMessages />
          <ChatInput />
        </TabsContent>

        <TabsContent value="flights" className="flex-1 overflow-y-auto mt-0">
          <FlightResults />
        </TabsContent>

        <TabsContent value="hotel" className="flex-1 overflow-y-auto mt-0">
          <HotelResults />
        </TabsContent>

        <TabsContent value="entertainment" className="flex-1 overflow-y-auto mt-0">
          <EntertainmentResults />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
