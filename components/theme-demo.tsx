"use client"

import { FlightCard, FlightData } from "@/components/flight-card"
import { ThemeProvider } from "@/components/ui/theme-provider"

export default function ThemeDemo() {
  const handleSelectFlight = (flight: FlightData) => {
    console.log("Selected flight:", flight)
  }

  const flight: FlightData = {
    id: "AA1234",
    airline: {
      name: "American Airlines",
      logo: "/airlines/american-airlines.svg",
    },
    price: {
      amount: 349,
      currency: "USD",
    },
    departure: {
      date: "Mon, Sep 12, 2023",
      time: "8:30 AM",
      city: "Las Vegas",
      state: "NV",
      airport: "Harry Reid International Airport",
      code: "LAS",
    },
    arrival: {
      date: "Mon, Sep 12, 2023",
      time: "2:15 PM",
      city: "New York",
      state: "NY",
      airport: "John F. Kennedy International Airport",
      code: "JFK",
    },
    stops: [
      {
        airport: "Dallas/Fort Worth International Airport",
        code: "DFW",
        duration: "1h 25m",
      },
    ],
    cabin: "Economy",
    passengers: 1,
    duration: "10h 45m",
    tripType: "One Way",
  }

  return (
    <div className="space-y-8 py-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Light Theme</h2>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="p-4 bg-white rounded-lg">
            <FlightCard flight={flight} onSelect={handleSelectFlight} />
          </div>
        </ThemeProvider>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Dark Theme</h2>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="p-4 bg-slate-900 rounded-lg">
            <FlightCard flight={flight} onSelect={handleSelectFlight} />
          </div>
        </ThemeProvider>
      </div>
    </div>
  )
}
