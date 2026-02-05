// -------------------------------------------------------
// TrampoJa - Shared Type Definitions
// -------------------------------------------------------

// Re-export Prisma-generated enums and types for convenience.
// These become available after running `npx prisma generate`.
export type {
  User,
  Worker,
  Market,
  Availability,
  Proposal,
  Job,
  Payment,
  Review,
} from '@prisma/client'

export {
  UserType,
  AvailabilityStatus,
  ProposalStatus,
  JobStatus,
  PaymentStatus,
  ReviewType,
  SkillType,
} from '@prisma/client'

// -------------------------------------------------------
// Application-level types
// -------------------------------------------------------

export type UserRole = 'worker' | 'market'

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface Coordinates {
  lat: number
  lng: number
}
