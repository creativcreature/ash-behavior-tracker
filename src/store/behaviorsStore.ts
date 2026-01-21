import { create } from 'zustand'
import type {
  BehaviorIncident,
  CreateBehaviorInput,
  UpdateBehaviorInput,
  BehaviorTemplate,
} from '@/types/behavior'
import { db } from '@/lib/storage/db'

interface BehaviorsState {
  incidents: BehaviorIncident[]
  templates: BehaviorTemplate[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchIncidents: (childId?: string) => Promise<void>
  fetchTemplates: () => Promise<void>
  createIncident: (input: CreateBehaviorInput) => Promise<BehaviorIncident>
  updateIncident: (id: string, input: UpdateBehaviorInput) => Promise<void>
  deleteIncident: (id: string) => Promise<void>
  getIncidentsByDateRange: (
    childId: string,
    startDate: Date,
    endDate: Date
  ) => BehaviorIncident[]
  getIncidentsByChild: (childId: string) => BehaviorIncident[]
}

export const useBehaviorsStore = create<BehaviorsState>((set, get) => ({
  incidents: [],
  templates: [],
  isLoading: false,
  error: null,

  fetchIncidents: async (childId?: string) => {
    set({ isLoading: true, error: null })
    try {
      let incidents: BehaviorIncident[]

      if (childId) {
        incidents = await db.incidents
          .where('childId')
          .equals(childId)
          .reverse()
          .sortBy('timestamp')
      } else {
        incidents = await db.incidents.orderBy('timestamp').reverse().toArray()
      }

      set({ incidents, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch incidents',
        isLoading: false,
      })
    }
  },

  fetchTemplates: async () => {
    set({ isLoading: true, error: null })
    try {
      const templates = await db.templates.toArray()
      set({ templates, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch templates',
        isLoading: false,
      })
    }
  },

  createIncident: async (input: CreateBehaviorInput) => {
    set({ isLoading: true, error: null })
    try {
      const now = new Date().toISOString()

      const incident: BehaviorIncident = {
        id: crypto.randomUUID(),
        ...input,
        timestamp: input.timestamp || now,
        recordedAt: now,
      }

      await db.incidents.add(incident)

      set((state) => ({
        incidents: [incident, ...state.incidents],
        isLoading: false,
      }))

      return incident
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create incident',
        isLoading: false,
      })
      throw error
    }
  },

  updateIncident: async (id: string, input: UpdateBehaviorInput) => {
    set({ isLoading: true, error: null })
    try {
      await db.incidents.update(id, input as any)

      set((state) => ({
        incidents: state.incidents.map((incident) =>
          incident.id === id ? { ...incident, ...input } : incident
        ),
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update incident',
        isLoading: false,
      })
      throw error
    }
  },

  deleteIncident: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await db.incidents.delete(id)

      set((state) => ({
        incidents: state.incidents.filter((incident) => incident.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete incident',
        isLoading: false,
      })
      throw error
    }
  },

  getIncidentsByDateRange: (childId: string, startDate: Date, endDate: Date) => {
    const { incidents } = get()
    return incidents.filter((incident) => {
      if (incident.childId !== childId) return false
      const incidentDate = new Date(incident.timestamp)
      return incidentDate >= startDate && incidentDate <= endDate
    })
  },

  getIncidentsByChild: (childId: string) => {
    const { incidents } = get()
    return incidents.filter((incident) => incident.childId === childId)
  },
}))
