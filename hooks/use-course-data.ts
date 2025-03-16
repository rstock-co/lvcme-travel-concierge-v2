"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For development/testing, include mock data
export const MOCK_COURSE_DATA = {
  courseName: "Advanced Cardiology Techniques",
  venue: "Las Vegas Convention Center",
  startDate: "2025-04-15",
  endDate: "2025-04-17",
  startTime: "09:00",
  endTime: "17:00",
  venueAddress: "3150 Paradise Rd, Las Vegas, NV 89109",
}

export function useCourseData() {
  const [courseData, setCourseData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourseData() {
      try {
        // In development, use mock data
        if (process.env.NODE_ENV === "development") {
          setTimeout(() => {
            setCourseData(MOCK_COURSE_DATA)
            setIsLoading(false)
          }, 500) // Simulate API delay
          return
        }

        // In production, fetch from Supabase
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Get the course ID from URL or local storage
        const courseId =
          new URLSearchParams(window.location.search).get("courseId") || localStorage.getItem("selectedCourseId")

        if (!courseId) {
          throw new Error("No course ID provided")
        }

        const { data, error } = await supabase.from("courses").select("*").eq("id", courseId).single()

        if (error) throw error

        setCourseData(data)
      } catch (err: any) {
        console.error("Error fetching course data:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseData()
  }, [])

  return { courseData, isLoading, error }
}

