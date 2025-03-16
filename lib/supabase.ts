import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Define course type
export interface Course {
  id: string
  name: string
  venue: string
  start_date: string
  end_date: string
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

// Fetch a course from the database
export async function fetchCourse(): Promise<Course | null> {
  try {
    // Get the first course from the mv_courses table
    const { data, error } = await supabase
      .from('mv_courses')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching course from mv_courses:', error)
      return null
    }

    if (!data) {
      return null
    }

    console.log('Raw course data:', JSON.stringify(data, null, 2))

    // Extract course dates from the nested structure
    const courseFormat = data.course_formats && data.course_formats.length > 0
      ? data.course_formats[0]
      : null

    // Extract venue from the nested structure
    const venueData = courseFormat?.venue || {}

    // Map the data to our Course interface
    const course: Course = {
      id: data.id || '',
      name: data.title || '',
      venue: venueData.name ? `${venueData.name}, ${venueData.city}` : 'Las Vegas',
      start_date: courseFormat?.course_start || '',
      end_date: courseFormat?.course_end || '',
      created_at: data.created_at || '',
      updated_at: data.updated_at || '',
      ...data // Include all other fields
    }

    console.log('Mapped course data:', JSON.stringify(course, null, 2))
    return course
  } catch (error) {
    console.error('Error fetching course:', error)
    return null
  }
}

// Format date to a readable string
export function formatDate(dateString: string): string {
  if (!dateString) return 'TBD'

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'TBD'
  }
}
