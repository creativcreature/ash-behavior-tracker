import Dexie, { type Table } from 'dexie'
import type { Child } from '@/types/child'
import type { BehaviorIncident, BehaviorTemplate } from '@/types/behavior'

export interface UserPreferences {
  id: string
  selectedChildId?: string
  language: string
  theme: 'light' | 'dark' | 'system'
  lastSync?: string
}

export class AshDatabase extends Dexie {
  children!: Table<Child, string>
  incidents!: Table<BehaviorIncident, string>
  templates!: Table<BehaviorTemplate, string>
  preferences!: Table<UserPreferences, string>

  constructor() {
    super('AshBehaviorTracker')

    this.version(1).stores({
      children: 'id, animalName, createdAt, updatedAt, archivedAt',
      incidents: 'id, childId, timestamp, behaviorType, recordedAt',
      templates: 'id, behaviorType',
      preferences: 'id',
    })
  }
}

export const db = new AshDatabase()

// Initialize default preferences
export async function initializePreferences() {
  const existing = await db.preferences.get('default')
  if (!existing) {
    await db.preferences.add({
      id: 'default',
      language: 'en',
      theme: 'system',
    })
  }
}

// Initialize default behavior templates
export async function initializeBehaviorTemplates() {
  const count = await db.templates.count()
  if (count === 0) {
    const templates: BehaviorTemplate[] = [
      {
        id: 'aggression',
        behaviorType: 'aggression',
        behaviorName: 'Aggression',
        commonAntecedents: [
          'Denied preferred item',
          'Transition between activities',
          'Difficult task presented',
          'Peer interaction',
          'Attention diverted',
        ],
        commonConsequences: [
          'Redirected to calm space',
          'Provided sensory break',
          'Ignored behavior',
          'Removed from situation',
          'Provided alternative communication',
        ],
        icon: '👊',
      },
      {
        id: 'self-injury',
        behaviorType: 'self-injury',
        behaviorName: 'Self-Injury',
        commonAntecedents: [
          'Sensory overwhelm',
          'Communication frustration',
          'Denied request',
          'Change in routine',
          'Physical discomfort',
        ],
        commonConsequences: [
          'Provided sensory input',
          'Offered communication device',
          'Redirected to safe behavior',
          'Assessed for pain/discomfort',
          'Provided reassurance',
        ],
        icon: '✋',
      },
      {
        id: 'elopement',
        behaviorType: 'elopement',
        behaviorName: 'Elopement',
        commonAntecedents: [
          'Overwhelmed by environment',
          'Avoiding task',
          'Seeking preferred activity',
          'Following peer',
          'Sensory seeking',
        ],
        commonConsequences: [
          'Returned to safe area',
          'Offered break',
          'Provided visual schedule',
          'Increased supervision',
          'Discussed safety',
        ],
        icon: '🏃',
      },
      {
        id: 'property-destruction',
        behaviorType: 'property-destruction',
        behaviorName: 'Property Destruction',
        commonAntecedents: [
          'Frustration with task',
          'Denied access',
          'Seeking attention',
          'Sensory exploration',
          'Imitating others',
        ],
        commonConsequences: [
          'Required cleanup/repair',
          'Redirected to appropriate activity',
          'Provided alternative',
          'Loss of privilege',
          'Discussed consequences',
        ],
        icon: '💥',
      },
      {
        id: 'tantrum-meltdown',
        behaviorType: 'tantrum-meltdown',
        behaviorName: 'Tantrum/Meltdown',
        commonAntecedents: [
          'Told "no"',
          'Overstimulation',
          'Fatigue',
          'Hunger/thirst',
          'Change in routine',
        ],
        commonConsequences: [
          'Allowed to calm down',
          'Removed sensory input',
          'Provided quiet space',
          'Offered comfort item',
          'Maintained safety',
        ],
        icon: '😭',
      },
    ]

    await db.templates.bulkAdd(templates)
  }
}

// Call initialization on module load
if (typeof window !== 'undefined') {
  initializePreferences()
  initializeBehaviorTemplates()
}
