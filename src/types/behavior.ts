export type BehaviorType =
  | 'aggression'
  | 'self-injury'
  | 'elopement'
  | 'property-destruction'
  | 'tantrum-meltdown'
  | 'other'

export type IntensityLevel = 1 | 2 | 3 | 4 | 5

export interface BehaviorIncident {
  id: string
  childId: string

  // ABC Data
  antecedent: string
  behavior: string
  behaviorType: BehaviorType
  consequence: string

  // Metadata
  timestamp: string
  duration?: number // in minutes
  intensity?: IntensityLevel
  location?: string
  people?: string[]

  // Recording
  recordedBy?: string
  recordedAt: string
  notes?: string
}

export interface CreateBehaviorInput {
  childId: string
  antecedent: string
  behavior: string
  behaviorType: BehaviorType
  consequence: string
  timestamp?: string
  duration?: number
  intensity?: IntensityLevel
  location?: string
  people?: string[]
  recordedBy?: string
  notes?: string
}

export interface UpdateBehaviorInput {
  antecedent?: string
  behavior?: string
  behaviorType?: BehaviorType
  consequence?: string
  timestamp?: string
  duration?: number
  intensity?: IntensityLevel
  location?: string
  people?: string[]
  recordedBy?: string
  notes?: string
}

export interface BehaviorTemplate {
  id: string
  behaviorType: BehaviorType
  behaviorName: string
  commonAntecedents: string[]
  commonConsequences: string[]
  icon: string
}
