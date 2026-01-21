export type AgeRange = 'toddler' | 'preschool' | 'school-age' | 'teen' | 'adult'

export interface Child {
  id: string
  animalName: string
  animalEmoji?: string // Optional for backwards compatibility
  dateOfBirth?: string
  ageRange?: AgeRange
  diagnosis?: string[]
  notes?: string
  createdAt: string
  updatedAt: string
  archivedAt?: string
}

export interface CreateChildInput {
  dateOfBirth?: string
  ageRange?: AgeRange
  diagnosis?: string[]
  notes?: string
}

export interface UpdateChildInput {
  dateOfBirth?: string
  ageRange?: AgeRange
  diagnosis?: string[]
  notes?: string
}
