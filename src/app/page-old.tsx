'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useChildrenStore } from '@/store/childrenStore'
import { useBehaviorsStore } from '@/store/behaviorsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  ClipboardList,
  TrendingUp,
  Calendar,
  Plus,
  BarChart3,
} from 'lucide-react'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'

export default function Home() {
  const router = useRouter()
  const { children, selectedChildId, fetchChildren, selectChild } = useChildrenStore()
  const { incidents, fetchIncidents } = useBehaviorsStore()

  useEffect(() => {
    fetchChildren()
    fetchIncidents()
  }, [fetchChildren, fetchIncidents])

  const activeChildren = children.filter((c) => !c.archivedAt)
  const selectedChild = children.find((c) => c.id === selectedChildId)

  // Calculate statistics for selected child
  const stats = useMemo(() => {
    if (!selectedChildId) {
      return {
        total: 0,
        today: 0,
        last7Days: 0,
        avgPerDay: 0,
        mostCommonType: null,
      }
    }

    const childIncidents = incidents.filter((i) => i.childId === selectedChildId)
    const now = new Date()
    const todayStart = startOfDay(now)
    const todayEnd = endOfDay(now)
    const sevenDaysAgo = subDays(now, 7)

    const todayIncidents = childIncidents.filter(
      (i) => new Date(i.timestamp) >= todayStart && new Date(i.timestamp) <= todayEnd
    )

    const last7DaysIncidents = childIncidents.filter(
      (i) => new Date(i.timestamp) >= sevenDaysAgo
    )

    // Find most common behavior type
    const typeCounts: Record<string, number> = {}
    childIncidents.forEach((incident) => {
      typeCounts[incident.behaviorType] = (typeCounts[incident.behaviorType] || 0) + 1
    })

    const mostCommonType = Object.keys(typeCounts).length
      ? Object.entries(typeCounts).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
      : null

    return {
      total: childIncidents.length,
      today: todayIncidents.length,
      last7Days: last7DaysIncidents.length,
      avgPerDay: last7DaysIncidents.length / 7,
      mostCommonType,
    }
  }, [selectedChildId, incidents])

  const recentIncidents = useMemo(() => {
    if (!selectedChildId) return []
    return incidents
      .filter((i) => i.childId === selectedChildId)
      .slice(0, 5)
  }, [selectedChildId, incidents])

  // First-time user experience
  if (activeChildren.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-primary">
            Welcome to Ash Behavior Tracker
          </h1>
          <p className="text-xl text-muted-foreground">
            Privacy-first behavior tracking for children with autism and developmental delays
          </p>
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-semibold">Getting Started</h2>
            <ul className="text-left list-disc list-inside space-y-3 text-muted-foreground max-w-2xl mx-auto">
              <li>Create child profiles with playful animal names for privacy</li>
              <li>Log behaviors in 3-5 seconds with Quick Mode</li>
              <li>Track detailed ABC data when you have more time</li>
              <li>Visualize patterns with charts and insights</li>
              <li>Export data for BCBAs and treatment planning</li>
            </ul>
            <Button size="lg" onClick={() => router.push('/children')}>
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Profile
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {selectedChild && (
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <span>{selectedChild.animalEmoji}</span>
              Tracking for {selectedChild.animalName}
            </p>
          )}
        </div>
        <Button size="lg" onClick={() => router.push('/track')}>
          <ClipboardList className="h-5 w-5 mr-2" />
          Log Behavior
        </Button>
      </div>

      {!selectedChildId ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Select a Child Profile</h2>
          <p className="text-muted-foreground mb-6">
            Choose a profile below to view their behavior data
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
            {activeChildren.map((child) => (
              <Card
                key={child.id}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => selectChild(child.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-3xl">{child.animalEmoji}</span>
                    {child.animalName}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Behaviors</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.today}</div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(), 'MMM d, yyyy')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last 7 Days</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.last7Days}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.avgPerDay.toFixed(1)} per day average
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Common</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">
                  {stats.mostCommonType?.replace('-', ' ') || 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">Behavior type</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Behaviors */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Behavior Logs</CardTitle>
            </CardHeader>
            <CardContent>
              {recentIncidents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No behaviors logged yet</p>
                  <Button
                    variant="link"
                    onClick={() => router.push('/track')}
                    className="mt-2"
                  >
                    Log your first behavior
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentIncidents.map((incident) => (
                    <div
                      key={incident.id}
                      className="flex items-start gap-4 pb-4 border-b last:border-0"
                    >
                      <div className="text-2xl">{getTypeIcon(incident.behaviorType)}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium capitalize">
                              {incident.behaviorType.replace('-', ' ')}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {incident.behavior}
                            </p>
                          </div>
                          <time className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                            {format(new Date(incident.timestamp), 'MMM d, h:mm a')}
                          </time>
                        </div>
                        {incident.intensity && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Intensity: {incident.intensity}/5
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/insights')}
                  >
                    View All Insights
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-24"
              onClick={() => router.push('/track')}
            >
              <div className="flex flex-col items-center gap-2">
                <ClipboardList className="h-6 w-6" />
                <span>Log Behavior</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-24"
              onClick={() => router.push('/insights')}
            >
              <div className="flex flex-col items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                <span>View Insights</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-24"
              onClick={() => router.push('/children')}
            >
              <div className="flex flex-col items-center gap-2">
                <Users className="h-6 w-6" />
                <span>Manage Profiles</span>
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    aggression: '👊',
    'self-injury': '✋',
    elopement: '🏃',
    'property-destruction': '💥',
    'tantrum-meltdown': '😭',
    other: '📝',
  }
  return icons[type] || '📝'
}
