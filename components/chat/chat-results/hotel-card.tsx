"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type HotelType, renderStars } from "@/lib/types/travel"
import { formatPrice } from "@/lib/utils/price-utils"
import { MapPin } from "lucide-react"

interface HotelCardProps {
  hotel: HotelType
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
}

export function HotelCard({ hotel, isSelected, onSelect, onRemove }: HotelCardProps) {
  return (
    <Card className={`border ${isSelected ? "border-primary bg-primary/5" : "border-border"}`}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="font-medium">{hotel.name}</h4>
            <p className="text-sm text-yellow-500">{renderStars(hotel.stars)}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">
              {formatPrice(hotel.pricePerNight)}
              <span className="text-sm text-muted-foreground">/night</span>
            </p>
            <p className="text-sm text-muted-foreground">{formatPrice(hotel.totalPrice)} total</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-primary/5">
            <MapPin className="h-3 w-3 mr-1" />
            {hotel.distanceText}
          </Badge>
          {hotel.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="outline" className="bg-secondary/10">
              {amenity}
            </Badge>
          ))}
          {hotel.amenities.length > 3 && <Badge variant="outline">+{hotel.amenities.length - 3} more</Badge>}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          variant={isSelected ? "secondary" : "outline"}
          size="sm"
          className="w-full"
          onClick={isSelected ? onRemove : onSelect}
        >
          {isSelected ? "Remove Selection" : "Select Hotel"}
        </Button>
      </CardFooter>
    </Card>
  )
}

