'use client'

import { useEffect, useState } from 'react'
import { useChildrenStore } from '@/store/childrenStore'
import { ChildCard } from '@/components/children/ChildCard'
import { ChildForm } from '@/components/children/ChildForm'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Users } from 'lucide-react'
import type { CreateChildInput } from '@/types/child'

export default function ChildrenPage() {
  const {
    children,
    selectedChildId,
    isLoading,
    fetchChildren,
    createChild,
    selectChild,
    archiveChild,
    unarchiveChild,
  } = useChildrenStore()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showArchived, setShowArchived] = useState(false)

  useEffect(() => {
    fetchChildren()
  }, [fetchChildren])

  const activeChildren = children.filter((c) => !c.archivedAt)
  const archivedChildren = children.filter((c) => c.archivedAt)

  const handleCreateChild = async (data: CreateChildInput) => {
    await createChild(data)
    setIsDialogOpen(false)
  }

  const handleArchive = async (id: string) => {
    if (confirm('Are you sure you want to archive this profile?')) {
      await archiveChild(id)
    }
  }

  const handleUnarchive = async (id: string) => {
    await unarchiveChild(id)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8" />
            Child Profiles
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage profiles with privacy-friendly animal names
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              New Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Child Profile</DialogTitle>
              <DialogDescription>
                A playful animal name will be automatically generated to protect privacy.
                All information is stored locally on your device.
              </DialogDescription>
            </DialogHeader>
            <ChildForm
              onSubmit={handleCreateChild}
              onCancel={() => setIsDialogOpen(false)}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && children.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading profiles...
        </div>
      ) : activeChildren.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No profiles yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first child profile to start tracking behaviors
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                Create First Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Child Profile</DialogTitle>
                <DialogDescription>
                  A playful animal name will be automatically generated to protect privacy.
                  All information is stored locally on your device.
                </DialogDescription>
              </DialogHeader>
              <ChildForm
                onSubmit={handleCreateChild}
                onCancel={() => setIsDialogOpen(false)}
                isLoading={isLoading}
              />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeChildren.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                isSelected={child.id === selectedChildId}
                onSelect={() => selectChild(child.id)}
                onArchive={() => handleArchive(child.id)}
                onUnarchive={() => handleUnarchive(child.id)}
              />
            ))}
          </div>

          {archivedChildren.length > 0 && (
            <div className="mt-8">
              <Button
                variant="ghost"
                onClick={() => setShowArchived(!showArchived)}
                className="mb-4"
              >
                {showArchived ? 'Hide' : 'Show'} Archived Profiles ({archivedChildren.length})
              </Button>

              {showArchived && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {archivedChildren.map((child) => (
                    <ChildCard
                      key={child.id}
                      child={child}
                      isSelected={false}
                      onSelect={() => {}}
                      onArchive={() => {}}
                      onUnarchive={() => handleUnarchive(child.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
