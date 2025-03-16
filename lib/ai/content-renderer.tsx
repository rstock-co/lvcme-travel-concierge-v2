"use client"
import ReactMarkdown from "react-markdown"
import { FlightCard } from "@/components/chat/chat-results/flight-card"
import { HotelCard } from "@/components/chat/chat-results/hotel-card"
import { EntertainmentCard } from "@/components/chat/chat-results/entertainment-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils/price-utils"
import { Plane, Hotel, Ticket, DollarSign } from "lucide-react"
import type { Flight, HotelType, Entertainment } from "@/lib/types/travel"
import { useTravelState } from "@/hooks/use-travel-state"
import { useChatState } from "@/hooks/use-chat-state"

// Check if the content contains a JSON object with flight, hotel, or entertainment data
export function renderStructuredContent(content: string) {
  try {
    // Check if the content contains JSON
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/)

    if (jsonMatch && jsonMatch[1]) {
      const data = JSON.parse(jsonMatch[1])

      // Render different cards based on data type
      if (data.flights || data.departureFlights || data.returnFlights) {
        return (
          <>
            <FlightCards
              flights={
                data.flights || {
                  departureFlights: data.departureFlights || [],
                  returnFlights: data.returnFlights || [],
                }
              }
            />
            <ReactMarkdown>{content.replace(jsonMatch[0], "")}</ReactMarkdown>
          </>
        )
      } else if (data.hotels) {
        return (
          <>
            <HotelCards hotels={data.hotels} venue={data.venue || "venue"} />
            <ReactMarkdown>{content.replace(jsonMatch[0], "")}</ReactMarkdown>
          </>
        )
      } else if (data.activities || data.entertainment) {
        return (
          <>
            <EntertainmentCards options={data.activities || data.entertainment} />
            <ReactMarkdown>{content.replace(jsonMatch[0], "")}</ReactMarkdown>
          </>
        )
      } else if (data.budgetSummary) {
        return (
          <>
            <BudgetSummary data={data.budgetSummary} />
            <ReactMarkdown>{content.replace(jsonMatch[0], "")}</ReactMarkdown>
          </>
        )
      }
    }

    // If not structured data, render as markdown
    return <ReactMarkdown>{content}</ReactMarkdown>
  } catch (e) {
    console.error("Error parsing structured content:", e)
    // If it's not valid JSON, render as markdown
    return <ReactMarkdown>{content}</ReactMarkdown>
  }
}

// Component to render flight cards
interface FlightCardsProps {
  flights: {
    departureFlights: Flight[]
    returnFlights: Flight[]
  }
}

function FlightCards({ flights }: FlightCardsProps) {
  const { travelPlan, selectFlight, removeFlight } = useTravelState()
  const { setActiveTab } = useChatState()

  const handleViewAllFlights = () => {
    setActiveTab("flights")
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <Plane className="h-4 w-4 mr-2 text-primary" />
          Flight Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {flights.departureFlights && flights.departureFlights.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Outbound Flights</h4>
            <div className="space-y-3">
              {flights.departureFlights.slice(0, 2).map((flight) => (
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

        {flights.returnFlights && flights.returnFlights.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Return Flights</h4>
            <div className="space-y-3">
              {flights.returnFlights.slice(0, 2).map((flight) => (
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

        {((flights.departureFlights && flights.departureFlights.length > 2) ||
          (flights.returnFlights && flights.returnFlights.length > 2)) && (
          <Button variant="outline" size="sm" onClick={handleViewAllFlights} className="w-full">
            View All Flight Options
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Component to render hotel cards
interface HotelCardsProps {
  hotels: HotelType[]
  venue: string
}

function HotelCards({ hotels, venue }: HotelCardsProps) {
  const { travelPlan, selectHotel, removeHotel } = useTravelState()
  const { setActiveTab } = useChatState()

  const handleViewAllHotels = () => {
    setActiveTab("hotel")
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <Hotel className="h-4 w-4 mr-2 text-primary" />
          Hotel Options near {venue}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {hotels.slice(0, 2).map((hotel) => (
            <HotelCard
              key={hotel.id || hotel.name}
              hotel={hotel}
              isSelected={travelPlan.hotel?.name === hotel.name}
              onSelect={() => selectHotel(hotel)}
              onRemove={removeHotel}
            />
          ))}
        </div>

        {hotels.length > 2 && (
          <Button variant="outline" size="sm" onClick={handleViewAllHotels} className="w-full">
            View All Hotel Options
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Component to render entertainment cards
interface EntertainmentCardsProps {
  options: Entertainment[]
}

function EntertainmentCards({ options }: EntertainmentCardsProps) {
  const { travelPlan, selectEntertainment, removeEntertainment } = useTravelState()
  const { setActiveTab } = useChatState()

  const handleViewAllEntertainment = () => {
    setActiveTab("entertainment")
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <Ticket className="h-4 w-4 mr-2 text-primary" />
          Entertainment Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {options.slice(0, 2).map((entertainment) => {
            const isSelected = travelPlan.entertainment.some(
              (item) => item.name.toLowerCase() === entertainment.name.toLowerCase(),
            )

            return (
              <EntertainmentCard
                key={entertainment.id || entertainment.name}
                entertainment={entertainment}
                isSelected={isSelected}
                onSelect={() => selectEntertainment(entertainment)}
                onRemove={() => removeEntertainment(entertainment)}
              />
            )
          })}
        </div>

        {options.length > 2 && (
          <Button variant="outline" size="sm" onClick={handleViewAllEntertainment} className="w-full">
            View All Entertainment Options
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Component to render budget summary
interface BudgetSummaryProps {
  data: {
    totalBudget: number
    totalExpenses: number
    remainingBudget: number
    percentUsed: number
    budgetStatus: string
    breakdown: {
      flights: number
      hotel: number
      entertainment: number
    }
  }
}

function BudgetSummary({ data }: BudgetSummaryProps) {
  const { totalBudget, totalExpenses, remainingBudget, percentUsed, budgetStatus, breakdown } = data
  const isOverBudget = remainingBudget < 0

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <DollarSign className="h-4 w-4 mr-2 text-primary" />
          Budget Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Flight:</div>
          <div className="text-right">{formatPrice(breakdown.flights)}</div>

          <div className="text-muted-foreground">Hotel:</div>
          <div className="text-right">{formatPrice(breakdown.hotel)}</div>

          <div className="text-muted-foreground">Entertainment:</div>
          <div className="text-right">{formatPrice(breakdown.entertainment)}</div>

          <Separator className="col-span-2 my-1" />

          <div className="font-medium">Total Expenses:</div>
          <div className="font-medium text-right">{formatPrice(totalExpenses)}</div>

          <div className="text-muted-foreground">Total Budget:</div>
          <div className="text-right">{formatPrice(totalBudget)}</div>

          <div className="font-medium">Remaining:</div>
          <div className={`font-medium text-right ${isOverBudget ? "text-destructive" : ""}`}>
            {formatPrice(remainingBudget)}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Budget Used</span>
            <span>{percentUsed}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${isOverBudget ? "bg-destructive" : "bg-primary"}`}
              style={{ width: `${Math.min(100, percentUsed)}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-center">
            <Badge variant={isOverBudget ? "destructive" : "outline"}>
              {budgetStatus.charAt(0).toUpperCase() + budgetStatus.slice(1)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

