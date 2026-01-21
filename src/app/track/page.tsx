'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useChildrenStore } from '@/store/childrenStore'
import { BehaviorSelector } from '@/components/tracking/BehaviorSelector'
import { ABCEntryForm } from '@/components/tracking/ABCEntryForm'
import { Celebration } from '@/components/ui/celebration'
import { PrivacyBadge } from '@/components/ui/privacy-badge'
import type { BehaviorType } from '@/types/behavior'
import { AlertCircle, ClipboardList, Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TrackPage() {
  const router = useRouter()
  const { selectedChildId, children, fetchChildren } = useChildrenStore()
  const [selectedBehaviorType, setSelectedBehaviorType] = useState<BehaviorType | undefined>(
    undefined
  )
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    fetchChildren()
  }, [fetchChildren])

  const selectedChild = children.find((c) => c.id === selectedChildId)

  if (!selectedChildId || !selectedChild) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12 bg-muted/50 rounded-xl">
          <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Profile Selected</h2>
          <p className="text-muted-foreground mb-6">
            Please select or create a child profile before tracking behaviors
          </p>
          <Button onClick={() => router.push('/children')} size="lg">
            Manage Profiles
          </Button>
        </div>
      </div>
    )
  }

  const handleBehaviorLogged = () => {
    setShowCelebration(true)
    setTimeout(() => {
      setSelectedBehaviorType(undefined)
    }, 3000)
  }

  return (
    <>
      <Celebration
        show={showCelebration}
        onClose={() => setShowCelebration(false)}
        type="success"
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="flex items-center gap-3 mb-2">
                <ClipboardList className="h-8 w-8 text-primary" />
                Track Behavior
              </h1>
              {selectedChild && (
                <p className="text-muted-foreground flex items-center gap-2">
                  Tracking for
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    <User className="w-4 h-4" />
                    {selectedChild.animalName}
                  </span>
                </p>
              )}
            </div>
            <PrivacyBadge variant="minimal" />
          </div>

          {!selectedBehaviorType && (
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Quick & Private Logging</h3>
                  <p className="text-sm text-muted-foreground">
                    Log behaviors in 3-5 seconds. All data stays on your device. Choose Quick
                    Mode for fast logging or Full ABC Mode for detailed analysis.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {!selectedBehaviorType ? (
          <div className="animate-slide-up">
            <h2 className="text-xl font-semibold mb-4">Select Behavior Type</h2>
            <BehaviorSelector
              onSelect={setSelectedBehaviorType}
              selectedType={selectedBehaviorType}
            />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto animate-slide-up">
            <ABCEntryForm
              childId={selectedChildId}
              initialBehaviorType={selectedBehaviorType}
              onSuccess={handleBehaviorLogged}
              onCancel={() => setSelectedBehaviorType(undefined)}
            />
          </div>
        )}
      </div>
    </>
  )
}
