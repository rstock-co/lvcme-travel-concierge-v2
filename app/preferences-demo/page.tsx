"use client"

import { useState } from "react"
import { FlightPreferences } from "@/components/flight-preferences"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PreferencesDemo() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

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

  // Sample preferences with extra days
  const extraDaysPreferences = {
    ...samplePreferences,
    arrivalPreference: "extra-days" as const,
    dates: {
      departure: "May 13, 2024",
      return: "May 20, 2024",
    },
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Flight Preferences Summary</h1>
        <Tabs defaultValue="light" onValueChange={(value) => setTheme(value as "light" | "dark")}>
          <TabsList>
            <TabsTrigger value="light">Light</TabsTrigger>
            <TabsTrigger value="dark">Dark</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-medium mb-4">Standard Arrival Preference</h2>
          <FlightPreferences preferences={samplePreferences} theme={theme} />
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">Extra Days Preference</h2>
          <FlightPreferences preferences={extraDaysPreferences} theme={theme} />
        </div>
      </div>
    </div>
  )
}

