export type UserRole = 'worker' | 'market'

export type JobStatus =
  | 'open'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed'

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}
