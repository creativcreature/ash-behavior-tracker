'use client'

import { useBehaviorsStore } from '@/store/behaviorsStore'
import { useEffect } from 'react'
import type { BehaviorType } from '@/types/behavior'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BehaviorSelectorProps {
  onSelect: (behaviorType: BehaviorType) => void
  selectedType?: BehaviorType
}

export function BehaviorSelector({ onSelect, selectedType }: BehaviorSelectorProps) {
  const { templates, fetchTemplates } = useBehaviorsStore()

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedType === template.behaviorType
              ? 'ring-2 ring-primary'
              : 'hover:border-primary'
          }`}
          onClick={() => onSelect(template.behaviorType)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg">
              <span className="text-3xl" role="img" aria-label={template.behaviorName}>
                {template.icon}
              </span>
              {template.behaviorName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tap to log this behavior
            </p>
          </CardContent>
        </Card>
      ))}
      <Card
        className={`cursor-pointer transition-all hover:shadow-lg ${
          selectedType === 'other'
            ? 'ring-2 ring-primary'
            : 'hover:border-primary'
        }`}
        onClick={() => onSelect('other')}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            <span className="text-3xl" role="img" aria-label="Other behavior">
              📝
            </span>
            Other
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Custom behavior not listed above
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
