"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Clock, ArrowRight, Armchair, Repeat, MapPin, Loader2, Plane } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export interface FlightPreferencesProps {
  preferences: {
    departure: {
      city: string
      state?: string
      country?: string
      airport: string
      code: string
    }
    destination: {
      city: string
      state?: string
      country?: string
      airport: string
      code: string
    }
    arrivalPreference: "day-before" | "2hrs-before" | "extra-days"
    dates?: {
      departure: string
      return: string
    }
    travelers: number
    cabinClass: "Economy" | "Business Class" | "First Class" | "No Preference"
    layoverPreference: "direct" | "one-stop" | "no-preference"
    departureTimePreference: "early-am" | "daytime" | "evening" | "no-preference"
    courseInfo?: {
      startDate: string
      endDate: string
    }
  }
  onSearch?: () => void
  onEdit?: () => void
  isSearching?: boolean
  flightsFound?: number | null
}

export const FlightPreferences: React.FC<FlightPreferencesProps> = ({
  preferences,
  onSearch = () => {
    toast({
      title: "Searching Flights",
      description: "Searching for flights based on your preferences...",
    })
  },
  onEdit = () => {
    toast({
      title: "Edit Preferences",
      description: "You can modify your flight preferences here.",
    })
  },
  isSearching = false,
  flightsFound = null
}) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [localIsSearching, setLocalIsSearching] = useState(isSearching)

  // Update local state when prop changes
  useEffect(() => {
    setLocalIsSearching(isSearching)
  }, [isSearching])

  const handleSearch = () => {
    setLocalIsSearching(true)
    onSearch()
  }

  // Helper function to format the arrival preference text
  const formatArrivalPreference = () => {
    switch (preferences.arrivalPreference) {
      case "day-before":
        return "Arrive the day before your course"
      case "2hrs-before":
        return "Arrive as late as 2hrs before your course"
      case "extra-days":
        return "Stay extra days before or after your course"
      default:
        return ""
    }
  }

  // Helper function to format the layover preference text
  const formatLayoverPreference = () => {
    switch (preferences.layoverPreference) {
      case "direct":
        return "Direct flights only"
      case "one-stop":
        return "1 stop maximum"
      case "no-preference":
        return "No preference"
      default:
        return ""
    }
  }

  // Helper function to format the departure time preference text
  const formatDepartureTimePreference = () => {
    switch (preferences.departureTimePreference) {
      case "early-am":
        return "Early AM (before 9AM)"
      case "daytime":
        return "Daytime (9 AM - 5 PM)"
      case "evening":
        return "Evening (after 5PM)"
      case "no-preference":
        return "No preference"
      default:
        return ""
    }
  }

  // Helper function to format dates in the requested format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Calculate flight dates based on course dates and arrival preference
  const getFlightDates = () => {
    if (preferences.arrivalPreference === "extra-days" && preferences.dates) {
      return {
        departure: formatDate(preferences.dates.departure),
        return: formatDate(preferences.dates.return),
      }
    } else if (preferences.courseInfo) {
      const courseStart = new Date(preferences.courseInfo.startDate)
      const courseEnd = new Date(preferences.courseInfo.endDate)

      let departureDate
      if (preferences.arrivalPreference === "day-before") {
        departureDate = new Date(courseStart)
        departureDate.setDate(courseStart.getDate() - 1)
      } else {
        // For "2hrs-before", use the course start date
        departureDate = courseStart
      }

      // Return date is the course end date
      const returnDate = courseEnd

      return {
        departure: formatDate(departureDate.toISOString()),
        return: formatDate(returnDate.toISOString()),
      }
    }

    return null
  }

  const flightDates = getFlightDates()

  // Render the action buttons or flights found text
  const renderActionArea = () => {
    if (localIsSearching) {
      return (
        <div className="flex justify-center mt-4">
          <Button disabled className="mr-2">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </Button>
        </div>
      )
    } else if (flightsFound !== null) {
      return (
        <div className="flex justify-center mt-4">
          <p className={`text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>
            {flightsFound} flights found
          </p>
        </div>
      )
    } else {
      return (
        <div className="flex justify-between mt-4">
          <Button onClick={handleSearch}>
            <Plane className="mr-2 h-4 w-4" />
            Ready to search for flights
          </Button>
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
        </div>
      )
    }
  }

  return (
    <Card
      className={`max-w-[461px] overflow-hidden border-l-4 border-l-primary ${
        isDark ? "dark bg-slate-900 text-slate-100" : "bg-white text-slate-900"
      }`}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-bold">Your Flight Preferences</CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        {/* Route */}
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-2">
            <MapPin className={`h-4 w-4 ${isDark ? "text-slate-400" : "text-muted-foreground"} mt-0.5`} />
            <div>
              <div className="font-medium">
                {preferences.departure.city}
                {preferences.departure.state ? `, ${preferences.departure.state}` : ""}
              </div>
              <div className={`text-xs ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
                {preferences.departure.airport} ({preferences.departure.code})
              </div>
            </div>
          </div>

          <ArrowRight className={`h-4 w-4 ${isDark ? "text-slate-400" : "text-muted-foreground"} mx-2`} />

          <div className="flex items-start space-x-2 text-right">
            <div>
              <div className="font-medium">
                {preferences.destination.city}
                {preferences.destination.state ? `, ${preferences.destination.state}` : ""}
              </div>
              <div className={`text-xs ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
                {preferences.destination.airport} ({preferences.destination.code})
              </div>
            </div>
            <MapPin className={`h-4 w-4 ${isDark ? "text-slate-400" : "text-muted-foreground"} mt-0.5`} />
          </div>
        </div>

        {/* Dates */}
        <div className={`rounded-md p-3 ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
          <div className="flex items-center mb-2">
            <Calendar className={`h-4 w-4 ${isDark ? "text-slate-400" : "text-muted-foreground"} mr-2`} />
            <span className="font-medium">Travel Dates</span>
          </div>

          {flightDates && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="font-medium text-sm">{flightDates.departure}</div>
                <div className={`text-xs ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>Outbound</div>
              </div>
              <div>
                <div className="font-medium text-sm">{flightDates.return}</div>
                <div className={`text-xs ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>Return</div>
              </div>
            </div>
          )}

          <div className={`text-xs ${isDark ? "text-slate-400" : "text-muted-foreground"} mt-2`}>{formatArrivalPreference()}</div>
        </div>

        {/* Preferences Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Travelers */}
          <div className={`rounded-md p-3 ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
            <div className="flex items-center mb-1">
              <Users className={`h-4 w-4 ${isDark ? "text-slate-400" : "text-muted-foreground"} mr-2`} />
              <span className="font-medium">Travelers</span>
            </div>
            <div className="text-sm">
              {preferences.travelers === 1 ? "1 person" : `${preferences.travelers} people`}
            </div>
          </div>

          {/* Cabin Class */}
          <div className={`rounded-md p-3 ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
            <div className="flex items-center mb-1">
              <Armchair className={`h-4 w-4 ${isDark ? "text-slate-400" : "text-muted-foreground"} mr-2`} />
              <span className="font-medium">Cabin</span>
            </div>
            <div className="text-sm">{preferences.cabinClass}</div>
          </div>

          {/* Layovers */}
          <div className={`rounded-md p-3 ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
            <div className="flex items-center mb-1">
              <Repeat className={`h-4 w-4 ${isDark ? "text-slate-400" : "text-muted-foreground"} mr-2`} />
              <span className="font-medium">Layovers</span>
            </div>
            <div className="text-sm">{formatLayoverPreference()}</div>
          </div>

          {/* Departure Time */}
          <div className={`rounded-md p-3 ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
            <div className="flex items-center mb-1">
              <Clock className={`h-4 w-4 ${isDark ? "text-slate-400" : "text-muted-foreground"} mr-2`} />
              <span className="font-medium">Departure</span>
            </div>
            <div className="text-sm">{formatDepartureTimePreference()}</div>
          </div>
        </div>

        {/* Action Buttons or Flights Found Text */}
        {renderActionArea()}
      </CardContent>
    </Card>
  )
}
