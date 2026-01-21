'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useChildrenStore } from '@/store/childrenStore'
import { useBehaviorsStore } from '@/store/behaviorsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PrivacyBadge, PrivacyFeatureGrid } from '@/components/ui/privacy-badge'
import {
  Users,
  ClipboardList,
  TrendingUp,
  Calendar,
  Plus,
  BarChart3,
  Shield,
  Sparkles,
  ArrowRight,
  Heart,
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
      <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-16 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              <span>Privacy-First Behavior Tracking</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Understand Behavior,
              <br />
              <span className="text-primary">Protect Privacy</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A compassionate tool for parents, teachers, and therapists tracking behavior
              patterns for children with autism and developmental delays.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" onClick={() => router.push('/children')} className="gap-2 shadow-elevated">
                <Plus className="w-5 h-5" />
                Create Your First Profile
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  const element = document.getElementById('features')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Privacy Banner */}
          <div className="mb-16 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <PrivacyBadge variant="banner" />
          </div>

          {/* Features Grid */}
          <div id="features" className="mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl font-bold text-center mb-4">Why Families Trust Ash</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Designed with privacy, accessibility, and compassion at its core
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary/50 hover:shadow-elevated transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Fast & Simple</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Log behaviors in 3-5 seconds with Quick Mode, or use Full ABC Mode for
                    detailed analysis.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 hover:shadow-elevated transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>100% Private</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    All data stays on your device. No cloud, no accounts, no tracking. You own
                    your information.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 hover:shadow-elevated transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Playful Anonymity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Children get fun animal names like "Brave Panda" to protect their identity
                    automatically.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 hover:shadow-elevated transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle>Visual Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Beautiful charts reveal patterns over time. Identify triggers and track
                    progress with ease.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 hover:shadow-elevated transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle>BCBA Ready</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Professional CSV exports compatible with Excel and behavior analysis
                    software.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 hover:shadow-elevated transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle>Accessible</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    WCAG AA compliant. Full keyboard navigation and screen reader support for
                    everyone.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Privacy Features */}
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-3xl font-bold text-center mb-12">
              Your Privacy is Our Priority
            </h2>
            <PrivacyFeatureGrid />
          </div>

          {/* CTA */}
          <div className="text-center mt-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-primary/20 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Create your first child profile and start tracking behaviors in under a minute.
                No registration required.
              </p>
              <Button size="lg" onClick={() => router.push('/children')} className="gap-2 shadow-elevated">
                <Plus className="w-5 h-5" />
                Create First Profile
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8 animate-slide-up">
        <div>
          <h1 className="mb-2">Dashboard</h1>
          {selectedChild && (
            <p className="text-muted-foreground flex items-center gap-2">
              <span>{selectedChild.animalEmoji}</span>
              Tracking for {selectedChild.animalName}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <PrivacyBadge variant="minimal" />
          <Button size="lg" onClick={() => router.push('/track')} className="gap-2 shadow-soft">
            <ClipboardList className="h-5 w-5" />
            Log Behavior
          </Button>
        </div>
      </div>

      {!selectedChildId ? (
        <div className="text-center py-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl animate-slide-up">
          <Users className="h-16 w-16 mx-auto text-primary mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Select a Profile</h2>
          <p className="text-muted-foreground mb-8">
            Choose a profile below to view their behavior data
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
            {activeChildren.map((child) => (
              <Card
                key={child.id}
                className="cursor-pointer hover:shadow-elevated hover:border-primary/50 transition-all"
                onClick={() => selectChild(child.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-4xl">{child.animalEmoji}</span>
                    <span>{child.animalName}</span>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
            <Card className="border-2 hover:shadow-soft transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Behaviors
                </CardTitle>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-soft transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.today}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(), 'MMM d, yyyy')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-soft transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Last 7 Days
                </CardTitle>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.last7Days}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.avgPerDay.toFixed(1)} per day average
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-soft transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Most Common
                </CardTitle>
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold capitalize">
                  {stats.mostCommonType?.replace('-', ' ') || 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Behavior type</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Behaviors */}
          <Card className="border-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>Recent Behavior Logs</CardTitle>
            </CardHeader>
            <CardContent>
              {recentIncidents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="mb-4">No behaviors logged yet</p>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/track')}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Log your first behavior
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentIncidents.map((incident) => (
                    <div
                      key={incident.id}
                      className="flex items-start gap-4 pb-4 border-b last:border-0 hover:bg-muted/30 -mx-2 px-2 py-2 rounded-lg transition-colors"
                    >
                      <div className="text-3xl">{getTypeIcon(incident.behaviorType)}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold capitalize">
                              {incident.behaviorType.replace('-', ' ')}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {incident.behavior}
                            </p>
                          </div>
                          <time className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                            {format(new Date(incident.timestamp), 'MMM d, h:mm a')}
                          </time>
                        </div>
                        {incident.intensity && (
                          <div className="flex items-center gap-1 mt-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < incident.intensity!
                                    ? 'bg-accent'
                                    : 'bg-muted'
                                }`}
                              />
                            ))}
                            <span className="text-xs text-muted-foreground ml-1">
                              Intensity {incident.intensity}/5
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => router.push('/insights')}
                  >
                    View All Insights
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button
              variant="outline"
              className="h-auto py-6 hover:shadow-soft transition-all hover:border-primary/50"
              onClick={() => router.push('/track')}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <span className="font-semibold">Log Behavior</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 hover:shadow-soft transition-all hover:border-accent/50"
              onClick={() => router.push('/insights')}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <span className="font-semibold">View Insights</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 hover:shadow-soft transition-all hover:border-primary/50"
              onClick={() => router.push('/children')}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <span className="font-semibold">Manage Profiles</span>
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
