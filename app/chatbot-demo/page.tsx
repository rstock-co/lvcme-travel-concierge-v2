"use client"

import { useState } from "react"
import { FlightPreferences } from "@/components/flight-preferences"
import { FlightCard, type FlightData } from "@/components/flight-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"

export default function ChatbotDemo() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [showFlights, setShowFlights] = useState(false)

  // Sample preferences data
  const samplePreferences = {
    departure: {
      city: "San Francisco",
      state: "CA",
      country: "USA",
      airport: "San Francisco International",
      code: "SFO",
    },
    destination: {
      city: "Las Vegas",
      state: "NV",
      country: "USA",
      airport: "Harry Reid International",
      code: "LAS",
    },
    arrivalPreference: "day-before" as const,
    travelers: 1,
    cabinClass: "Economy" as const,
    layoverPreference: "direct" as const,
    departureTimePreference: "daytime" as const,
    courseInfo: {
      startDate: "May 15, 2024",
      endDate: "May 18, 2024",
    },
  }

  // Sample flight data
  const flights: FlightData[] = [
    {
      id: "UA1234",
      airline: {
        name: "United Airlines",
        logo: "/placeholder.svg?height=40&width=40",
      },
      price: {
        amount: 289,
        currency: "USD",
      },
      departure: {
        date: "May 14, 2024",
        time: "8:30 AM",
        city: "San Francisco",
        state: "CA",
        airport: "San Francisco International",
        code: "SFO",
      },
      arrival: {
        date: "May 14, 2024",
        time: "10:15 AM",
        city: "Las Vegas",
        state: "NV",
        airport: "Harry Reid International",
        code: "LAS",
      },
      stops: [],
      cabin: "Economy",
      passengers: 1,
      duration: "1h 45m",
      tripType: "One Way",
    },
    {
      id: "AA5678",
      airline: {
        name: "American Airlines",
        logo: "/placeholder.svg?height=40&width=40",
      },
      price: {
        amount: 245,
        currency: "USD",
      },
      departure: {
        date: "May 14, 2024",
        time: "11:20 AM",
        city: "San Francisco",
        state: "CA",
        airport: "San Francisco International",
        code: "SFO",
      },
      arrival: {
        date: "May 14, 2024",
        time: "1:05 PM",
        city: "Las Vegas",
        state: "NV",
        airport: "Harry Reid International",
        code: "LAS",
      },
      stops: [],
      cabin: "Economy",
      passengers: 1,
      duration: "1h 45m",
      tripType: "One Way",
    },
  ]

  const handleSearchFlights = () => {
    setShowFlights(true)
    toast({
      title: "Searching for flights",
      description: "Finding the best options based on your preferences...",
    })
  }

  const handleSelectFlight = (flight: FlightData) => {
    toast({
      title: "Flight Selected",
      description: `You've selected ${flight.airline.name} flight #${flight.id} from ${flight.departure.city} to ${flight.arrival.city}`,
    })
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark bg-slate-950" : "bg-gray-50"}`}>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : ""}`}>Flight Booking Assistant</h1>
          <Tabs defaultValue={theme} onValueChange={(value) => setTheme(value as "light" | "dark")}>
            <TabsList>
              <TabsTrigger value="light">Light</TabsTrigger>
              <TabsTrigger value="dark">Dark</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Conversation History */}
            <div className="space-y-4">
              {/* Bot Message - Introduction */}
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <Card className={`p-3 max-w-[80%] ${theme === "dark" ? "bg-slate-800 text-white" : ""}`}>
                  <p className="text-sm">
                    Hi there! I'm your flight booking assistant. I'll help you find the best flights for your trip to
                    Las Vegas. Let me ask you a few questions to understand your preferences.
                  </p>
                </Card>
              </div>

              {/* Bot Message - Questions Summary */}
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <Card className={`p-3 max-w-[80%] ${theme === "dark" ? "bg-slate-800 text-white" : ""}`}>
                  <p className="text-sm">
                    Thanks for answering all my questions! Based on our conversation, I understand you want to:
                  </p>
                  <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                    <li>Fly from San Francisco to Las Vegas</li>
                    <li>Arrive the day before your course (May 14)</li>
                    <li>Travel alone in Economy class</li>
                    <li>Take a direct flight during daytime hours</li>
                  </ul>
                  <p className="text-sm mt-2">Here's a summary of your preferences:</p>
                </Card>
              </div>

              {/* Preferences Card */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 flex-shrink-0"></div>
                <div className="w-full max-w-[461px]">
                  <FlightPreferences preferences={samplePreferences} theme={theme} />
                  <div className="mt-4">
                    <Button onClick={handleSearchFlights} className="w-full">
                      Search for Flights
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bot Message - Search Results */}
              {showFlights && (
                <>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <Card className={`p-3 max-w-[80%] ${theme === "dark" ? "bg-slate-800 text-white" : ""}`}>
                      <p className="text-sm">
                        Great! I've found some flight options that match your preferences. Here are the best options for
                        your trip:
                      </p>
                    </Card>
                  </div>

                  {/* Flight Results */}
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 flex-shrink-0"></div>
                    <div className="w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {flights.map((flight) => (
                          <FlightCard key={flight.id} flight={flight} onSelect={handleSelectFlight} theme={theme} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bot Message - Next Steps */}
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <Card className={`p-3 max-w-[80%] ${theme === "dark" ? "bg-slate-800 text-white" : ""}`}>
                      <p className="text-sm">
                        Please select a flight that works best for you. Once you've made your selection, I can help you
                        with the booking process.
                      </p>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

