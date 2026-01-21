'use client'

import type { Child } from '@/types/child'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Archive, ArchiveRestore, Eye, User } from 'lucide-react'

interface ChildCardProps {
  child: Child
  onSelect: () => void
  onArchive: () => void
  onUnarchive: () => void
  isSelected: boolean
}

export function ChildCard({
  child,
  onSelect,
  onArchive,
  onUnarchive,
  isSelected,
}: ChildCardProps) {
  const isArchived = !!child.archivedAt

  return (
    <Card
      className={`transition-all ${
        isSelected
          ? 'ring-2 ring-primary'
          : 'hover:shadow-md cursor-pointer'
      } ${isArchived ? 'opacity-60' : ''}`}
      onClick={!isArchived ? onSelect : undefined}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{child.animalName}</h3>
            {child.ageRange && (
              <p className="text-sm text-muted-foreground capitalize">
                {child.ageRange.replace('-', ' ')}
              </p>
            )}
          </div>
        </div>
        {isArchived && (
          <span className="text-xs text-muted-foreground">Archived</span>
        )}
      </CardHeader>
      <CardContent>
        {child.diagnosis && child.diagnosis.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-muted-foreground mb-1">Diagnosis:</p>
            <div className="flex flex-wrap gap-1">
              {child.diagnosis.map((d, index) => (
                <span
                  key={index}
                  className="text-xs bg-secondary px-2 py-1 rounded-full"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}
        {child.notes && (
          <div className="mb-3">
            <p className="text-sm text-muted-foreground mb-1">Notes:</p>
            <p className="text-sm line-clamp-2">{child.notes}</p>
          </div>
        )}
        <div className="flex gap-2 mt-4">
          {!isArchived && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect()
                }}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isSelected ? 'Selected' : 'Select'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onArchive()
                }}
              >
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
            </>
          )}
          {isArchived && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onUnarchive()
              }}
              className="flex-1"
            >
              <ArchiveRestore className="h-4 w-4 mr-2" />
              Restore
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
