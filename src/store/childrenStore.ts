import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Child, CreateChildInput, UpdateChildInput } from '@/types/child'
import { db } from '@/lib/storage/db'
import { generateAnimalName } from '@/lib/utils/animalNames'

interface ChildrenState {
  children: Child[]
  selectedChildId: string | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchChildren: () => Promise<void>
  createChild: (input: CreateChildInput) => Promise<Child>
  updateChild: (id: string, input: UpdateChildInput) => Promise<void>
  archiveChild: (id: string) => Promise<void>
  unarchiveChild: (id: string) => Promise<void>
  selectChild: (id: string | null) => void
  getChild: (id: string) => Child | undefined
}

export const useChildrenStore = create<ChildrenState>()(
  persist(
    (set, get) => ({
      children: [],
      selectedChildId: null,
      isLoading: false,
      error: null,

      fetchChildren: async () => {
        set({ isLoading: true, error: null })
        try {
          const children = await db.children
            .orderBy('createdAt')
            .reverse()
            .toArray()
          set({ children, isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch children',
            isLoading: false,
          })
        }
      },

      createChild: async (input: CreateChildInput) => {
        set({ isLoading: true, error: null })
        try {
          const { name, emoji } = await generateAnimalName()
          const now = new Date().toISOString()

          const child: Child = {
            id: crypto.randomUUID(),
            animalName: name,
            animalEmoji: emoji,
            ...input,
            createdAt: now,
            updatedAt: now,
          }

          await db.children.add(child)

          set((state) => ({
            children: [child, ...state.children],
            isLoading: false,
          }))

          return child
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to create child',
            isLoading: false,
          })
          throw error
        }
      },

      updateChild: async (id: string, input: UpdateChildInput) => {
        set({ isLoading: true, error: null })
        try {
          const updatedAt = new Date().toISOString()
          await db.children.update(id, { ...input, updatedAt })

          set((state) => ({
            children: state.children.map((child) =>
              child.id === id ? { ...child, ...input, updatedAt } : child
            ),
            isLoading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update child',
            isLoading: false,
          })
          throw error
        }
      },

      archiveChild: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          const archivedAt = new Date().toISOString()
          await db.children.update(id, { archivedAt })

          set((state) => ({
            children: state.children.map((child) =>
              child.id === id ? { ...child, archivedAt } : child
            ),
            selectedChildId: state.selectedChildId === id ? null : state.selectedChildId,
            isLoading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to archive child',
            isLoading: false,
          })
          throw error
        }
      },

      unarchiveChild: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          await db.children.update(id, { archivedAt: undefined })

          set((state) => ({
            children: state.children.map((child) =>
              child.id === id ? { ...child, archivedAt: undefined } : child
            ),
            isLoading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to unarchive child',
            isLoading: false,
          })
          throw error
        }
      },

      selectChild: (id: string | null) => {
        set({ selectedChildId: id })

        // Also update preferences in IndexedDB
        db.preferences.update('default', { selectedChildId: id || undefined })
      },

      getChild: (id: string) => {
        return get().children.find((child) => child.id === id)
      },
    }),
    {
      name: 'ash-selected-child',
      partialize: (state) => ({ selectedChildId: state.selectedChildId }),
    }
  )
)
