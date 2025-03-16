"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Entertainment, formatPrice } from "@/lib/travel-tools"
import { MapPin } from "lucide-react"

interface EntertainmentCardProps {
  entertainment: Entertainment
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
}

export function EntertainmentCard({ entertainment, isSelected, onSelect, onRemove }: EntertainmentCardProps) {
  return (
    <Card className={`border ${isSelected ? "border-primary bg-primary/5" : "border-border"}`}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="font-medium">{entertainment.name}</h4>
            <Badge variant="outline" className="mt-1">
              {entertainment.type}
            </Badge>
          </div>
          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
            {formatPrice(entertainment.price)}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mt-3">{entertainment.description}</p>

        <div className="mt-3 flex items-center text-sm text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          {entertainment.location}
          <div className="ml-auto flex">
            {"★".repeat(Math.floor(entertainment.rating))}
            {"☆".repeat(5 - Math.floor(entertainment.rating))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          variant={isSelected ? "secondary" : "outline"}
          size="sm"
          className="w-full"
          onClick={isSelected ? onRemove : onSelect}
        >
          {isSelected ? "Remove Selection" : "Select Activity"}
        </Button>
      </CardFooter>
    </Card>
  )
}

