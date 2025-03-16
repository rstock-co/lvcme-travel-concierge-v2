"use client"

import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane } from "lucide-react"
import { FlightCard } from "./flight-card"
import { useTravelState } from "@/hooks/use-travel-state"
import { useChatState } from "@/hooks/use-chat-state"

export function FlightResults() {
  const { flightOptions, travelPlan, selectFlight, removeFlight } = useTravelState()
  const { setActiveTab, handleInputChange } = useChatState()

  return (
    <CardContent className="space-y-6 pt-4 px-6">
      <div className="flex items-center space-x-2 border-b border-border pb-3">
        <div className="bg-primary/10 p-2 rounded-full">
          <Plane className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-medium">Flight Options</h3>
      </div>

      {flightOptions.departureFlights.length > 0 || flightOptions.returnFlights.length > 0 ? (
        <div className="space-y-6">
          {/* Departure Flights */}
          {flightOptions.departureFlights.length > 0 && (
            <div>
              <h4 className="text-md font-medium mb-3">Outbound Flights</h4>
              <div className="space-y-3">
                {flightOptions.departureFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    isSelected={travelPlan.departureFlight?.id === flight.id}
                    onSelect={() => selectFlight(flight, "departure")}
                    onRemove={() => removeFlight("departure")}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Return Flights */}
          {flightOptions.returnFlights.length > 0 && (
            <div>
              <h4 className="text-md font-medium mb-3">Return Flights</h4>
              <div className="space-y-3">
                {flightOptions.returnFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    isSelected={travelPlan.returnFlight?.id === flight.id}
                    onSelect={() => selectFlight(flight, "return")}
                    onRemove={() => removeFlight("return")}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <p className="text-muted-foreground">No flights selected yet. Chat with the concierge to find flights.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setActiveTab("chat")
              handleInputChange({ target: { value: "I need flights to Las Vegas from New York" } } as any)
            }}
          >
            Find Flights
          </Button>
        </div>
      )}
    </CardContent>
  )
}

