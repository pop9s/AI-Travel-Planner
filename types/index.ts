export interface TravelFormData {
  destination: string
  duration: string
  travelers: string
  budget: string
  interests: string
  startDate: string
  specialRequests: string
}

export interface TravelPlan {
  plan: string
  destination: string
  generatedAt?: Date
}

export interface ApiError {
  error: string
}

