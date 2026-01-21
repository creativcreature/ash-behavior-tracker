'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useChildrenStore } from '@/store/childrenStore'
import { BehaviorSelector } from '@/components/tracking/BehaviorSelector'
import { ABCEntryForm } from '@/components/tracking/ABCEntryForm'
import type { BehaviorType } from '@/types/behavior'
import { AlertCircle, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TrackPage() {
  const router = useRouter()
  const { selectedChildId, children, fetchChildren } = useChildrenStore()
  const [selectedBehaviorType, setSelectedBehaviorType] = useState<BehaviorType | null>(
    null
  )

  useEffect(() => {
    fetchChildren()
  }, [fetchChildren])

  const selectedChild = children.find((c) => c.id === selectedChildId)

  if (!selectedChildId || !selectedChild) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Child Profile Selected</h2>
          <p className="text-muted-foreground mb-6">
            Please select or create a child profile before tracking behaviors
          </p>
          <Button onClick={() => router.push('/children')}>
            Manage Child Profiles
          </Button>
        </div>
      </div>
    )
  }

  const handleBehaviorLogged = () => {
    setSelectedBehaviorType(null)
    // Could show a success toast here
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ClipboardList className="h-8 w-8" />
            Track Behavior
          </h1>
          {selectedChild && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Tracking for:</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <span>{selectedChild.animalEmoji}</span>
                {selectedChild.animalName}
              </p>
            </div>
          )}
        </div>
        <p className="text-muted-foreground">
          {selectedBehaviorType
            ? 'Fill in the details below to log this behavior'
            : 'Select a behavior type to begin logging'}
        </p>
      </div>

      {!selectedBehaviorType ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Select Behavior Type</h2>
          <BehaviorSelector
            onSelect={setSelectedBehaviorType}
            selectedType={selectedBehaviorType}
          />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <ABCEntryForm
            childId={selectedChildId}
            initialBehaviorType={selectedBehaviorType}
            onSuccess={handleBehaviorLogged}
            onCancel={() => setSelectedBehaviorType(null)}
          />
        </div>
      )}
    </div>
  )
}
