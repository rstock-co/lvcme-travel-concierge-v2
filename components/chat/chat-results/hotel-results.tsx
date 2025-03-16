"use client"

import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Hotel } from "lucide-react"
import { HotelCard } from "./hotel-card"
import { useTravelState } from "@/hooks/use-travel-state"
import { useChatState } from "@/hooks/use-chat-state"

export function HotelResults() {
  const { hotelOptions, travelPlan, selectHotel, removeHotel } = useTravelState()
  const { setActiveTab, handleInputChange } = useChatState()

  return (
    <CardContent className="space-y-6 pt-4 px-6">
      <div className="flex items-center space-x-2 border-b border-border pb-3">
        <div className="bg-primary/10 p-2 rounded-full">
          <Hotel className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-medium">Hotel Options</h3>
      </div>

      {hotelOptions.length > 0 ? (
        <div className="space-y-4">
          {hotelOptions.map((hotel) => (
            <HotelCard
              key={hotel.id || hotel.name}
              hotel={hotel}
              isSelected={travelPlan.hotel?.name === hotel.name}
              onSelect={() => selectHotel(hotel)}
              onRemove={removeHotel}
            />
          ))}
        </div>
      ) : (
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <p className="text-muted-foreground">
            No hotels selected yet. Chat with the concierge to find accommodations.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setActiveTab("chat")
              handleInputChange({ target: { value: "I need a hotel near the Bellagio Conference Center" } } as any)
            }}
          >
            Find Hotels
          </Button>
        </div>
      )}
    </CardContent>
  )
}

