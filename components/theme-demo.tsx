"use client"

import { FlightCard, type FlightData } from "./flight-card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ThemeDemo() {
  const handleSelectFlight = (flight: FlightData) => {
    toast({
      title: "Flight Selected",
      description: `You've selected ${flight.airline.name} flight #${flight.id} from ${flight.departure.city} to ${flight.arrival.city}`,
    })
  }

  // Sample flight data
  const flight: FlightData = {
    id: "UA1234",
    airline: {
      name: "United Airlines",
      logo: "/placeholder.svg?height=40&width=40",
    },
    price: {
      amount: 531,
      currency: "USD",
    },
    departure: {
      date: "10 April, 2024",
      time: "8:30 PM",
      city: "San Francisco",
      state: "CA",
      airport: "San Francisco International",
      code: "SFO",
    },
    arrival: {
      date: "11 April, 2024",
      time: "4:20 PM",
      city: "Rome",
      state: "",
      airport: "Leonardo da Vinci International",
      code: "FCO",
    },
    stops: [],
    cabin: "Economy",
    passengers: 1,
    duration: "10h 45m",
    tripType: "One Way",
  }

  return (
    <div className="space-y-8 py-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Light Theme</h2>
        <FlightCard flight={flight} onSelect={handleSelectFlight} theme="light" />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Dark Theme</h2>
        <FlightCard flight={flight} onSelect={handleSelectFlight} theme="dark" />
      </div>

      <Toaster />
    </div>
  )
}

