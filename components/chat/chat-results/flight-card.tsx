"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Flight } from "@/lib/types/travel"
import { formatPrice } from "@/lib/utils/price-utils"

interface FlightCardProps {
  flight: Flight
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
}

export function FlightCard({ flight, isSelected, onSelect, onRemove }: FlightCardProps) {
  return (
    <Card className={`border ${isSelected ? "border-primary bg-primary/5" : "border-border"}`}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="font-medium">{flight.airline}</h4>
            <p className="text-sm text-muted-foreground">Flight {flight.flightNumber}</p>
          </div>
          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">{formatPrice(flight.price)}</span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-center">
            <p className="text-lg font-medium">{flight.departureTime}</p>
            <p className="text-sm text-muted-foreground">{flight.departureCity}</p>
          </div>

          <div className="flex-1 mx-4">
            <div className="relative flex items-center">
              <div className="h-0.5 flex-1 bg-border"></div>
              <div className="mx-2 text-xs text-muted-foreground">{flight.duration}</div>
              <div className="h-0.5 flex-1 bg-border"></div>
            </div>
            <div className="text-xs text-center text-muted-foreground mt-1">
              {flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-medium">{flight.arrivalTime}</p>
            <p className="text-sm text-muted-foreground">{flight.arrivalCity}</p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          {new Date(flight.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          variant={isSelected ? "secondary" : "outline"}
          size="sm"
          className="w-full"
          onClick={isSelected ? onRemove : onSelect}
        >
          {isSelected ? "Remove Selection" : "Select Flight"}
        </Button>
      </CardFooter>
    </Card>
  )
}

