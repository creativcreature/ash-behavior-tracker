'use client'

import { useBehaviorsStore } from '@/store/behaviorsStore'
import { useEffect } from 'react'
import type { BehaviorType } from '@/types/behavior'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Zap,
  Hand,
  Move,
  AlertOctagon,
  Frown,
  FileEdit,
  LucideIcon
} from 'lucide-react'

interface BehaviorSelectorProps {
  onSelect: (behaviorType: BehaviorType) => void
  selectedType?: BehaviorType
}

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  'zap': Zap,
  'hand': Hand,
  'move': Move,
  'alert-octagon': AlertOctagon,
  'frown': Frown,
  'file-edit': FileEdit,
}

export function BehaviorSelector({ onSelect, selectedType }: BehaviorSelectorProps) {
  const { templates, fetchTemplates } = useBehaviorsStore()

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => {
        const Icon = iconMap[template.icon] || FileEdit

        return (
          <Card
            key={template.id}
            className={`cursor-pointer transition-premium hover:shadow-premium-hover border-2 ${
              selectedType === template.behaviorType
                ? 'ring-2 ring-primary border-primary bg-primary/5'
                : 'hover:border-primary/50'
            }`}
            onClick={() => onSelect(template.behaviorType)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                {template.behaviorName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Select to log this behavior
              </p>
            </CardContent>
          </Card>
        )
      })}
      <Card
        className={`cursor-pointer transition-premium hover:shadow-premium-hover border-2 ${
          selectedType === 'other'
            ? 'ring-2 ring-primary border-primary bg-primary/5'
            : 'hover:border-primary/50'
        }`}
        onClick={() => onSelect('other')}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileEdit className="w-5 h-5 text-primary" />
            </div>
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
