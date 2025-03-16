"use client"

import type React from "react"
import { Clock, Users, ArrowRight, Plane, Luggage, Info } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface FlightStop {
  airport: string
  code: string
  duration: string
}

export interface FlightData {
  id: string
  airline: {
    name: string
    logo: string
  }
  price: {
    amount: number
    currency: string
  }
  departure: {
    date: string
    time: string
    city: string
    state: string
    airport: string
    code: string
  }
  arrival: {
    date: string
    time: string
    city: string
    state: string
    airport: string
    code: string
  }
  stops: FlightStop[]
  cabin: string
  passengers: number
  duration: string
  tripType: "One Way" | "Round Trip"
}

export interface FlightCardProps {
  flight: FlightData
  onSelect?: (flight: FlightData) => void
  theme?: "light" | "dark"
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, onSelect = () => {}, theme = "light" }) => {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: flight.price.currency,
    minimumFractionDigits: 0,
  }).format(flight.price.amount)

  const stopLabel =
    flight.stops.length === 0 ? "Nonstop" : `${flight.stops.length} ${flight.stops.length === 1 ? "Stop" : "Stops"}`

  return (
    <Card
      className={`w-full max-w-[461px] overflow-hidden border-l-4 hover:shadow-lg transition-all duration-200 hover:border-l-primary ${theme === "dark" ? "dark bg-slate-900 text-slate-100" : ""}`}
    >
      <CardHeader className="p-3 flex flex-row justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            <img
              src={flight.airline.logo || "/placeholder.svg"}
              alt={flight.airline.name}
              className="h-8 w-8 object-contain"
            />
          </div>
          <div>
            <h3 className="font-bold text-lg">{flight.airline.name}</h3>
            <p className="text-sm text-muted-foreground">Flight #{flight.id}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{formattedPrice}</div>
          <Badge variant={flight.tripType === "One Way" ? "outline" : "default"} className="mt-1">
            {flight.tripType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0">
        {/* Flight Route */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-center">
              <div className="text-xl font-bold">{flight.departure.time}</div>
              <div className="text-xs text-muted-foreground">{flight.departure.code}</div>
            </div>

            <div className="flex-1 px-2 flex flex-col items-center">
              <div className="text-xs text-muted-foreground mb-1">{flight.duration}</div>
              <div className="w-full flex items-center">
                <div className="h-[1px] flex-1 bg-muted"></div>
                <ArrowRight className="h-5 w-5 mx-1 text-muted-foreground stroke-[2px]" />
                <div className="h-[1px] flex-1 bg-muted"></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stopLabel}</div>
            </div>

            <div className="text-center">
              <div className="text-xl font-bold">{flight.arrival.time}</div>
              <div className="text-xs text-muted-foreground">{flight.arrival.code}</div>
            </div>
          </div>

          <div className="flex justify-between text-xs">
            <div>
              <div className="font-medium">
                {flight.departure.city}, {flight.departure.state}
              </div>
              <div className="text-muted-foreground">{flight.departure.date}</div>
            </div>
            <div className="text-right">
              <div className="font-medium">
                {flight.arrival.city}, {flight.arrival.state}
              </div>
              <div className="text-muted-foreground">{flight.arrival.date}</div>
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`rounded-md p-2 ${theme === "dark" ? "bg-slate-800" : "bg-gray-100"}`}>
            <div className="flex items-center text-xs font-medium text-muted-foreground mb-1">
              <Plane className="h-3 w-3 mr-1" /> STOPS
            </div>
            <div className="font-medium flex items-center text-sm">
              {stopLabel}
              {flight.stops.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 p-0">
                        <Info className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-64">
                      <div className="space-y-2">
                        {flight.stops.map((stop, index) => (
                          <div key={index} className="text-xs">
                            <div className="font-medium">
                              {stop.airport} ({stop.code})
                            </div>
                            <div className="text-muted-foreground">Layover: {stop.duration}</div>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          <div className={`rounded-md p-2 ${theme === "dark" ? "bg-slate-800" : "bg-gray-100"}`}>
            <div className="flex items-center text-xs font-medium text-muted-foreground mb-1">
              <Luggage className="h-3 w-3 mr-1" /> CABIN
            </div>
            <div className="font-medium text-sm">{flight.cabin}</div>
          </div>

          <div className={`rounded-md p-2 ${theme === "dark" ? "bg-slate-800" : "bg-gray-100"}`}>
            <div className="flex items-center text-xs font-medium text-muted-foreground mb-1">
              <Users className="h-3 w-3 mr-1" /> PASSENGERS
            </div>
            <div className="font-medium text-sm">{flight.passengers}</div>
          </div>

          <div className={`rounded-md p-2 ${theme === "dark" ? "bg-slate-800" : "bg-gray-100"}`}>
            <div className="flex items-center text-xs font-medium text-muted-foreground mb-1">
              <Clock className="h-3 w-3 mr-1" /> AIRPORTS
            </div>
            <div className="font-medium text-sm flex items-center space-x-1">
              <span>{flight.departure.airport.split(" ")[0]}</span>
              <span>→</span>
              <span>{flight.arrival.airport.split(" ")[0]}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-2 flex justify-end">
        <Button onClick={() => onSelect(flight)} className="rounded-full w-full">
          Select Flight
        </Button>
      </CardFooter>
    </Card>
  )
}

