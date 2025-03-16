"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Clock } from "lucide-react"
import { useCourseData } from "@/hooks/use-course-data"
import { Skeleton } from "@/components/ui/skeleton"

export function CourseDetails() {
  const { courseData, isLoading, error } = useCourseData()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Course Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-5 w-full" />
          <div className="flex items-start">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex items-start">
            <Skeleton className="h-4 w-4 mr-2" />
            <div className="space-y-1 w-full">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="flex items-start">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">Error loading course details: {error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!courseData) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">No course data available</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Course Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h3 className="font-medium">{courseData.courseName}</h3>
        </div>
        <div className="flex items-start text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2 mt-0.5" />
          <div>
            <div>{courseData.venue}</div>
            {courseData.venueAddress && <div className="text-xs">{courseData.venueAddress}</div>}
          </div>
        </div>
        <div className="flex items-start text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2 mt-0.5" />
          <div>
            <div>{formatDate(courseData.startDate)}</div>
            <div>to {formatDate(courseData.endDate)}</div>
          </div>
        </div>
        {(courseData.startTime || courseData.endTime) && (
          <div className="flex items-start text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 mt-0.5" />
            <div>
              {courseData.startTime && courseData.endTime
                ? `${courseData.startTime} - ${courseData.endTime}`
                : courseData.startTime
                  ? `Starts at ${courseData.startTime}`
                  : `Ends at ${courseData.endTime}`}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

