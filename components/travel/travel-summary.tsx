import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type TravelPlan, formatPrice } from "@/lib/travel-tools"
import { Plane, Hotel, Ticket, DollarSign } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface TravelSummaryProps {
  travelPlan: TravelPlan
}

export function TravelSummary({ travelPlan }: TravelSummaryProps) {
  const flightCost = (travelPlan.departureFlight?.price || 0) + (travelPlan.returnFlight?.price || 0)
  const hotelCost = travelPlan.hotel?.totalPrice || 0
  const entertainmentCost = travelPlan.entertainment.reduce((sum, item) => sum + item.price, 0)
  const totalCost = flightCost + hotelCost + entertainmentCost

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <DollarSign className="h-5 w-5 mr-1 text-primary" />
          Travel Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {(travelPlan.departureFlight || travelPlan.returnFlight) && (
          <div>
            <div className="flex items-center text-sm font-medium mb-2">
              <Plane className="h-4 w-4 mr-1 text-muted-foreground" />
              Flights
            </div>

            {travelPlan.departureFlight && (
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Outbound: {travelPlan.departureFlight.airline}</span>
                <span>{formatPrice(travelPlan.departureFlight.price)}</span>
              </div>
            )}

            {travelPlan.returnFlight && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Return: {travelPlan.returnFlight.airline}</span>
                <span>{formatPrice(travelPlan.returnFlight.price)}</span>
              </div>
            )}
          </div>
        )}

        {travelPlan.hotel && (
          <div>
            <div className="flex items-center text-sm font-medium mb-2">
              <Hotel className="h-4 w-4 mr-1 text-muted-foreground" />
              Hotel
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {travelPlan.hotel.name} ({travelPlan.hotel.nights} nights)
              </span>
              <span>{formatPrice(travelPlan.hotel.totalPrice)}</span>
            </div>
          </div>
        )}

        {travelPlan.entertainment.length > 0 && (
          <div>
            <div className="flex items-center text-sm font-medium mb-2">
              <Ticket className="h-4 w-4 mr-1 text-muted-foreground" />
              Entertainment
            </div>

            {travelPlan.entertainment.map((item, index) => (
              <div key={index} className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{item.name}</span>
                <span>{formatPrice(item.price)}</span>
              </div>
            ))}
          </div>
        )}

        <Separator />

        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{formatPrice(totalCost)}</span>
        </div>

        {travelPlan.totalBudget && (
          <div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Budget</span>
              <span>{formatPrice(travelPlan.totalBudget)}</span>
            </div>

            <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${totalCost > travelPlan.totalBudget ? "bg-destructive" : "bg-primary"}`}
                style={{ width: `${Math.min(100, (totalCost / travelPlan.totalBudget) * 100)}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs mt-1">
              <span>{Math.round((totalCost / travelPlan.totalBudget) * 100)}% of budget</span>
              <span className={totalCost > travelPlan.totalBudget ? "text-destructive" : ""}>
                {totalCost > travelPlan.totalBudget
                  ? `${formatPrice(totalCost - travelPlan.totalBudget)} over budget`
                  : `${formatPrice(travelPlan.totalBudget - totalCost)} remaining`}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

