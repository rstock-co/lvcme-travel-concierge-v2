"use client"

import React from "react"

import { useChat } from "ai/react"
import { useState, createContext, useContext, useEffect } from "react"
import { useTravelState } from "./use-travel-state"
import { useCourseData } from "./use-course-data"

// Create a context for chat state
const ChatStateContext = createContext<any>(null)

// Provider component
export function ChatStateProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("chat")
  const { setCourseDetails, setFlightOptions, setHotelOptions, setEntertainmentOptions, setTravelPlan } =
    useTravelState()
  const { courseData } = useCourseData()

  // Chat state
  const chatState = useChat({
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Welcome to your travel concierge! I can help you plan your trip to Las Vegas. Would you like to start with flights, accommodations, or entertainment options?`,
      },
    ],
    body: {
      courseData,
    },
    onFinish: (message) => {
      try {
        // Look for JSON data in the message
        const jsonMatch = message.content.match(/```json\n([\s\S]*?)\n```/)

        if (jsonMatch && jsonMatch[1]) {
          const data = JSON.parse(jsonMatch[1])

          // Update UI based on the type of data
          if (data.flights || data.departureFlights || data.returnFlights) {
            setFlightOptions({
              departureFlights: data.departureFlights || data.flights?.departureFlights || [],
              returnFlights: data.returnFlights || data.flights?.returnFlights || [],
            })

            // If there are flights, switch to the flights tab
            if (
              (data.departureFlights && data.departureFlights.length > 0) ||
              (data.flights?.departureFlights && data.flights.departureFlights.length > 0)
            ) {
              setActiveTab("flights")
            }
          }

          if (data.hotels) {
            setHotelOptions(data.hotels)

            // If there are hotels, switch to the hotels tab
            if (data.hotels.length > 0) {
              setActiveTab("hotel")
            }
          }

          if (data.activities || data.entertainment) {
            setEntertainmentOptions(data.activities || data.entertainment)

            // If there is entertainment, switch to the entertainment tab
            if (
              (data.activities && data.activities.length > 0) ||
              (data.entertainment && data.entertainment.length > 0)
            ) {
              setActiveTab("entertainment")
            }
          }

          // Handle selections
          if (data.selectedFlight) {
            setTravelPlan((prev) => ({
              ...prev,
              [data.flightType === "departure" ? "departureFlight" : "returnFlight"]: data.selectedFlight,
            }))
          }

          if (data.selectedHotel) {
            setTravelPlan((prev) => ({
              ...prev,
              hotel: data.selectedHotel,
            }))
          }

          if (data.selectedEntertainment) {
            setTravelPlan((prev) => {
              // Check if this entertainment is already in the list
              const exists = prev.entertainment.some(
                (item) => item.name.toLowerCase() === data.selectedEntertainment.name.toLowerCase(),
              )

              if (!exists) {
                return {
                  ...prev,
                  entertainment: [...prev.entertainment, data.selectedEntertainment],
                }
              }

              return prev
            })
          }

          // Handle budget updates
          if (data.budgetSummary) {
            setTravelPlan((prev) => ({
              ...prev,
              totalBudget: data.budgetSummary.totalBudget,
              currentSpend: data.budgetSummary.totalExpenses,
            }))
          }
        }
      } catch (error) {
        console.error("Error processing message:", error)
      }
    },
  })

  // Update course details when they change
  useEffect(() => {
    if (courseData) {
      setCourseDetails(courseData)
    }
  }, [courseData, setCourseDetails])

  return (
    <ChatStateContext.Provider
      value={{
        ...chatState,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </ChatStateContext.Provider>
  )
}

// Hook to use the chat state
export function useChatState() {
  const context = useContext(ChatStateContext)
  if (!context) {
    throw new Error("useChatState must be used within a ChatStateProvider")
  }
  return context
}
