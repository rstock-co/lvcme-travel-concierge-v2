"use client"

import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Ticket } from "lucide-react"
import { EntertainmentCard } from "./entertainment-card"
import { useTravelState } from "@/hooks/use-travel-state"
import { useChatState } from "@/hooks/use-chat-state"

export function EntertainmentResults() {
  const { entertainmentOptions, travelPlan, selectEntertainment, removeEntertainment, confirmEntertainment } =
    useTravelState()
  const { setActiveTab, handleInputChange } = useChatState()

  return (
    <CardContent className="space-y-6 pt-4 px-6">
      <div className="flex items-center space-x-2 border-b border-border pb-3">
        <div className="bg-primary/10 p-2 rounded-full">
          <Ticket className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-medium">Entertainment Options</h3>
      </div>

      {entertainmentOptions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            {entertainmentOptions.map((entertainment) => {
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

          {travelPlan.entertainment.length > 0 && (
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <div>
                <span className="text-sm font-medium">Selected {travelPlan.entertainment.length} activities</span>
                <span className="text-sm text-muted-foreground ml-2">
                  (Total: ${travelPlan.entertainment.reduce((sum, item) => sum + item.price, 0)})
                </span>
              </div>
              <Button size="sm" onClick={confirmEntertainment}>
                Confirm Selections
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <p className="text-muted-foreground">
            No entertainment selected yet. Chat with the concierge to find activities.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setActiveTab("chat")
              handleInputChange({
                target: { value: "What entertainment options are available in Las Vegas?" },
              } as any)
            }}
          >
            Find Entertainment
          </Button>
        </div>
      )}
    </CardContent>
  )
}

