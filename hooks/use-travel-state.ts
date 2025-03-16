"use client"

import * as React from "react"

import { useState, createContext, useContext, useEffect } from "react"
import type { Flight, HotelType, Entertainment, TravelPlan } from "@/lib/types/travel"

// Define the context type
interface TravelStateContextType {
  courseDetails: {
    courseName: string
    venue: string
    startDate: string
    endDate: string
  }
  setCourseDetails: React.Dispatch<React.SetStateAction<{
    courseName: string
    venue: string
    startDate: string
    endDate: string
  }>>
  flightOptions: {
    departureFlights: Flight[]
    returnFlights: Flight[]
  }
  setFlightOptions: React.Dispatch<React.SetStateAction<{
    departureFlights: Flight[]
    returnFlights: Flight[]
  }>>
  hotelOptions: HotelType[]
  setHotelOptions: React.Dispatch<React.SetStateAction<HotelType[]>>
  entertainmentOptions: Entertainment[]
  setEntertainmentOptions: React.Dispatch<React.SetStateAction<Entertainment[]>>
  travelPlan: TravelPlan
  setTravelPlan: React.Dispatch<React.SetStateAction<TravelPlan>>
  selectFlight: (flight: Flight, type: "departure" | "return") => void
  removeFlight: (type: "departure" | "return") => void
  selectHotel: (hotel: HotelType) => void
  removeHotel: () => void
  selectEntertainment: (entertainment: Entertainment) => void
  removeEntertainment: (entertainment: Entertainment) => void
  confirmEntertainment: () => void
}

// Create a context for travel state
const TravelStateContext = createContext<TravelStateContextType | null>(null)

// Provider component
export function TravelStateProvider({ children }: { children: React.ReactNode }) {
  // Course details
  const [courseDetails, setCourseDetails] = useState({
    courseName: "Advanced Cardiology Techniques",
    venue: "Bellagio Conference Center",
    startDate: "2025-04-15T09:00:00",
    endDate: "2025-04-18T17:00:00",
  })

  // Available flight, hotel, and entertainment options
  const [flightOptions, setFlightOptions] = useState<{
    departureFlights: Flight[]
    returnFlights: Flight[]
  }>({
    departureFlights: [],
    returnFlights: [],
  })

  const [hotelOptions, setHotelOptions] = useState<HotelType[]>([])
  const [entertainmentOptions, setEntertainmentOptions] = useState<Entertainment[]>([])

  // Travel plan state
  const [travelPlan, setTravelPlan] = useState<TravelPlan>({
    departureFlight: null,
    returnFlight: null,
    hotel: null,
    entertainment: [],
    currentSpend: 0,
  })

  // Update total spend when travel plan changes
  useEffect(() => {
    let total = 0
    if (travelPlan.departureFlight) total += travelPlan.departureFlight.price
    if (travelPlan.returnFlight) total += travelPlan.returnFlight.price
    if (travelPlan.hotel) total += travelPlan.hotel.totalPrice
    travelPlan.entertainment.forEach((item) => (total += item.price))

    setTravelPlan((prev) => ({
      ...prev,
      currentSpend: total,
    }))
  }, [travelPlan.departureFlight, travelPlan.returnFlight, travelPlan.hotel, travelPlan.entertainment])

  // Select a flight
  const selectFlight = (flight: Flight, type: "departure" | "return") => {
    setTravelPlan((prev) => ({
      ...prev,
      [type === "departure" ? "departureFlight" : "returnFlight"]: flight,
    }))
  }

  // Remove a flight
  const removeFlight = (type: "departure" | "return") => {
    setTravelPlan((prev) => ({
      ...prev,
      [type === "departure" ? "departureFlight" : "returnFlight"]: null,
    }))
  }

  // Select a hotel
  const selectHotel = (hotel: HotelType) => {
    setTravelPlan((prev) => ({
      ...prev,
      hotel,
    }))
  }

  // Remove a hotel
  const removeHotel = () => {
    setTravelPlan((prev) => ({
      ...prev,
      hotel: null,
    }))
  }

  // Select entertainment
  const selectEntertainment = (entertainment: Entertainment) => {
    // Check if already selected
    const isAlreadySelected = travelPlan.entertainment.some(
      (item) => item.name.toLowerCase() === entertainment.name.toLowerCase(),
    )

    if (isAlreadySelected) {
      // Remove from selection
      setTravelPlan((prev) => ({
        ...prev,
        entertainment: prev.entertainment.filter(
          (item) => item.name.toLowerCase() !== entertainment.name.toLowerCase(),
        ),
      }))
    } else {
      // Add to selection
      setTravelPlan((prev) => ({
        ...prev,
        entertainment: [...prev.entertainment, entertainment],
      }))
    }
  }

  // Remove entertainment
  const removeEntertainment = (entertainment: Entertainment) => {
    setTravelPlan((prev) => ({
      ...prev,
      entertainment: prev.entertainment.filter((item) => item.name.toLowerCase() !== entertainment.name.toLowerCase()),
    }))
  }

  // Confirm entertainment selections
  const confirmEntertainment = () => {
    // This would typically send a message to the chat
  }

  const value = {
    courseDetails,
    setCourseDetails,
    flightOptions,
    setFlightOptions,
    hotelOptions,
    setHotelOptions,
    entertainmentOptions,
    setEntertainmentOptions,
    travelPlan,
    setTravelPlan,
    selectFlight,
    removeFlight,
    selectHotel,
    removeHotel,
    selectEntertainment,
    removeEntertainment,
    confirmEntertainment,
  }

  return React.createElement(
    TravelStateContext.Provider,
    { value },
    children
  )
}

// Hook to use the travel state
export function useTravelState() {
  const context = useContext(TravelStateContext)
  if (!context) {
    throw new Error("useTravelState must be used within a TravelStateProvider")
  }
  return context
}
